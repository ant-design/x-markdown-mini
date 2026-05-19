import { parse, type LexerOptions } from './core/lexer.js';
import { irToUnifiedNodes } from './core/irToUnifiedNodes.js';
import type { RenderContext, UnifiedNode } from './types.js';

export interface RunPipelineOptions extends RenderContext {
  lexerOptions?: LexerOptions;
}

/**
 * 一次性解析：content → parse(IR) → irToUnifiedNodes → 统一节点。
 */
export function runPipeline(content: string, options: RunPipelineOptions = {}): UnifiedNode[] {
  const { lexerOptions, ...ctx } = options;
  const ir = parse(content, lexerOptions);
  return irToUnifiedNodes(ir, ctx);
}
