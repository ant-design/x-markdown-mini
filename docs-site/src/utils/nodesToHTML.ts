/**
 * 仅用于文档站预览：将小程序节点转为 HTML 字符串，在浏览器中展示。
 * 不做为库的一部分发布。
 */

export interface MiniNode {
  name: string;
  attrs?: Record<string, string | number | boolean>;
  children?: MiniNode[];
  animate?: 'block' | 'text' | false;
}

/** Map MiniNode tag names to semantic CSS classes for the phone preview. */
const TAG_CLASS: Record<string, string> = {
  h1: 'md-h1',
  h2: 'md-h2',
  h3: 'md-h3',
  pre: 'md-code-block',
  blockquote: 'md-blockquote',
  a: 'md-link',
  ul: 'md-list',
  ol: 'md-list',
  table: 'md-table',
};

function escapeHtml(text: string): string {
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attrsToStr(attrs: Record<string, string | number | boolean> | undefined): string {
  if (!attrs || typeof attrs !== 'object') return '';
  return Object.entries(attrs)
    .map(([k, v]) => {
      if (v === true) return k;
      if (v === false || v === undefined || v === null) return '';
      return `${k}="${escapeHtml(String(v))}"`;
    })
    .filter(Boolean)
    .join(' ');
}

const VOID_TAGS = new Set(['br', 'img', 'hr', 'input']);

export function nodesToHTML(nodes: MiniNode[]): string {
  if (!Array.isArray(nodes) || nodes.length === 0) return '';

  function one(node: MiniNode): string {
    const { name, attrs, children, animate } = node;
    const tag = (name || 'div').toLowerCase();

    // Text nodes: the library already HTML-escapes values when escapeText=true
    // (the default), so we emit them as-is. When escapeText=false the values
    // are raw and _do_ need escaping for safe HTML insertion.
    if (tag === 'text') {
      const value = attrs?.value != null ? String(attrs.value) : '';
      if (/<|>|"|'/.test(value)) return escapeHtml(value);
      return value;
    }

    // Build the class string: merge TAG_CLASS with any existing class attr
    const extraCls: string[] = [];
    if (TAG_CLASS[tag]) extraCls.push(TAG_CLASS[tag]);
    if (animate === 'block' || animate === 'text') extraCls.push('md-animate-block');

    let mergedAttrs = attrs;
    if (extraCls.length > 0) {
      const existingClass = attrs?.class ? String(attrs.class) + ' ' : '';
      mergedAttrs = { ...attrs, class: existingClass + extraCls.join(' ') };
    }

    const attrStr = attrsToStr(mergedAttrs);
    const open = attrStr ? `<${tag} ${attrStr}>` : `<${tag}>`;

    if (VOID_TAGS.has(tag)) return open;

    if (children && children.length > 0) {
      const inner = children.map(one).join('');
      return `${open}${inner}</${tag}>`;
    }

    return `${open}</${tag}>`;
  }

  return nodes.map(one).join('');
}
