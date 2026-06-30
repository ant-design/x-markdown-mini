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

describe('Alipay code block scroll shadows', () => {
  it('wraps code blocks in a measured horizontal scroller with square edge shadows', () => {
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.acss'),
      'utf8',
    );
    const sjs = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.sjs'),
      'utf8',
    );
    const renderer = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.ts'),
      'utf8',
    );

    expect(axml).toContain('markdownx-code-scroll');
    expect(axml).toContain('markdownx-code-body');
    expect(axml).toContain('data-scroll-key="code-{{i}}"');
    expect(axml).toContain('onScroll="_codeScroll"');
    expect(axml).toContain("u.leftShadowClass(shadows, 'code-', i, true)");
    expect(axml).toContain("u.rightShadowClass(shadows, 'code-', i, true)");
    // 边缘阴影现为公用样式（shared/elements.css，构建时内联进 MiniNodeRenderer 的 acss）。
    const elements = readFileSync(
      resolve(root, 'src/components/shared/elements.css'),
      'utf8',
    );
    expect(elements).toContain('.markdownx-edge-shadow');
    expect(elements).toMatch(/\.markdownx-edge-shadow\s*\{[\s\S]*?border-radius:\s*0/);
    expect(elements).not.toMatch(/markdownx-edge-shadow[^{}]*::(?:before|after)/);
    expect(acss).not.toContain('.markdownx-edge-shadow-left');
    expect(sjs).toContain('function leftShadowClass');
    expect(sjs).toContain('function rightShadowClass');
    expect(renderer).toContain("query.selectAll('.md-code-block').boundingClientRect()");
    expect(renderer).toContain("query.selectAll('.markdownx-code-body').boundingClientRect()");
    expect(renderer).toContain('scrollLeft + viewportWidth');
    expect(renderer).toContain('_codeScroll');
  });
});
