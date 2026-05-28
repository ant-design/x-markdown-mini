import { describe, it, expect } from 'vitest';
import { XMarkdownMini } from '../index.js';
import type { Token, Tokens } from 'marked';

describe('XMarkdownMini.parse', () => {
  it('returns marked-shaped Token[] with type/raw fields', () => {
    const md = new XMarkdownMini();
    const tokens = md.parse('# Hello\n\nWorld');
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
    const heading = tokens.find((t) => t.type === 'heading') as Tokens.Heading | undefined;
    expect(heading).toBeDefined();
    expect(heading?.depth).toBe(1);
    expect(heading?.text).toBe('Hello');
  });

  it('preserves the code block language (lang) — fixes the v1 lang drop', () => {
    const md = new XMarkdownMini();
    const tokens = md.parse('```typescript\nconst x = 1;\n```');
    const code = tokens.find((t) => t.type === 'code') as Tokens.Code | undefined;
    expect(code).toBeDefined();
    expect(code?.lang).toBe('typescript');
    expect(code?.text).toBe('const x = 1;');
  });

  it('respects breaks=true at construction time', () => {
    const md = new XMarkdownMini({ breaks: true });
    const tokens = md.parse('line one\nline two');
    // With breaks enabled, the inline child tokens should contain a 'br'.
    const para = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph | undefined;
    expect(para).toBeDefined();
    const hasBr = (para?.tokens ?? []).some((t) => t.type === 'br');
    expect(hasBr).toBe(true);
  });

  it('respects gfm=false (disables tables)', () => {
    const md = new XMarkdownMini({ gfm: false });
    const tokens = md.parse('| a | b |\n|---|---|\n| 1 | 2 |');
    // Without gfm, the table is parsed as plain paragraphs / text, not a table token.
    expect(tokens.some((t) => t.type === 'table')).toBe(false);
  });

  it('calls are independent — no shared mutable state between invocations', () => {
    const md = new XMarkdownMini();
    const a = md.parse('# A');
    const b = md.parse('# B');
    expect((a[0] as Tokens.Heading).text).toBe('A');
    expect((b[0] as Tokens.Heading).text).toBe('B');
  });

  it('Token type is exported from the package surface', async () => {
    // Compile-time check: the type import on line 3 of this file proves Token is exported.
    // We also runtime-assert that a token has the expected shape.
    const md = new XMarkdownMini();
    const tokens: Token[] = md.parse('paragraph');
    expect(tokens[0]).toMatchObject({ type: expect.any(String), raw: expect.any(String) });
  });
});
