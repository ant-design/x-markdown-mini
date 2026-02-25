import { describe, it, expect } from 'vitest';
import { runPipeline } from '../pipeline.js';
import { tokensToIR } from '../core/tokensToIR.js';
import { lex } from '../core/lexer.js';
import type { Token } from 'marked';

describe('lex + tokensToIR', () => {
  it('parses heading and paragraph', () => {
    const tokens = lex('# Hello\n\nWorld.');
    const ir = tokensToIR(tokens as Token[]);
    expect(ir.length).toBeGreaterThanOrEqual(2);
    expect(ir[0].t).toBe('heading');
    expect(ir[0].a?.depth).toBe(1);
    expect(ir[1].t).toBe('paragraph');
  });

  it('parses list', () => {
    const tokens = lex('- a\n- b');
    const ir = tokensToIR(tokens as Token[]);
    expect(ir.length).toBe(1);
    expect(ir[0].t).toBe('list');
    expect(ir[0].c?.length).toBe(2);
  });

  it('parses code block', () => {
    const tokens = lex('```js\nconst x = 1;\n```');
    const ir = tokensToIR(tokens as Token[]);
    expect(ir.length).toBe(1);
    expect(ir[0].t).toBe('code');
    expect(ir[0].a?.lang).toBe('js');
    expect((ir[0].raw ?? '').includes('const')).toBe(true);
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

  it('respects animation option', () => {
    const withAnim = runPipeline('Hello', { animation: true });
    const withoutAnim = runPipeline('Hello', { animation: false });
    expect(withAnim[0].animate).toBe('block');
    expect(withoutAnim[0].animate).toBeUndefined();
  });
});
