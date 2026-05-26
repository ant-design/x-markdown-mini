import React from 'react';
import type { MiniNode } from '@ant-design/x-markdown-mini';

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

function renderNode(node: MiniNode, key: React.Key): React.ReactNode {
  const { name, attrs, children, animate } = node;
  const tag = (name || 'div').toLowerCase();

  // Text node: value may contain HTML entities (escapeText=true default).
  // Use dangerouslySetInnerHTML so the browser decodes them correctly.
  if (tag === 'text') {
    const value = attrs?.value != null ? String(attrs.value) : '';
    const html = /<|>|"|'/.test(value) ? escapeHtmlForText(value) : value;
    return React.createElement('span', { key, dangerouslySetInnerHTML: { __html: html } });
  }

  // Build className
  const classes: string[] = [];
  if (TAG_CLASS[tag]) classes.push(TAG_CLASS[tag]);
  if (animate === 'block' || animate === 'text') classes.push('md-animate-block');

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

  const childNodes = children?.map((child, i) => renderNode(child, i));
  if (childNodes && childNodes.length > 0) {
    return React.createElement(tag, elProps, ...childNodes);
  }

  return React.createElement(tag, elProps);
}

export function renderMiniNodes(nodes: MiniNode[]): React.ReactNode[] {
  return nodes.map((node, i) => renderNode(node, i));
}