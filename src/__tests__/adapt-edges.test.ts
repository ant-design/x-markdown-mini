import { describe, expect, it } from 'vitest';
import { adaptNodes } from '../adapters/adapt.js';
import type { UnifiedNode } from '../types.js';
import type { PlatformAdapterConfig, PlatformCapabilities } from '../adapters/capabilities.js';

const fullCaps: PlatformCapabilities = {
  preSupported: true,
  tableSupported: true,
  blockquoteSupported: true,
  olStartSupported: true,
  httpsOnlyImages: false,
  videoSupported: true,
};

const noCaps: PlatformCapabilities = {
  preSupported: false,
  tableSupported: false,
  blockquoteSupported: false,
  olStartSupported: false,
  httpsOnlyImages: true,
  videoSupported: false,
};

function flatten(nodes: UnifiedNode[]): UnifiedNode[] {
  const out: UnifiedNode[] = [];
  const q = [...nodes];
  while (q.length) {
    const n = q.shift()!;
    out.push(n);
    if (n.children) q.push(...n.children);
  }
  return out;
}

describe('adaptNodes — video handling', () => {
  it('drops <video> when caps.videoSupported=false', () => {
    const input: UnifiedNode[] = [
      { name: 'video', attrs: { src: 'https://e.com/v.mp4' } },
      { name: 'p', attrs: {}, children: [{ name: 'text', attrs: { value: 'sib' } }] },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out.length).toBe(1);
    expect(out[0].name).toBe('p');
  });

  it('keeps <video> when caps.videoSupported=true', () => {
    const input: UnifiedNode[] = [
      { name: 'video', attrs: { src: 'https://e.com/v.mp4' } },
    ];
    const out = adaptNodes(input, { caps: fullCaps });
    expect(out[0].name).toBe('video');
  });

  it('drops nested <video> children too', () => {
    const input: UnifiedNode[] = [
      {
        name: 'div',
        attrs: {},
        children: [
          { name: 'video', attrs: { src: 'x' } },
          { name: 'p', attrs: {}, children: [] },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    // No video remains anywhere
    expect(flatten(out).some((n) => n.name === 'video')).toBe(false);
    // <p> survives
    expect(flatten(out).some((n) => n.name === 'p')).toBe(true);
  });
});

describe('adaptNodes — pre / blockquote downgrade preserves animate', () => {
  it('downgraded <pre> preserves the animate flag', () => {
    const input: UnifiedNode[] = [
      {
        name: 'pre',
        attrs: { class: 'md-code-block' },
        children: [{ name: 'code', attrs: {}, children: [{ name: 'text', attrs: { value: 'hi' } }] }],
        animate: 'block',
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].name).toBe('div');
    expect(out[0].animate).toBe('block');
  });

  it('downgraded <blockquote> preserves animate and produces no children array when empty', () => {
    const input: UnifiedNode[] = [
      { name: 'blockquote', attrs: { class: 'md-blockquote' }, animate: 'block' },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].name).toBe('div');
    expect(out[0].animate).toBe('block');
    expect(out[0].children).toBeUndefined();
  });
});

describe('adaptNodes — flattenTable edge cases', () => {
  it('skips non-tr children inside thead/tbody (defensive branch)', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: { class: 'md-table' },
        children: [
          {
            name: 'thead',
            attrs: {},
            children: [
              { name: 'caption', attrs: {} }, // bogus child — not <tr>
              {
                name: 'tr',
                attrs: {},
                children: [{ name: 'th', attrs: {}, children: [{ name: 'text', attrs: { value: 'H' } }] }],
              },
            ],
          },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    // No <caption> appears in output
    expect(flatten(out).some((n) => n.name === 'caption')).toBe(false);
    expect(flatten(out).some((n) => String(n.attrs?.class ?? '') === 'md-th')).toBe(true);
  });

  it('handles unknown section name → md-table-body class', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: { class: 'md-table' },
        children: [
          {
            name: 'tfoot',
            attrs: {},
            children: [
              { name: 'tr', attrs: {}, children: [{ name: 'td', attrs: {}, children: [] }] },
            ],
          },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(flatten(out).some((n) => String(n.attrs?.class ?? '') === 'md-table-body')).toBe(true);
  });

  it('drops empty sections (no rows survived) from the flattened table', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: {},
        children: [
          { name: 'thead', attrs: {}, children: [] }, // no rows
          {
            name: 'tbody',
            attrs: {},
            children: [
              { name: 'tr', attrs: {}, children: [{ name: 'td', attrs: {}, children: [] }] },
            ],
          },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    const sections = flatten(out).filter((n) =>
      ['md-thead', 'md-tbody'].includes(String(n.attrs?.class ?? ''))
    );
    expect(sections.length).toBe(1);
    expect(sections[0].attrs?.class).toBe('md-tbody');
  });

  it('table cell without children produces a div without a children array', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: {},
        children: [
          {
            name: 'tbody',
            attrs: {},
            children: [
              {
                name: 'tr',
                attrs: {},
                children: [{ name: 'td', attrs: {} /* no children */ }],
              },
            ],
          },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    const td = flatten(out).find((n) => String(n.attrs?.class ?? '') === 'md-td');
    expect(td).toBeDefined();
    expect(td?.children).toBeUndefined();
  });
});

describe('adaptNodes — classMode', () => {
  it('classMode=preserve keeps class attributes on internal nodes', () => {
    const input: UnifiedNode[] = [
      {
        name: 'p',
        attrs: { class: 'md-paragraph', selectable: true },
        children: [{ name: 'text', attrs: { value: 'hi', class: 'md-text' } }],
      },
    ];
    const cfg: PlatformAdapterConfig = { caps: fullCaps, classMode: 'preserve' };
    const out = adaptNodes(input, cfg);
    expect(out[0].attrs?.class).toBe('md-paragraph');
    expect(out[0].attrs?.selectable).toBeUndefined(); // selectable still stripped
    expect(out[0].children?.[0].attrs?.class).toBe('md-text');
  });

  it('default classMode=strip strips class everywhere', () => {
    const input: UnifiedNode[] = [
      { name: 'p', attrs: { class: 'x' }, children: [] },
    ];
    const out = adaptNodes(input, { caps: fullCaps });
    expect(out[0].attrs?.class).toBeUndefined();
  });
});

describe('adaptNodes — ol start + image src branches', () => {
  it('drops ol start when caps.olStartSupported=false', () => {
    const input: UnifiedNode[] = [
      { name: 'ol', attrs: { start: 4 }, children: [] },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].attrs?.start).toBeUndefined();
  });

  it('keeps ol start when caps.olStartSupported=true', () => {
    const input: UnifiedNode[] = [
      { name: 'ol', attrs: { start: 4 }, children: [] },
    ];
    const out = adaptNodes(input, { caps: fullCaps });
    expect(out[0].attrs?.start).toBe(4);
  });

  it('https-only images replace http with https; https URLs untouched', () => {
    const input: UnifiedNode[] = [
      { name: 'img', attrs: { src: 'http://a.com/x.png' } },
      { name: 'img', attrs: { src: 'https://b.com/y.png' } },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].attrs?.src).toBe('https://a.com/x.png');
    expect(out[1].attrs?.src).toBe('https://b.com/y.png');
  });

  it('non-string img src is left untouched in the https path', () => {
    const input: UnifiedNode[] = [
      { name: 'img', attrs: { src: 42 } }, // number — unusual but defensively handled
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].attrs?.src).toBe(42);
  });
});

describe('adaptNodes — anchor rewriting', () => {
  it('rewriteAnchorHref=true converts href → data-href and adds md-link class', () => {
    const input: UnifiedNode[] = [
      { name: 'a', attrs: { href: 'https://e.com', title: 'T' }, children: [] },
    ];
    const out = adaptNodes(input, { caps: fullCaps, rewriteAnchorHref: true });
    expect(out[0].attrs?.['data-href']).toBe('https://e.com');
    expect(out[0].attrs?.href).toBeUndefined();
    expect(out[0].attrs?.class).toBe('md-link');
    expect(out[0].attrs?.title).toBe('T'); // other attrs preserved
  });

  it('rewriteAnchorHref=true without an href on <a> does nothing', () => {
    const input: UnifiedNode[] = [
      { name: 'a', attrs: { class: 'x' }, children: [] },
    ];
    const out = adaptNodes(input, { caps: fullCaps, rewriteAnchorHref: true });
    expect(out[0].attrs?.['data-href']).toBeUndefined();
  });

  it('rewriteAnchorHref=false leaves anchor untouched', () => {
    const input: UnifiedNode[] = [
      { name: 'a', attrs: { href: 'https://e.com' }, children: [] },
    ];
    const out = adaptNodes(input, { caps: fullCaps });
    expect(out[0].attrs?.href).toBe('https://e.com');
    expect(out[0].attrs?.['data-href']).toBeUndefined();
  });
});

describe('adaptNodes — animate / children preservation', () => {
  it('preserves animate property on a regular node', () => {
    const input: UnifiedNode[] = [
      { name: 'p', attrs: {}, animate: 'block', children: [{ name: 'text', attrs: { value: 'x' } }] },
    ];
    const out = adaptNodes(input, { caps: fullCaps });
    expect(out[0].animate).toBe('block');
  });

  it('drops empty children array (children mapped to nothing)', () => {
    const input: UnifiedNode[] = [
      {
        name: 'div',
        attrs: {},
        children: [
          { name: 'video', attrs: { src: 'x' } }, // dropped by video filter
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].children).toBeUndefined();
  });
});

describe('adaptNodes — flattenTable nil-children fallbacks', () => {
  it('handles table without children at all', () => {
    const input: UnifiedNode[] = [
      // table with no children property → flattenTable hits `?? []` on outer loop
      { name: 'table', attrs: {} },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].name).toBe('div');
    expect(String(out[0].attrs?.class)).toBe('md-table');
    expect(out[0].children).toEqual([]);
  });

  it('handles thead/tbody section without children property', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: {},
        children: [{ name: 'thead', attrs: {} }],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    // No rows survived → no thead section appears either
    expect(out[0].children).toEqual([]);
  });

  it('handles row without children property', () => {
    const input: UnifiedNode[] = [
      {
        name: 'table',
        attrs: {},
        children: [
          {
            name: 'tbody',
            attrs: {},
            children: [{ name: 'tr', attrs: {} /* row.children missing */ }],
          },
        ],
      },
    ];
    const out = adaptNodes(input, { caps: noCaps });
    // Row with 0 cells still produces a <div class="md-tr">
    const tr = flatten(out).find((n) => String(n.attrs?.class ?? '') === 'md-tr');
    expect(tr).toBeDefined();
    expect(tr?.children).toEqual([]);
  });
});

describe('adaptNodes — pre/blockquote with missing children', () => {
  it('downgrades <pre> with no children property', () => {
    const input: UnifiedNode[] = [{ name: 'pre', attrs: { class: 'md-code-block' } }];
    const out = adaptNodes(input, { caps: noCaps });
    expect(out[0].name).toBe('div');
    expect(out[0].children).toBeUndefined();
  });
});
