import React from 'react';
import type { MiniNode } from '@ant-design/x-markdown-mini';
import { AnimationText } from './AnimationText';

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

const VOID_TAGS = new Set(['br', 'img', 'hr', 'input']);

function copyToClipboard(text: string): void {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      /* clipboard can be blocked in embedded previews */
    });
  }
}

const COPY_ICON = (
  <svg viewBox="0 0 16 16" width={14} height={14} fill="none" aria-hidden="true">
    <path
      d="M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z"
      stroke="currentColor"
      strokeWidth={1.4}
    />
    <path
      d="M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </svg>
);

function renderHeaderItem(h: MiniNode, key: React.Key): React.ReactNode {
  if (h.name === 'copy-button') {
    const payload = h.attrs?.['data-copy'] != null ? String(h.attrs['data-copy']) : '';
    return (
      <button
        type="button"
        key={key}
        className="md-copy-btn"
        aria-label="复制"
        onClick={() => copyToClipboard(payload)}
      >
        {COPY_ICON}
      </button>
    );
  }
  if (h.name === 'text') {
    return (
      <span key={key} className={h.attrs?.class ? String(h.attrs.class) : undefined}>
        {h.attrs?.value != null ? String(h.attrs.value) : ''}
      </span>
    );
  }
  return renderNode(h, key, false);
}

function styleStringToObject(s: string): React.CSSProperties {
  const result: Record<string, string> = {};
  for (const part of s.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    const reactKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    result[reactKey] = value;
  }
  return result as React.CSSProperties;
}

function escapeHtmlForText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderNode(node: MiniNode, key: React.Key, animateText: boolean): React.ReactNode {
  const { name, attrs, children, animate } = node;
  const tag = (name || 'div').toLowerCase();

  // Text node: value may contain HTML entities (escapeText=true default).
  if (tag === 'text') {
    const value = attrs?.value != null ? String(attrs.value) : '';
    // Streaming: render via AnimationText so each newly-appended segment fades in
    // individually (typewriter). It decodes entities and renders plain text.
    if (animateText) {
      return <AnimationText key={key} value={value} />;
    }
    // Use dangerouslySetInnerHTML so the browser decodes entities correctly.
    const html = /<|>|"|'/.test(value) ? escapeHtmlForText(value) : value;
    return React.createElement('span', { key, dangerouslySetInnerHTML: { __html: html } });
  }

  // Code/table header bar: wrap the element with a bar rendered from node.header.
  if (node.header && node.header.length > 0) {
    const isTable = tag === 'table';
    const wrapClass = isTable ? 'md-tableblock' : 'md-codeblock';
    const barClass = isTable ? 'md-tableblock-bar' : 'md-codeblock-bar';
    const bar = (
      <div className={barClass}>{node.header.map((h, i) => renderHeaderItem(h, i))}</div>
    );
    const el = renderNode({ ...node, header: undefined }, 'el', animateText);
    return (
      <div className={wrapClass} key={key}>
        {bar}
        {el}
      </div>
    );
  }

  // Build className
  const classes: string[] = [];
  if (TAG_CLASS[tag]) classes.push(TAG_CLASS[tag]);
  if (animate) classes.push('md-animate-block');

  // Build React props
  const elProps: Record<string, unknown> = { key };
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') {
        // Merge existing class with computed classes
        if (classes.length > 0) {
          elProps.className = `${v} ${classes.join(' ')}`;
          classes.length = 0;
        } else {
          elProps.className = v;
        }
      } else if (k === 'style' && typeof v === 'string') {
        elProps.style = styleStringToObject(v);
      } else if (v === true) {
        elProps[k] = true;
      } else if (v !== false && v != null) {
        elProps[k] = String(v);
      }
    }
  }
  // Remaining computed classes (not merged with attrs.class above)
  if (classes.length > 0) {
    elProps.className = elProps.className
      ? `${elProps.className} ${classes.join(' ')}`
      : classes.join(' ');
  }

  if (VOID_TAGS.has(tag)) {
    return React.createElement(tag, elProps);
  }

  const childNodes = children?.map((child, i) => renderNode(child, i, animateText));
  if (childNodes && childNodes.length > 0) {
    return React.createElement(tag, elProps, ...childNodes);
  }

  return React.createElement(tag, elProps);
}

/**
 * @param animateText  流式渲染时传 true：文本叶子走 AnimationText 逐字渐显（打字机）。
 *                     一次性渲染传 false（默认），文本作为静态 span。
 */
export function renderMiniNodes(nodes: MiniNode[], animateText = false): React.ReactNode[] {
  return nodes.map((node, i) => renderNode(node, i, animateText));
}