import type {
  XMarkdownMiniProps,
  UnifiedNode,
  LexerOptions,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
import { resolvePlatform, type Platform } from './platform.js';
import { tokensToWechat } from './core/tokensToWechat.js';
import { tokensToAlipay } from './core/tokensToAlipay.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';

interface NormalizedStreamingConfig {
  hasNextChunk: boolean;
  semanticEnabled: boolean;
  semanticConfig: SemanticStreamingConfig;
  enableAnimation: boolean;
}

function normalizeStreamingConfig(
  streaming: XMarkdownMiniProps['streaming'],
): NormalizedStreamingConfig | null {
  if (!streaming) return null;

  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true,
      semanticConfig: {},
      enableAnimation: true,
    };
  }

  const cfg = streaming as StreamingConfig;
  const semantic = cfg.semantic ?? true;
  return {
    hasNextChunk: cfg.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: typeof semantic === 'object' ? semantic : {},
    enableAnimation: cfg.enableAnimation ?? true,
  };
}

export interface XMarkdownMiniOptions {
  /**
   * 是否对文本节点做 HTML 转义。默认 true（用于原生 rich-text）。
   * 自渲染组件路径应传 false（<text>{{value}}</text> 不解码实体）。
   */
  escapeText?: boolean;
}

interface TransformOptions {
  animation: boolean;
  selectable: boolean;
  escapeText: boolean;
  lexerOptions: LexerOptions | undefined;
}

function pickTransform(
  target: Platform,
  opts: TransformOptions,
): (markdown: string) => UnifiedNode[] {
  if (target === 'wechat') return (md) => tokensToWechat(md, opts);
  return (md) => tokensToAlipay(md, opts);
}

/**
 * 独立的渲染实例，持有自己的 streaming 状态。多个实例之间互不干扰，
 * 适合页面里同时挂多个 Markdown 组件 / 同时跑多路流式输出的场景。
 *
 * @example
 *   const md = new XMarkdownMini();
 *   md.render({ content: '##', streaming: true, onPatch });
 *   md.render({ content: '## Heading', streaming: { hasNextChunk: false }, onPatch });
 *
 * 顶层导出的 `render` 内部使用一个 default 实例——多路并发流式请改用 `new XMarkdownMini()`。
 */
export class XMarkdownMini {
  private streamProcessor: StreamingProcessor | null = null;
  private readonly escapeText: boolean;

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.escapeText = opts.escapeText ?? true;
  }

  /**
   * 主入口：根据 props 走一次性或流式渲染。
   * - 一次性：返回节点，并（若提供）调用一次 onPatch
   * - 流式：通过 onPatch 增量推送节点；返回空数组
   */
  render(props: XMarkdownMiniProps): UnifiedNode[] {
    const { content, platform = 'auto', selectable = true, options } = props;
    const target = resolvePlatform(platform);
    const stream = normalizeStreamingConfig(props.streaming);
    const lexerOptions = options as LexerOptions | undefined;

    if (!stream) {
      // 切到一次性：清掉可能还在的流式 processor
      this.streamProcessor = null;
      props.onRenderStart?.();
      const transform = pickTransform(target, {
        animation: false,
        selectable,
        escapeText: this.escapeText,
        lexerOptions,
      });
      const nodes = transform(content);
      props.onPatch?.(nodes);
      props.onRenderComplete?.();
      return nodes;
    }

    if (!this.streamProcessor) {
      const transform = pickTransform(target, {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
        lexerOptions,
      });
      this.streamProcessor = new StreamingProcessor({
        transform,
        semanticEnabled: stream.semanticEnabled,
        ...stream.semanticConfig,
        onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
        onPatch: (nodes) => props.onPatch?.(nodes),
        onComplete: () => {
          props.onRenderComplete?.();
          this.streamProcessor = null;
        },
      });
      props.onRenderStart?.();
    }

    this.streamProcessor.handleContentUpdate(content);
    this.streamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }

  /** 主动重置流式状态（detached / unmount 时调用）。 */
  reset(): void {
    this.streamProcessor?.reset();
    this.streamProcessor = null;
  }
}

const defaultInstance = new XMarkdownMini();

/**
 * 全局便捷入口。内部使用一个 default `XMarkdownMini` 实例——
 * 多个调用方共享同一份流式状态。如需多路并发流式，请改用 `new XMarkdownMini()`。
 */
export function render(props: XMarkdownMiniProps): UnifiedNode[] {
  return defaultInstance.render(props);
}

export { resolvePlatform } from './platform.js';
export type { Platform, PlatformInput } from './platform.js';
export { tokensToWechat, tokensToAlipay } from './core/index.js';
export type { LexerOptions } from './core/index.js';
export { StreamingProcessor } from './streaming/index.js';
export type {
  XMarkdownMiniProps,
  UnifiedNode,
  RenderContext,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
