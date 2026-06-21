import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('Alipay table layout', () => {
  it('uses the same responsive column widths as WeChat', () => {
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/Markdown/index.acss'),
      'utf8',
    );

    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?width:\s*max-content/);
    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?min-width:\s*100%/);
    expect(acss).toMatch(/\.md-(?:th|td):first-child[\s\S]*?min-width:\s*120rpx/);
    expect(acss).toMatch(/\.md-(?:th|td):first-child[\s\S]*?max-width:\s*150rpx/);
    expect(acss).toMatch(
      /\.md-(?:th|td):not\(:first-child\)[\s\S]*?min-width:\s*160rpx/,
    );
    expect(acss).toMatch(/\.md-table-single[\s\S]*?width:\s*100%/);
  });

  it('renders rows and cells directly inside a shadowed horizontal scroller', () => {
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/Markdown/index.acss'),
      'utf8',
    );

    expect(axml).toContain('markdownx-table-content');
    expect(axml).toContain('onScroll="_tableScroll"');
    expect(axml).toContain('a:for="{{node.children}}"');
    expect(axml).toContain('a:for="{{row.children}}"');
    expect(acss).toContain('.markdownx-table-content--left-shadow::before');
    expect(acss).toContain('.markdownx-table-content--right-shadow::after');

    const renderer = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.ts'),
      'utf8',
    );
    expect(renderer).toContain('e?.detail?.scrollWidth');
  });
});
