// Single-pass transformer: markdown string -> WeChat-final nodes.
// Bakes in WeChat rich-text quirks:
//   - <a href> -> <a data-href class="md-link"> (rich-text doesn't fire <a>
//     tap events; consumers read data-href via dataset on the bubbled tap)
//   - No class on other nodes (rich-text ignores internal class anyway)
//   - <ol start> preserved
//   - Images keep http:// as-is
import { Lexer, type Token, type Tokens, type MarkedOptions } from 'marked';
import type { LexerOptions, RenderContext, MiniNode } from '../../types.js';
import { renderCustomToken } from '../shared/customTokenRenderer.js';

function escapeHtml(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (ch === 38) out += '&amp;';
    else if (ch === 60) out += '&lt;';
    else if (ch === 62) out += '&gt;';
    else if (ch === 34) out += '&quot;';
    else out += text[i];
  }
  return out;
}

function buildMarkedOptions(opts: LexerOptions): MarkedOptions {
  return { gfm: opts.gfm !== false, breaks: !!opts.breaks };
}

function block(
  name: string,
  children: MiniNode[],
  animate: boolean,
  extra?: Record<string, string | number | boolean>
): MiniNode {
  const node: MiniNode = { name, attrs: { ...(extra ?? {}) } };
  if (children.length) node.children = children;
  if (animate) node.animate = 'block';
  return node;
}

export interface TokensToWechatOptions extends RenderContext {
  lexerOptions?: LexerOptions;
}

/**
 * 从 markdown 字符串生成微信节点（自带内部 Lexer.lex）。
 * 老调用方保留，新调用方应直接走 `XMarkdownMini.parse(content)` 拿到 Token[]，
 * 再用 `tokensToWechatNodes(tokens, ctx)`，这样 marked extensions 能流过。
 */
export function tokensToWechat(
  content: string,
  options: TokensToWechatOptions = {}
): MiniNode[] {
  const { lexerOptions, ...ctx } = options;
  const tokens = Lexer.lex(content, buildMarkedOptions(lexerOptions ?? {}));
  return tokensToWechatNodes(tokens, ctx);
}

/**
 * 从 pre-lexed marked Token[] 生成微信节点。
 * 推荐使用入口：`XMarkdownMini.parse(content)` → tokens → `tokensToWechatNodes(tokens, ctx)`。
 * 这条路径让 marked extensions (用户自定义 tokenizer) 自然透传。
 */
export function tokensToWechatNodes(tokens: Token[], ctx: RenderContext = {}): MiniNode[] {
  const animate = ctx.animation === true;
  const enc = ctx.escapeText === false ? (s: string) => s : escapeHtml;
  return blockTokens(tokens, animate, enc, ctx);
}

function blockTokens(
  tokens: Token[],
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode[] {
  const out: MiniNode[] = [];
  for (const tok of tokens) {
    const node = blockTok(tok, animate, enc, ctx);
    if (node) out.push(node);
  }
  return out;
}

function blockTok(
  tok: Token,
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode | null {
  switch (tok.type) {
    case 'space': return null;
    case 'heading': {
      const t = tok as Tokens.Heading;
      const depth = Math.min(6, Math.max(1, t.depth ?? 1));
      return block(`h${depth}`, inlineTokens(t.tokens ?? [], enc, ctx), animate);
    }
    case 'paragraph': {
      const t = tok as Tokens.Paragraph;
      return block('p', inlineTokens(t.tokens ?? [], enc, ctx), animate);
    }
    case 'code': {
      const t = tok as Tokens.Code;
      const codeChild: MiniNode = {
        name: 'code', attrs: {},
        children: [{ name: 'text', attrs: { value: enc(t.text ?? '') } }],
      };
      return block('pre', [codeChild], animate);
    }
    case 'hr':
      return animate
        ? { name: 'hr', attrs: {}, animate: 'block' as const }
        : { name: 'hr', attrs: {} };
    case 'blockquote': {
      const t = tok as Tokens.Blockquote;
      return block('blockquote', blockTokens(t.tokens ?? [], animate, enc, ctx), animate);
    }
    case 'list': {
      const t = tok as Tokens.List;
      const ordered = !!t.ordered;
      const start = typeof t.start === 'number' ? t.start : 1;
      const tag = ordered ? 'ol' : 'ul';
      const children = t.items.map((it) => listItemTok(it, animate, enc, ctx));
      // wechat keeps ol[start]
      const extra: Record<string, string | number | boolean> = {};
      if (ordered && start !== 1) extra.start = start;
      return block(tag, children, animate, extra);
    }
    case 'html': {
      const t = tok as Tokens.HTML;
      const raw = (t.text ?? t.raw ?? '').replace(/\s+$/, '');
      return { name: 'div', attrs: {}, children: [{ name: 'text', attrs: { value: raw } }] };
    }
    case 'table': {
      const t = tok as Tokens.Table;
      const headCells: MiniNode[] = (t.header ?? []).map((cell) => ({
        name: 'th', attrs: {},
        children: inlineTokens(cell.tokens ?? [], enc, ctx),
      }));
      const rowNodes: MiniNode[] = (t.rows ?? []).map((row) => ({
        name: 'tr', attrs: {},
        children: row.map((cell) => ({
          name: 'td', attrs: {},
          children: inlineTokens(cell.tokens ?? [], enc, ctx),
        })),
      }));
      const thead: MiniNode = { name: 'thead', attrs: {}, children: [{ name: 'tr', attrs: {}, children: headCells }] };
      const tbody: MiniNode = { name: 'tbody', attrs: {}, children: rowNodes };
      return block('table', [thead, tbody], animate);
    }
    case 'text': {
      const t = tok as Tokens.Text;
      const inline = t.tokens
        ? inlineTokens(t.tokens, enc, ctx)
        : [{ name: 'text', attrs: { value: enc(t.text ?? '') } } as MiniNode];
      return block('p', inline, animate);
    }
    case 'def': return null;
    default: {
      const custom = renderCustomToken(tok, ctx);
      return custom.length ? block('div', custom, animate) : null;
    }
  }
}

function listItemTok(
  item: Tokens.ListItem,
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode {
  const blocks = item.tokens ?? [];
  const children: MiniNode[] = [];
  if (blocks.length === 1 && blocks[0].type === 'paragraph') {
    const p = blocks[0] as Tokens.Paragraph;
    children.push(...inlineTokens(p.tokens ?? [], enc, ctx));
  } else {
    for (const b of blocks) {
      if (b.type === 'paragraph') {
        const p = b as Tokens.Paragraph;
        children.push(...inlineTokens(p.tokens ?? [], enc, ctx));
      } else if (b.type === 'text') {
        const t = b as Tokens.Text;
        const inline = t.tokens
          ? inlineTokens(t.tokens, enc, ctx)
          : [{ name: 'text', attrs: { value: enc(t.text ?? '') } } as MiniNode];
        children.push(...inline);
      } else {
        const node = blockTok(b, animate, enc, ctx);
        if (node) children.push(node);
      }
    }
  }
  return block('li', children, false);
}

function inlineTokens(
  tokens: Token[],
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode[] {
  const out: MiniNode[] = [];
  for (const tok of tokens) inlineTok(tok, enc, out, ctx);
  return out;
}

function inlineTok(
  tok: Token,
  enc: (s: string) => string,
  out: MiniNode[],
  ctx: RenderContext,
): void {
  switch (tok.type) {
    case 'text': {
      const t = tok as Tokens.Text;
      if (t.tokens && t.tokens.length) {
        for (const inner of t.tokens) inlineTok(inner, enc, out, ctx);
      } else {
        const v = enc(t.text ?? '');
        if (v) out.push({ name: 'text', attrs: { value: v } });
      }
      return;
    }
    case 'escape': {
      const t = tok as Tokens.Escape;
      const v = enc(t.text ?? '');
      if (v) out.push({ name: 'text', attrs: { value: v } });
      return;
    }
    case 'strong': {
      const t = tok as Tokens.Strong;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, enc, inner, ctx);
      out.push({ name: 'strong', attrs: {}, children: inner });
      return;
    }
    case 'em': {
      const t = tok as Tokens.Em;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, enc, inner, ctx);
      out.push({ name: 'em', attrs: {}, children: inner });
      return;
    }
    case 'del': {
      const t = tok as Tokens.Del;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, enc, inner, ctx);
      out.push({ name: 'del', attrs: {}, children: inner });
      return;
    }
    case 'codespan': {
      const t = tok as Tokens.Codespan;
      out.push({
        name: 'code', attrs: {},
        children: [{ name: 'text', attrs: { value: enc(t.text ?? '') } }],
      });
      return;
    }
    case 'br':
      out.push({ name: 'br', attrs: {} });
      return;
    case 'link': {
      const t = tok as Tokens.Link;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, enc, inner, ctx);
      // WeChat-specific: rewrite href -> data-href + class='md-link'
      out.push({
        name: 'a',
        attrs: { 'data-href': t.href ?? '', class: 'md-link' },
        children: inner.length ? inner : [{ name: 'text', attrs: { value: '' } }],
      });
      return;
    }
    case 'image': {
      const t = tok as Tokens.Image;
      // wechat: no http->https; class stripped
      out.push({ name: 'img', attrs: { src: t.href ?? '', alt: t.text ?? '' } });
      return;
    }
    case 'html': {
      const t = tok as Tokens.HTML | Tokens.Tag;
      out.push({ name: 'text', attrs: { value: enc(t.text ?? '') } });
      return;
    }
    default: {
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) out.push(...custom);
      return;
    }
  }
}
