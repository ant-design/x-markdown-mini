import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StreamingProcessor } from '../streaming/index.js';
import { tokensToWechat } from '../platforms/wechat/tokensToWechat.js';
import type { MiniNode } from '../types.js';

interface Collector {
  patches: MiniNode[][];
  updates: string[];
  completed: boolean;
}

interface MakeOpts {
  semanticEnabled?: boolean;
  delimiters?: RegExp;
  maxChunkSize?: number;
  chunkDelay?: number | number[];
  charDelay?: number | number[];
  /** Transformer context (folded into a tokensToWechat closure for tests). */
  gfm?: boolean;
  breaks?: boolean;
  escapeText?: boolean;
  animation?: boolean;
}

function make(opts: MakeOpts = {}): { proc: StreamingProcessor; collector: Collector } {
  const collector: Collector = { patches: [], updates: [], completed: false };
  const transform = (md: string): MiniNode[] =>
    tokensToWechat(md, {
      options: { gfm: opts.gfm, breaks: opts.breaks },
      escapeText: opts.escapeText,
      animation: opts.animation,
    });
  const proc = new StreamingProcessor({
    transform,
    onUpdate: (md) => collector.updates.push(md),
    onPatch: (nodes) => collector.patches.push(nodes),
    onComplete: () => {
      collector.completed = true;
    },
    semanticEnabled: opts.semanticEnabled,
    delimiters: opts.delimiters,
    maxChunkSize: opts.maxChunkSize,
    chunkDelay: opts.chunkDelay,
    charDelay: opts.charDelay,
  });
  return { proc, collector };
}

describe('StreamingProcessor — getters', () => {
  it('getRenderedText reflects the text already emitted', () => {
    const { proc, collector } = make({ chunkDelay: 0, charDelay: 0 });
    proc.handleContentUpdate('hello world');
    proc.runRenderLoop(false);
    expect(proc.getRenderedText()).toBe('hello world');
    expect(collector.completed).toBe(true);
  });

  it('hasPendingChunks reports remaining work', () => {
    const { proc } = make({ chunkDelay: 5, charDelay: 0 });
    proc.handleContentUpdate('abc. def. ghi.');
    proc.runRenderLoop(true);
    // Typewriter mode → pending chunks should exist before timers fire
    expect(proc.hasPendingChunks()).toBe(true);
    proc.reset();
    expect(proc.hasPendingChunks()).toBe(false);
  });
});

describe('StreamingProcessor — reset / non-prefix updates', () => {
  it('reset clears state and timers', () => {
    const { proc } = make({ chunkDelay: 10, charDelay: 0 });
    proc.handleContentUpdate('abc. def.');
    proc.runRenderLoop(true);
    proc.reset();
    expect(proc.getRenderedText()).toBe('');
    expect(proc.hasPendingChunks()).toBe(false);
  });

  it('non-prefix content resets and uses new content as buffer', () => {
    const { proc, collector } = make({ chunkDelay: 0, charDelay: 0 });
    proc.handleContentUpdate('# Initial');
    proc.runRenderLoop(true);
    proc.handleContentUpdate('## Different start');
    proc.runRenderLoop(false);
    const last = collector.patches[collector.patches.length - 1];
    expect(last[0].name).toBe('h2');
  });
});

describe('StreamingProcessor — typewriter mode (fake timers)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('chunkDelay > 0 advances by semantic chunks and completes after flush', () => {
    const { proc, collector } = make({ chunkDelay: 10, charDelay: 0 });
    proc.handleContentUpdate('一句一。二句二。');
    proc.runRenderLoop(false);
    // First chunk fires immediately (initial timeout = 0)
    vi.runAllTimers();
    expect(collector.completed).toBe(true);
    // Multiple patches emitted, one per chunk
    expect(collector.patches.length).toBeGreaterThanOrEqual(2);
    expect(proc.getRenderedText()).toBe('一句一。二句二。');
  });

  it('charDelay > 0 yields per-character flushes', () => {
    const { proc, collector } = make({ chunkDelay: 5, charDelay: 5 });
    proc.handleContentUpdate('abcde');
    proc.runRenderLoop(false);
    vi.runAllTimers();
    // 5 chars + final scheduling
    expect(collector.completed).toBe(true);
    // At least one patch per character
    expect(collector.patches.length).toBeGreaterThanOrEqual(5);
    expect(proc.getRenderedText()).toBe('abcde');
  });

  it('typewriter loop does not complete while hasNextChunk=true; completes after a final hasNext=false push', () => {
    const { proc, collector } = make({ chunkDelay: 10, charDelay: 0 });
    proc.handleContentUpdate('hello. world.');
    proc.runRenderLoop(true);
    // Advance bounded — typewriter polls while hasNextChunk=true
    vi.advanceTimersByTime(1000);
    expect(collector.completed).toBe(false);
    proc.reset(); // stop the polling timer chain

    // Provide content, then finish
    const next = make({ chunkDelay: 10, charDelay: 0 });
    next.proc.handleContentUpdate('hello. world. final.');
    next.proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(next.collector.completed).toBe(true);
  });

  it('splitIntoChunks (semanticEnabled=false) splits by maxChunkSize while hasNextChunk=true', () => {
    const { proc, collector } = make({
      chunkDelay: 5,
      charDelay: 0,
      semanticEnabled: false,
      maxChunkSize: 4,
    });
    proc.handleContentUpdate('abcdefghij');
    proc.runRenderLoop(true);
    vi.advanceTimersByTime(1000);
    // hasNextChunk=true → tail under maxChunkSize remains buffered, rendered is multiple of 4
    expect(proc.getRenderedText().length % 4).toBe(0);
    expect(proc.getRenderedText().length).toBeGreaterThan(0);
    expect(collector.patches.length).toBeGreaterThan(0);
    proc.reset();

    // Fresh processor, finish path
    const last = make({ chunkDelay: 5, charDelay: 0, semanticEnabled: false, maxChunkSize: 4 });
    last.proc.handleContentUpdate('abcdefghij');
    last.proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(last.proc.getRenderedText()).toBe('abcdefghij');
    expect(last.collector.completed).toBe(true);
  });

  it('splitIntoChunks (semanticEnabled=true): no delimiter + over maxChunkSize + hasNext=true → slice by maxChunkSize', () => {
    const long = 'a'.repeat(100); // no delimiters
    const { proc, collector } = make({
      chunkDelay: 5,
      charDelay: 0,
      semanticEnabled: true,
      maxChunkSize: 10,
    });
    proc.handleContentUpdate(long);
    proc.runRenderLoop(true);
    vi.advanceTimersByTime(1000);
    // hasNextChunk=true with no delimiters → forced chunks of 10
    expect(proc.getRenderedText().length % 10).toBe(0);
    expect(proc.getRenderedText().length).toBeGreaterThan(0);
    expect(collector.completed).toBe(false);
    proc.reset();
  });

  it('typewriter loop processes buffer left after splitIntoChunks (re-split branch)', () => {
    // Set up a state where, mid-typewriter, a new push appends more content.
    const { proc, collector } = make({ chunkDelay: 10, charDelay: 0 });
    proc.handleContentUpdate('one. two. three. four. five.');
    proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(proc.getRenderedText()).toBe('one. two. three. four. five.');
    expect(collector.completed).toBe(true);
  });

  it('typewriter loop preserves pending chunks when new content arrives mid-render', () => {
    const { proc } = make({ chunkDelay: 10, charDelay: 0, delimiters: /\./ });

    proc.handleContentUpdate('one. two.');
    proc.runRenderLoop(true);
    vi.advanceTimersByTime(0);
    expect(proc.getRenderedText()).toBe('one.');

    proc.handleContentUpdate('one. two. three.');
    proc.runRenderLoop(false);
    vi.runAllTimers();

    expect(proc.getRenderedText()).toBe('one. two. three.');
  });

  it('typewriter mode also triggers advanceCommit (double-blank between blocks)', () => {
    const md = '# A\n\n\nParagraph here. Another sentence.';
    const { proc, collector } = make({ chunkDelay: 5, charDelay: 0 });
    proc.handleContentUpdate(md);
    proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(collector.completed).toBe(true);
    const last = collector.patches[collector.patches.length - 1];
    // h1 from committed segment and paragraph from tail
    expect(last[0].name).toBe('h1');
  });

  it('does not drop the first character after committing a chunk that ends with blank lines', () => {
    const { proc, collector } = make({ chunkDelay: 5, charDelay: 0 });
    proc.handleContentUpdate('Alpha.\n\n## Heading\n\n```ts\nconst x = 1;\n```\n');
    proc.runRenderLoop(false);
    vi.runAllTimers();

    const last = collector.patches[collector.patches.length - 1];
    expect(textContent(last)).toContain('Heading');
    expect(textContent(last)).toContain('const x = 1;');
    expect(last.some((n) => n.name === 'h2')).toBe(true);
    expect(last.some((n) => n.name === 'pre')).toBe(true);
  });
});

describe('StreamingProcessor — advanceCommit + fence handling (sync mode)', () => {
  it('does not commit while inside an open fenced code block', () => {
    const md = '```js\nconst x = 1;\n\n\n```\nafter\n';
    const { proc, collector } = make({ chunkDelay: 0, charDelay: 0 });
    proc.handleContentUpdate(md);
    proc.runRenderLoop(false);
    // Final pass renders full document including the closed code block
    const last = collector.patches[collector.patches.length - 1];
    expect(last.some((n) => n.name === 'pre')).toBe(true);
    expect(collector.completed).toBe(true);
  });

  it('commits stable prefix before tail when double blank line outside fence is seen', () => {
    const { proc, collector } = make({ chunkDelay: 0, charDelay: 0 });
    proc.handleContentUpdate('# Stable\n\n\nTail');
    proc.runRenderLoop(true);
    const snapshot = JSON.stringify(collector.patches[collector.patches.length - 1][0]);
    proc.handleContentUpdate('# Stable\n\n\nTail more text');
    proc.runRenderLoop(true);
    const after = JSON.stringify(collector.patches[collector.patches.length - 1][0]);
    expect(after).toBe(snapshot);
  });

  it('tilde fence (~~~) is matched on close', () => {
    const md = '~~~py\nval = 1\n~~~\n';
    const { proc, collector } = make({ chunkDelay: 0, charDelay: 0 });
    proc.handleContentUpdate(md);
    proc.runRenderLoop(false);
    expect(collector.completed).toBe(true);
    expect(collector.patches[collector.patches.length - 1].some((n) => n.name === 'pre')).toBe(true);
  });
});

describe('StreamingProcessor — config propagation', () => {
  it('passes options to internal parse calls (breaks=true → <br>)', () => {
    const { proc, collector } = make({
      chunkDelay: 0,
      charDelay: 0,
      breaks: true,
    });
    proc.handleContentUpdate('line one\nline two');
    proc.runRenderLoop(false);
    const last = collector.patches[collector.patches.length - 1];
    const flat: MiniNode[] = [];
    const q = [...last];
    while (q.length) {
      const n = q.shift()!;
      flat.push(n);
      if (n.children) q.push(...n.children);
    }
    expect(flat.some((n) => n.name === 'br')).toBe(true);
  });

  it('escapeText=false propagates through to inline text (component mode)', () => {
    const { proc, collector } = make({
      chunkDelay: 0,
      charDelay: 0,
      escapeText: false,
    });
    proc.handleContentUpdate('a < b & "c"');
    proc.runRenderLoop(false);
    const last = collector.patches[collector.patches.length - 1];
    const flat: MiniNode[] = [];
    const q = [...last];
    while (q.length) {
      const n = q.shift()!;
      flat.push(n);
      if (n.children) q.push(...n.children);
    }
    const text = flat.find((n) => n.name === 'text');
    const val = String(text?.attrs?.value ?? '');
    expect(val).toContain('<');
    expect(val).toContain('&');
    expect(val).not.toContain('&lt;');
  });

  it('animation=true on streaming output passes through to nodes', () => {
    const { proc, collector } = make({
      chunkDelay: 0,
      charDelay: 0,
      animation: true,
    });
    proc.handleContentUpdate('# Hi');
    proc.runRenderLoop(false);
    const last = collector.patches[collector.patches.length - 1];
    expect(last[0].animate).toBe(true);
  });
});

describe('StreamingProcessor — variable-speed (array) timing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts array charDelay/chunkDelay and renders the full text', () => {
    const { proc, collector } = make({
      chunkDelay: [30, 20, 0],
      charDelay: [20, 10, 5],
    });
    proc.handleContentUpdate('一句一。二句二。三句三。');
    proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(collector.completed).toBe(true);
    expect(proc.getRenderedText()).toBe('一句一。二句二。三句三。');
    // Per-character flushes → many patches
    expect(collector.patches.length).toBeGreaterThanOrEqual(5);
  });

  it('array delay of all-zeros behaves like immediate (synchronous) flush', () => {
    const { proc, collector } = make({ chunkDelay: [0, 0], charDelay: [0, 0] });
    proc.handleContentUpdate('hello world');
    proc.runRenderLoop(false);
    // No timers needed — immediate path
    expect(proc.getRenderedText()).toBe('hello world');
    expect(collector.completed).toBe(true);
  });

  it('never splits an emoji surrogate pair across char-step updates', () => {
    const text = 'ab😀cd🎉ef';
    const { proc, collector } = make({ chunkDelay: [5], charDelay: [5] });
    proc.handleContentUpdate(text);
    proc.runRenderLoop(false);
    vi.runAllTimers();
    expect(proc.getRenderedText()).toBe(text);
    // Every intermediate update must be free of a lone (unpaired) surrogate
    for (const u of collector.updates) {
      expect(hasLoneSurrogate(u)).toBe(false);
    }
  });
});

function hasLoneSurrogate(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      // high surrogate must be followed by a low surrogate
      const next = i + 1 < s.length ? s.charCodeAt(i + 1) : 0;
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
      i++;
    } else if (c >= 0xdc00 && c <= 0xdfff) {
      // lone low surrogate
      return true;
    }
  }
  return false;
}

function textContent(nodes: MiniNode[]): string {
  const out: string[] = [];
  const q = [...nodes];
  while (q.length) {
    const n = q.shift()!;
    if (n.name === 'text') out.push(String(n.attrs?.value ?? ''));
    if (n.children) q.push(...n.children);
  }
  return out.join('');
}
