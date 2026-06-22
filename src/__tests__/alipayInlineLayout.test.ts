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

    expect(axml).toMatch(
      /<block\s+a:elif="\{\{node\.name === 'a'\}\}">[\s\S]*?<text[\s\S]*?hover-class="md-link--active"/,
    );
    expect(axml).not.toMatch(/<view\s+a:elif="\{\{node\.name === 'a'\}\}"/);
    expect(sharedElements).toMatch(/\.md-link\s*\{[\s\S]*?display:\s*inline/);
    expect(sharedElements).toMatch(/\.md-del[\s\S]*?text-decoration:\s*line-through/);
    expect(rendererAcss).toContain('.md-link--active');
  });
});
