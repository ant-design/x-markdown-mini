import { describe, it, expect, vi } from 'vitest';
import { runPipeline } from '../pipeline.js';
import { XMarkdownMini } from '../index.js';
import { parse } from '../core/lexer.js';
import type { UnifiedNode } from '../types.js';

describe('parse (mini lexer → IR)', () => {
  it('parses heading and paragraph', () => {
    const ir = parse('# Hello\n\nWorld.');
    expect(ir.length).toBeGreaterThanOrEqual(2);
    expect(ir[0].t).toBe('heading');
    expect(ir[0].a?.depth).toBe(1);
    expect(ir[1].t).toBe('paragraph');
  });

  it('parses unordered list with two items', () => {
    const ir = parse('- a\n- b\n');
    expect(ir.length).toBe(1);
    expect(ir[0].t).toBe('list');
    expect(ir[0].a?.ordered).toBe(false);
    expect(ir[0].c?.length).toBe(2);
  });

  it('parses ordered list with start', () => {
    const ir = parse('3. a\n4. b\n');
    expect(ir[0].t).toBe('list');
    expect(ir[0].a?.ordered).toBe(true);
    expect(ir[0].a?.start).toBe(3);
  });

  it('parses fenced code block with language', () => {
    const ir = parse('```js\nconst x = 1;\n```\n');
    expect(ir.length).toBe(1);
    expect(ir[0].t).toBe('code');
    expect(ir[0].a?.lang).toBe('js');
    expect(ir[0].raw).toContain('const x = 1;');
  });

  it('parses blockquote', () => {
    const ir = parse('> hello\n> world\n');
    expect(ir[0].t).toBe('blockquote');
    expect(ir[0].c?.[0].t).toBe('paragraph');
  });

  it('parses hr', () => {
    const ir = parse('---\n');
    expect(ir[0].t).toBe('hr');
  });

  it('parses gfm pipe table', () => {
    const ir = parse('| a | b |\n|---|---|\n| 1 | 2 |\n');
    expect(ir[0].t).toBe('table');
    expect(ir[0].c?.[0].t).toBe('thead');
    expect(ir[0].c?.[1].t).toBe('tbody');
    expect(ir[0].c?.[1].c?.[0].c?.length).toBe(2);
  });

  it('parses inline strong, em, codespan and links', () => {
    const ir = parse('A **bold** and *em* and `c` and [x](https://e.com).');
    const para = ir[0];
    expect(para.t).toBe('paragraph');
    const types = para.c!.map((n) => n.t);
    expect(types).toContain('strong');
    expect(types).toContain('em');
    expect(types).toContain('codespan');
    expect(types).toContain('link');
  });
});

describe('runPipeline', () => {
  it('returns unified nodes for simple markdown', () => {
    const nodes = runPipeline('# Hi\n\nPara.');
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThanOrEqual(1);
    expect(nodes[0].name).toBe('h1');
    expect(nodes[0].attrs?.class).toContain('md-heading');
  });

  it('animation=true preserves both semantic and animate classes', () => {
    const withAnim = runPipeline('# Hi', { animation: true });
    const withoutAnim = runPipeline('# Hi', { animation: false });
    expect(withAnim[0].animate).toBe('block');
    const cls = String(withAnim[0].attrs?.class ?? '');
    // 修复后的合并：md-heading + md-h1 + md-animate-block
    expect(cls).toContain('md-heading');
    expect(cls).toContain('md-h1');
    expect(cls).toContain('md-animate-block');
    expect(withoutAnim[0].animate).toBeUndefined();
    expect(String(withoutAnim[0].attrs?.class ?? '')).not.toContain('md-animate-block');
  });

  it('does not set selectable on internal nodes', () => {
    const nodes = runPipeline('# Hi\n\nPara with [link](https://example.com)');
    for (const n of flatten(nodes)) {
      expect(n.attrs?.selectable).toBeUndefined();
    }
  });

  it('escapes html-special chars inside text', () => {
    const nodes = runPipeline('a < b & c');
    const text = flatten(nodes).find((n) => n.name === 'text');
    expect(String(text?.attrs?.value ?? '')).toContain('&lt;');
    expect(String(text?.attrs?.value ?? '')).toContain('&amp;');
  });

  it('escapeText=false leaves text raw (component renderer path)', () => {
    const nodes = runPipeline('a < b & "c"', { escapeText: false });
    const text = flatten(nodes).find((n) => n.name === 'text');
    const value = String(text?.attrs?.value ?? '');
    expect(value).toContain('<');
    expect(value).toContain('&');
    expect(value).toContain('"');
    expect(value).not.toContain('&lt;');
    expect(value).not.toContain('&amp;');
    expect(value).not.toContain('&quot;');
  });
});

describe('XMarkdownMini one-shot render', () => {
  it('returns unified nodes for given content', () => {
    const md = new XMarkdownMini();
    const nodes = md.render({ content: '# Hi\n\nPara.' });
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThanOrEqual(1);
    expect(nodes[0].name).toBe('h1');
  });

  it('invokes onRenderStart before onRenderComplete', () => {
    const md = new XMarkdownMini();
    const calls: string[] = [];
    const onRenderStart = vi.fn(() => {
      calls.push('start');
    });
    const onRenderComplete = vi.fn(() => {
      calls.push('complete');
    });
    md.render({ content: '# Hi', onRenderStart, onRenderComplete });
    expect(onRenderStart).toHaveBeenCalledTimes(1);
    expect(onRenderComplete).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['start', 'complete']);
  });

  it('works without lifecycle callbacks', () => {
    const md = new XMarkdownMini();
    expect(() => md.render({ content: '# Hi' })).not.toThrow();
  });

  it('does not enable block animation (one-shot render)', () => {
    const md = new XMarkdownMini();
    const nodes = md.render({ content: '# Hi' });
    expect(nodes[0].animate).toBeUndefined();
    expect(String(nodes[0].attrs?.class ?? '')).not.toContain('md-animate-block');
  });

  it('defaults selectable to true when not provided', () => {
    const md = new XMarkdownMini();
    expect(() => md.render({ content: '# Hi' })).not.toThrow();
    const nodes = md.render({ content: '# Hi' });
    // selectable is consumed by the pipeline; verify no internal node has it set
    for (const n of flatten(nodes)) {
      expect(n.attrs?.selectable).toBeUndefined();
    }
  });

  it('respects explicit selectable=false', () => {
    const md = new XMarkdownMini();
    const nodes = md.render({ content: '# Hi', selectable: false });
    expect(nodes.length).toBeGreaterThanOrEqual(1);
  });

  it('forwards options to lexer (gfm table)', () => {
    const md = new XMarkdownMini();
    const nodes = md.render({
      content: '| a | b |\n|---|---|\n| 1 | 2 |\n',
      options: {},
    });
    const flat = flatten(nodes);
    expect(flat.some((n) => n.name === 'table')).toBe(true);
  });
});

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
