const DEFAULT_DELIMITERS = /[。？！……；：——，、\n]/;
const DEFAULT_MAX_CHUNK_SIZE = 80;

/** 数组延迟视为「全 0 / 空」时等同恒定 0，可走同步立即渲染路径。 */
function isZeroDelay(spec: number | number[]): boolean {
  if (Array.isArray(spec)) return spec.length === 0 || spec.every((d) => d === 0);
  return spec === 0;
}

/** 取第 index 个已渲染块对应的延迟；数组越界取末项，空数组当 0。 */
function resolveDelay(spec: number | number[], index: number): number {
  if (Array.isArray(spec)) {
    if (spec.length === 0) return 0;
    return spec[Math.min(index, spec.length - 1)];
  }
  return spec;
}

interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string }>;
}
let cachedSegmenter: GraphemeSegmenter | null = null;
let segmenterResolved = false;

/**
 * 按 grapheme cluster 切分（emoji、组合字符不被劈开）。优先 Intl.Segmenter，
 * 不可用时回退 Array.from（已按 code point 迭代，至少不劈 surrogate pair）。
 */
function splitGraphemes(text: string): string[] {
  if (!segmenterResolved) {
    segmenterResolved = true;
    try {
      const Seg = (Intl as { Segmenter?: new () => GraphemeSegmenter }).Segmenter;
      if (Seg) cachedSegmenter = new Seg();
    } catch {
      cachedSegmenter = null;
    }
  }
  if (cachedSegmenter) {
    const out: string[] = [];
    for (const s of cachedSegmenter.segment(text)) out.push(s.segment);
    return out;
  }
  return Array.from(text);
}

export interface StreamingProcessorConfig<T> {
  /**
   * 把一段已经过流式预处理的 markdown 文本转成平台节点的函数。
   *
   * 重要边界：AI 流式处理发生在 lex 之前。StreamingProcessor 只处理字符串层：
   * 增量合并、语义切块、稳定段缓存、tail fixup。调用 transform 时，入参仍是
   * markdown 字符串；调用方（通常是 XMarkdownMini）才在 transform 内部执行
   * marked lexer，并交给平台 renderer。
   */
  transform: (markdown: string) => T[];
  /**
   * 可选的 tail 预处理。流式渲染时，每次 flush 只对 tail（未稳定段）调用一次，
   * 已 commit 的稳定段不会再被处理。典型用法：接 remend 补全未闭合的 markdown
   * 语法（**bold / `code` / [link]( 等），避免 AI 流式输出时闪烁。
   *
   * 注意：fixup 只影响传给 `transform` 的字符串，不会写回 renderedText，因此
   * `getRenderedText()` 与 `onUpdate` 回调中拿到的仍是用户原始内容。
   */
  fixup?: (tail: string) => string;
  onUpdate: (markdown: string) => void;
  onPatch: (nodes: T[]) => void;
  onComplete: () => void;
  semanticEnabled?: boolean;
  delimiters?: RegExp;
  maxChunkSize?: number;
  /** number = 恒定；number[] = 按已渲染块序号变速（随块加速），超出取末项 */
  chunkDelay?: number | number[];
  /** number = 恒定；number[] = 按已渲染块序号变速，超出取末项 */
  charDelay?: number | number[];
}

/**
 * 流式处理器：
 * - 增量合并 markdown 文本（前缀匹配则视作追加，否则 reset）
 * - 已稳定（前面已被空行收尾）的块只进入 transform 一次，缓存为 stableNodes
 * - 仅对未稳定的 tail（最后一段）每次重新走 fixup → transform
 * - chunkDelay/charDelay 全为 0 时跳过 setTimeout 链，单次 onPatch 即返回
 * - 否则走语义切块的"打字机"模式：按 delimiters / maxChunkSize 推进 renderedText
 */
export class StreamingProcessor<T = unknown> {
  private buffer = '';
  private renderedText = '';
  private previousMarkdown = '';

  private stableNodes: T[] = [];
  private committedLen = 0;
  /** Whether the character at committedLen is inside a fenced code block (used for incremental scanning). */
  private committedInFence = false;
  private committedFenceChar = '';

  private pendingChunks: string[] = [];
  private chunkIndex = 0;
  /** 已渲染块的累计序号，用于数组变速延迟（charDelay/chunkDelay 为数组时按此取值）。 */
  private chunkRenderIndex = 0;
  private activeChunk = '';
  private activeChunkOffset = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private currentHasNextChunk = false;

  private readonly config: {
    transform: (markdown: string) => T[];
    fixup: ((tail: string) => string) | undefined;
    onUpdate: (markdown: string) => void;
    onPatch: (nodes: T[]) => void;
    onComplete: () => void;
    semanticEnabled: boolean;
    delimiters: RegExp;
    maxChunkSize: number;
    chunkDelay: number | number[];
    charDelay: number | number[];
  };

  constructor(cfg: StreamingProcessorConfig<T>) {
    this.config = {
      transform: cfg.transform,
      fixup: cfg.fixup,
      onUpdate: cfg.onUpdate,
      onPatch: cfg.onPatch,
      onComplete: cfg.onComplete,
      semanticEnabled: cfg.semanticEnabled ?? true,
      delimiters: cfg.delimiters ?? DEFAULT_DELIMITERS,
      maxChunkSize: cfg.maxChunkSize ?? DEFAULT_MAX_CHUNK_SIZE,
      chunkDelay: cfg.chunkDelay ?? 0,
      charDelay: cfg.charDelay ?? 0,
    };
  }

  /** 内容更新：增量则追加到 buffer，否则 reset 后整段替换。 */
  handleContentUpdate(content: string): void {
    if (content.startsWith(this.previousMarkdown)) {
      this.buffer += content.slice(this.previousMarkdown.length);
    } else {
      this.reset();
      this.buffer = content;
    }
    this.previousMarkdown = content;
  }

  reset(): void {
    this.buffer = '';
    this.renderedText = '';
    this.previousMarkdown = '';
    this.pendingChunks = [];
    this.chunkIndex = 0;
    this.chunkRenderIndex = 0;
    this.activeChunk = '';
    this.activeChunkOffset = 0;
    this.stableNodes = [];
    this.committedLen = 0;
    this.committedInFence = false;
    this.committedFenceChar = '';
    this.cancelScheduledRender();
  }

  /**
   * 推进渲染。若 chunk/charDelay 都为 0，立即一次性 flush；否则进入打字机循环。
   */
  runRenderLoop(hasNextChunk: boolean): void {
    this.currentHasNextChunk = hasNextChunk;
    const { chunkDelay, charDelay } = this.config;

    this.cancelScheduledRender();

    if (isZeroDelay(chunkDelay) && isZeroDelay(charDelay)) {
      // 非打字机模式：直接把 buffer 一次性渲染出去
      if (this.buffer.length > 0) {
        this.renderedText += this.buffer;
        this.buffer = '';
      }
      this.flushNodes();
      if (!hasNextChunk) {
        this.config.onComplete();
      }
      return;
    }

    // 打字机模式：按语义/长度切块，依次推进
    this.splitIntoChunks(hasNextChunk);
    this.chunkIndex = 0;
    this.scheduleNext();
  }

  /** 当前已输出给 UI 的完整 markdown 字符串 */
  getRenderedText(): string {
    return this.renderedText;
  }

  /** 是否还有待处理 chunks（外部可据此判断是否完成） */
  hasPendingChunks(): boolean {
    return this.chunkIndex < this.pendingChunks.length || this.buffer.length > 0;
  }

  // --- 内部 ---

  /** 按 delimiters + maxChunkSize 把 buffer 切成 chunk 序列；hasNext=false 时 flush 末尾。 */
  private splitIntoChunks(hasNextChunk: boolean): void {
    const { semanticEnabled, delimiters = DEFAULT_DELIMITERS, maxChunkSize = DEFAULT_MAX_CHUNK_SIZE } = this.config;
    const pending: string[] = [];
    let remaining = this.buffer;

    while (remaining.length > 0) {
      let chunk = '';
      if (semanticEnabled) {
        const m = remaining.match(delimiters);
        const cut = m ? remaining.indexOf(m[0]) + 1 : -1;
        if (cut > 0) {
          chunk = remaining.slice(0, cut);
          remaining = remaining.slice(cut);
        } else if (remaining.length > maxChunkSize && hasNextChunk) {
          chunk = remaining.slice(0, maxChunkSize);
          remaining = remaining.slice(maxChunkSize);
        } else if (!hasNextChunk) {
          chunk = remaining;
          remaining = '';
        } else {
          break;
        }
      } else if (remaining.length > maxChunkSize) {
        chunk = remaining.slice(0, maxChunkSize);
        remaining = remaining.slice(maxChunkSize);
      } else if (!hasNextChunk) {
        chunk = remaining;
        remaining = '';
      } else {
        break;
      }

      if (chunk.length > 0) pending.push(chunk);
    }

    this.pendingChunks = pending;
    this.buffer = remaining;
  }

  private scheduleNext(): void {
    const { chunkDelay, charDelay, onComplete } = this.config;
    // 数组变速：本块的 char/chunk 延迟按已渲染块序号取值，块内保持恒定。
    const interChunkDelay = this.chunkIndex === 0 ? 0 : resolveDelay(chunkDelay, this.chunkRenderIndex);

    this.timer = setTimeout(() => {
      if (this.chunkIndex >= this.pendingChunks.length) {
        if (this.buffer.length > 0) {
          this.splitIntoChunks(this.currentHasNextChunk);
          this.scheduleNext();
          return;
        }
        this.timer = null;
        this.activeChunk = '';
        this.activeChunkOffset = 0;
        if (!this.currentHasNextChunk) onComplete();
        return;
      }

      const chunk = this.pendingChunks[this.chunkIndex];
      this.activeChunk = chunk;
      this.activeChunkOffset = 0;
      const cd = resolveDelay(charDelay, this.chunkRenderIndex);
      const graphemes = cd > 0 ? splitGraphemes(chunk) : null;
      if (cd > 0 && graphemes && graphemes.length > 1) {
        // 打字机逐字（按 grapheme，避免劈坏 emoji/组合字符）。
        let gi = 0;
        let offset = 0;
        const step = (): void => {
          if (gi < graphemes.length) {
            const g = graphemes[gi++];
            this.renderedText += g;
            offset += g.length;
            this.activeChunkOffset = offset;
            this.flushNodes();
            this.timer = setTimeout(step, cd);
          } else {
            this.activeChunk = '';
            this.activeChunkOffset = 0;
            this.chunkIndex += 1;
            this.chunkRenderIndex += 1;
            this.scheduleNext();
          }
        };
        step();
      } else {
        this.renderedText += chunk;
        this.activeChunk = '';
        this.activeChunkOffset = 0;
        this.chunkIndex += 1;
        this.chunkRenderIndex += 1;
        this.flushNodes();
        this.scheduleNext();
      }
    }, interChunkDelay);
  }

  private cancelScheduledRender(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    let remaining = '';
    let startIndex = this.chunkIndex;
    if (this.activeChunk) {
      remaining += this.activeChunk.slice(this.activeChunkOffset);
      startIndex = this.chunkIndex + 1;
    }
    if (startIndex < this.pendingChunks.length) {
      remaining += this.pendingChunks.slice(startIndex).join('');
    }
    if (remaining) this.buffer = remaining + this.buffer;
    this.pendingChunks = [];
    this.chunkIndex = 0;
    this.activeChunk = '';
    this.activeChunkOffset = 0;
  }

  /** 推进 commit 点：从上次 committedLen 开始增量扫描，找 fenced code 之外的最后一段「双换行」位置。 */
  private advanceCommit(): void {
    const text = this.renderedText;
    if (this.committedLen >= text.length) return;

    let inFence = this.committedInFence;
    let fenceChar = this.committedFenceChar;
    let lineStart = this.committedLen;

    if (this.committedLen > 0) {
      let ls = this.committedLen;
      while (ls > 0 && text[ls - 1] !== '\n') ls--;
      lineStart = ls;
    }

    let lastSafe = -1;
    let lastSafeInFence = false;
    let lastSafeFenceChar = '';
    let prevBlank = false;

    for (let i = lineStart; i <= text.length; i++) {
      if (i === text.length || text[i] === '\n') {
        const line = text.slice(lineStart, i);
        const fence = /^ {0,3}(`{3,}|~{3,})/.exec(line);
        if (fence) {
          if (!inFence) {
            inFence = true;
            fenceChar = fence[1][0];
          } else if (fence[1][0] === fenceChar) {
            inFence = false;
            fenceChar = '';
          }
        }
        const isBlank = line.trim() === '';
        if (!inFence && isBlank && prevBlank) {
          lastSafe = i === text.length ? i : i + 1;
          lastSafeInFence = inFence;
          lastSafeFenceChar = fenceChar;
        }
        prevBlank = isBlank && !inFence;
        lineStart = i + 1;
      }
    }

    if (lastSafe > this.committedLen) {
      const segment = text.slice(this.committedLen, lastSafe);
      const nodes = this.config.transform(segment);
      this.stableNodes.push(...nodes);
      this.committedLen = lastSafe;
      this.committedInFence = lastSafeInFence;
      this.committedFenceChar = lastSafeFenceChar;
    }
  }

  /** 重新解析 tail 部分，与 stableNodes 合并后 emit。 */
  private flushNodes(): void {
    const { onUpdate, onPatch, transform, fixup } = this.config;
    onUpdate(this.renderedText);

    this.advanceCommit();
    const tail = this.renderedText.slice(this.committedLen);
    // fixup 只对 tail 字符串生效；committed 段已稳定无需再补
    const fixedTail = tail && fixup ? fixup(tail) : tail;
    const tailNodes = fixedTail ? transform(fixedTail) : [];

    onPatch(this.stableNodes.concat(tailNodes));
  }
}
