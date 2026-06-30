import { describe, expect, it } from 'vitest';
import { tokensToWechat } from '../platforms/wechat/tokensToWechat.js';
import type { MiniNode } from '../types.js';

function flatten(nodes: MiniNode[]): MiniNode[] {
  const out: MiniNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    out.push(n);
    if (n.children) queue.push(...n.children);
  }
  return out;
}

function find(nodes: MiniNode[], name: string): MiniNode | undefined {
  return flatten(nodes).find((n) => n.name === name);
}

describe('tokensToWechat — platform-specific behavior', () => {
  it('rewrites <a href> to <a data-href> and adds class=md-link', () => {
    const out = tokensToWechat('[L](https://e.com)');
    const a = find(out, 'a')!;
    expect(a.attrs?.['data-href']).toBe('https://e.com');
    expect(a.attrs?.href).toBeUndefined();
    expect(String(a.attrs?.class)).toBe('md-link');
  });

  it('keeps <ol start> attribute', () => {
    const out = tokensToWechat('3. a\n4. b');
    expect(out[0].name).toBe('ol');
    expect(out[0].attrs?.start).toBe(3);
  });

  it('renders explicit list markers for mini-program view-based lists', () => {
    const ordered = tokensToWechat('3. a\n4. b');
    const unordered = tokensToWechat('- c');

    expect(ordered[0].children?.[0].children?.[0]).toEqual({
      name: 'text',
      attrs: { class: 'md-list-marker', value: '3.' },
    });
    expect(ordered[0].children?.[1].children?.[0]).toEqual({
      name: 'text',
      attrs: { class: 'md-list-marker', value: '4.' },
    });
    expect(unordered[0].children?.[0].children?.[0]).toEqual({
      name: 'text',
      attrs: { class: 'md-list-marker', value: '•' },
    });
  });

  it('does not rewrite http:// in <img src>', () => {
    const out = tokensToWechat('![alt](http://e.com/i.png)');
    const img = find(out, 'img')!;
    expect(img.attrs?.src).toBe('http://e.com/i.png');
  });

  it('assigns semantic classes to block nodes; inline emphasis is classed later by the flatten layer', () => {
    const out = tokensToWechat('# Hi\n\n**bold**');
    const h1 = out[0];
    expect(h1.name).toBe('h1');
    expect(h1.attrs?.class).toBe('md-heading md-h1');
    const strong = find(out, 'strong')!;
    expect(strong.attrs?.class).toBeUndefined();
  });

  it('preserves animation flag alongside the semantic heading class', () => {
    const out = tokensToWechat('# X', { animation: true });
    expect(out[0].animate).toBe(true);
    expect(out[0].attrs?.class).toBe('md-heading md-h1');
  });

  it('marks single- and multi-column tables for responsive column sizing', () => {
    const single = tokensToWechat('| a |\n| - |\n| 1 |');
    const multi = tokensToWechat('| a | b |\n| - | - |\n| 1 | 2 |');

    expect(find(single, 'table')?.attrs?.class).toBe('md-table md-table-single');
    expect(find(multi, 'table')?.attrs?.class).toBe('md-table md-table-multi');
  });
});

describe('tokensToWechat — shared semantic mapping', () => {
  it('renders heading/list/table/code structurally same as unified path', () => {
    const out = tokensToWechat('# A\n\n- x\n- y\n\n```ts\nlet a = 1;\n```\n\n| h |\n|---|\n| v |');
    expect(out.map((n) => n.name)).toEqual(['h1', 'ul', 'pre', 'table']);
  });

  it('escapes HTML entities in text by default', () => {
    const out = tokensToWechat('a < b');
    const text = find(out, 'text');
    expect(String(text?.attrs?.value)).toContain('&lt;');
  });
});
