import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('Alipay inline links', () => {
  it('stays inline and exposes a visible pressed state', () => {
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    // 元素级样式（md-link / md-del）统一在共享 elements.css；按压态 md-link--active 仍是
    // Alipay 专属，留在 MiniNodeRenderer 的 acss。
    const sharedElements = readFileSync(
      resolve(root, 'src/components/shared/elements.css'),
      'utf8',
    );
    const rendererAcss = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.acss'),
      'utf8',
    );

    // flatten 已把 anchor 展开成「自带 value、无 children」的叶子 run，模板直接
    // 渲染单个 <text>{{u.valueOf(node)}} 而非遍历 node.children（后者扁平化后为空，
    // 会导致整段链接不显示）。仍是可点击的 inline <text>，带按压态。
    expect(axml).toMatch(
      /<text\s+a:elif="\{\{node\.name === 'a'\}\}"[\s\S]*?hover-class="md-link--active"[\s\S]*?>\{\{u\.valueOf\(node\)\}\}<\/text>/,
    );
    expect(axml).not.toMatch(/<view\s+a:elif="\{\{node\.name === 'a'\}\}"/);
    // 不能再用 <block> 遍历 node.children——扁平化后 anchor 无 children。
    expect(axml).not.toMatch(/<block\s+a:elif="\{\{node\.name === 'a'\}\}"/);
    expect(sharedElements).toMatch(/\.md-link\s*\{[\s\S]*?display:\s*inline/);
    expect(sharedElements).toMatch(/\.md-del[\s\S]*?text-decoration:\s*line-through/);
    expect(rendererAcss).toContain('.md-link--active');
  });

  it('never per-char animates a list marker (would split "1." across lines)', () => {
    // 流式动画把文本拆成逐字 <text>，但列表 marker（.md-list-marker，仅 28rpx 宽的 flex 项）
    // 拆开后 "1" 和 "." 会分行。marker 必须整体渲染，故动画分支门控排除 marker。
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    const sjs = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.sjs'),
      'utf8',
    );
    expect(axml).toContain('u.isText(node.name) && animation && !u.isMarker(node)');
    expect(sjs).toMatch(/function isMarker\(node\)\s*\{[\s\S]*?md-list-marker/);
    expect(sjs).toContain('isMarker: isMarker');
  });
});
