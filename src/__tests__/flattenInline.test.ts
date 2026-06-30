import { describe, it, expect } from 'vitest';
import { tokensToWechat } from '../platforms/wechat/tokensToWechat.js';
import { tokensToAlipay } from '../platforms/alipay/tokensToAlipay.js';
import { flattenInlineNodes, resolveLinkHref } from '../components/shared/flattenInline.js';
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

  it('flattens anchors into interactive leaf runs in the surrounding text flow', () => {
    const nodes = tokensToWechat('see [a **strong** link](https://e.com)', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const anchors = findAll(flat, (n) => n.name === 'a');
    expect(anchors.length).toBeGreaterThan(0);
    expect(anchors.every((n) => !n.children)).toBe(true);
    expect(anchors.every((n) => n.attrs?.['data-href'] === 'https://e.com')).toBe(true);
    expect(anchors.map((n) => n.attrs?.value).join('')).toBe('a strong link');
    const strongRun = anchors.find((n) =>
      String(n.attrs?.class ?? '').includes('md-strong')
    );
    expect(strongRun).toBeTruthy();
    expect(String(strongRun?.attrs?.class ?? '')).toContain('md-link');
  });

  it('resolveLinkHref reads the href off a flattened anchor leaf on both platforms', () => {
    // WeChat anchors carry `data-href`; Alipay anchors carry `href`. The shared
    // _tap handler must extract a clickable URL from either.
    const wechatAnchor = findFirst(
      flattenInlineNodes(tokensToWechat('go [here](https://w.com)', { escapeText: false })),
      (n) => n.name === 'a',
    );
    const alipayAnchor = findFirst(
      flattenInlineNodes(tokensToAlipay('go [here](https://a.com)', { escapeText: false })),
      (n) => n.name === 'a',
    );
    expect(resolveLinkHref(wechatAnchor)).toBe('https://w.com');
    expect(resolveLinkHref(alipayAnchor)).toBe('https://a.com');
  });

  it('resolveLinkHref returns null for non-anchor or hrefless nodes', () => {
    expect(resolveLinkHref(undefined)).toBeNull();
    expect(resolveLinkHref(null)).toBeNull();
    expect(resolveLinkHref({ name: 'text', attrs: { value: 'x' } })).toBeNull();
    expect(resolveLinkHref({ name: 'a', attrs: {} })).toBeNull();
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

  it('assigns stable sibling keys recursively for mini-program wx:key reuse', () => {
    const input: MiniNode[] = [
      {
        name: 'pre',
        attrs: {},
        header: [
          { name: 'text', attrs: { value: 'ts' } },
          { name: 'copy-button', attrs: { 'data-copy': 'code' } },
        ],
        children: [
          { name: 'code', attrs: {}, children: [{ name: 'text', attrs: { value: 'code' } }] },
        ],
      },
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'text', attrs: { value: 'a' } },
          { name: 'text', attrs: { value: 'b' } },
        ],
      },
    ];

    const out = flattenInlineNodes(input);

    expect(out.map((n) => n.k)).toEqual([0, 1]);
    expect(out[0].header?.map((n) => n.k)).toEqual([0, 1]);
    expect(out[0].children?.map((n) => n.k)).toEqual([0]);
    expect(out[1].children?.map((n) => n.k)).toEqual([0, 1]);
  });

  it('flattens a top-level anchor into interactive leaf runs', () => {
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
    expect(out.every((n) => n.name === 'a' && !n.children)).toBe(true);
    expect(out.map((n) => n.attrs?.value).join('')).toBe('bold tail');
    const boldRun = out.find((n) =>
      String(n.attrs?.class ?? '').includes('md-strong')
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

  it('drops an empty anchor because it has no visible leaf run', () => {
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
    expect(anchor).toBeUndefined();
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
