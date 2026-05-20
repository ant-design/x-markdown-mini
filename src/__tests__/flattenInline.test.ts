import { describe, it, expect } from 'vitest';
import { tokensToWechat } from '../core/tokensToWechat.js';
import { flattenInlineNodes } from '../components/shared/flattenInline.js';
import type { MiniNode } from '../types.js';

function findAll(nodes: MiniNode[], pred: (n: MiniNode) => boolean): MiniNode[] {
  const out: MiniNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    if (pred(n)) out.push(n);
    if (n.children) queue.push(...n.children);
  }
  return out;
}

function findFirst(nodes: MiniNode[], pred: (n: MiniNode) => boolean): MiniNode | undefined {
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    if (pred(n)) return n;
    if (n.children) queue.push(...n.children);
  }
  return undefined;
}

describe('flattenInlineNodes', () => {
  it('collapses nested strong+em into flat text runs with merged classes', () => {
    const nodes = tokensToWechat('plain **bold _italic_** tail', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const p = flat[0];
    expect(p.name).toBe('p');

    // After flattening, every direct child of <p> is either text/br/img/a — never strong/em/code.
    const childNames = (p.children ?? []).map((c) => c.name);
    expect(childNames.every((n) => n === 'text' || n === 'br' || n === 'img' || n === 'a')).toBe(true);

    const runs = (p.children ?? []).filter((c) => c.name === 'text');
    const values = runs.map((r) => r.attrs?.value as string);
    expect(values.join('')).toContain('plain ');
    expect(values.join('')).toContain('bold ');
    expect(values.join('')).toContain('italic');
    expect(values.join('')).toContain(' tail');

    // The "italic" run should carry both md-strong and md-em.
    const italic = runs.find((r) => (r.attrs?.value as string).includes('italic'));
    const cls = String(italic?.attrs?.class ?? '');
    expect(cls).toContain('md-strong');
    expect(cls).toContain('md-em');
  });

  it('keeps anchors interactive but flattens their inline contents', () => {
    const nodes = tokensToWechat('see [a **strong** link](https://e.com)', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const anchor = findFirst(flat, (n) => n.name === 'a');
    expect(anchor).toBeTruthy();
    // tokensToWechat rewrites href → data-href
    expect(anchor!.attrs?.['data-href']).toBe('https://e.com');
    const innerNames = (anchor!.children ?? []).map((c) => c.name);
    expect(innerNames.every((n) => n === 'text' || n === 'br' || n === 'img')).toBe(true);
    const strongRun = (anchor!.children ?? []).find((c) =>
      String(c.attrs?.class ?? '').includes('md-strong')
    );
    expect(strongRun).toBeTruthy();
    expect(String(strongRun?.attrs?.value ?? '')).toContain('strong');
  });

  it('preserves inline-code class on flattened run', () => {
    const nodes = tokensToWechat('use `npm` here', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const codeRun = findFirst(flat, (n) =>
      n.name === 'text' && String(n.attrs?.class ?? '').includes('md-inline-code')
    );
    expect(codeRun).toBeTruthy();
    expect(String(codeRun?.attrs?.value ?? '')).toBe('npm');
  });

  it('returns leaf nodes (no children) unchanged from walk()', () => {
    const input: MiniNode[] = [
      { name: 'hr', attrs: { class: 'md-hr' } },
      { name: 'p', attrs: {}, children: [] }, // empty children path
    ];
    const out = flattenInlineNodes(input);
    expect(out[0]).toEqual(input[0]); // leaf returned as-is
    expect(out[1].name).toBe('p');
  });

  it('top-level anchor goes through the anchor walk branch (flattens children but keeps <a>)', () => {
    const input: MiniNode[] = [
      {
        name: 'a',
        attrs: { href: 'https://e.com', class: 'md-link' },
        children: [
          { name: 'strong', attrs: {}, children: [{ name: 'text', attrs: { value: 'bold' } }] },
          { name: 'text', attrs: { value: ' tail' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    expect(out[0].name).toBe('a');
    // children should be flat — no nested strong
    const names = (out[0].children ?? []).map((c) => c.name);
    expect(names.every((n) => n === 'text' || n === 'br' || n === 'img')).toBe(true);
    const boldRun = (out[0].children ?? []).find((c) =>
      String(c.attrs?.class ?? '').includes('md-strong')
    );
    expect(boldRun).toBeTruthy();
  });

  it('handles standalone <img> inside a paragraph (image preserved by flattenOne)', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: { value: 'before ' } },
          { name: 'img', attrs: { src: 'https://e.com/i.png', alt: 'pic' } },
          { name: 'text', attrs: { value: ' after' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const img = (out[0].children ?? []).find((c) => c.name === 'img');
    expect(img).toBeDefined();
    expect(img?.attrs?.src).toBe('https://e.com/i.png');
  });

  it('handles explicit <br> in inline children', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: { value: 'a' } },
          { name: 'br', attrs: {} },
          { name: 'text', attrs: { value: 'b' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    expect((out[0].children ?? []).some((c) => c.name === 'br')).toBe(true);
  });

  it('skips empty-string text leaves entirely', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: { value: '' } },
          { name: 'text', attrs: { value: 'kept' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const texts = (out[0].children ?? []).filter((c) => c.name === 'text');
    expect(texts.length).toBe(1);
    expect(texts[0].attrs?.value).toBe('kept');
  });

  it('text without class chain produces no class attribute', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [{ name: 'text', attrs: { value: 'plain' } }],
      },
    ];
    const out = flattenInlineNodes(input);
    const text = (out[0].children ?? [])[0];
    expect(text.name).toBe('text');
    expect(text.attrs?.class).toBeUndefined();
  });

  it('block-like child inside an inline context falls through walk path', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: { value: 'pre' } },
          {
            // Unknown non-inline tag — falls into walk() at the bottom of flattenOne
            name: 'mark',
            attrs: { class: 'highlight' },
            children: [{ name: 'text', attrs: { value: 'inside-mark' } }],
          },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const marks = findAll(out, (n) => n.name === 'mark');
    expect(marks.length).toBe(1);
  });

  it('text node without a value attribute is treated as empty (no attrs.value)', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: {} }, // value missing → coerced to ''
          { name: 'text', attrs: { value: 'kept' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const texts = (out[0].children ?? []).filter((c) => c.name === 'text');
    expect(texts.length).toBe(1);
    expect(texts[0].attrs?.value).toBe('kept');
  });

  it('anchor without explicit children property still flattens', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'a', attrs: { href: 'https://e.com' } }, // no children property
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const anchor = (out[0].children ?? []).find((c) => c.name === 'a');
    expect(anchor).toBeDefined();
    expect(anchor?.children).toEqual([]);
  });

  it('inline container without children property is treated as empty', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'strong', attrs: {} }, // no children
          { name: 'text', attrs: { value: 'tail' } },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const texts = (out[0].children ?? []).filter((c) => c.name === 'text');
    expect(texts.length).toBe(1);
    expect(texts[0].attrs?.value).toBe('tail');
  });

  it('span is treated as an inline collapse container', () => {
    const input: MiniNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          {
            name: 'span',
            attrs: { class: 'extra-cls' },
            children: [{ name: 'text', attrs: { value: 'inner' } }],
          },
        ],
      },
    ];
    const out = flattenInlineNodes(input);
    const texts = (out[0].children ?? []).filter((c) => c.name === 'text');
    expect(texts.length).toBe(1);
    expect(texts[0].attrs?.value).toBe('inner');
    // span has no built-in tag class, but its attrs.class flows into chain
    expect(String(texts[0].attrs?.class ?? '')).toContain('extra-cls');
  });
});
