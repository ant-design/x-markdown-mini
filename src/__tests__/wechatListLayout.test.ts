import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

// 回归守卫：WeChat 自定义组件宿主不是 flex 透明的，若把列表项的 marker 和 content
// 都塞进同一个嵌套 <mini-node-renderer> 宿主里，flex 容器 .md-list-item 只能看到一个
// 子节点 → "1."/"•" 会单独占一行（支付宝的 slot 宿主是透明的，所以那端正常）。
// 修复方式：列表项分支把 marker 文本与 content 容器作为 flex 容器的「直接子节点」渲染。
describe('WeChat list layout', () => {
  it('renders list-item marker and content as direct flex children', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const wxs = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );

    // wxs 暴露 isListItem 且能识别 md-list-item 节点
    expect(wxs).toContain('isListItem: isListItem');
    const wxsModule: { exports?: Record<string, any> } = {};
    new Function('module', wxs)(wxsModule);
    expect(
      wxsModule.exports!.isListItem({ name: 'li', attrs: { class: 'md-list-item' } }),
    ).toBe(true);
    expect(
      wxsModule.exports!.isListItem({ name: 'view', attrs: { class: 'md-paragraph' } }),
    ).toBe(false);

    // wxml 有专门的 list-item 分支
    const listItemIndex = wxml.indexOf('u.isListItem(node)');
    expect(listItemIndex).toBeGreaterThan(-1);

    // 该分支遍历 li 的直接子节点，把 marker 文本直接渲染为 <text>（而不是把 marker 与
    // content 一起塞进一个 mini-node-renderer 宿主）。
    const branch = wxml.slice(listItemIndex, listItemIndex + 900);
    expect(branch).toMatch(/wx:for="\{\{node\.children\}\}"/);
    expect(branch).toMatch(/<text[\s\S]*?u\.valueOf/);
  });
});
