import { lex } from './core/lexer.js';
import { tokensToIR } from './core/tokensToIR.js';
import { irToUnifiedNodes } from './core/irToUnifiedNodes.js';
import type { UnifiedNode } from './types.js';
import type { XMarkdownMiniProps } from './types.js';

/**
 * 一次性解析：content → lexer → tokensToIR → irToUnifiedNodes → 统一节点
 */
export function runPipeline(
  content: string,
  options: {
    animation?: boolean;
    selectable?: boolean;
    lexerOptions?: Record<string, unknown>;
  } = {}
): UnifiedNode[] {
  const tokens = lex(content, options.lexerOptions as import('./core/lexer.js').LexerOptions);
  const ir = tokensToIR(tokens as import('marked').Token[]);
  return irToUnifiedNodes(ir, {
    animation: options.animation,
    selectable: options.selectable,
  });
}

/**
 * 一次性渲染主入口（无流式）：返回统一节点，由调用方按 platform 选适配器。
 */
export function renderOnce(props: XMarkdownMiniProps): UnifiedNode[] {
  const { content, animation = false, selectable = true, options } = props;
  props.onRenderStart?.();
  const nodes = runPipeline(content, {
    animation,
    selectable,
    lexerOptions: options,
  });
  props.onRenderComplete?.();
  return nodes;
}
