import { marked } from 'marked';
import type { TokensList, MarkedOptions } from 'marked';

export interface LexerOptions {
  gfm?: boolean;
  breaks?: boolean;
  [key: string]: unknown;
}

/**
 * 使用 marked.lexer 将 Markdown 解析为 Token 树，不跑 HTML 渲染。
 */
export function lex(markdown: string, options?: LexerOptions): TokensList {
  const opts = options ? { ...options } : undefined;
  return marked.lexer(markdown, opts as MarkedOptions);
}
