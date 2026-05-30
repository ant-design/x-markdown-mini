import { describe, it, expect } from 'vitest';
import { XMarkdownMini, Footnote } from '../index.js';
import type { MiniNode } from '../index.js';

function findNode(nodes: MiniNode[], name: string): MiniNode | undefined {
  for (const n of nodes) {
    if (n.name === name) return n;
    if (n.children) {
      const f = findNode(n.children, name);
      if (f) return f;
    }
  }
  return undefined;
}

describe('Footnote extension', () => {
  it('parses [^label:content] into a footnote node with label + content attrs', () => {
    const md = new XMarkdownMini({ extensions: [Footnote()] });
    const nodes = md.renderNodes({
      content: 'Markdown[^1:一种轻量标记语言] 很好用。',
      platform: 'alipay',
    });
    const fn = findNode(nodes, 'footnote');
    expect(fn).toBeDefined();
    expect(fn!.tag).toBe('footnote');
    expect(fn!.attrs?.label).toBe('1');
    expect(fn!.attrs?.content).toBe('一种轻量标记语言');
  });

  it('falls back to default label when no explicit label is given', () => {
    const md = new XMarkdownMini({ extensions: [Footnote({ defaultLabel: '注' })] });
    const nodes = md.renderNodes({
      content: '文字[^这是一段说明]后续。',
      platform: 'wechat',
    });
    const fn = findNode(nodes, 'footnote');
    expect(fn).toBeDefined();
    expect(fn!.attrs?.label).toBe('注');
    expect(fn!.attrs?.content).toBe('这是一段说明');
  });

  it('footnote node survives inline flattening with attrs intact', async () => {
    const { flattenInlineNodes } = await import('../components/shared/flattenInline.js');
    const md = new XMarkdownMini({ extensions: [Footnote()], escapeText: false });
    const nodes = md.renderNodes({
      content: 'a[^2:第二条] b',
      platform: 'wechat',
    });
    const fn = findNode(flattenInlineNodes(nodes), 'footnote');
    expect(fn).toBeDefined();
    expect(fn!.attrs?.label).toBe('2');
    expect(fn!.attrs?.content).toBe('第二条');
  });

  it('plain markdown without footnote syntax is unaffected', () => {
    const md = new XMarkdownMini({ extensions: [Footnote()] });
    const nodes = md.renderNodes({ content: '普通 [链接](https://x) 文本', platform: 'alipay' });
    expect(findNode(nodes, 'footnote')).toBeUndefined();
    expect(findNode(nodes, 'a')).toBeDefined();
  });
});
