import type {
  XMarkdownMiniProps,
  UnifiedNode,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
import { resolvePlatform } from './platform.js';
import { runPipeline } from './pipeline.js';
import { adaptToPlatform } from './adapters/index.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';
import type { LexerOptions } from './core/lexer.js';

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
   * 是否对输出节点跑平台 adapter（wechat / alipay 节点改写）。默认 true。
   * 组件层渲染（直接喂给 rich-text）应传 false，由组件自行处理。
   */
  adapt?: boolean;
  /**
   * 是否对文本节点做 HTML 转义。默认 true。
   * 组件层渲染应传 false（rich-text 自己处理转义）。
   */
  escapeText?: boolean;
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
  private readonly adapt: boolean;
  private readonly escapeText: boolean;

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.adapt = opts.adapt ?? true;
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

    if (!stream) {
      // 切到一次性：清掉可能还在的流式 processor
      this.streamProcessor = null;
      props.onRenderStart?.();
      const nodes = runPipeline(content, {
        animation: false,
        selectable,
        lexerOptions: options as LexerOptions | undefined,
        escapeText: this.escapeText,
      });
      const out = this.adapt ? adaptToPlatform(nodes, target) : nodes;
      props.onPatch?.(out);
      props.onRenderComplete?.();
      return out;
    }

    if (!this.streamProcessor) {
      this.streamProcessor = new StreamingProcessor({
        semanticEnabled: stream.semanticEnabled,
        ...stream.semanticConfig,
        animation: stream.enableAnimation,
        selectable,
        lexerOptions: options as LexerOptions | undefined,
        escapeText: this.escapeText,
        onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
        onPatch: (nodes) =>
          props.onPatch?.(this.adapt ? adaptToPlatform(nodes, target) : nodes),
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
export { runPipeline, renderOnce } from './pipeline.js';
export { parse, lex, parseInline, irToUnifiedNodes } from './core/index.js';
export {
  adaptToPlatform,
  adaptNodes,
  toWechatNodes,
  toAlipayNodes,
  PLATFORM_CAPABILITIES,
  PLATFORM_ADAPTER_CONFIG,
} from './adapters/index.js';
export type {
  PlatformCapabilities,
  PlatformAdapterConfig,
} from './adapters/index.js';
export { StreamingProcessor } from './streaming/index.js';
export type {
  XMarkdownMiniProps,
  UnifiedNode,
  IRNode,
  IRNodeType,
  IRBlockType,
  IRInlineType,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
