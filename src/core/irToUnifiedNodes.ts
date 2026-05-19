import type { IRNode, IRInlineType, RenderContext, UnifiedNode } from '../types.js';

export type IrToUnifiedOptions = RenderContext;

const ANIMATE_CLASS = 'md-animate-block';

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

function joinClass(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

function makeBlock(
  name: string,
  cls: string,
  children: UnifiedNode[],
  animate: boolean,
  extra?: Record<string, string | number | boolean>
): UnifiedNode {
  const attrs: Record<string, string | number | boolean> = { ...extra };
  attrs.class = joinClass(cls, animate && ANIMATE_CLASS);
  const node: UnifiedNode = { name, attrs };
  if (children.length) node.children = children;
  if (animate) node.animate = 'block';
  return node;
}

function inlineToUnified(nodes: IRNode[] | undefined, enc: (s: string) => string): UnifiedNode[] {
  if (!nodes || nodes.length === 0) return [];
  const out: UnifiedNode[] = [];
  for (const n of nodes) {
    switch (n.t) {
      case 'strong':
        out.push({ name: 'strong', attrs: {}, children: inlineToUnified(n.c, enc) });
        break;
      case 'em':
        out.push({ name: 'em', attrs: {}, children: inlineToUnified(n.c, enc) });
        break;
      case 'del':
        out.push({
          name: 'del',
          attrs: { class: 'md-del' },
          children: inlineToUnified(n.c, enc),
        });
        break;
      case 'codespan':
        out.push({
          name: 'code',
          attrs: { class: 'md-inline-code' },
          children: [{ name: 'text', attrs: { value: enc(n.raw ?? '') } }],
        });
        break;
      case 'br':
        out.push({ name: 'br', attrs: {} });
        break;
      case 'link': {
        const href = (n.a?.href as string) ?? '';
        const inner = inlineToUnified(n.c, enc);
        out.push({
          name: 'a',
          attrs: { href, class: 'md-link' },
          children: inner.length ? inner : [{ name: 'text', attrs: { value: '' } }],
        });
        break;
      }
      case 'image': {
        const src = (n.a?.href as string) ?? '';
        const alt = (n.a?.alt as string) ?? '';
        out.push({ name: 'img', attrs: { src, alt, class: 'md-img' } });
        break;
      }
      case 'text':
      default: {
        const value = n.raw ?? '';
        if (value) out.push({ name: 'text', attrs: { value: enc(value) } });
        break;
      }
    }
  }
  return out;
}

function blockToUnified(ir: IRNode, animate: boolean, enc: (s: string) => string): UnifiedNode {
  switch (ir.t) {
    case 'heading': {
      const depth = Math.min(6, Math.max(1, (ir.a?.depth as number) ?? 1));
      const tag = `h${depth}`;
      return makeBlock(tag, `md-heading md-${tag}`, inlineToUnified(ir.c, enc), animate);
    }
    case 'paragraph':
      return makeBlock('p', 'md-paragraph', inlineToUnified(ir.c, enc), animate);
    case 'code': {
      const lang = ir.a?.lang as string | undefined;
      const codeAttrs: Record<string, string | number | boolean> = { class: 'md-code' };
      if (lang) codeAttrs.class = `md-code language-${lang}`;
      const codeChild: UnifiedNode = {
        name: 'code',
        attrs: codeAttrs,
        children: [{ name: 'text', attrs: { value: enc(ir.raw ?? '') } }],
      };
      return makeBlock('pre', 'md-code-block', [codeChild], animate);
    }
    case 'blockquote': {
      const children = (ir.c ?? []).map((c) => blockToUnified(c, animate, enc));
      return makeBlock('blockquote', 'md-blockquote', children, animate);
    }
    case 'list': {
      const ordered = !!ir.a?.ordered;
      const start = ir.a?.start as number | undefined;
      const tag = ordered ? 'ol' : 'ul';
      const children = (ir.c ?? []).map((c) => blockToUnified(c, animate, enc));
      const extra: Record<string, string | number | boolean> = {};
      if (ordered && start != null && start !== 1) extra.start = start;
      return makeBlock(tag, 'md-list', children, animate, extra);
    }
    case 'list_item': {
      const children: UnifiedNode[] = [];
      for (const c of ir.c ?? []) {
        if (c.t === 'paragraph') {
          children.push(...inlineToUnified(c.c, enc));
        } else if (c.t === 'text' || isInlineIR(c)) {
          // 注：text IR 用 raw 而不是 c，必须经 inlineToUnified([c]) 走单节点路径
          children.push(...inlineToUnified([c], enc));
        } else {
          children.push(blockToUnified(c, animate, enc));
        }
      }
      return makeBlock('li', 'md-list-item', children, false);
    }
    case 'hr':
      return { name: 'hr', attrs: { class: joinClass('md-hr', animate && ANIMATE_CLASS) }, ...(animate && { animate: 'block' as const }) };
    case 'html':
      return { name: 'div', attrs: { class: 'md-html' }, children: [{ name: 'text', attrs: { value: ir.raw ?? '' } }] };
    case 'table': {
      const children = (ir.c ?? []).map((c) => blockToUnified(c, false, enc));
      return makeBlock('table', 'md-table', children, animate);
    }
    case 'thead': {
      const cells = (ir.c ?? []).map((cell) => ({
        name: 'th',
        attrs: { class: 'md-th' },
        children: inlineToUnified(cell.c, enc),
      }));
      return { name: 'thead', attrs: {}, children: [{ name: 'tr', attrs: {}, children: cells }] };
    }
    case 'tbody': {
      const rows = (ir.c ?? []).map((row) => ({
        name: 'tr',
        attrs: {},
        children: (row.c ?? []).map((cell) => ({
          name: 'td',
          attrs: { class: 'md-td' },
          children: inlineToUnified(cell.c, enc),
        })),
      }));
      return { name: 'tbody', attrs: {}, children: rows };
    }
    case 'space':
      return { name: 'span', attrs: {} };
    case 'text':
    default:
      return makeBlock(
        'p',
        'md-paragraph',
        ir.c ? inlineToUnified(ir.c, enc) : [{ name: 'text', attrs: { value: enc(ir.raw ?? '') } }],
        animate
      );
  }
}

const INLINE_IR_TYPES: ReadonlySet<IRInlineType> = new Set([
  'strong', 'em', 'del', 'codespan', 'link', 'image', 'br',
]);

function isInlineIR(ir: IRNode): boolean {
  return INLINE_IR_TYPES.has(ir.t as IRInlineType);
}

/**
 * 将 IR 树转为统一 rich-text 节点数组（与微信 nodes 对齐，小写 name/class）。
 */
export function irToUnifiedNodes(irNodes: IRNode[], options?: IrToUnifiedOptions): UnifiedNode[] {
  const animate = options?.animation === true;
  const enc = options?.escapeText === false ? (s: string) => s : escapeHtml;
  const out: UnifiedNode[] = [];
  for (const ir of irNodes) {
    if (ir.t === 'space') continue;
    out.push(blockToUnified(ir, animate, enc));
  }
  return out;
}
