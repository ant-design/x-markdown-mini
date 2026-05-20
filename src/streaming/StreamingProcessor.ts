import type { UnifiedNode } from '../types.js';

const DEFAULT_DELIMITERS = /[。？！……；：——，、\n]/;
const DEFAULT_MAX_CHUNK_SIZE = 80;

export interface StreamingProcessorConfig {
  /**
   * 把一段 markdown 文本转成平台节点的函数。调用方（通常是 XMarkdownMini）
   * 根据 platform 上下文挑出 tokensToWechat / tokensToAlipay 之一，并把
   * escapeText / animation / lexerOptions 闭包进去。StreamingProcessor 自己
   * 不关心平台和上下文，只调用此回调。
   */
  transform: (markdown: string) => UnifiedNode[];
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
  onPatch: (nodes: UnifiedNode[]) => void;
  onComplete: () => void;
  semanticEnabled?: boolean;
  delimiters?: RegExp;
  maxChunkSize?: number;
  chunkDelay?: number;
  charDelay?: number;
}

/**
 * 流式处理器：
 * - 增量合并 markdown 文本（前缀匹配则视作追加，否则 reset）
 * - 已稳定（前面已被空行收尾）的块只解析一次，缓存为 stableNodes
 * - 仅对未稳定的 tail（最后一段）每次重新走 transform
 * - chunkDelay/charDelay 全为 0 时跳过 setTimeout 链，单次 onPatch 即返回
 * - 否则走语义切块的"打字机"模式：按 delimiters / maxChunkSize 推进 renderedText
 */
export class StreamingProcessor {
  private buffer = '';
  private renderedText = '';
  private previousMarkdown = '';

  private stableNodes: UnifiedNode[] = [];
  private committedLen = 0;
  /** Whether the character at committedLen is inside a fenced code block (used for incremental scanning). */
  private committedInFence = false;
  private committedFenceChar = '';

  private pendingChunks: string[] = [];
  private chunkIndex = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private currentHasNextChunk = false;

  private readonly config: {
    transform: (markdown: string) => UnifiedNode[];
    fixup: ((tail: string) => string) | undefined;
    onUpdate: (markdown: string) => void;
    onPatch: (nodes: UnifiedNode[]) => void;
    onComplete: () => void;
    semanticEnabled: boolean;
    delimiters: RegExp;
    maxChunkSize: number;
    chunkDelay: number;
    charDelay: number;
  };

  constructor(cfg: StreamingProcessorConfig) {
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
    this.stableNodes = [];
    this.committedLen = 0;
    this.committedInFence = false;
    this.committedFenceChar = '';
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * 推进渲染。若 chunk/charDelay 都为 0，立即一次性 flush；否则进入打字机循环。
   */
  runRenderLoop(hasNextChunk: boolean): void {
    this.currentHasNextChunk = hasNextChunk;
    const { chunkDelay, charDelay } = this.config;

    if (chunkDelay === 0 && charDelay === 0) {
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
      } else if (remaining.length > maxChunkSize && hasNextChunk) {
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

    this.timer = setTimeout(() => {
      if (this.chunkIndex >= this.pendingChunks.length) {
        if (this.buffer.length > 0) {
          this.splitIntoChunks(this.currentHasNextChunk);
          this.scheduleNext();
          return;
        }
        this.timer = null;
        if (!this.currentHasNextChunk) onComplete();
        return;
      }

      const chunk = this.pendingChunks[this.chunkIndex];
      if (charDelay > 0 && chunk.length > 1) {
        let i = 0;
        const step = (): void => {
          if (i < chunk.length) {
            this.renderedText += chunk[i++];
            this.flushNodes();
            this.timer = setTimeout(step, charDelay);
          } else {
            this.chunkIndex += 1;
            this.scheduleNext();
          }
        };
        step();
      } else {
        this.renderedText += chunk;
        this.chunkIndex += 1;
        this.flushNodes();
        this.scheduleNext();
      }
    }, this.chunkIndex === 0 ? 0 : chunkDelay);
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
          lastSafe = i + 1;
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
