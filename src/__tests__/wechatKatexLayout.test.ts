import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('WeChat KaTeX layout', () => {
  it('renders the deep KaTeX tree in one component boundary', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const wxs = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );

    expect(wxml).toContain('<template name="katexTree">');
    expect(wxml).toContain('<template is="katexTree"');
    expect(wxml).toContain('u.isKatex(node)');
    expect(wxs).toContain('function isKatex(node)');
  });
});
