import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('WeChat table layout', () => {
  it('fills the viewport, constrains the first column, and lets remaining columns expand', () => {
    const wxss = readFileSync(
      resolve(root, 'src/components/wechat/Markdown/index.wxss'),
      'utf8',
    );

    expect(wxss).toMatch(/\.md-table\s*\{[\s\S]*?width:\s*max-content/);
    expect(wxss).toMatch(/\.md-table\s*\{[\s\S]*?min-width:\s*100%/);
    expect(wxss).toMatch(/\.md-(?:th|td):first-child[\s\S]*?min-width:\s*120rpx/);
    expect(wxss).toMatch(/\.md-(?:th|td):first-child[\s\S]*?max-width:\s*150rpx/);
    expect(wxss).toMatch(
      /\.md-(?:th|td):not\(:first-child\)[\s\S]*?min-width:\s*160rpx/,
    );
    expect(wxss).toMatch(/\.md-table-single[\s\S]*?width:\s*100%/);
  });

  it('wraps the scroll view with position-aware overlay edge shadows (shared style)', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const wxs = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );
    const elements = readFileSync(
      resolve(root, 'src/components/shared/elements.css'),
      'utf8',
    );

    // overlay <view>（不用 ::before/::after 伪元素——微信嵌套自定义组件里不渲染）
    expect(wxml).toContain('markdownx-table-content');
    expect(wxml).toContain('markdownx-edge-shadow-left');
    expect(wxml).toContain('markdownx-edge-shadow-right');
    expect(wxml).toContain('u.leftShadowClass(tableShadows, i)');
    expect(wxml).toContain('u.rightShadowClass(tableShadows, i)');
    expect(wxml).toContain('bindscroll="_tableScroll"');
    expect(wxml).toContain('wx:for="{{node.children}}"');
    expect(wxml).toContain('wx:for="{{row.children}}"');

    // 阴影样式是公用的：定义在 shared/elements.css（构建时内联进 MiniNodeRenderer，
    // 能触达深层渲染的表格），不再藏在高层 Markdown 组件的 wxss 里。
    expect(elements).toContain('.markdownx-edge-shadow');
    expect(elements).toContain('.markdownx-edge-shadow--visible');
    expect(elements).toContain('.markdownx-edge-shadow-left');
    expect(elements).toContain('.markdownx-edge-shadow-right');

    // wxs 暴露可见性 helper
    expect(wxs).toContain('leftShadowClass: leftShadowClass');
    expect(wxs).toContain('rightShadowClass: rightShadowClass');

    const renderer = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.ts'),
      'utf8',
    );
    expect(renderer).toContain('e?.detail?.scrollWidth');
  });

  it('computes left and right shadow visibility from real scroll geometry', async () => {
    const helper = resolve(root, 'src/components/shared/tableScroll.ts');
    expect(existsSync(helper), `${helper} must exist`).toBe(true);
    const { getTableShadowState } = await import('../components/shared/tableScroll.js');

    expect(getTableShadowState(0, 600, 600)).toEqual({ left: false, right: false });
    expect(getTableShadowState(0, 900, 600)).toEqual({ left: false, right: true });
    expect(getTableShadowState(160, 900, 600)).toEqual({ left: true, right: true });
    expect(getTableShadowState(300, 900, 600)).toEqual({ left: true, right: false });
  });
});
