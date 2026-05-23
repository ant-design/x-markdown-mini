import { describe, expect, it } from 'vitest';
import { Lexer } from 'marked';
import {
  renderTokensToMiniNodes,
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
