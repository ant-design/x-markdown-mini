import { describe, it, expect, vi } from 'vitest';
import { StreamingProcessor } from '../streaming/StreamingProcessor.js';
import { tokensToWechat } from '../platforms/wechat/tokensToWechat.js';
import { XMarkdownMini } from '../index.js';
import CodeHighlight from '../plugins/CodeHighlight/index.js';
import Latex from '../plugins/Latex/index.js';
import type { MiniNode } from '../types.js';

/** Flatten a MiniNode tree to a flat list for easy assertions. */
function flatten(nodes: MiniNode[]): MiniNode[] {
  const out: MiniNode[] = [];
  const q = [...nodes];
  while (q.length) {
    const n = q.shift()!;
    out.push(n);
    if (n.children) q.push(...n.children);
  }
  return out;
}

/** Concatenate all text node values in a tree. */
function textContent(nodes: MiniNode[]): string {
  return flatten(nodes)
    .filter((n) => n.name === 'text')
    .map((n) => String(n.attrs?.value ?? ''))
    .join('');
}

describe('StreamingProcessor — fixup wiring', () => {
  it('fixup is invoked on tail content before transform', () => {
    const seen: string[] = [];
    const fixup = (s: string): string => {
      seen.push(s);
      return s;
    };
    const proc = new StreamingProcessor({
      transform: (md) => tokensToWechat(md),
      fixup,
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: () => {},
      onComplete: () => {},
    });
    proc.handleContentUpdate('hello world');
    proc.runRenderLoop(true);
    expect(seen).toEqual(['hello world']);
  });

  it('passes fixed markdown into transform before any lex/render work', () => {
    const transformed: string[] = [];
    const proc = new StreamingProcessor({
      transform: (md) => {
        transformed.push(md);
        return tokensToWechat(md);
      },
      fixup: (tail) => `${tail} [fixed]`,
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: () => {},
      onComplete: () => {},
    });

    proc.handleContentUpdate('hello');
    proc.runRenderLoop(true);

    expect(transformed).toEqual(['hello [fixed]']);
  });

  it('fixup is NOT invoked on committed prefix (only on tail)', () => {
    const seen: string[] = [];
    const fixup = (s: string): string => {
      seen.push(s);
      return s;
    };
    const proc = new StreamingProcessor({
      transform: (md) => tokensToWechat(md),
      fixup,
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: () => {},
      onComplete: () => {},
    });
    proc.handleContentUpdate('# Stable\n\n\nTail line');
    proc.runRenderLoop(true);
    // The stable prefix '# Stable\n\n\n' (terminated by double blank line) must
    // not be passed to fixup; only the tail 'Tail line' should appear.
    expect(seen).toEqual(['Tail line']);
  });

  it('getRenderedText returns original markdown, not fixed-up tail', () => {
    const fixup = (s: string): string => `[FIXED:${s}]`;
    const patches: MiniNode[][] = [];
    const proc = new StreamingProcessor({
      transform: (md) => tokensToWechat(md),
      fixup,
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: (nodes) => patches.push(nodes),
      onComplete: () => {},
    });
    proc.handleContentUpdate('hello **wor');
    proc.runRenderLoop(true);
    expect(proc.getRenderedText()).toBe('hello **wor');
  });

  it('no fixup (undefined): unclosed bold remains literal — regression baseline', () => {
    const patches: MiniNode[][] = [];
    const proc = new StreamingProcessor({
      transform: (md) => tokensToWechat(md),
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: (nodes) => patches.push(nodes),
      onComplete: () => {},
    });
    proc.handleContentUpdate('hello **wor');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'strong')).toBe(false);
    expect(textContent(last)).toContain('**wor');
  });
});

describe('StreamingProcessor + remend integration', () => {
  // Use remend directly as the fixup function — exercises the real wiring.
  // The integration is what we actually ship; this guards the contract that
  // remend's output can be re-parsed by marked into the expected token shapes.
  async function makeRemendProc() {
    const { default: remend } = await import('remend');
    const patches: MiniNode[][] = [];
    const proc = new StreamingProcessor({
      transform: (md) => tokensToWechat(md),
      fixup: (tail: string) => remend(tail),
      chunkDelay: 0,
      charDelay: 0,
      onUpdate: () => {},
      onPatch: (nodes) => patches.push(nodes),
      onComplete: () => {},
    });
    return { proc, patches };
  }

  it('closes unclosed **bold during streaming', async () => {
    const { proc, patches } = await makeRemendProc();
    proc.handleContentUpdate('hello **world');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'strong')).toBe(true);
  });

  it('closes unclosed inline `code` during streaming', async () => {
    const { proc, patches } = await makeRemendProc();
    proc.handleContentUpdate('see `x = 1');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'code')).toBe(true);
  });

  it('closes unclosed [text](url during streaming', async () => {
    const { proc, patches } = await makeRemendProc();
    proc.handleContentUpdate('visit [the docs](https://exa');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'a')).toBe(true);
  });

  it('closes unclosed *italic during streaming', async () => {
    const { proc, patches } = await makeRemendProc();
    proc.handleContentUpdate('this is *important');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'em')).toBe(true);
  });

  it('closes unclosed ~~strikethrough during streaming', async () => {
    const { proc, patches } = await makeRemendProc();
    proc.handleContentUpdate('this is ~~gone');
    proc.runRenderLoop(true);
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'del')).toBe(true);
  });
});

describe('XMarkdownMini — streamingFixup option', () => {
  it('default streamingFixup uses remend (closes unclosed **bold)', () => {
    const md = new XMarkdownMini();
    const patches: MiniNode[][] = [];
    md.renderNodes({
      content: 'hello **world',
      streaming: { hasNextChunk: true },
      onPatch: (nodes) => patches.push(nodes),
    });
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'strong')).toBe(true);
  });

  it('streamingFixup: false disables fixup — unclosed remains literal', () => {
    const md = new XMarkdownMini({ streamingFixup: false });
    const patches: MiniNode[][] = [];
    md.renderNodes({
      content: 'hello **world',
      streaming: { hasNextChunk: true },
      onPatch: (nodes) => patches.push(nodes),
    });
    const last = patches[patches.length - 1];
    expect(flatten(last).some((n) => n.name === 'strong')).toBe(false);
    expect(textContent(last)).toContain('**world');
  });

  it('custom streamingFixup function is called with the tail', () => {
    const spy = vi.fn((s: string) => s);
    const md = new XMarkdownMini({ streamingFixup: spy });
    md.renderNodes({
      content: 'plain content',
      streaming: { hasNextChunk: true },
      onPatch: () => {},
    });
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toBe('plain content');
  });

  it('one-shot (non-streaming) path does NOT invoke fixup', () => {
    const spy = vi.fn((s: string) => s);
    const md = new XMarkdownMini({ streamingFixup: spy });
    md.renderNodes({
      content: 'hello **world',
      onPatch: () => {},
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('default streamingFixup closes an open fenced code block so plugins can render while streaming', () => {
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const patches: MiniNode[][] = [];

    md.renderNodes({
      content: '```typescript\nconst answer: number = 42;',
      streaming: { hasNextChunk: true },
      onPatch: (nodes) => patches.push(nodes),
    });

    const flat = flatten(patches[patches.length - 1]);
    expect(flat.some((n) => n.name === 'pre')).toBe(true);
    expect(flat.some((n) => String(n.attrs?.class ?? '').includes('hljs language-typescript'))).toBe(true);
  });

  it('default streamingFixup closes an open block formula so Latex can render while streaming', () => {
    const md = new XMarkdownMini({
      extensions: [Latex({ katexOptions: { throwOnError: false } })],
    });
    const patches: MiniNode[][] = [];

    md.renderNodes({
      content: '$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}',
      streaming: { hasNextChunk: true },
      onPatch: (nodes) => patches.push(nodes),
    });

    const flat = flatten(patches[patches.length - 1]);
    expect(flat.some((n) => String(n.attrs?.class ?? '').includes('katex-display'))).toBe(true);
  });

  it('accepts top-level streaming delays even when semantic chunking is disabled', () => {
    vi.useFakeTimers();
    try {
      const md = new XMarkdownMini();
      const patches: MiniNode[][] = [];
      let completed = false;

      md.renderNodes({
        content: 'abcdefghij',
        streaming: {
          hasNextChunk: false,
          semantic: false,
          maxChunkSize: 4,
          chunkDelay: 10,
        },
        onPatch: (nodes) => patches.push(nodes),
        onRenderComplete: () => {
          completed = true;
        },
      });

      expect(patches.length).toBe(0);
      vi.runAllTimers();
      expect(completed).toBe(true);
      expect(textContent(patches[patches.length - 1])).toBe('abcdefghij');
      expect(patches.length).toBeGreaterThanOrEqual(3);
    } finally {
      vi.useRealTimers();
    }
  });
});
