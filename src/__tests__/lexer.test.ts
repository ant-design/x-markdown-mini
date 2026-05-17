import { describe, expect, it } from 'vitest';
import { parse, lex, parseInline } from '../core/lexer.js';
import type { IRNode } from '../types.js';

function flatTypes(nodes: IRNode[]): string[] {
  const out: string[] = [];
  const stack = [...nodes];
  while (stack.length) {
    const n = stack.shift()!;
    out.push(n.t);
    if (n.c) stack.push(...n.c);
  }
  return out;
}

describe('parse / lex (block-level edge cases)', () => {
  it('lex is an alias of parse', () => {
    expect(lex).toBe(parse);
  });

  it('drops space tokens between blocks (returns null → filtered)', () => {
    const ir = parse('# A\n\n\n\n# B\n');
    // Only the two headings should remain — no `space` IR
    expect(ir.every((n) => n.t === 'heading')).toBe(true);
    expect(ir.length).toBe(2);
  });

  it('drops reference link definitions (def tokens)', () => {
    const ir = parse('[foo]: https://example.com "title"\n\nbody [foo].');
    // No `def` should remain — only the paragraph survives
    expect(ir.some((n) => n.t === 'paragraph')).toBe(true);
    expect(ir.every((n) => (n.t as string) !== 'def')).toBe(true);
  });

  it('parses block-level html and strips trailing whitespace', () => {
    const ir = parse('<div>raw html</div>\n\n');
    const html = ir.find((n) => n.t === 'html');
    expect(html).toBeTruthy();
    expect(html!.raw).toBe('<div>raw html</div>');
  });

  it('parses fenced code without language (no lang attr)', () => {
    const ir = parse('```\nplain\n```\n');
    expect(ir[0].t).toBe('code');
    expect(ir[0].a).toBeUndefined();
  });

  it('list item with nested block (loose list) keeps blocks instead of unwrapping', () => {
    const ir = parse('- item one\n\n  second paragraph\n\n- next item\n');
    const list = ir.find((n) => n.t === 'list')!;
    const firstItem = list.c![0];
    // loose list → first item children contain paragraph block(s)
    expect(firstItem.t).toBe('list_item');
    expect(firstItem.c!.some((c) => c.t === 'paragraph')).toBe(true);
  });

  it('handles strong/em/codespan/link/image/br/escape/del in one paragraph', () => {
    const ir = parse('**b** *i* `c` [x](https://e.com "t") ![alt](https://e.com/i.png "img") A\\nB ~~del~~');
    const para = ir[0];
    expect(para.t).toBe('paragraph');
    const types = flatTypes(para.c ?? []);
    expect(types).toContain('strong');
    expect(types).toContain('em');
    expect(types).toContain('codespan');
    expect(types).toContain('link');
    expect(types).toContain('image');
    // del IR is collapsed to text children, never appears as 'del'
    expect(types).not.toContain('del');
  });

  it('attaches title to link when present', () => {
    const ir = parse('[x](https://e.com "title here")');
    const link = ir[0].c![0];
    expect(link.t).toBe('link');
    expect(link.a?.href).toBe('https://e.com');
    expect(link.a?.title).toBe('title here');
  });

  it('attaches alt and title on image', () => {
    const ir = parse('![the alt](https://e.com/i.png "the title")');
    // image lives inside paragraph
    const img = ir[0].c![0];
    expect(img.t).toBe('image');
    expect(img.a?.href).toBe('https://e.com/i.png');
    expect(img.a?.alt).toBe('the alt');
    expect(img.a?.title).toBe('the title');
  });

  it('emits br IR with breaks=true', () => {
    const ir = parse('line one\nline two', { breaks: true });
    const types = flatTypes(ir[0].c ?? []);
    expect(types).toContain('br');
  });

  it('keeps gfm=true by default; gfm=false disables tables', () => {
    const irOn = parse('| a |\n|---|\n| 1 |');
    expect(irOn[0].t).toBe('table');
    const irOff = parse('| a |\n|---|\n| 1 |', { gfm: false });
    // Without gfm the pipe table is parsed as a paragraph
    expect(irOff[0].t).toBe('paragraph');
  });

  it('escapes are returned as plain text', () => {
    const ir = parse('A \\* not em');
    const types = flatTypes(ir[0].c ?? []);
    // 'em' should NOT appear; only text
    expect(types).not.toContain('em');
  });

  it('parses inline html tag as text', () => {
    const ir = parse('hello <span>raw</span> world');
    const para = ir[0];
    // inline html present as text within paragraph
    const textNodes = (para.c ?? []).filter((n) => n.t === 'text');
    expect(textNodes.some((t) => (t.raw ?? '').includes('<span>'))).toBe(true);
  });
});

describe('parseInline', () => {
  it('returns inline IR nodes for an inline-only source', () => {
    const nodes = parseInline('plain **bold** and *em*');
    const types = flatTypes(nodes);
    expect(types).toContain('strong');
    expect(types).toContain('em');
  });

  it('accepts options (gfm/breaks)', () => {
    const nodes = parseInline('a\nb', { breaks: true });
    expect(flatTypes(nodes)).toContain('br');
  });

  it('handles empty input gracefully', () => {
    const nodes = parseInline('');
    expect(Array.isArray(nodes)).toBe(true);
  });
});
