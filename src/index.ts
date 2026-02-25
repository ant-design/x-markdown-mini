import type { XMarkdownMiniProps, UnifiedNode, SemanticStreamingConfig, Platform } from './types.js';
import { renderOnce } from './pipeline.js';
import { adaptToPlatform } from './adapters/index.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';

let streamProcessor: StreamingProcessor | null = null;

/**
 * 主入口：根据 props 走一次性或流式，返回当前节点（一次性时有效）；流式时通过 onPatch 回调更新。
 */
export function render(props: XMarkdownMiniProps): UnifiedNode[] {
  const {
    content,
    platform = 'wechat',
    hasNextChunk = false,
    streaming = false,
    animation = false,
    selectable = true,
    options,
  } = props;

  if (!streaming) {
    streamProcessor = null;
    const nodes = renderOnce(props);
    return adaptToPlatform(nodes, platform);
  }

  const streamConfig = streaming === true ? {} : (streaming as SemanticStreamingConfig);
  if (!streamProcessor) {
    streamProcessor = new StreamingProcessor({
      ...streamConfig,
      animation,
      selectable,
      lexerOptions: options,
      onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
      onPatch: (nodes) => {
        const adapted = adaptToPlatform(nodes, platform);
        props.onPatch?.(adapted);
      },
      onComplete: () => {
        props.onRenderComplete?.();
        streamProcessor = null;
      },
    });
  }

  streamProcessor.handleContentUpdate(content);
  streamProcessor.runRenderLoop(hasNextChunk);
  return [];
}

export { runPipeline, renderOnce } from './pipeline.js';
export { lex, tokensToIR, irToUnifiedNodes } from './core/index.js';
export { adaptToPlatform, toWechatNodes, toAlipayNodes, toDouyinNodes, toOtherNodes } from './adapters/index.js';
export { StreamingProcessor } from './streaming/index.js';
export { describeRecursiveRender } from './recursive/index.js';
export type {
  XMarkdownMiniProps,
  UnifiedNode,
  IRNode,
  Platform,
  SemanticStreamingConfig,
} from './types.js';
