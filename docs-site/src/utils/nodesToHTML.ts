/**
 * 仅用于文档站预览：将统一 rich-text 节点转为 HTML 字符串，在浏览器中展示。
 * 不做为库的一部分发布。
 */

export interface UnifiedNode {
  name: string;
  attrs?: Record<string, string | number | boolean>;
  children?: UnifiedNode[];
  animate?: 'block' | 'text' | false;
}

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

export function nodesToHTML(nodes: UnifiedNode[]): string {
  if (!Array.isArray(nodes) || nodes.length === 0) return '';

  function one(node: UnifiedNode): string {
    const { name, attrs, children } = node;
    const tag = (name || 'div').toLowerCase();

    if (tag === 'text') {
      const value = attrs?.value != null ? String(attrs.value) : '';
      return escapeHtml(value);
    }

    const attrStr = attrsToStr(attrs);
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
