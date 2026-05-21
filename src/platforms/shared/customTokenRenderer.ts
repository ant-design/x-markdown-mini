import type { Token } from 'marked';
import type { RenderContext, MiniNode } from '../../types.js';

export function renderCustomToken(
  token: Token,
  ctx: RenderContext,
): MiniNode[] {
  const renderers = ctx.tokenRenderers;
  if (!renderers || renderers.length === 0) return [];

  for (const renderer of renderers) {
    if (renderer.token !== token.type) continue;
    const rendered = renderer.render(token, ctx);
    if (!rendered) return [];
    return Array.isArray(rendered) ? rendered : [rendered];
  }

  return [];
}
