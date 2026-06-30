import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { XMarkdownMini } from '../index.js';
import type { MiniNode } from '../index.js';

const root = resolve(__dirname, '../..');

function findNode(nodes: MiniNode[], name: string): MiniNode | undefined {
  for (const node of nodes) {
    if (node.name === name) return node;
    const nested = node.children && findNode(node.children, name);
    if (nested) return nested;
  }
  return undefined;
}

describe('Footnote stays an application extension', () => {
  it('is absent from the library entry and built-in Markdown component API', () => {
    const files = [
      'src/index.ts',
      'src/components/alipay/Markdown/index.ts',
      'src/components/wechat/Markdown/index.ts',
    ];

    for (const file of files) {
      expect(readFileSync(resolve(root, file), 'utf8')).not.toMatch(/\b[Ff]ootnote\b/);
    }
  });

  it('can be implemented locally by the docs-site demo', async () => {
    const extensionFile = resolve(
      root,
      'docs-site/src/demos/plugins/footnoteExtension.ts',
    );
    expect(existsSync(extensionFile)).toBe(true);

    const { createFootnoteExtension } = await import(
      '../../docs-site/src/demos/plugins/footnoteExtension.js'
    );
    const md = new XMarkdownMini({ extensions: [createFootnoteExtension()] });
    const nodes = md.renderNodes({
      content: 'Markdown[^1:一种轻量标记语言]',
      platform: 'wechat',
    });
    const footnote = findNode(nodes, 'footnote');

    expect(footnote?.attrs).toMatchObject({
      label: '1',
      content: '一种轻量标记语言',
    });
  });
});
