import { Lexer, type MarkedOptions, type Token } from 'marked';
import type { LexerOptions, MiniNode, RenderContext } from '../../types.js';
import type { PlatformCapabilities } from '../types.js';
import {
  renderTokensToMiniNodes,
  type MiniNodePlatformAdapter,
} from '../shared/miniNodeRenderer.js';

function buildMarkedOptions(opts: LexerOptions): MarkedOptions {
  return { gfm: opts.gfm !== false, breaks: !!opts.breaks };
}

export const wechatCapabilities: PlatformCapabilities = {
  supportsOlStart: true,
  requiresHttpsImage: false,
  anchorHrefMode: 'data-href',
  supportsTable: true,
  supportsPre: true,
  supportsBlockquote: true,
};

const wechatAdapter: MiniNodePlatformAdapter = {
  capabilities: wechatCapabilities,
  linkAttrs: (href) => ({ 'data-href': href, class: 'md-link' }),
  imageSrc: (src) => src,
  olAttrs: (start) => {
    const attrs: Record<string, string | number | boolean> = {};
    if (start !== 1) attrs.start = start;
    return attrs;
  },
};

export interface TokensToWechatOptions extends RenderContext {
  lexerOptions?: LexerOptions;
}

/**
 * Converts markdown into WeChat mini-program nodes.
 * Kept for compatibility; new code can parse once and call tokensToWechatNodes().
 */
export function tokensToWechat(
  content: string,
  options: TokensToWechatOptions = {},
): MiniNode[] {
  const { lexerOptions, ...ctx } = options;
  const tokens = Lexer.lex(content, buildMarkedOptions(lexerOptions ?? {}));
  return tokensToWechatNodes(tokens, ctx);
}

/** Converts pre-lexed marked Token[] into WeChat mini-program nodes. */
export function tokensToWechatNodes(tokens: Token[], ctx: RenderContext = {}): MiniNode[] {
  return renderTokensToMiniNodes(tokens, wechatAdapter, ctx);
}
