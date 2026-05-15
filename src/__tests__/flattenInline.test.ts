import { describe, it, expect } from 'vitest';
import { runPipeline } from '../pipeline.js';
import { flattenInlineNodes } from '../components/shared/flattenInline.js';
import type { UnifiedNode } from '../types.js';

function findFirst(nodes: UnifiedNode[], pred: (n: UnifiedNode) => boolean): UnifiedNode | undefined {
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
    const nodes = runPipeline('plain **bold _italic_** tail', { escapeText: false });
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
    const nodes = runPipeline('see [a **strong** link](https://e.com)', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const anchor = findFirst(flat, (n) => n.name === 'a');
    expect(anchor).toBeTruthy();
    expect(anchor!.attrs?.href).toBe('https://e.com');
    const innerNames = (anchor!.children ?? []).map((c) => c.name);
    expect(innerNames.every((n) => n === 'text' || n === 'br' || n === 'img')).toBe(true);
    const strongRun = (anchor!.children ?? []).find((c) =>
      String(c.attrs?.class ?? '').includes('md-strong')
    );
    expect(strongRun).toBeTruthy();
    expect(String(strongRun?.attrs?.value ?? '')).toContain('strong');
  });

  it('preserves inline-code class on flattened run', () => {
    const nodes = runPipeline('use `npm` here', { escapeText: false });
    const flat = flattenInlineNodes(nodes);
    const codeRun = findFirst(flat, (n) =>
      n.name === 'text' && String(n.attrs?.class ?? '').includes('md-inline-code')
    );
    expect(codeRun).toBeTruthy();
    expect(String(codeRun?.attrs?.value ?? '')).toBe('npm');
  });
});
