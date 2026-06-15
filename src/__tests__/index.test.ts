import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  parse,
  render,
  renderNodes,
  resolvePlatform,
  StreamingProcessor,
  XMarkdownMini,
  tokensToWechat,
  tokensToAlipay,
  getPlatformRenderer,
  registerPlatformRenderer,
  copyButton,
} from '../index.js';
import type { MiniNode } from '../index.js';

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
    expect(typeof parse).toBe('function');
    expect(typeof renderNodes).toBe('function');
    expect(typeof resolvePlatform).toBe('function');
    expect(typeof StreamingProcessor).toBe('function');
    expect(typeof tokensToWechat).toBe('function');
    expect(typeof tokensToAlipay).toBe('function');
    expect(typeof getPlatformRenderer).toBe('function');
    expect(typeof registerPlatformRenderer).toBe('function');
  });
});

describe('platform renderers', () => {
  it('exposes renderer capabilities for supported platforms', () => {
    const wechat = getPlatformRenderer('wechat');
    const alipay = getPlatformRenderer('alipay');

    expect(wechat.name).toBe('wechat');
    expect(wechat.capabilities.anchorHrefMode).toBe('data-href');
    expect(alipay.name).toBe('alipay');
    expect(alipay.capabilities.requiresHttpsImage).toBe(true);
    expect(typeof wechat.renderTokens).toBe('function');
  });

  it('supports registering a custom platform renderer', () => {
    registerPlatformRenderer({
      name: 'custom',
      capabilities: {
        supportsOlStart: false,
        requiresHttpsImage: false,
        anchorHrefMode: 'href',
        supportsTable: false,
        supportsPre: false,
        supportsBlockquote: false,
      },
      renderTokens: () => [{ name: 'custom-node' }],
    });

    expect(getPlatformRenderer('custom').name).toBe('custom');
    const nodes = renderNodes({ content: '# Hi', platform: 'custom' });
    expect(nodes).toEqual([{ name: 'custom-node' }]);
  });
});

describe('render / parse token API', () => {
  it('returns marked tokens without platform rendering', () => {
    const tokens = render('# Hi');
    expect(tokens[0].type).toBe('heading');
    expect(JSON.stringify(tokens)).not.toContain('data-href');
  });

  it('parse is the explicit alias for the token API', () => {
    const tokens = parse('A [x](http://e.com)');
    expect(tokens[0].type).toBe('paragraph');
  });

  it('supports AI streaming optimization while returning marked tokens', () => {
    const patches: unknown[][] = [];
    const complete = vi.fn();

    const r1 = render({
      content: 'hello **wor',
      streaming: true,
      onPatch: (tokens) => patches.push(tokens),
      onRenderComplete: complete,
    });
    expect(r1).toEqual([]);
    expect(patches.length).toBe(1);
    expect(JSON.stringify(patches[0])).toContain('strong');
    expect(complete).not.toHaveBeenCalled();

    render({
      content: 'hello **world**',
      streaming: { hasNextChunk: false },
      onPatch: (tokens) => patches.push(tokens),
      onRenderComplete: complete,
    });
    expect(complete).toHaveBeenCalledTimes(1);
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
    const nodes = renderNodes({
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
    const nodes = renderNodes({ content: '# Hi', platform: 'alipay' });
    expect(nodes[0].name).toBe('h1');
  });

  it('uses auto-detected platform when none is provided', () => {
    clearRuntimes();
    installRuntime('wx');
    const nodes = renderNodes({
      content: 'A [x](http://e.com)',
    });
    // tokensToWechat rewrites <a href> → data-href
    const para = nodes[0];
    const anchor = (para.children ?? []).find((c) => c.name === 'a');
    expect(anchor?.attrs?.['data-href']).toBe('http://e.com');
    expect(anchor?.attrs?.href).toBeUndefined();
  });
});

describe('render (streaming)', () => {
  it('streaming=true uses default semantic config and emits patches via onPatch', () => {
    const patches: MiniNode[][] = [];
    const onPatch = (nodes: MiniNode[]): void => {
      patches.push(nodes);
    };
    const onRenderStart = vi.fn();
    const onRenderProgress = vi.fn();
    const onRenderComplete = vi.fn();

    const r1 = renderNodes({
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
    const r2 = renderNodes({
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
    const patches: MiniNode[][] = [];
    renderNodes({
      content: 'Para one.',
      platform: 'wechat',
      streaming: { hasNextChunk: false, semantic: false, enableAnimation: false },
      onPatch: (nodes) => patches.push(nodes),
    });
    expect(patches.length).toBeGreaterThanOrEqual(1);
  });

  it('streaming with semantic config object propagates delimiters/maxChunkSize', () => {
    const patches: MiniNode[][] = [];
    renderNodes({
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
    const patches: MiniNode[][] = [];
    renderNodes({
      content: 'Line1\nLine2',
      platform: 'wechat',
      breaks: true,
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => patches.push(nodes),
    });
    // <br> appears in the last patch when breaks=true
    const last = patches[patches.length - 1];
    const flat: MiniNode[] = [];
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
  function extractText(nodes: MiniNode[]): string {
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

    const aPatches: MiniNode[][] = [];
    const bPatches: MiniNode[][] = [];

    // Start both streams without completion
    a.renderNodes({
      content: '# Aaa',
      platform: 'wechat',
      streaming: true,
      onPatch: (nodes) => aPatches.push(nodes),
    });
    b.renderNodes({
      content: '# Bbb',
      platform: 'wechat',
      streaming: true,
      onPatch: (nodes) => bPatches.push(nodes),
    });

    // Finish both
    a.renderNodes({
      content: '# Aaa\n\nDone-A',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch: (nodes) => aPatches.push(nodes),
    });
    b.renderNodes({
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
    const patches: MiniNode[][] = [];
    const onPatch = (n: MiniNode[]): void => {
      patches.push(n);
    };

    md.renderNodes({ content: '##', platform: 'wechat', streaming: true, onPatch });
    md.renderNodes({
      content: '## Headi',
      platform: 'wechat',
      streaming: true,
      onPatch,
    });
    md.renderNodes({
      content: '## Heading2',
      platform: 'wechat',
      streaming: { hasNextChunk: false },
      onPatch,
    });

    const last = patches[patches.length - 1];
    expect(last[0].name).toBe('h2');
    expect(extractText(last)).toBe('Heading2');
  });

  it('one-shot render fires onPatch with the final adapted nodes', () => {
    const md = new XMarkdownMini();
    const patches: MiniNode[][] = [];
    const nodes = md.renderNodes({
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
    const patches: MiniNode[][] = [];
    md.renderNodes({
      content: '# Hi',
      platform: 'wechat',
      streaming: true,
      onPatch: (n) => patches.push(n),
    });
    md.reset();
    // After reset, a new render starts fresh — onRenderStart fires again
    const onRenderStart = vi.fn();
    md.renderNodes({
      content: '# Fresh',
      platform: 'wechat',
      streaming: true,
      onRenderStart,
      onPatch: (n) => patches.push(n),
    });
    expect(onRenderStart).toHaveBeenCalledTimes(1);
  });
});

describe('code/table header options', () => {
  function findDeep(nodes: any[], name: string): any {
    const q = [...nodes];
    while (q.length) {
      const n = q.shift();
      if (n.name === name) return n;
      if (n.children) q.push(...n.children);
    }
    return undefined;
  }

  it('renders default headers and disables them via options', () => {
    const on = new XMarkdownMini().renderNodes({ content: '```ts\nx\n```', platform: 'alipay' });
    expect(findDeep(on, 'pre').header).toBeDefined();

    const off = new XMarkdownMini({ codeBlock: { header: false }, table: { header: false } });
    const codeNodes = off.renderNodes({ content: '```ts\nx\n```', platform: 'alipay' });
    expect(findDeep(codeNodes, 'pre').header).toBeUndefined();
    const tableNodes = off.renderNodes({ content: '| a |\n| - |\n| 1 |', platform: 'alipay' });
    expect(findDeep(tableNodes, 'table').header).toBeUndefined();
  });

  it('exports copyButton from the package root', () => {
    expect(copyButton('z')).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'z', class: 'md-copy-icon' } });
  });
});
