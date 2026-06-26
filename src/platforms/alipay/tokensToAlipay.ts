import { Lexer, type MarkedOptions, type Token, type Tokens } from 'marked';
import type { MiniNode, RenderContext } from '../../types.js';
import type { PlatformCapabilities } from '../types.js';
import {
  renderTokensToMiniNodes,
  type MiniNodePlatformAdapter,
} from '../shared/miniNodeRenderer.js';

function buildMarkedOptions(opts: { gfm?: boolean; breaks?: boolean }): MarkedOptions {
  return { gfm: opts.gfm !== false, breaks: !!opts.breaks };
}

export const alipayCapabilities: PlatformCapabilities = {
  supportsOlStart: false,
  requiresHttpsImage: true,
  anchorHrefMode: 'href',
  supportsTable: true,
  supportsPre: true,
  supportsBlockquote: true,
};

const alipayAdapter: MiniNodePlatformAdapter = {
  capabilities: alipayCapabilities,
  linkAttrs: (href) => ({ href, class: 'md-link' }),
  imageSrc: (src) => src.replace(/^http:\/\//, 'https://'),
  olAttrs: () => ({}),
  listItemMarker: ({ ordered, start, index }) => (ordered ? `${start + index}.` : '•'),
  node: (node, meta) => {
    if (node.name !== 'table') return node;
    const table = meta.token as Tokens.Table;
    const columnCount = table.header?.length ?? 0;
    return {
      ...node,
      attrs: {
        ...node.attrs,
        class: columnCount > 1 ? 'md-table md-table-multi' : 'md-table md-table-single',
      },
    };
  },
};

export interface TokensToAlipayOptions extends RenderContext {
  options?: { gfm?: boolean; breaks?: boolean };
}

/**
 * Converts markdown into Alipay mini-program nodes.
 * Kept for compatibility; new code can parse once and call tokensToAlipayNodes().
 */
export function tokensToAlipay(
  content: string,
  opts: TokensToAlipayOptions = {},
): MiniNode[] {
  const { options, ...ctx } = opts;
  const tokens = Lexer.lex(content, buildMarkedOptions(options ?? {}));
  return tokensToAlipayNodes(tokens, ctx);
}

/** Converts pre-lexed marked Token[] into Alipay mini-program nodes. */
export function tokensToAlipayNodes(tokens: Token[], ctx: RenderContext = {}): MiniNode[] {
  return renderTokensToMiniNodes(tokens, alipayAdapter, ctx);
}
