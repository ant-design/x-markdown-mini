import { type Token, type Tokens } from 'marked';
import type { MiniNode, RenderContext, CodeHeaderRenderer, TableHeaderRenderer } from '../../types.js';
import type { PlatformCapabilities } from '../types.js';
import { renderCustomToken } from './customTokenRenderer.js';

export type MiniNodeAttrs = Record<string, string | number | boolean>;

export interface MiniNodeRenderMeta {
  token?: Token;
  role: 'block' | 'inline';
}

export interface MiniNodePlatformAdapter {
  capabilities?: Partial<Pick<PlatformCapabilities, 'supportsTable' | 'supportsPre' | 'supportsBlockquote'>>;
  linkAttrs: (href: string, token: Tokens.Link) => MiniNodeAttrs;
  imageSrc: (src: string, token: Tokens.Image) => string;
  olAttrs: (start: number, token: Tokens.List) => MiniNodeAttrs;
  listItemMarker?: (meta: ListItemMeta) => string;
  node?: (node: MiniNode, meta: MiniNodeRenderMeta) => MiniNode | null | undefined;
}

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

function block(
  name: string,
  children: MiniNode[],
  animate: boolean,
  adapter: MiniNodePlatformAdapter,
  token?: Token,
  extra?: MiniNodeAttrs,
): MiniNode {
  const node: MiniNode = { name };
  if (extra && Object.keys(extra).length > 0) node.attrs = extra;
  if (children.length) node.children = children;
  if (animate) node.animate = true;
  return adaptNode(adapter, node, { role: 'block', token }) ?? node;
}

function inlineNode(
  adapter: MiniNodePlatformAdapter,
  node: MiniNode,
  token?: Token,
): MiniNode | null {
  return adaptNode(adapter, compactNode(node), { role: 'inline', token });
}

function compactNode(node: MiniNode): MiniNode {
  if (node.attrs && Object.keys(node.attrs).length === 0) {
    const { attrs: _attrs, ...rest } = node;
    return rest;
  }
  return node;
}

function adaptNode(
  adapter: MiniNodePlatformAdapter,
  node: MiniNode,
  meta: MiniNodeRenderMeta,
): MiniNode | null {
  const adapted = adapter.node?.(node, meta);
  if (adapted === null) return null;
  return compactNode(adapted ?? node);
}

function supports(
  adapter: MiniNodePlatformAdapter,
  capability: keyof NonNullable<MiniNodePlatformAdapter['capabilities']>,
): boolean {
  return adapter.capabilities?.[capability] !== false;
}

function textBlock(value: string, animate: boolean, adapter: MiniNodePlatformAdapter, token?: Token): MiniNode {
  return block('p', value ? [{ name: 'text', attrs: { value } }] : [], animate, adapter, token, { class: 'md-paragraph' });
}

function collectText(nodes: MiniNode[]): string {
  let out = '';
  for (const node of nodes) {
    if (node.name === 'text') out += String(node.attrs?.value ?? '');
    if (node.children) out += collectText(node.children);
  }
  return out;
}

/** Build a copy-button MiniNode carrying the raw clipboard payload. */
export function copyButton(text: string): MiniNode {
  return { name: 'copy-button', attrs: { 'data-copy': text, class: 'md-copy-icon' } };
}

function asNodeArray(x: MiniNode | MiniNode[] | null | undefined): MiniNode[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function buildCodeHeader(ctx: RenderContext, lang: string, text: string, token: Tokens.Code): MiniNode[] {
  const cfg = ctx.codeHeader;
  if (cfg === false) return [];
  if (typeof cfg === 'function') return asNodeArray((cfg as CodeHeaderRenderer)({ lang, text, token }));
  return [
    { name: 'text', attrs: { class: 'md-codeblock-lang', value: lang || 'code' } },
    copyButton(text),
  ];
}

function buildTableHeader(ctx: RenderContext, token: Tokens.Table): MiniNode[] {
  const cfg = ctx.tableHeader;
  if (cfg === false) return [];
  const markdown = token.raw ?? '';
  if (typeof cfg === 'function') return asNodeArray((cfg as TableHeaderRenderer)({ markdown, token }));
  return [
    { name: 'text', attrs: { class: 'md-tableblock-title', value: '表格' } },
    copyButton(markdown),
  ];
}

function withHeader(node: MiniNode, header: MiniNode[]): MiniNode {
  if (header.length) node.header = header;
  return node;
}

export function renderTokensToMiniNodes(
  tokens: Token[],
  adapter: MiniNodePlatformAdapter,
  ctx: RenderContext = {},
): MiniNode[] {
  const animate = ctx.animation === true;
  const enc = ctx.escapeText === false ? (s: string) => s : escapeHtml;
  // Shallow-clone ctx so custom miniRenderers can recursively render inline
  // children without leaking the closure callback into the caller's ctx.
  const localCtx: RenderContext = { ...ctx };
  localCtx.renderInlineTokens = (inner: Token[]) =>
    inlineTokens(inner, adapter, enc, localCtx);
  return blockTokens(tokens, adapter, animate, enc, localCtx);
}

function blockTokens(
  tokens: Token[],
  adapter: MiniNodePlatformAdapter,
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode[] {
  const out: MiniNode[] = [];
  for (const tok of tokens) {
    const node = blockTok(tok, adapter, animate, enc, ctx);
    if (node) out.push(node);
  }
  return out;
}

function blockTok(
  tok: Token,
  adapter: MiniNodePlatformAdapter,
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode | null {
  switch (tok.type) {
    case 'space':
      return null;
    case 'heading': {
      const t = tok as Tokens.Heading;
      const depth = Math.min(6, Math.max(1, t.depth ?? 1));
      return block(`h${depth}`, inlineTokens(t.tokens ?? [], adapter, enc, ctx), animate, adapter, tok, {
        class: `md-heading md-h${depth}`,
      });
    }
    case 'paragraph': {
      const t = tok as Tokens.Paragraph;
      return block('p', inlineTokens(t.tokens ?? [], adapter, enc, ctx), animate, adapter, tok, { class: 'md-paragraph' });
    }
    case 'code': {
      const t = tok as Tokens.Code;
      const lang = ((t.lang ?? '').trim().split(/\s+/)[0]) ?? '';
      const preAttrs: MiniNodeAttrs = lang
        ? { class: 'md-code-block', lang }
        : { class: 'md-code-block' };
      const header = buildCodeHeader(ctx, lang, t.text ?? '', t);
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) return withHeader(block('pre', custom, animate, adapter, tok, preAttrs), header);
      if (!supports(adapter, 'supportsPre')) {
        return textBlock(enc(t.text ?? ''), animate, adapter, tok);
      }
      const codeChild: MiniNode = {
        name: 'code',
        children: [{ name: 'text', attrs: { value: enc(t.text ?? '') } }],
      };
      return withHeader(block('pre', [codeChild], animate, adapter, tok, preAttrs), header);
    }
    case 'hr':
      return block('hr', [], animate, adapter, tok, { class: 'md-hr' });
    case 'blockquote': {
      const t = tok as Tokens.Blockquote;
      const children = blockTokens(t.tokens ?? [], adapter, animate, enc, ctx);
      if (!supports(adapter, 'supportsBlockquote')) {
        return textBlock(collectText(children), animate, adapter, tok);
      }
      return block('blockquote', children, animate, adapter, tok, { class: 'md-blockquote' });
    }
    case 'list': {
      const t = tok as Tokens.List;
      const ordered = !!t.ordered;
      const start = typeof t.start === 'number' ? t.start : 1;
      const tag = ordered ? 'ol' : 'ul';
      const children = t.items.map((item, index) =>
        listItemTok(item, adapter, animate, enc, ctx, { ordered, start, index, token: item }),
      );
      const listAttrs: MiniNodeAttrs = { class: 'md-list', ...(ordered ? adapter.olAttrs(start, t) : {}) };
      return block(tag, children, animate, adapter, tok, listAttrs);
    }
    case 'html': {
      const t = tok as Tokens.HTML;
      const raw = (t.text ?? t.raw ?? '').replace(/\s+$/, '');
      return block('div', raw ? [{ name: 'text', attrs: { value: raw } }] : [], animate, adapter, tok);
    }
    case 'table': {
      const t = tok as Tokens.Table;
      // Extension override: an extension whose miniRenderer/renderer is named
      // 'table' fully replaces the built-in table rendering (mirrors 'code').
      // The extension returns the complete replacement node(s); a single node is
      // returned as-is, multiples are wrapped in a block container.
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) {
        return custom.length === 1 ? custom[0] : block('div', custom, animate, adapter, tok);
      }
      if (!supports(adapter, 'supportsTable')) {
        const rows = [
          t.header ?? [],
          ...(t.rows ?? []),
        ];
        const value = rows
          .map((row) => row.map((cell) => collectText(inlineTokens(cell.tokens ?? [], adapter, enc, ctx))).join('\t'))
          .join('\n');
        return textBlock(value, animate, adapter, tok);
      }
      const headCells: MiniNode[] = (t.header ?? []).map((cell) => ({
        name: 'th',
        attrs: { class: 'md-th' },
        children: inlineTokens(cell.tokens ?? [], adapter, enc, ctx),
      }));
      const rowNodes: MiniNode[] = (t.rows ?? []).map((row) => ({
        name: 'tr',
        attrs: { class: 'md-tr' },
        children: row.map((cell) => ({
          name: 'td',
          attrs: { class: 'md-td' },
          children: inlineTokens(cell.tokens ?? [], adapter, enc, ctx),
        })),
      }));
      // No thead/tbody wrappers: WeChat does not render display:table-row-group
      // reliably on <view>, which breaks column alignment. Putting <tr> rows
      // directly under the CSS table is the cross-platform-robust structure.
      const headerRow: MiniNode = { name: 'tr', attrs: { class: 'md-tr' }, children: headCells };
      return withHeader(
        block('table', [headerRow, ...rowNodes], animate, adapter, tok, { class: 'md-table' }),
        buildTableHeader(ctx, t),
      );
    }
    case 'text': {
      const t = tok as Tokens.Text;
      const inline = t.tokens
        ? inlineTokens(t.tokens, adapter, enc, ctx)
        : [{ name: 'text', attrs: { value: enc(t.text ?? '') } } as MiniNode];
      return block('p', inline, animate, adapter, tok);
    }
    case 'def':
      return null;
    default: {
      const custom = renderCustomToken(tok, ctx);
      return custom.length ? block('div', custom, animate, adapter, tok) : null;
    }
  }
}

interface ListItemMeta {
  ordered: boolean;
  start: number;
  index: number;
  token: Tokens.ListItem;
}

function listItemTok(
  item: Tokens.ListItem,
  adapter: MiniNodePlatformAdapter,
  animate: boolean,
  enc: (s: string) => string,
  ctx: RenderContext,
  meta: ListItemMeta,
): MiniNode {
  const blocks = item.tokens ?? [];
  const children: MiniNode[] = [];
  const marker = adapter.listItemMarker?.(meta);
  if (marker) {
    children.push({ name: 'text', attrs: { class: 'md-list-marker', value: marker } });
  }
  const content: MiniNode[] = marker ? [] : children;
  if (blocks.length === 1 && blocks[0].type === 'paragraph') {
    const p = blocks[0] as Tokens.Paragraph;
    content.push(...inlineTokens(p.tokens ?? [], adapter, enc, ctx));
  } else {
    for (const b of blocks) {
      if (b.type === 'paragraph') {
        const p = b as Tokens.Paragraph;
        content.push(...inlineTokens(p.tokens ?? [], adapter, enc, ctx));
      } else if (b.type === 'text') {
        const t = b as Tokens.Text;
        const inline = t.tokens
          ? inlineTokens(t.tokens, adapter, enc, ctx)
          : [{ name: 'text', attrs: { value: enc(t.text ?? '') } } as MiniNode];
        content.push(...inline);
      } else {
        const node = blockTok(b, adapter, animate, enc, ctx);
        if (node) content.push(node);
      }
    }
  }
  if (marker) {
    children.push({ name: 'div', attrs: { class: 'md-list-content' }, children: content });
  }
  return block('li', children, false, adapter, item, { class: 'md-list-item' });
}

function inlineTokens(
  tokens: Token[],
  adapter: MiniNodePlatformAdapter,
  enc: (s: string) => string,
  ctx: RenderContext,
): MiniNode[] {
  const out: MiniNode[] = [];
  for (const tok of tokens) inlineTok(tok, adapter, enc, out, ctx);
  return out;
}

function inlineTok(
  tok: Token,
  adapter: MiniNodePlatformAdapter,
  enc: (s: string) => string,
  out: MiniNode[],
  ctx: RenderContext,
): void {
  switch (tok.type) {
    case 'text': {
      const t = tok as Tokens.Text;
      if (t.tokens && t.tokens.length) {
        for (const inner of t.tokens) inlineTok(inner, adapter, enc, out, ctx);
      } else {
        const value = enc(t.text ?? '');
        const node = inlineNode(adapter, { name: 'text', attrs: { value } }, tok);
        if (value && node) out.push(node);
      }
      return;
    }
    case 'escape': {
      const t = tok as Tokens.Escape;
      const value = enc(t.text ?? '');
      const node = inlineNode(adapter, { name: 'text', attrs: { value } }, tok);
      if (value && node) out.push(node);
      return;
    }
    case 'strong': {
      const t = tok as Tokens.Strong;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: 'strong', children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case 'em': {
      const t = tok as Tokens.Em;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: 'em', children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case 'del': {
      const t = tok as Tokens.Del;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: 'del', children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case 'codespan': {
      const t = tok as Tokens.Codespan;
      const node = inlineNode(adapter, {
        name: 'code',
        attrs: { class: 'md-inline-code' },
        children: [{ name: 'text', attrs: { value: enc(t.text ?? '') } }],
      }, tok);
      if (node) out.push(node);
      return;
    }
    case 'br':
      {
        const node = inlineNode(adapter, { name: 'br' }, tok);
        if (node) out.push(node);
      }
      return;
    case 'link': {
      const t = tok as Tokens.Link;
      const inner: MiniNode[] = [];
      for (const c of t.tokens ?? []) inlineTok(c, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, {
        name: 'a',
        attrs: adapter.linkAttrs(t.href ?? '', t),
        children: inner.length ? inner : [{ name: 'text', attrs: { value: '' } }],
      }, tok);
      if (node) out.push(node);
      return;
    }
    case 'image': {
      const t = tok as Tokens.Image;
      const node = inlineNode(
        adapter,
        { name: 'img', attrs: { src: adapter.imageSrc(t.href ?? '', t), alt: t.text ?? '' } },
        tok,
      );
      if (node) out.push(node);
      return;
    }
    case 'html': {
      const t = tok as Tokens.HTML | Tokens.Tag;
      const node = inlineNode(adapter, { name: 'text', attrs: { value: enc(t.text ?? '') } }, tok);
      if (node) out.push(node);
      return;
    }
    default: {
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) out.push(...custom);
      return;
    }
  }
}
