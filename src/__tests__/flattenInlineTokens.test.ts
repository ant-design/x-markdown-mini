import { describe, it, expect } from 'vitest';
import { Lexer, type Token, type Tokens } from 'marked';
import { flattenInlineTokens } from '../components/shared/flattenInlineTokens.js';

/** Lex inline-only markdown by extracting the first paragraph's child tokens. */
function inline(md: string): Token[] {
  const tokens = Lexer.lex(md);
  const p = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph | undefined;
  return p?.tokens ?? [];
}

describe('flattenInlineTokens', () => {
  it('flattens plain text into a single text run', () => {
    const runs = flattenInlineTokens(inline('plain text'), { escapeText: false });
    expect(runs).toEqual([{ kind: 'text', value: 'plain text', classes: '' }]);
  });

  it('marks bold runs with md-strong class', () => {
    const runs = flattenInlineTokens(inline('a **bold** b'), { escapeText: false });
    const boldRun = runs.find((r) => r.kind === 'text' && r.classes.includes('md-strong'));
    expect(boldRun?.value).toBe('bold');
  });

  it('merges nested strong+em into a single run with both classes', () => {
    const runs = flattenInlineTokens(inline('**_both_**'), { escapeText: false });
    const merged = runs.find((r) => r.kind === 'text');
    expect(merged?.classes).toContain('md-strong');
    expect(merged?.classes).toContain('md-em');
    expect(merged?.value).toBe('both');
  });

  it('marks inline codespan with md-inline-code', () => {
    const runs = flattenInlineTokens(inline('see `x = 1`'), { escapeText: false });
    const code = runs.find((r) => r.classes.includes('md-inline-code'));
    expect(code?.value).toBe('x = 1');
  });

  it('marks strikethrough with md-del', () => {
    const runs = flattenInlineTokens(inline('~~gone~~'), { escapeText: false });
    const del = runs.find((r) => r.classes.includes('md-del'));
    expect(del?.value).toBe('gone');
  });

  it('emits link as a standalone run carrying href + child text', () => {
    const runs = flattenInlineTokens(inline('go [home](https://example.com)'), { escapeText: false });
    const link = runs.find((r) => r.kind === 'link');
    expect(link).toBeDefined();
    expect(link?.attrs?.href).toBe('https://example.com');
    expect(link?.value).toBe('home');
  });

  it('emits image as a standalone run carrying src + alt', () => {
    const runs = flattenInlineTokens(inline('see ![cat](https://example.com/c.png)'), { escapeText: false });
    const img = runs.find((r) => r.kind === 'image');
    expect(img).toBeDefined();
    expect(img?.attrs?.src).toBe('https://example.com/c.png');
    expect(img?.attrs?.alt).toBe('cat');
  });

  it('emits br for hard line break', () => {
    const runs = flattenInlineTokens(inline('a  \nb'), { escapeText: false });
    expect(runs.some((r) => r.kind === 'br')).toBe(true);
  });

  it('escapeText=true encodes HTML entities in text values', () => {
    const runs = flattenInlineTokens(inline('a < b & "c"'), { escapeText: true });
    const text = runs.find((r) => r.kind === 'text');
    expect(text?.value).toContain('&lt;');
    expect(text?.value).toContain('&amp;');
    expect(text?.value).toContain('&quot;');
  });

  it('escapeText=false leaves raw < and & in text values (self-render mode)', () => {
    const runs = flattenInlineTokens(inline('a < b & c'), { escapeText: false });
    const text = runs.find((r) => r.kind === 'text');
    expect(text?.value).toContain('<');
    expect(text?.value).toContain('&');
    expect(text?.value).not.toContain('&lt;');
  });
});
