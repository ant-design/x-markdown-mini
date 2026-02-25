import type { IRNode, UnifiedNode } from '../types.js';

export interface IrToUnifiedOptions {
  animation?: boolean;
  selectable?: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function irInlineToUnified(nodes: IRNode[] | undefined, opts: IrToUnifiedOptions): UnifiedNode[] {
  if (!nodes || nodes.length === 0) return [];
  const out: UnifiedNode[] = [];
  for (const n of nodes) {
    const children = irToUnifiedChildren(n.c, opts);
    const attrs: Record<string, string | number | boolean> = {};
    if (opts.selectable !== false) attrs.selectable = true;
    switch (n.t) {
      case 'strong':
        out.push({ name: 'b', attrs, children: children.length ? children : undefined });
        break;
      case 'em':
        out.push({ name: 'i', attrs, children: children.length ? children : undefined });
        break;
      case 'codespan':
        out.push({
          name: 'code',
          attrs: { class: 'md-inline-code', ...attrs },
          children: [{ name: 'text', attrs: { value: n.raw ?? '' } }],
        });
        break;
      case 'br':
        out.push({ name: 'br', attrs });
        break;
      case 'link':
        out.push({
          name: 'a',
          attrs: {
            href: (n.a?.href as string) ?? '',
            ...attrs,
          },
          children: children.length ? children : [{ name: 'text', attrs: { value: n.raw ?? '' } }],
        });
        break;
      case 'image':
        out.push({
          name: 'img',
          attrs: {
            src: (n.a?.href as string) ?? '',
            alt: (n.a?.alt as string) ?? '',
            ...attrs,
          },
        });
        break;
      case 'text':
      default:
        const value = n.raw ?? '';
        if (value) out.push({ name: 'text', attrs: { value: escapeHtml(value), ...attrs } });
        break;
    }
  }
  return out;
}

function irToUnifiedChildren(nodes: IRNode[] | undefined, opts: IrToUnifiedOptions): UnifiedNode[] {
  if (!nodes || nodes.length === 0) return [];
  return irInlineToUnified(nodes, opts);
}

function blockToUnified(ir: IRNode, opts: IrToUnifiedOptions, animate: boolean): UnifiedNode {
  const attrs: Record<string, string | number | boolean> = {};
  if (opts.selectable !== false) attrs.selectable = true;
  const animateAttr = animate ? ({ animate: 'block' as const } as UnifiedNode['attrs']) : undefined;
  const wrap = (name: string, children: UnifiedNode[], extraAttrs?: Record<string, string | number | boolean>): UnifiedNode => ({
    name,
    attrs: { ...attrs, ...extraAttrs, ...(animateAttr && { class: 'md-animate-block' }) },
    children,
    ...(animate ? { animate: 'block' as const } : {}),
  });

  switch (ir.t) {
    case 'heading': {
      const depth = (ir.a?.depth as number) ?? 1;
      const tag = `h${Math.min(6, Math.max(1, depth))}`;
      const children = irToUnifiedChildren(ir.c, opts);
      return wrap(tag, children, { class: `md-heading md-${tag}` });
    }
    case 'paragraph': {
      const children = irToUnifiedChildren(ir.c, opts);
      return wrap('p', children, { class: 'md-paragraph' });
    }
    case 'code': {
      const value = ir.raw ?? '';
      const lang = ir.a?.lang as string | undefined;
      return {
        name: 'pre',
        attrs: { class: 'md-code-block', ...attrs, ...(animateAttr && { class: 'md-code-block md-animate-block' }) },
        children: [
          {
            name: 'code',
            attrs: lang ? { class: `language-${lang}` } : {},
            children: [{ name: 'text', attrs: { value: escapeHtml(value) } }],
          },
        ],
        ...(animate ? { animate: 'block' as const } : {}),
      };
    }
    case 'blockquote': {
      const children = (ir.c || []).map((c) => blockToUnified(c, opts, animate));
      return wrap('blockquote', children, { class: 'md-blockquote' });
    }
    case 'list': {
      const ordered = ir.a?.ordered as boolean;
      const start = ir.a?.start as number | undefined;
      const listTag = ordered ? 'ol' : 'ul';
      const listAttrs: Record<string, string | number | boolean> = { class: 'md-list' };
      if (ordered && start != null && start !== 1) listAttrs.start = start;
      const children = (ir.c || []).map((c) => blockToUnified(c, opts, animate));
      return { name: listTag, attrs: { ...attrs, ...listAttrs, ...(animateAttr && { class: 'md-list md-animate-block' }) }, children, ...(animate ? { animate: 'block' as const } : {}) };
    }
    case 'list_item': {
      const children = (ir.c || []).map((c) => blockToUnified(c, opts, animate));
      return wrap('li', children, { class: 'md-list-item' });
    }
    case 'hr':
      return { name: 'hr', attrs: { class: 'md-hr', ...attrs }, ...(animate ? { animate: 'block' as const } : {}) };
    case 'html':
      return { name: 'div', attrs: { class: 'md-html', ...attrs }, children: [{ name: 'text', attrs: { value: ir.raw ?? '' } }] };
    case 'table': {
      const tableChildren = (ir.c || []).map((c) => blockTablePartToUnified(c, opts, animate));
      return wrap('table', tableChildren, { class: 'md-table' });
    }
    case 'thead': {
      const cells = (ir.c || []).map((cell) => {
        const inner = irToUnifiedChildren((cell as IRNode).c, opts);
        return { name: 'th', attrs: { class: 'md-th' }, children: inner };
      });
      return { name: 'thead', attrs: {}, children: [{ name: 'tr', attrs: {}, children: cells }] };
    }
    case 'tbody': {
      const rows = (ir.c || []).map((row) => {
        const cells = (row as IRNode).c?.map((cell) => {
          const inner = irToUnifiedChildren((cell as IRNode).c, opts);
          return { name: 'td', attrs: { class: 'md-td' }, children: inner };
        }) ?? [];
        return { name: 'tr', attrs: {}, children: cells };
      });
      return { name: 'tbody', attrs: {}, children: rows };
    }
    case 'space':
      return { name: 'span', attrs: {}, children: [] };
    case 'text':
    default: {
      const textChildren = irToUnifiedChildren(ir.c, opts);
      return {
        name: 'p',
        attrs: { class: 'md-paragraph' },
        children: textChildren.length ? textChildren : [{ name: 'text', attrs: { value: ir.raw ?? '' } }],
      };
    }
  }
}

function blockTablePartToUnified(ir: IRNode, opts: IrToUnifiedOptions, animate: boolean): UnifiedNode {
  if (ir.t === 'thead' || ir.t === 'tbody') return blockToUnified(ir, opts, animate);
  if (ir.t === 'tr') {
    const cells = (ir.c || []).map((c) => {
      const inner = irToUnifiedChildren((c as IRNode).c, opts);
      const tag = (c as IRNode).t === 'th' ? 'th' : 'td';
      return { name: tag, attrs: { class: `md-${tag}` }, children: inner };
    });
    return { name: 'tr', attrs: {}, children: cells };
  }
  return blockToUnified(ir, opts, animate);
}

/**
 * 将 IR 树转为统一 rich-text 节点数组（与微信 nodes 对齐，小写 name/class）。
 */
export function irToUnifiedNodes(irNodes: IRNode[], options?: IrToUnifiedOptions): UnifiedNode[] {
  const opts: IrToUnifiedOptions = { selectable: true, ...options };
  const animate = opts.animation === true;
  const out: UnifiedNode[] = [];
  for (const ir of irNodes) {
    if (ir.t === 'space') continue;
    const node = blockToUnified(ir, opts, animate);
    if (node.children?.length === 0 && node.name === 'span') continue;
    out.push(node);
  }
  return out;
}
