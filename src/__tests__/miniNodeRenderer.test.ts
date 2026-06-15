import { describe, expect, it } from 'vitest';
import { Lexer } from 'marked';
import {
  renderTokensToMiniNodes,
  copyButton,
  type MiniNodePlatformAdapter,
} from '../platforms/shared/miniNodeRenderer.js';
import type { MiniNode } from '../types.js';

function flatten(nodes: MiniNode[]): MiniNode[] {
  const out: MiniNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const node = queue.shift()!;
    out.push(node);
    if (node.children) queue.push(...node.children);
  }
  return out;
}

function find(nodes: MiniNode[], name: string): MiniNode | undefined {
  return flatten(nodes).find((node) => node.name === name);
}

describe('renderTokensToMiniNodes', () => {
  it('keeps markdown semantics in the shared layer and delegates platform differences to the adapter', () => {
    const adapter: MiniNodePlatformAdapter = {
      linkAttrs: (href) => ({ 'data-url': href, role: 'link' }),
      imageSrc: (src) => src.replace(/^http:\/\//, 'https://'),
      olAttrs: (start) => {
        const attrs: Record<string, string | number | boolean> = {};
        if (start !== 1) attrs['data-start'] = start;
        return attrs;
      },
    };

    const tokens = Lexer.lex('3. [L](http://e.com)\n\n![alt](http://e.com/i.png)');
    const nodes = renderTokensToMiniNodes(tokens, adapter, { escapeText: false });

    expect(nodes.map((node) => node.name)).toEqual(['ol', 'p']);
    expect(nodes[0].attrs?.['data-start']).toBe(3);
    expect(find(nodes, 'a')?.attrs).toEqual({ 'data-url': 'http://e.com', role: 'link' });
    expect(find(nodes, 'img')?.attrs?.src).toBe('https://e.com/i.png');
  });

  it('omits empty attrs to keep mini-program setData payload smaller', () => {
    const adapter: MiniNodePlatformAdapter = {
      linkAttrs: (href) => ({ href }),
      imageSrc: (src) => src,
      olAttrs: () => ({}),
    };

    const nodes = renderTokensToMiniNodes(Lexer.lex('# T\n\n**b**'), adapter);

    expect(nodes[0]).not.toHaveProperty('attrs');
    expect(find(nodes, 'strong')).not.toHaveProperty('attrs');
  });

  it('uses adapter capabilities for unsupported block fallback', () => {
    const adapter: MiniNodePlatformAdapter = {
      capabilities: {
        supportsBlockquote: false,
        supportsPre: false,
        supportsTable: false,
      },
      linkAttrs: (href) => ({ href }),
      imageSrc: (src) => src,
      olAttrs: () => ({}),
    };

    const nodes = renderTokensToMiniNodes(
      Lexer.lex('> quote\n\n```ts\nconst a = 1;\n```\n\n| h |\n|---|\n| v |'),
      adapter,
      { escapeText: false },
    );

    expect(nodes.map((node) => node.name)).toEqual(['p', 'p', 'p']);
    expect(find(nodes, 'blockquote')).toBeUndefined();
    expect(find(nodes, 'pre')).toBeUndefined();
    expect(find(nodes, 'table')).toBeUndefined();
  });

  it('adds table classes consumed by mini-program component styles', () => {
    const adapter: MiniNodePlatformAdapter = {
      linkAttrs: (href) => ({ href }),
      imageSrc: (src) => src,
      olAttrs: () => ({}),
    };

    const nodes = renderTokensToMiniNodes(
      Lexer.lex('| h |\n|---|\n| v |'),
      adapter,
      { escapeText: false },
    );

    expect(find(nodes, 'table')?.attrs?.class).toBe('md-table');
    expect(find(nodes, 'th')?.attrs?.class).toBe('md-th');
    expect(find(nodes, 'td')?.attrs?.class).toBe('md-td');
  });

  const headerAdapter: MiniNodePlatformAdapter = {
    linkAttrs: (href) => ({ 'data-url': href }),
    imageSrc: (src) => src,
    olAttrs: () => ({}),
    capabilities: { supportsPre: true, supportsTable: true },
  };

  it('adds a default code-block header (language label + copy button with raw text)', () => {
    const tokens = Lexer.lex('```ts\nconst a = 1\n```');
    const nodes = renderTokensToMiniNodes(tokens, headerAdapter, { escapeText: false });
    const pre = find(nodes, 'pre')!;
    expect(pre.header).toBeDefined();
    expect(pre.header![0]).toEqual({ name: 'text', attrs: { class: 'md-codeblock-lang', value: 'ts' } });
    expect(pre.header![1]).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'const a = 1', class: 'md-copy-icon' } });
  });

  it('defaults the code-block header label to "code" when no language', () => {
    const nodes = renderTokensToMiniNodes(Lexer.lex('```\nplain\n```'), headerAdapter, { escapeText: false });
    expect(find(nodes, 'pre')!.header![0].attrs?.value).toBe('code');
  });

  it('adds a default table header ("表格" + copy button with markdown source)', () => {
    const src = '| a | b |\n| - | - |\n| 1 | 2 |';
    const nodes = renderTokensToMiniNodes(Lexer.lex(src), headerAdapter, { escapeText: false });
    const table = find(nodes, 'table')!;
    expect(table.header![0]).toEqual({ name: 'text', attrs: { class: 'md-tableblock-title', value: '表格' } });
    expect(table.header![1].name).toBe('copy-button');
    expect(String(table.header![1].attrs?.['data-copy'])).toContain('| a | b |');
  });

  it('copyButton() builds a copy-button node carrying the payload', () => {
    expect(copyButton('hello')).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'hello', class: 'md-copy-icon' } });
  });

  it('lets adapters rewrite final nodes without changing markdown semantics', () => {
    const adapter: MiniNodePlatformAdapter = {
      linkAttrs: (href) => ({ href }),
      imageSrc: (src) => src,
      olAttrs: () => ({}),
      node: (node) => (node.name === 'blockquote' ? { ...node, name: 'view' } : node),
    };

    const nodes = renderTokensToMiniNodes(Lexer.lex('> quote'), adapter);

    expect(nodes[0].name).toBe('view');
  });
});
