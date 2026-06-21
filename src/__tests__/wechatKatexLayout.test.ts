import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('WeChat KaTeX layout', () => {
  it('uses virtual component hosts instead of forbidden recursive templates', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const component = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.ts'),
      'utf8',
    );

    expect(wxml).not.toContain('<template name="katexTree">');
    expect(wxml).not.toContain('<template is="katexTree"');
    expect(component).toMatch(/options:\s*\{[\s\S]*?virtualHost:\s*true/);

    const wxss = readFileSync(
      resolve(root, 'src/plugins/Latex/style.wxss'),
      'utf8',
    );
    expect(wxss).toContain('.katex .vlist .katex-vlist-child');
    expect(wxss).not.toMatch(/\.katex \.vlist \.katex-node\s*\{/);
  });

  it('compensates WeChat vlist baseline rounding without affecting Alipay', () => {
    const wechatStyles = readFileSync(
      resolve(root, 'src/plugins/Latex/style.wxss'),
      'utf8',
    );
    const alipayStyles = readFileSync(
      resolve(root, 'src/plugins/Latex/style.acss'),
      'utf8',
    );

    expect(wechatStyles).toMatch(
      /\.katex \.vlist\s*\{[^}]*transform:\s*translateY\(0\.04em\)/s,
    );
    expect(alipayStyles).not.toContain('translateY(0.04em)');
  });
});
