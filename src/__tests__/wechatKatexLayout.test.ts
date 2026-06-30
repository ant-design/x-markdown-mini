import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('WeChat KaTeX layout', () => {
  it('renders KaTeX in one rich-text boundary instead of recursive components', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const wxs = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );

    expect(wxml).not.toContain('<template name="katexTree">');
    expect(wxml).not.toContain('<template is="katexTree"');
    expect(wxml).toMatch(
      /<rich-text\s+wx:elif="\{\{u\.isKatex\(node\)\}\}"[\s\S]*?nodes="\{\{u\.toRichTextNodes\(node\.children\)\}\}"/,
    );
    expect(wxs).toContain('function isKatex(node)');
    expect(wxs).toContain('isKatex: isKatex');

    const richTextIndex = wxml.indexOf('u.isKatex(node)');
    const recursiveIndex = wxml.lastIndexOf('<mini-node-renderer');
    expect(richTextIndex).toBeGreaterThan(-1);
    expect(richTextIndex).toBeLessThan(recursiveIndex);

    const wxss = readFileSync(
      resolve(root, 'src/plugins/Latex/style.wxss'),
      'utf8',
    );
    expect(wxss).toContain('.katex .vlist .katex-vlist-child');
    expect(wxss).not.toMatch(/\.katex \.vlist \.katex-node\s*\{/);
    expect(wxss).toMatch(
      /\.katex-display\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;/s,
    );
  });

  it('renders inline KaTeX through the same rich-text path as block (real KaTeX fonts)', () => {
    const wxml = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxml'),
      'utf8',
    );
    const wxs = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );

    // Inline math no longer falls back to a unicode-approximation <text>; both
    // inline and block KaTeX render via the single isKatex rich-text branch so
    // inline formulas get the real KaTeX font instead of the system font.
    expect(wxml).not.toContain('isInlineKatex');
    expect(wxml).not.toContain('inlineKatexText');
    expect(wxs).not.toContain('isInlineKatex');
    expect(wxs).not.toContain('inlineKatexText');

    // The katex-inline wrapper must be inline-block so the rich-text box stays in
    // the surrounding text flow instead of forcing its own line.
    const wxss = readFileSync(
      resolve(root, 'src/plugins/Latex/style.wxss'),
      'utf8',
    );
    expect(wxss).toMatch(/\.katex-inline\s*\{[^}]*display:\s*inline-block;/s);
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

  it('converts MiniNode text leaves to the rich-text node schema', () => {
    const source = readFileSync(
      resolve(root, 'src/components/wechat/MiniNodeRenderer/index.wxs'),
      'utf8',
    );
    const wxsModule: { exports?: Record<string, any> } = {};
    new Function('module', source)(wxsModule);

    const result = wxsModule.exports!.toRichTextNodes([
      {
        name: 'span',
        attrs: { class: 'mord' },
        children: [{ name: 'text', attrs: { value: 'x' } }],
      },
    ]);

    expect(result).toEqual([
      {
        name: 'span',
        attrs: { class: 'mord' },
        children: [{ type: 'text', text: 'x' }],
      },
    ]);
  });
});
