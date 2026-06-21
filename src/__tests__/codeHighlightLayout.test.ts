import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe.each([
  ['WeChat', 'wxss'],
  ['Alipay', 'acss'],
] as const)('%s code block layout', (_platform, extension) => {
  it('preserves source newlines without wrapping long highlighted lines', () => {
    const componentStyle = readFileSync(
      resolve(
        root,
        `src/components/${extension === 'wxss' ? 'wechat' : 'alipay'}/Markdown/index.${extension}`,
      ),
      'utf8',
    );
    const highlightStyle = readFileSync(
      resolve(root, `src/plugins/CodeHighlight/style.${extension}`),
      'utf8',
    );

    expect(componentStyle).toMatch(/\.md-code-block\s*\{[\s\S]*?white-space:\s*pre\s*;/);
    expect(componentStyle).toMatch(/\.md-code-block\s*\{[\s\S]*?word-break:\s*normal\s*;/);
    expect(componentStyle).toMatch(/\.md-code\s*\{[\s\S]*?white-space:\s*pre\s*;/);
    expect(componentStyle).toMatch(/\.md-code\s*\{[\s\S]*?word-break:\s*normal\s*;/);
    expect(highlightStyle).toMatch(/\.hljs\s*\{[\s\S]*?white-space:\s*pre\s*;/);
    expect(highlightStyle).toMatch(/\.hljs\s*\{[\s\S]*?word-break:\s*normal\s*;/);
  });
});
