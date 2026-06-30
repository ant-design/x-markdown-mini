import type { Token } from 'marked';
import type { RenderContext, MiniNode } from '../../types.js';
import { htmlToMiniNodes } from '../../plugins/shared/htmlToMiniNodes.js';

/**
 * Minimal `this` stub passed to marked-style HTML `renderer` functions.
 *
 * Note: `parser.parseInline` is a no-op stub here — MiniNode-targeted
 * renderers cannot delegate inline rendering through marked because our
 * pipeline is MiniNode-based, not HTML-based. Renderers that need inline
 * children should use `miniRenderer` (which receives the full Token and can
 * walk `token.tokens` itself) instead of `renderer`.
 */
function makeRendererThis(_ctx: RenderContext): { parser: { parseInline: () => string } } {
  return { parser: { parseInline: () => '' } };
}

export function renderCustomToken(
  token: Token,
  ctx: RenderContext,
): MiniNode[] {
  // 1) Colocated extensions: scan extensions[].extensions[] for a matching
  //    tokenizer entry, prefer miniRenderer, fall back to HTML renderer.
  const exts = ctx.extensions;
  if (exts && exts.length > 0) {
    for (let i = 0; i < exts.length; i++) {
      const inner = exts[i]?.extensions;
      if (!inner || inner.length === 0) continue;
      for (let j = 0; j < inner.length; j++) {
        const tok = inner[j];
        if (!tok || tok.name !== token.type) continue;
        if (typeof tok.miniRenderer === 'function') {
          const rendered = tok.miniRenderer(token, ctx);
          if (!rendered) return [];
          return Array.isArray(rendered) ? rendered : [rendered];
        }
        if (typeof tok.renderer === 'function') {
          const html = tok.renderer.call(makeRendererThis(ctx), token);
          if (typeof html !== 'string' || html.length === 0) return [];
          return htmlToMiniNodes(html, ctx.escapeText !== false);
        }
        // Tokenizer entry matched but no renderer — no match found.
        break;
      }
    }
  }

  return [];
}
