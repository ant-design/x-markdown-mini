import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('Alipay table layout', () => {
  it('overrides fragile native text/list marker layout on device', () => {
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.acss'),
      'utf8',
    );

    expect(acss).toMatch(/text\s*\{[\s\S]*?line-height:\s*inherit/);
    expect(acss).toMatch(/text\s*\{[\s\S]*?vertical-align:\s*baseline/);
    expect(acss).toMatch(/\.md-list-item\s*\{[\s\S]*?display:\s*flex/);
    expect(acss).toMatch(/\.md-list-item\s*\{[\s\S]*?align-items:\s*flex-start/);
    expect(acss).toMatch(/\.md-list-marker\s*\{[\s\S]*?padding-top:\s*6rpx/);
    expect(acss).toMatch(/\.md-list-content\s*\{[\s\S]*?flex:\s*1/);
  });

  it('uses a flex table layout for Alipay device compatibility', () => {
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.acss'),
      'utf8',
    );

    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?display:\s*block/);
    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?min-width:\s*100%/);
    expect(acss).toMatch(/\.md-tr\s*\{[\s\S]*?display:\s*flex/);
    expect(acss).toMatch(/\.md-tr\s*\{[\s\S]*?width:\s*100%/);
    expect(acss).toMatch(/\.md-(?:th|td)\s*\{[\s\S]*?display:\s*block/);
    expect(acss).toMatch(/\.md-(?:th|td)\s*\{[\s\S]*?flex:\s*0 0 240rpx/);
    expect(acss).not.toMatch(/display:\s*table(?:;|\s)/);
    expect(acss).not.toMatch(/display:\s*table-row/);
    expect(acss).not.toMatch(/display:\s*table-cell/);
    expect(acss).not.toContain('max-content');
    expect(acss).not.toContain(':first-child');
    expect(acss).not.toContain(':not(');
    expect(acss).toMatch(/\.md-table-multi \.md-tc-f[\s\S]*?min-width:\s*180rpx/);
    expect(acss).toMatch(/\.md-table-multi \.md-tc-f[\s\S]*?max-width:\s*180rpx/);
    expect(acss).toMatch(/\.md-table-multi \.md-tc-r[\s\S]*?min-width:\s*240rpx/);
    expect(acss).toMatch(/\.md-table-single[\s\S]*?width:\s*100%/);
  });

  it('renders rows and cells directly inside a shadowed horizontal scroller', () => {
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.acss'),
      'utf8',
    );

    expect(axml).toContain('markdownx-table-content');
    expect(axml).toContain('onScroll="_tableScroll"');
    expect(axml).toContain('data-scroll-key="table-{{i}}"');
    expect(axml).toContain('data-default-right="{{u.defaultRightShadow(node)}}"');
    expect(axml).toContain("u.leftShadowClass(shadows, 'table-', i, u.defaultRightShadow(node))");
    expect(axml).toContain("u.rightShadowClass(shadows, 'table-', i, u.defaultRightShadow(node))");
    expect(axml).toContain('a:for="{{node.children}}"');
    expect(axml).toContain('a:for="{{row.children}}"');
    // 边缘阴影现为公用样式（shared/elements.css，构建时内联进 MiniNodeRenderer 的
    // wxss/acss，两端共用）。Alipay acss 不再单独维护这份样式。
    const elements = readFileSync(
      resolve(root, 'src/components/shared/elements.css'),
      'utf8',
    );
    expect(elements).toContain('.markdownx-edge-shadow');
    expect(elements).toContain('.markdownx-edge-shadow-left');
    expect(elements).toContain('.markdownx-edge-shadow-right');
    expect(elements).toMatch(/\.markdownx-edge-shadow\s*\{[\s\S]*?border-radius:\s*0/);
    // 边缘阴影用 overlay <view>，不用伪元素：edge-shadow 规则块里没有 ::before/::after。
    expect(elements).not.toMatch(/markdownx-edge-shadow[^{}]*::(?:before|after)/);
    expect(acss).not.toContain('.markdownx-edge-shadow-left');
    expect(acss).not.toContain('.markdownx-edge-shadow-right');

    const sjs = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.sjs'),
      'utf8',
    );
    expect(sjs).toContain('function leftShadowClass');
    expect(sjs).toContain('function rightShadowClass');
    expect(sjs).toContain('function defaultRightShadow');
    expect(sjs).toContain('if (!state && defaultRight) return { left: false, right: true }');

    const renderer = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.ts'),
      'utf8',
    );
    expect(renderer).toContain('detail.scrollWidth');
    expect(renderer).toContain('defaultRight && !state.left && state.right');
    expect(renderer).toContain('shadows');
  });
});
