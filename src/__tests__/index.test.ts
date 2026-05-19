import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  render,
  resolvePlatform,
  StreamingProcessor,
  XMarkdownMini,
  adaptNodes,
  adaptToPlatform,
  toAlipayNodes,
  toWechatNodes,
  parse,
  parseInline,
  irToUnifiedNodes,
  runPipeline,
  PLATFORM_CAPABILITIES,
  PLATFORM_ADAPTER_CONFIG,
} from '../index.js';
import type { UnifiedNode } from '../index.js';

type Globalish = Record<string, unknown>;

const RUNTIMES = ['my', 'wx'] as const;

function clearRuntimes(): void {
  const g = globalThis as unknown as Globalish;
  for (const key of RUNTIMES) {
    delete g[key];
  }
}

function installRuntime(key: (typeof RUNTIMES)[number]): void {
  (globalThis as unknown as Globalish)[key] = { getSystemInfo: () => ({}) };
}

afterEach(() => {
  clearRuntimes();
});

describe('public re-exports', () => {
  it('re-exports the full public surface from src/index.ts', () => {
    expect(typeof render).toBe('function');
    expect(typeof resolvePlatform).toBe('function');
    expect(typeof StreamingProcessor).toBe('function');
    expect(typeof adaptNodes).toBe('function');
    expect(typeof adaptToPlatform).toBe('function');
    expect(typeof toAlipayNodes).toBe('function');
    expect(typeof toWechatNodes).toBe('function');
    expect(typeof parse).toBe('function');
    expect(typeof parseInline).toBe('function');
    expect(typeof irToUnifiedNodes).toBe('function');
    expect(typeof runPipeline).toBe('function');
    expect(PLATFORM_CAPABILITIES).toBeDefined();
    expect(PLATFORM_ADAPTER_CONFIG).toBeDefined();
  });
});

describe('resolvePlatform / detectPlatformRuntime', () => {
  it('returns the given platform when not auto', () => {
    expect(resolvePlatform('wechat')).toBe('wechat');
    expect(resolvePlatform('alipay')).toBe('alipay');
  });

  it('treats undefined/auto as runtime detection', () => {
    clearRuntimes();
    expect(resolvePlatform()).toBe('alipay'); // default fallback
    installRuntime('wx');
    expect(resolvePlatform('auto')).toBe('wechat');
  });

  it('detects all known runtimes', () => {
    const mapping: Array<[(typeof RUNTIMES)[number], string]> = [
      ['my', 'alipay'],
      ['wx', 'wechat'],
    ];
    for (const [key, expected] of mapping) {
      clearRuntimes();
      installRuntime(key);
      expect(resolvePlatform('auto')).toBe(expected);
    }
  });

  it('ignores runtimes that exist but lack getSystemInfo*', () => {
    clearRuntimes();
    (globalThis as unknown as Globalish).wx = { something: 'else' };
    expect(resolvePlatform('auto')).toBe('alipay');
  });

  it('accepts getSystemInfoSync as a valid runtime marker', () => {
    clearRuntimes();
    (globalThis as unknown as Globalish).wx = { getSystemInfoSync: () => ({}) };
    expect(resolvePlatform('auto')).toBe('wechat');
  });

  it('ignores non-object runtime globals', () => {
    clearRuntimes();
    (globalThis as unknown as Globalish).my = 'not-an-object';
    expect(resolvePlatform('auto')).toBe('alipay'); // falls through to default
  });

  it('does not throw when globalThis is unavailable', () => {
    const root = globalThis as unknown as Globalish;
    const descriptor = Object.getOwnPropertyDescriptor(root, 'globalThis');
    let platform: string | undefined;

    try {
      delete root.globalThis;
      platform = resolvePlatform('auto');
    } finally {
      if (descriptor) Object.defineProperty(root, 'globalThis', descriptor);
    }

    expect(platform).toBe('alipay');
  });
});

describe('render (one-shot)', () => {
  it('returns adapted nodes when streaming is falsy', () => {
    const start = vi.fn();
    const done = vi.fn();
    const progress = vi.fn();
    const nodes = render({
      content: '# Hi\n\nPara.',
      platform: 'wechat',
      streaming: false,
      onRenderStart: start,
      onRenderComplete: done,
      onRenderProgress: progress,
    });
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes[0].name).toBe('h1');
    expect(start).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(1);
    expect(progress).not.toHaveBeenCalled();
  });

  it('omits streaming arg → goes through one-shot path', () => {
    const nodes = render({ content: '# Hi', platform: 'alipay' });
    expect(nodes[0].name).toBe('h1');
  });

  it('uses auto-detected platform when none is provided', () => {
    clearRuntimes();
    installRuntime('wx');
    const nodes = render({
      content: 'A [x](http://e.com)',
    });
    // WeChat adapter rewrites <a href> → data-href
    const para = nodes[0];
    const anchor = (para.children ?? []).find((c) => c.name === 'a');
    expect(anchor?.attrs?.['data-href']).toBe('http://e.com');
    expect(anchor?.attrs?.href).toBeUndefined();
  });
});

describe('render (streaming)', () => {
  it('streaming=true uses default semantic config and emits patches via onPatch', () => {
    const patches: UnifiedNode[][] = [];
    const onPatch = (nodes: UnifiedNode[]): void => {
      patches.push(nodes);
    };
    const onRenderStart = vi.fn();
    const onRenderProgress = vi.fn();
    const onRenderComplete = vi.fn();

    const r1 = render({
      content: '# Hi',
      platform: 'wechat',
      streaming: true, // hasNextChunk: true → no completion
      onPatch,
      onRenderStart,
      onRenderProgress,
      onRenderComplete,
    });
    expect(r1).toEqual([]);
    expect(onRenderStart).toHaveBeenCalledTimes(1);
    expect(onRenderProgress).toHaveBeenCalled();
    expect(patches.length).toBe(1);
    expect(onRenderComplete).not.toHaveBeenCalled();

    // explicit { hasNextChunk: false } finishes; onRenderStart still fires only once
    const r2 = render({
      content: '# Hi\n\nFinal.',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch,
      onRenderStart,
      onRenderComplete,
    });
    expect(r2).toEqual([]);
    // onRenderStart not called again — same active stream session
    expect(onRenderStart).toHaveBeenCalledTimes(1);
    expect(onRenderComplete).toHaveBeenCalledTimes(1);
  });

  it('streaming as StreamingConfig object with semantic=false / no animation works', () => {
    const patches: UnifiedNode[][] = [];
    render({
      content: 'Para one.',
      platform: 'wechat',
      streaming: { hasNextChunk: false, semantic: false, enableAnimation: false },
      onPatch: (nodes) => patches.push(nodes),
    });
    expect(patches.length).toBeGreaterThanOrEqual(1);
  });

  it('streaming with semantic config object propagates delimiters/maxChunkSize', () => {
    const patches: UnifiedNode[][] = [];
    render({
      content: 'Hello, world.',
      platform: 'wechat',
      streaming: {
        hasNextChunk: false,
        semantic: { maxChunkSize: 4 },
      },
      onPatch: (nodes) => patches.push(nodes),
    });
    expect(patches.length).toBeGreaterThanOrEqual(1);
  });

  it('passes lexer options through to streaming pipeline', () => {
    const patches: UnifiedNode[][] = [];
    render({
      content: 'Line1\nLine2',
      platform: 'wechat',
      options: { breaks: true },
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => patches.push(nodes),
    });
    // <br> appears in the last patch when breaks=true
    const last = patches[patches.length - 1];
    const flat: UnifiedNode[] = [];
    const q = [...last];
    while (q.length) {
      const n = q.shift()!;
      flat.push(n);
      if (n.children) q.push(...n.children);
    }
    expect(flat.some((n) => n.name === 'br')).toBe(true);
  });
});

describe('XMarkdownMini — multi-instance isolation', () => {
  function extractText(nodes: UnifiedNode[]): string {
    let t = '';
    for (const n of nodes) {
      if (n.name === 'text' && typeof n.attrs?.value === 'string') {
        t += n.attrs.value;
      }
      if (n.children) t += extractText(n.children);
    }
    return t;
  }

  it('two instances streaming concurrently each receive their own patches', () => {
    const a = new XMarkdownMini();
    const b = new XMarkdownMini();

    const aPatches: UnifiedNode[][] = [];
    const bPatches: UnifiedNode[][] = [];

    // Start both streams without completion
    a.render({
      content: '# Aaa',
      platform: 'wechat',
      streaming: true,
      onPatch: (nodes) => aPatches.push(nodes),
    });
    b.render({
      content: '# Bbb',
      platform: 'wechat',
      streaming: true,
      onPatch: (nodes) => bPatches.push(nodes),
    });

    // Finish both
    a.render({
      content: '# Aaa\n\nDone-A',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => aPatches.push(nodes),
    });
    b.render({
      content: '# Bbb\n\nDone-B',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => bPatches.push(nodes),
    });

    const aFinal = extractText(aPatches[aPatches.length - 1]);
    const bFinal = extractText(bPatches[bPatches.length - 1]);

    expect(aFinal).toContain('Aaa');
    expect(aFinal).toContain('Done-A');
    expect(aFinal).not.toContain('Bbb');

    expect(bFinal).toContain('Bbb');
    expect(bFinal).toContain('Done-B');
    expect(bFinal).not.toContain('Aaa');
  });

  it('growing-prefix streaming updates accumulate (not duplicate)', () => {
    const md = new XMarkdownMini();
    const patches: UnifiedNode[][] = [];
    const onPatch = (n: UnifiedNode[]): void => {
      patches.push(n);
    };

    md.render({ content: '##', platform: 'wechat', streaming: true, onPatch });
    md.render({
      content: '## Headi',
      platform: 'wechat',
      streaming: true,
      onPatch,
    });
    md.render({
      content: '## Heading2',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch,
    });

    const last = patches[patches.length - 1];
    expect(last[0].name).toBe('h2');
    expect(extractText(last)).toBe('Heading2');
  });

  it('adapt:false skips platform adapter (raw unified nodes)', () => {
    const md = new XMarkdownMini({ adapt: false });
    const patches: UnifiedNode[][] = [];
    md.render({
      content: 'A [x](http://e.com)',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => patches.push(nodes),
    });
    const last = patches[patches.length - 1];
    const para = last[0];
    const anchor = (para.children ?? []).find((c) => c.name === 'a');
    // wechat adapter would rewrite href→data-href; with adapt:false, href stays
    expect(anchor?.attrs?.href).toBe('http://e.com');
    expect(anchor?.attrs?.['data-href']).toBeUndefined();
  });

  it('one-shot render fires onPatch with the final adapted nodes', () => {
    const md = new XMarkdownMini();
    const patches: UnifiedNode[][] = [];
    const nodes = md.render({
      content: '# Hi',
      platform: 'wechat',
      streaming: false,
      onPatch: (n) => patches.push(n),
    });
    expect(patches.length).toBe(1);
    expect(nodes[0].name).toBe('h1');
    expect(patches[0][0].name).toBe('h1');
  });

  it('reset() clears in-flight stream state', () => {
    const md = new XMarkdownMini();
    const patches: UnifiedNode[][] = [];
    md.render({
      content: '# Hi',
      platform: 'wechat',
      streaming: true,
      onPatch: (n) => patches.push(n),
    });
    md.reset();
    // After reset, a new render starts fresh — onRenderStart fires again
    const onRenderStart = vi.fn();
    md.render({
      content: '# Fresh',
      platform: 'wechat',
      streaming: true,
      onRenderStart,
      onPatch: (n) => patches.push(n),
    });
    expect(onRenderStart).toHaveBeenCalledTimes(1);
  });
});
