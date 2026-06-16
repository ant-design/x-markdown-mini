/**
 * 仅用于文档站预览：将小程序节点转为 HTML 字符串，在浏览器中展示。
 * 不做为库的一部分发布。
 */

export interface MiniNode {
  name: string;
  attrs?: Record<string, string | number | boolean>;
  children?: MiniNode[];
  header?: MiniNode[];
  animate?: boolean;
}

/** Inline copy glyph (currentColor) used for the header copy button. */
const COPY_SVG =
  '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">' +
  '<path d="M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z" stroke="currentColor" stroke-width="1.4"/>' +
  '<path d="M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
  '</svg>';

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

    if (tag === 'pre') {
      const bar = node.header ? headerBar(node.header, 'md-codeblock-bar') : '';
      const inner = children && children.length > 0 ? children.map(one).join('') : '';
      return `<div class="md-codeblock">${bar}<pre class="md-code-block">${inner}</pre></div>`;
    }

    if (tag === 'table' && node.header) {
      const bar = headerBar(node.header, 'md-tableblock-bar');
      const inner = children && children.length > 0 ? children.map(one).join('') : '';
      return `<div class="md-tableblock">${bar}<table class="md-table">${inner}</table></div>`;
    }

    // Build the class string: merge TAG_CLASS with any existing class attr
    const extraCls: string[] = [];
    if (TAG_CLASS[tag]) extraCls.push(TAG_CLASS[tag]);
    if (animate) extraCls.push('md-animate-block');

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

  // Render a code/table header bar from `node.header`. Text items keep their
  // class (lang label / title); `copy-button` becomes a clickable button whose
  // `data-copy` payload PhonePreview reads via a delegated click handler.
  function headerBar(header: MiniNode[], barClass: string): string {
    const items = header
      .map((h) => {
        if (h.name === 'copy-button') {
          const payload = h.attrs?.['data-copy'] != null ? String(h.attrs['data-copy']) : '';
          return `<button type="button" class="md-copy-btn" data-copy="${escapeHtml(payload)}" aria-label="复制">${COPY_SVG}</button>`;
        }
        if (h.name === 'text') {
          const cls = h.attrs?.class ? String(h.attrs.class) : '';
          const val = h.attrs?.value != null ? String(h.attrs.value) : '';
          const safe = /<|>|"|'/.test(val) ? escapeHtml(val) : val;
          return `<span class="${escapeHtml(cls)}">${safe}</span>`;
        }
        return one(h);
      })
      .join('');
    return `<div class="${barClass}">${items}</div>`;
  }

  return nodes.map(one).join('');
}
