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
    expect(acss).toMatch(/\.md-list-marker\s*\{[\s\S]*?line-height:\s*inherit/);
  });

  it('uses a flex table layout for Alipay device compatibility', () => {
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/Markdown/index.acss'),
      'utf8',
    );

    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?display:\s*inline-flex/);
    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?flex-direction:\s*column/);
    expect(acss).toMatch(/\.md-table\s*\{[\s\S]*?min-width:\s*100%/);
    expect(acss).toMatch(/\.md-tr\s*\{[\s\S]*?display:\s*flex/);
    expect(acss).toMatch(/\.md-(?:th|td)\s*\{[\s\S]*?display:\s*block/);
    expect(acss).not.toMatch(/display:\s*table(?:;|\s)/);
    expect(acss).not.toMatch(/display:\s*table-row/);
    expect(acss).not.toMatch(/display:\s*table-cell/);
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
