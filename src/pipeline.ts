import { parse, type LexerOptions } from './core/lexer.js';
import { irToUnifiedNodes } from './core/irToUnifiedNodes.js';
import type { UnifiedNode, XMarkdownMiniProps } from './types.js';

export interface RunPipelineOptions {
  animation?: boolean;
  selectable?: boolean;
  lexerOptions?: LexerOptions;
  /** 见 IrToUnifiedOptions.escapeText。组件渲染场景应传 false。 */
  escapeText?: boolean;
}

/**
 * 一次性解析：content → parse(IR) → irToUnifiedNodes → 统一节点。
 */
export function runPipeline(content: string, options: RunPipelineOptions = {}): UnifiedNode[] {
  const ir = parse(content, options.lexerOptions);
  return irToUnifiedNodes(ir, {
    animation: options.animation,
    selectable: options.selectable,
    escapeText: options.escapeText,
  });
}

/**
 * 一次性渲染主入口（无流式）：返回统一节点，由调用方按 platform 选适配器。
 */
export function renderOnce(props: XMarkdownMiniProps): UnifiedNode[] {
  const { content, selectable = true, options } = props;
  props.onRenderStart?.();
  const nodes = runPipeline(content, {
    animation: false,
    selectable,
    lexerOptions: options as LexerOptions | undefined,
  });
  props.onRenderComplete?.();
  return nodes;
}
