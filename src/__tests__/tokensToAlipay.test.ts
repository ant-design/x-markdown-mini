import { describe, expect, it } from 'vitest';
import { tokensToAlipay } from '../platforms/alipay/tokensToAlipay.js';
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

describe('tokensToAlipay — platform-specific behavior', () => {
  it('keeps <a href> and marks it as an interactive link', () => {
    const out = tokensToAlipay('[L](https://e.com)');
    const a = find(out, 'a')!;
    expect(a.attrs?.href).toBe('https://e.com');
    expect(a.attrs?.['data-href']).toBeUndefined();
    expect(a.attrs?.class).toBe('md-link');
  });

  it('drops <ol start> attribute for Alipay', () => {
    const out = tokensToAlipay('3. a\n4. b');
    expect(out[0].name).toBe('ol');
    expect(out[0].attrs?.start).toBeUndefined();
  });

  it('rewrites http:// in <img src> to https://', () => {
    const out = tokensToAlipay('![alt](http://e.com/i.png)');
    const img = find(out, 'img')!;
    expect(img.attrs?.src).toBe('https://e.com/i.png');
  });

  it('does not touch https:// image src', () => {
    const out = tokensToAlipay('![alt](https://secure.com/i.png)');
    const img = find(out, 'img')!;
    expect(img.attrs?.src).toBe('https://secure.com/i.png');
  });

  it('strips class on all nodes', () => {
    const out = tokensToAlipay('# Hi\n\n**bold**');
    expect(out[0].attrs?.class).toBeUndefined();
    const strong = find(out, 'strong')!;
    expect(strong.attrs?.class).toBeUndefined();
  });

  it('preserves animation flag', () => {
    const out = tokensToAlipay('# X', { animation: true });
    expect(out[0].animate).toBe(true);
    expect(out[0].attrs?.class).toBeUndefined();
  });

  it('marks single- and multi-column tables for responsive column sizing', () => {
    const single = tokensToAlipay('| a |\n| - |\n| 1 |');
    const multi = tokensToAlipay('| a | b |\n| - | - |\n| 1 | 2 |');

    expect(find(single, 'table')?.attrs?.class).toBe('md-table md-table-single');
    expect(find(multi, 'table')?.attrs?.class).toBe('md-table md-table-multi');
  });
});

describe('tokensToAlipay — shared semantic mapping', () => {
  it('renders heading/list/table/code structurally same as wechat path', () => {
    const out = tokensToAlipay('# A\n\n- x\n- y\n\n```ts\nlet a = 1;\n```\n\n| h |\n|---|\n| v |');
    expect(out.map((n) => n.name)).toEqual(['h1', 'ul', 'pre', 'table']);
  });

  it('escapes HTML entities in text by default', () => {
    const out = tokensToAlipay('a < b');
    const text = find(out, 'text');
    expect(String(text?.attrs?.value)).toContain('&lt;');
  });
});
