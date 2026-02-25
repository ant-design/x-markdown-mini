import type { SemanticStreamingConfig } from '../types.js';
import type { UnifiedNode } from '../types.js';
import { runPipeline } from '../pipeline.js';

const DEFAULT_DELIMITERS = /[。？！……；：——，、\n]/;
const DEFAULT_MAX_CHUNK_SIZE = 80;

export interface StreamingProcessorConfig extends SemanticStreamingConfig {
  onUpdate: (markdown: string) => void;
  onPatch: (nodes: UnifiedNode[]) => void;
  onComplete: () => void;
  animation?: boolean;
  selectable?: boolean;
  lexerOptions?: Record<string, unknown>;
}

export class StreamingProcessor {
  private buffer = '';
  private renderedText = '';
  private pendingChunks: string[] = [];
  private previousMarkdown = '';
  private config: StreamingProcessorConfig;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private chunkIndex = 0;
  private charIndexInChunk = 0;
  private currentHasNextChunk = false;

  constructor(config: StreamingProcessorConfig) {
    this.config = {
      delimiters: DEFAULT_DELIMITERS,
      maxChunkSize: DEFAULT_MAX_CHUNK_SIZE,
      chunkDelays: [0],
      charDelays: [0],
      ...config,
    };
  }

  /**
   * 内容更新：增量则追加到 buffer，否则 reset 后整段替换。
   */
  handleContentUpdate(content: string): void {
    if (content.startsWith(this.previousMarkdown)) {
      const delta = content.slice(this.previousMarkdown.length);
      this.buffer += delta;
    } else {
      this.reset();
      this.buffer = content;
    }
    this.previousMarkdown = content;
  }

  /**
   * 按 delimiters + maxChunkSize 切块；!hasNextChunk 时把剩余 buffer 推入最后一块。
   */
  splitIntoChunks(hasNextChunk: boolean): void {
    const { delimiters = DEFAULT_DELIMITERS, maxChunkSize = DEFAULT_MAX_CHUNK_SIZE } = this.config;
    this.pendingChunks = [];
    let remaining = this.buffer;
    while (remaining.length > 0) {
      const match = remaining.match(delimiters);
      const nextDelimIndex = match ? remaining.indexOf(match[0]) + 1 : -1;
      let chunk: string;
      if (nextDelimIndex > 0) {
        chunk = remaining.slice(0, nextDelimIndex);
        remaining = remaining.slice(nextDelimIndex);
      } else if (remaining.length > maxChunkSize && hasNextChunk) {
        chunk = remaining.slice(0, maxChunkSize);
        remaining = remaining.slice(maxChunkSize);
      } else if (!hasNextChunk) {
        chunk = remaining;
        remaining = '';
      } else {
        break;
      }
      if (chunk.length > 0) this.pendingChunks.push(chunk);
    }
    if (remaining.length > 0 && !hasNextChunk) {
      this.pendingChunks.push(remaining);
    }
    this.buffer = remaining;
  }

  /**
   * 重置状态（非增量时调用）
   */
  reset(): void {
    this.buffer = '';
    this.renderedText = '';
    this.pendingChunks = [];
    this.chunkIndex = 0;
    this.charIndexInChunk = 0;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * 按 chunkDelays/charDelays 推进 renderedText，每步解析并 onPatch(nodes)。
   */
  runRenderLoop(hasNextChunk: boolean): void {
    this.currentHasNextChunk = hasNextChunk;
    this.splitIntoChunks(hasNextChunk);
    this.chunkIndex = 0;
    this.charIndexInChunk = 0;
    this.scheduleNext();
  }

  private flushNodes(): void {
    const { onUpdate, onPatch } = this.config;
    onUpdate(this.renderedText);
    const nodes = runPipeline(this.renderedText, {
      animation: this.config.animation,
      selectable: this.config.selectable,
      lexerOptions: this.config.lexerOptions,
    });
    onPatch(nodes);
  }

  private scheduleNext(): void {
    const { chunkDelays = [0], charDelays = [0], onComplete } = this.config;
    const delayForChunk = chunkDelays[Math.min(this.chunkIndex, chunkDelays.length - 1)] ?? chunkDelays[chunkDelays.length - 1] ?? 0;
    const delayForChar = charDelays[0] ?? 0;

    this.timer = setTimeout(() => {
      if (this.chunkIndex >= this.pendingChunks.length) {
        if (this.buffer.length > 0) {
          this.splitIntoChunks(this.currentHasNextChunk);
          this.scheduleNext();
          return;
        }
        this.timer = null;
        if (!this.currentHasNextChunk) {
          onComplete();
        }
        return;
      }

      const chunk = this.pendingChunks[this.chunkIndex];
      if (delayForChar > 0 && chunk.length > 1) {
        let idx = 0;
        const step = (): void => {
          if (idx < chunk.length) {
            this.renderedText += chunk[idx];
            idx += 1;
            this.flushNodes();
            this.timer = setTimeout(step, delayForChar);
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
    }, this.chunkIndex === 0 ? 0 : delayForChunk);
  }

  /** 当前已输出给 UI 的完整 markdown 字符串 */
  getRenderedText(): string {
    return this.renderedText;
  }

  /** 是否还有待处理的 chunks（用于外部判断是否可 onComplete） */
  hasPendingChunks(): boolean {
    return this.chunkIndex < this.pendingChunks.length || this.buffer.length > 0;
  }
}
