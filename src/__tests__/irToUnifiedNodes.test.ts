import { describe, expect, it } from 'vitest';
import { irToUnifiedNodes } from '../core/index.js';
import type { IRNode, UnifiedNode } from '../types.js';

function flatten(nodes: UnifiedNode[]): UnifiedNode[] {
  const out: UnifiedNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    out.push(n);
    if (n.children) queue.push(...n.children);
  }
  return out;
}

function find(nodes: UnifiedNode[], name: string): UnifiedNode | undefined {
  return flatten(nodes).find((n) => n.name === name);
}

describe('irToUnifiedNodes — heading', () => {
  it('clamps depth to [1, 6]', () => {
    const ir: IRNode[] = [
      { t: 'heading', a: { depth: 0 }, c: [{ t: 'text', raw: 'A' }] },
      { t: 'heading', a: { depth: 9 }, c: [{ t: 'text', raw: 'B' }] },
      { t: 'heading', c: [{ t: 'text', raw: 'C' }] }, // missing depth → fallback to 1
    ];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('h1');
    expect(out[1].name).toBe('h6');
    expect(out[2].name).toBe('h1');
  });

  it('animation=true adds md-animate-block and animate=block', () => {
    const ir: IRNode[] = [{ t: 'heading', a: { depth: 1 }, c: [{ t: 'text', raw: 'X' }] }];
    const out = irToUnifiedNodes(ir, { animation: true });
    expect(out[0].animate).toBe('block');
    expect(String(out[0].attrs?.class)).toContain('md-animate-block');
  });
});

describe('irToUnifiedNodes — inline branches', () => {
  it('renders strong/em/codespan/br/link/image inside a paragraph', () => {
    const ir: IRNode[] = [
      {
        t: 'paragraph',
        c: [
          { t: 'strong', c: [{ t: 'text', raw: 'B' }] },
          { t: 'em', c: [{ t: 'text', raw: 'I' }] },
          { t: 'codespan', raw: '<x>' },
          { t: 'br' },
          { t: 'link', a: { href: 'https://e.com' }, c: [{ t: 'text', raw: 'L' }] },
          { t: 'image', a: { href: 'https://e.com/i.png', alt: 'A' } },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const flat = flatten(out);
    expect(flat.some((n) => n.name === 'strong')).toBe(true);
    expect(flat.some((n) => n.name === 'em')).toBe(true);
    expect(flat.some((n) => n.name === 'code')).toBe(true);
    expect(flat.some((n) => n.name === 'br')).toBe(true);
    expect(flat.some((n) => n.name === 'a')).toBe(true);
    expect(flat.some((n) => n.name === 'img')).toBe(true);

    // codespan value goes through escape by default
    const codeText = flat.find((n) => n.name === 'text' && String(n.attrs?.value ?? '').includes('&lt;'));
    expect(codeText).toBeTruthy();
  });

  it('link with empty inline content emits an empty text node child', () => {
    const ir: IRNode[] = [
      {
        t: 'paragraph',
        c: [{ t: 'link', a: { href: 'https://e.com' }, c: [] }],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const a = find(out, 'a')!;
    expect(a.children).toBeDefined();
    expect(a.children![0].name).toBe('text');
    expect(a.children![0].attrs?.value).toBe('');
  });

  it('image without alt/href falls back to empty strings', () => {
    const ir: IRNode[] = [
      { t: 'paragraph', c: [{ t: 'image' }] },
    ];
    const out = irToUnifiedNodes(ir);
    const img = find(out, 'img')!;
    expect(img.attrs?.src).toBe('');
    expect(img.attrs?.alt).toBe('');
  });

  it('text IR with empty raw is dropped entirely from inline output', () => {
    const ir: IRNode[] = [
      {
        t: 'paragraph',
        c: [{ t: 'text', raw: '' }, { t: 'text', raw: 'kept' }],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const textNodes = flatten(out).filter((n) => n.name === 'text');
    // Only the kept text remains
    expect(textNodes.length).toBe(1);
    expect(textNodes[0].attrs?.value).toBe('kept');
  });

  it('unknown inline IR type falls back to text branch', () => {
    const ir: IRNode[] = [
      {
        t: 'paragraph',
        c: [{ t: 'mystery' as IRNode['t'], raw: 'fallback' }],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const text = find(out, 'text');
    expect(text?.attrs?.value).toBe('fallback');
  });

  it('escapeText=false leaves <, &, " un-escaped (component renderer mode)', () => {
    const ir: IRNode[] = [
      { t: 'paragraph', c: [{ t: 'text', raw: 'a < b & "c"' }] },
    ];
    const out = irToUnifiedNodes(ir, { escapeText: false });
    const text = find(out, 'text');
    const val = String(text?.attrs?.value ?? '');
    expect(val).toContain('<');
    expect(val).toContain('&');
    expect(val).toContain('"');
    expect(val).not.toContain('&lt;');
  });

  it('escapes >, &, <, " via escapeHtml when escapeText is default', () => {
    const ir: IRNode[] = [
      { t: 'paragraph', c: [{ t: 'text', raw: 'a > b < c & d "e"' }] },
    ];
    const out = irToUnifiedNodes(ir);
    const text = find(out, 'text');
    const val = String(text?.attrs?.value ?? '');
    expect(val).toContain('&gt;');
    expect(val).toContain('&lt;');
    expect(val).toContain('&amp;');
    expect(val).toContain('&quot;');
  });
});

describe('irToUnifiedNodes — block branches', () => {
  it('renders code block with language as <pre><code class="md-code language-X">', () => {
    const ir: IRNode[] = [
      { t: 'code', a: { lang: 'ts' }, raw: 'let x: number = 1;' },
    ];
    const out = irToUnifiedNodes(ir);
    const pre = out[0];
    expect(pre.name).toBe('pre');
    const code = pre.children?.[0];
    expect(code?.name).toBe('code');
    expect(String(code?.attrs?.class)).toContain('language-ts');
  });

  it('code block without lang keeps the bare md-code class', () => {
    const ir: IRNode[] = [{ t: 'code', raw: 'plain' }];
    const out = irToUnifiedNodes(ir);
    const code = out[0].children?.[0];
    expect(String(code?.attrs?.class)).toBe('md-code');
  });

  it('renders hr with class only (no children) and respects animation flag', () => {
    const noAnim = irToUnifiedNodes([{ t: 'hr' }]);
    expect(noAnim[0]).toEqual({ name: 'hr', attrs: { class: 'md-hr' } });

    const anim = irToUnifiedNodes([{ t: 'hr' }], { animation: true });
    expect(anim[0].animate).toBe('block');
    expect(String(anim[0].attrs?.class)).toContain('md-animate-block');
  });

  it('renders html block as <div class="md-html"> with raw text', () => {
    const out = irToUnifiedNodes([{ t: 'html', raw: '<b>raw</b>' }]);
    expect(out[0].name).toBe('div');
    expect(String(out[0].attrs?.class)).toBe('md-html');
    expect(out[0].children?.[0].attrs?.value).toBe('<b>raw</b>');
  });

  it('renders blockquote containing paragraphs', () => {
    const ir: IRNode[] = [
      {
        t: 'blockquote',
        c: [
          { t: 'paragraph', c: [{ t: 'text', raw: 'q' }] },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('blockquote');
    expect(out[0].children?.[0].name).toBe('p');
  });

  it('ordered list: omits start when start===1, keeps when >1', () => {
    const list1: IRNode = { t: 'list', a: { ordered: true, start: 1 }, c: [] };
    const list3: IRNode = { t: 'list', a: { ordered: true, start: 3 }, c: [] };
    const list1Missing: IRNode = { t: 'list', a: { ordered: true }, c: [] };
    const unordered: IRNode = { t: 'list', a: { ordered: false }, c: [] };

    const out = irToUnifiedNodes([list1, list3, list1Missing, unordered]);
    expect(out[0].name).toBe('ol');
    expect(out[0].attrs?.start).toBeUndefined();
    expect(out[1].name).toBe('ol');
    expect(out[1].attrs?.start).toBe(3);
    expect(out[2].attrs?.start).toBeUndefined();
    expect(out[3].name).toBe('ul');
  });

  it('list_item paragraph child is inlined; nested block child is kept as block', () => {
    const ir: IRNode[] = [
      {
        t: 'list',
        a: { ordered: false },
        c: [
          {
            t: 'list_item',
            c: [
              { t: 'paragraph', c: [{ t: 'text', raw: 'p' }] },
              { t: 'code', raw: 'block' }, // forces block child path
            ],
          },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const li = out[0].children?.[0];
    expect(li?.name).toBe('li');
    // inlined paragraph → text child; nested code → <pre> child
    const names = (li?.children ?? []).map((c) => c.name);
    expect(names).toContain('text');
    expect(names).toContain('pre');
  });

  it('list_item with raw text IR child goes through the text raw path', () => {
    const ir: IRNode[] = [
      {
        t: 'list',
        a: { ordered: false },
        c: [
          {
            t: 'list_item',
            c: [{ t: 'text', raw: 'hello' }],
          },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const li = out[0].children?.[0];
    expect(li?.children?.[0].name).toBe('text');
    expect(li?.children?.[0].attrs?.value).toBe('hello');
  });

  it('list_item with inline IR child (strong) goes through isInlineIR path', () => {
    const ir: IRNode[] = [
      {
        t: 'list',
        a: { ordered: false },
        c: [
          {
            t: 'list_item',
            c: [{ t: 'strong', c: [{ t: 'text', raw: 'bold' }] }],
          },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const li = out[0].children?.[0];
    expect(li?.children?.[0].name).toBe('strong');
  });

  it('renders a full table with thead/tbody/th/td cells', () => {
    const ir: IRNode[] = [
      {
        t: 'table',
        c: [
          {
            t: 'thead',
            c: [
              { t: 'th', c: [{ t: 'text', raw: 'H1' }] },
              { t: 'th', c: [{ t: 'text', raw: 'H2' }] },
            ],
          },
          {
            t: 'tbody',
            c: [
              {
                t: 'tr',
                c: [
                  { t: 'td', c: [{ t: 'text', raw: 'D1' }] },
                  { t: 'td', c: [{ t: 'text', raw: 'D2' }] },
                ],
              },
            ],
          },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('table');
    const flat = flatten(out);
    expect(flat.some((n) => n.name === 'thead')).toBe(true);
    expect(flat.some((n) => n.name === 'tbody')).toBe(true);
    expect(flat.some((n) => n.name === 'tr')).toBe(true);
    expect(flat.filter((n) => n.name === 'th').length).toBe(2);
    expect(flat.filter((n) => n.name === 'td').length).toBe(2);
    const th = flat.find((n) => n.name === 'th');
    expect(String(th?.attrs?.class)).toBe('md-th');
    const td = flat.find((n) => n.name === 'td');
    expect(String(td?.attrs?.class)).toBe('md-td');
  });

  it('returns empty inline children array when nodes argument is undefined', () => {
    const ir: IRNode[] = [{ t: 'paragraph' }];
    const out = irToUnifiedNodes(ir);
    // paragraph with no c → no children
    expect(out[0].name).toBe('p');
    expect(out[0].children).toBeUndefined();
  });

  it('top-level space IR is filtered (skipped)', () => {
    const ir: IRNode[] = [
      { t: 'space' },
      { t: 'paragraph', c: [{ t: 'text', raw: 'hi' }] },
    ];
    const out = irToUnifiedNodes(ir);
    expect(out.length).toBe(1);
    expect(out[0].name).toBe('p');
  });

  it('space IR nested as a child renders to <span> (defensive branch)', () => {
    // space normally filtered at top level — but blockToUnified('space') maps to <span>
    const ir: IRNode[] = [
      { t: 'blockquote', c: [{ t: 'space' }] },
    ];
    const out = irToUnifiedNodes(ir);
    const span = find(out, 'span');
    expect(span).toBeTruthy();
  });

  it('unknown block IR type falls back to paragraph (text path)', () => {
    const ir: IRNode[] = [{ t: 'totally-unknown' as IRNode['t'], raw: 'plain' }];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('p');
    const text = find(out, 'text');
    expect(text?.attrs?.value).toBe('plain');
  });

  it('unknown block IR with children falls through to paragraph using inline children', () => {
    const ir: IRNode[] = [
      {
        t: 'totally-unknown' as IRNode['t'],
        c: [{ t: 'text', raw: 'fallback' }],
      },
    ];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('p');
    expect(find(out, 'text')?.attrs?.value).toBe('fallback');
  });

  it('unknown block IR with neither children nor raw produces an empty text node', () => {
    const ir: IRNode[] = [{ t: 'totally-unknown' as IRNode['t'] }];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('p');
    const text = find(out, 'text');
    expect(text?.attrs?.value).toBe('');
  });

  it('thead/tbody with undefined children produces empty cell/row arrays', () => {
    const ir: IRNode[] = [
      {
        t: 'table',
        c: [
          { t: 'thead' }, // no c
          { t: 'tbody' }, // no c
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    expect(out[0].name).toBe('table');
    const thead = find(out, 'thead');
    const tbody = find(out, 'tbody');
    expect(thead?.children?.[0].name).toBe('tr');
    expect(thead?.children?.[0].children).toEqual([]); // no cells
    expect(tbody?.children).toEqual([]); // no rows
  });

  it('tbody row with no children produces an empty <tr>', () => {
    const ir: IRNode[] = [
      {
        t: 'table',
        c: [
          {
            t: 'tbody',
            c: [{ t: 'tr' }], // tr with no c
          },
        ],
      },
    ];
    const out = irToUnifiedNodes(ir);
    const tr = find(out, 'tr');
    expect(tr).toBeDefined();
    expect(tr?.children).toEqual([]);
  });

  it('table with no children renders an empty <table>', () => {
    const out = irToUnifiedNodes([{ t: 'table' }]);
    expect(out[0].name).toBe('table');
    expect(out[0].children).toBeUndefined();
  });

  it('code IR without raw renders an empty <code> child', () => {
    const out = irToUnifiedNodes([{ t: 'code' }]);
    expect(out[0].name).toBe('pre');
    const code = out[0].children?.[0];
    expect(code?.children?.[0].attrs?.value).toBe('');
  });

  it('list with undefined children renders empty <ul>/<ol>', () => {
    const out = irToUnifiedNodes([{ t: 'list', a: { ordered: false } }]);
    expect(out[0].name).toBe('ul');
    expect(out[0].children).toBeUndefined();
  });

  it('blockquote with undefined children renders empty <blockquote>', () => {
    const out = irToUnifiedNodes([{ t: 'blockquote' }]);
    expect(out[0].name).toBe('blockquote');
    expect(out[0].children).toBeUndefined();
  });

  it('explicit block-level "text" IR renders to <p> with the text inline', () => {
    // Block-level text IR is produced by the lexer for loose list-item text.
    // Calling irToUnifiedNodes directly exercises the literal `case 'text':` branch.
    const out = irToUnifiedNodes([{ t: 'text', raw: 'raw-block' }]);
    expect(out[0].name).toBe('p');
    expect(find(out, 'text')?.attrs?.value).toBe('raw-block');
  });

  it('list_item with no children property renders an empty <li>', () => {
    const out = irToUnifiedNodes([
      {
        t: 'list',
        a: { ordered: false },
        c: [{ t: 'list_item' }],
      },
    ]);
    const li = out[0].children?.[0];
    expect(li?.name).toBe('li');
    expect(li?.children).toBeUndefined();
  });

  it('html block IR without raw renders as <div class="md-html"> with empty text', () => {
    const out = irToUnifiedNodes([{ t: 'html' }]);
    expect(out[0].name).toBe('div');
    expect(out[0].children?.[0].attrs?.value).toBe('');
  });

  it('codespan inline without raw uses empty string', () => {
    const out = irToUnifiedNodes([
      { t: 'paragraph', c: [{ t: 'codespan' }] },
    ]);
    const code = find(out, 'code');
    expect(code?.children?.[0].attrs?.value).toBe('');
  });

  it('link inline without a href attribute falls back to empty string', () => {
    const out = irToUnifiedNodes([
      { t: 'paragraph', c: [{ t: 'link', c: [{ t: 'text', raw: 'L' }] }] },
    ]);
    const a = find(out, 'a');
    expect(a?.attrs?.href).toBe('');
  });

  it('image inline without an a attribute object is rendered with empty src/alt', () => {
    const out = irToUnifiedNodes([
      { t: 'paragraph', c: [{ t: 'image' }] },
    ]);
    const img = find(out, 'img');
    expect(img?.attrs?.src).toBe('');
    expect(img?.attrs?.alt).toBe('');
  });

  it('text-default branch with undefined raw is dropped (?? "" fallback)', () => {
    const out = irToUnifiedNodes([
      {
        t: 'paragraph',
        c: [
          { t: 'text' }, // no raw — n.raw ?? '' takes the nullish branch
          { t: 'text', raw: 'survives' },
        ],
      },
    ]);
    const texts = flatten(out).filter((n) => n.name === 'text');
    expect(texts.length).toBe(1);
    expect(texts[0].attrs?.value).toBe('survives');
  });
});
