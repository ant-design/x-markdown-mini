import type {
  XMarkdownMiniProps,
  UnifiedNode,
  SemanticStreamingConfig,
  StreamingConfig,
  PlatformInput,
  Platform,
} from './types.js';
import { renderOnce } from './pipeline.js';
import { adaptToPlatform } from './adapters/index.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';

let streamProcessor: StreamingProcessor | null = null;

function detectPlatformRuntime(): Platform {
  const g = globalThis as unknown as Record<string, unknown>;
  const has = (key: string): boolean => {
    const obj = g[key];
    if (!obj || typeof obj !== 'object') return false;
    const target = obj as Record<string, unknown>;
    return (
      typeof target.getSystemInfo === 'function' || typeof target.getSystemInfoSync === 'function'
    );
  };

  if (has('my')) return 'alipay';
  if (has('wx')) return 'wechat';
  if (has('tt')) return 'douyin';
  if (has('swan')) return 'baidu';
  if (has('qq')) return 'qq';
  if (has('ks')) return 'kuaishou';
  if (has('dd')) return 'dingtalk';
  if (has('jd')) return 'jd';
  return 'alipay';
}

export function resolvePlatform(platform?: PlatformInput): Platform {
  if (!platform || platform === 'auto') return detectPlatformRuntime();
  return platform;
}

interface NormalizedStreamingConfig {
  hasNextChunk: boolean;
  semanticEnabled: boolean;
  semanticConfig: SemanticStreamingConfig;
  enableAnimation: boolean;
}

function normalizeStreamingConfig(streaming: XMarkdownMiniProps['streaming']): NormalizedStreamingConfig | null {
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
  const semanticEnabled = semantic !== false;
  const semanticConfig = typeof semantic === 'object' ? semantic : {};

  return {
    hasNextChunk: cfg.hasNextChunk,
    semanticEnabled,
    semanticConfig,
    enableAnimation: cfg.enableAnimation ?? true,
  };
}

/**
 * 主入口：根据 props 走一次性或流式。
 * - 一次性：返回适配后节点。
 * - 流式：通过 props.onPatch 回调增量推送节点；返回值为空数组。
 */
export function render(props: XMarkdownMiniProps): UnifiedNode[] {
  const { content, platform = 'auto', selectable = true, options } = props;
  const target = resolvePlatform(platform);
  const stream = normalizeStreamingConfig(props.streaming);

  if (!stream) {
    streamProcessor = null;
    return adaptToPlatform(renderOnce(props), target);
  }

  if (!streamProcessor) {
    streamProcessor = new StreamingProcessor({
      semanticEnabled: stream.semanticEnabled,
      ...stream.semanticConfig,
      animation: stream.enableAnimation,
      selectable,
      lexerOptions: options,
      onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
      onPatch: (nodes) => props.onPatch?.(adaptToPlatform(nodes, target)),
      onComplete: () => {
        props.onRenderComplete?.();
        streamProcessor = null;
      },
    });
    props.onRenderStart?.();
  }

  streamProcessor.handleContentUpdate(content);
  streamProcessor.runRenderLoop(stream.hasNextChunk);
  return [];
}

export { runPipeline, renderOnce } from './pipeline.js';
export { parse, lex, parseInline, irToUnifiedNodes } from './core/index.js';
export {
  adaptToPlatform,
  adaptNodes,
  toWechatNodes,
  toAlipayNodes,
  toDouyinNodes,
  toOtherNodes,
  PLATFORM_CAPABILITIES,
  PLATFORM_ADAPTER_CONFIG,
} from './adapters/index.js';
export type { PlatformCapabilities, PlatformAdapterConfig } from './adapters/index.js';
export { StreamingProcessor } from './streaming/index.js';
export type {
  XMarkdownMiniProps,
  UnifiedNode,
  IRNode,
  IRNodeType,
  IRBlockType,
  IRInlineType,
  Platform,
  PlatformInput,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
