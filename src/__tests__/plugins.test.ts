import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { XMarkdownMini } from '../index.js';
import type { XMarkdownExtension } from '../index.js';
import { htmlToMiniNodes } from '../plugins/shared/htmlToMiniNodes.js';
import { flattenInlineNodes } from '../components/shared/flattenInline.js';

// ---------------------------------------------------------------------------
// htmlToMiniNodes
// ---------------------------------------------------------------------------

describe('htmlToMiniNodes', () => {
  it('parses a single span with class', () => {
    const nodes = htmlToMiniNodes('<span class="hljs-keyword">const</span>', false);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe('span');
    expect(nodes[0].attrs?.class).toBe('hljs-keyword');
    expect(nodes[0].children).toHaveLength(1);
    expect(nodes[0].children![0].name).toBe('text');
    expect(nodes[0].children![0].attrs?.value).toBe('const');
  });

  it('parses nested spans', () => {
    const nodes = htmlToMiniNodes(
      '<span class="hljs-title"><span class="hljs-keyword">function</span> foo</span>',
      false,
    );
    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe('span');
    expect(nodes[0].attrs?.class).toBe('hljs-title');
    expect(nodes[0].children).toHaveLength(2);
    expect(nodes[0].children![0].name).toBe('span');
    expect(nodes[0].children![0].attrs?.class).toBe('hljs-keyword');
  });

  it('parses div wrapper with spans', () => {
    const nodes = htmlToMiniNodes(
      '<div class="katex-display"><span class="katex"><span class="base">x</span></span></div>',
      false,
    );
    expect(nodes).toHaveLength(1);
    expect(nodes[0].name).toBe('div');
    expect(nodes[0].attrs?.class).toBe('katex-display');
    expect(nodes[0].children![0].name).toBe('span');
  });

  it('handles <br> as newline text node', () => {
    const nodes = htmlToMiniNodes('line1<br>line2', false);
    // <br> creates a newline text node; text before/after are separate nodes
    const flat = JSON.stringify(nodes);
    expect(flat).toContain('\\n');
  });

  it('skips katex-mathml spans', () => {
    const html = '<span class="katex-mathml"><math><mrow>x</mrow></math></span><span class="katex-html"><span class="base">x</span></span>';
    const nodes = htmlToMiniNodes(html, false);
    const json = JSON.stringify(nodes);
    expect(json).not.toContain('katex-mathml');
    expect(json).toContain('katex-html');
    expect(json).toContain('base');
  });

  it('decodes HTML entities when escapeText is true', () => {
    const nodes = htmlToMiniNodes('<span>&amp; &lt;</span>', true);
    expect(nodes[0].children![0].attrs?.value).toBe('& <');
  });

  it('leaves HTML entities when escapeText is false', () => {
    const nodes = htmlToMiniNodes('<span>&amp; &lt;</span>', false);
    expect(nodes[0].children![0].attrs?.value).toBe('&amp; &lt;');
  });

  it('returns empty array for empty input', () => {
    expect(htmlToMiniNodes('', false)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// CodeHighlight — extension miniRenderer override path
// ---------------------------------------------------------------------------

describe('CodeHighlight — extension miniRenderer override', () => {
  it('extension miniRenderer for "code" takes priority over built-in', () => {
    const codeExtension: XMarkdownExtension = {
      extensions: [
        {
          name: 'code',
          level: 'block',
          miniRenderer(token) {
            return [{ name: 'pre', attrs: { class: 'custom-code' }, children: [{ name: 'text', attrs: { value: (token as any).text ?? '' } }] }];
          },
        },
      ],
    };

    const md = new XMarkdownMini({ extensions: [codeExtension] });
    const nodes = md.renderNodes({ content: '```js\nconsole.log("hi")\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('custom-code');
  });
});

// ---------------------------------------------------------------------------
// Latex — tokenizer
// ---------------------------------------------------------------------------

describe('Latex — tokenizer', () => {
  it('keeps KaTeX layout styles separate from default font payload', () => {
    const wxss = readFileSync(
      new URL('../plugins/Latex/style.wxss', import.meta.url),
      'utf8',
    );
    const acss = readFileSync(
      new URL('../plugins/Latex/style.acss', import.meta.url),
      'utf8',
    );

    // Default component styles must not import the generated base64 font sheets:
    // users who never render formulas should not pay that CSS payload.
    expect(wxss).not.toContain('@import "./fonts.wxss";');
    expect(acss).not.toContain('@import "./fonts.acss";');
    expect(wxss).toContain('font-family: "KaTeX_Main"');
    expect(acss).toContain('font-family: "KaTeX_Main"');
    expect(wxss).not.toMatch(/font-family:\s*KaTeX_/);
    expect(acss).not.toMatch(/font-family:\s*KaTeX_/);

    // The layout sheets must not ship dead CDN url() refs anymore.
    expect(wxss).not.toContain('http');
    expect(acss).not.toContain('http');
  });

  it('imports only KaTeX layout styles from default component styles', () => {
    const alipayMarkdown = readFileSync(
      new URL('../components/alipay/Markdown/index.acss', import.meta.url),
      'utf8',
    );
    const wechatMarkdown = readFileSync(
      new URL('../components/wechat/Markdown/index.wxss', import.meta.url),
      'utf8',
    );
    const alipayRenderer = readFileSync(
      new URL('../components/alipay/MiniNodeRenderer/index.acss', import.meta.url),
      'utf8',
    );
    const wechatRenderer = readFileSync(
      new URL('../components/wechat/MiniNodeRenderer/index.wxss', import.meta.url),
      'utf8',
    );

    expect(alipayMarkdown).toContain('@import "../../plugins/Latex/style.acss";');
    expect(wechatMarkdown).toContain('@import "../../plugins/Latex/style.wxss";');
    expect(alipayRenderer).toMatch(/^@import "\.\.\/\.\.\/plugins\/Latex\/style\.acss";/);
    expect(wechatRenderer).toMatch(/^@import "\.\.\/\.\.\/plugins\/Latex\/style\.wxss";/);
    for (const css of [alipayMarkdown, wechatMarkdown, alipayRenderer, wechatRenderer]) {
      expect(css).not.toContain('/Latex/fonts.');
    }
  });

  it('registers KaTeX fonts globally only when latex is enabled', () => {
    // 真机修复：组件作用域 @font-face 在支付宝真机不生效，改用 loadFontFace 全局注册；
    // 且必须仅在开启 latex 时调用——没用公式的页面不应加载这些字体。
    const loader = readFileSync(
      new URL('../components/shared/loadKatexFonts.ts', import.meta.url),
      'utf8',
    );
    expect(loader).toContain('loadFontFace');
    expect(loader).toContain('global: true');
    expect(loader).toContain('/node_modules/');
    expect(loader).toContain('/miniprogram_npm/');
    expect(loader).toContain('/katex-fonts');

    for (const platform of ['alipay', 'wechat']) {
      const src = readFileSync(
        new URL(`../components/${platform}/Markdown/index.ts`, import.meta.url),
        'utf8',
      );
      expect(src).toContain('loadKatexFonts');
      // 调用必须门控在 latex 判断之后
      expect(src).toMatch(/latex\)\s*loadKatexFonts\(/);
    }
  });

  it('registers KaTeX fonts from Alipay MiniNodeRenderer for direct JS rendering', () => {
    const renderer = readFileSync(
      new URL('../components/alipay/MiniNodeRenderer/index.ts', import.meta.url),
      'utf8',
    );
    expect(renderer).toContain('loadKatexFonts');
    expect(renderer).toContain("indexOf('katex')");
    expect(renderer).toMatch(/if\s*\([^)]*\(this\.props\.nodes\)[^)]*\)\s*loadKatexFonts\(/);
    // Must reuse the shared all-faces loader, not a crippled local stub that only
    // registers one face (the JS-接入 page relies on this for every KaTeX font on
    // device — registering only KaTeX_Math left every other glyph in the system font).
    expect(renderer).toMatch(
      /import\s*\{[^}]*loadKatexFonts[^}]*\}\s*from\s*'\.\.\/\.\.\/shared\/loadKatexFonts\.js'/,
    );
    expect(renderer).not.toMatch(/function\s+loadKatexFonts\s*\(/);

    // The shared loader must register the full KaTeX face set, not just one family.
    const loader = readFileSync(
      new URL('../components/shared/loadKatexFonts.ts', import.meta.url),
      'utf8',
    );
    for (const family of ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_AMS', 'KaTeX_Size4', 'KaTeX_Caligraphic']) {
      expect(loader).toContain(family);
    }
  });

  it('guards Alipay KaTeX reflow callbacks after component unmount', () => {
    const files = [
      '../components/alipay/Markdown/index.ts',
      '../components/alipay/MiniNodeRenderer/index.ts',
    ];

    for (const file of files) {
      const src = readFileSync(new URL(file, import.meta.url), 'utf8');
      expect(src, file).toContain('mounted: false');
      expect(src, file).toContain('this.mounted = true;');
      expect(src, file).toContain('this.mounted = false;');
      expect(src, file).toContain('if (this.mounted) this._katexFontReflow();');
      expect(src, file).toMatch(
        /this\.setData\(\{ katexReflow: false \}, \(\) => \{\s*if \(this\.mounted\) this\.setData\(\{ katexReflow: true \}\);/s,
      );
    }
  });

  it('avoids tag selectors forbidden in component wxss', () => {
    const wxss = readFileSync(
      new URL('../plugins/Latex/style.wxss', import.meta.url),
      'utf8',
    );
    expect(wxss).not.toMatch(/\.katex(?:[^\n{]*\s)(?:view|path|img)(?=[\s,{.:])/);
  });

  it('tokenizes inline math $...$', async () => {
    // Dynamic import to avoid test bundling issues
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const tokens = md.parse('The formula $x^2$ is simple');
    const para = tokens.find((t) => t.type === 'paragraph') as any;
    const types = para.tokens.map((t: any) => t.type);
    expect(types).toContain('inlineKatex');
  });

  it('tokenizes block math $$...$$', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    // Block math requires newline after $$ (matching the old @alipay/markdown-x-math pattern)
    const tokens = md.parse('$$\nx^2 + y^2 = z^2\n$$');
    const types = tokens.map((t: any) => t.type);
    expect(types).toContain('blockKatex');
  });

  it('inline math renders to MiniNode with katex class on WeChat', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$x^2$', platform: 'wechat' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex');
    expect(json).toContain('katex-node');
  });

  it('inline math renders to MiniNode with katex class on Alipay', async () => {
    // 支付宝与微信一样渲染真实 KaTeX 子树（字体经 loadFontFace 全局注册）；
    // 这是对此前「降级成 unicode 近似文本」做法的回归守卫。
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$x^2$', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex');
    expect(json).toContain('katex-node');
    expect(json).not.toContain('md-latex-fallback');
  });

  it('stamps kxf-* font classes onto KaTeX glyph text leaves (真机 font assignment)', async () => {
    // 真机字体赋值不能靠后代选择器 / view→text 继承（跨嵌套组件边界失效），改由插件把字体意图
    // 下沉成 kxf-* 类盖到每个字形 <text>，再用单类选择器赋字体。这里守卫「下沉」确实发生。
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$x + 1$', platform: 'alipay' });

    // 收集 katex 子树里的所有 text 叶子，断言每个都带某个 kxf-* 字体类。
    const texts: any[] = [];
    const walk = (list: any[]): void => {
      for (const n of list) {
        if (n.name === 'text') texts.push(n);
        if (n.children) walk(n.children);
      }
    };
    walk(nodes);
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) {
      expect(String(t.attrs?.class ?? ''), `text "${t.attrs?.value}" needs a kxf-* class`)
        .toMatch(/\bkxf-[a-z0-9]+\b/);
    }
    const json = JSON.stringify(nodes);
    // 变量 x → mathnormal → kxf-mathitalic；数字/算符 → 默认 kxf-main。
    expect(json).toContain('kxf-mathitalic');
    expect(json).toContain('kxf-main');
  });

  it('block math renders to MiniNode with katex-display class', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$$\nx^2\n$$', platform: 'wechat' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex-display');
  });

  it('marks only direct vlist children for zero-height positioning', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({
      content: '$$\n\\frac{n(n+1)}{2}\n$$',
      platform: 'wechat',
    });
    const queue = [...nodes];
    let vlist: any;
    while (queue.length) {
      const node = queue.shift()!;
      if (String(node.attrs?.class ?? '').split(/\s+/).includes('vlist')) {
        vlist = node;
        break;
      }
      if (node.children) queue.push(...node.children);
    }

    expect(vlist).toBeTruthy();
    const direct = vlist.children.filter((node: any) => node.name !== 'text');
    expect(direct.every((node: any) =>
      String(node.attrs?.class ?? '').includes('katex-vlist-child'))).toBe(true);
    const grandchildren = direct.flatMap((node: any) => node.children ?? []);
    expect(grandchildren.some((node: any) =>
      String(node.attrs?.class ?? '').includes('katex-vlist-child'))).toBe(false);
  });

  it('renders nothing when a formula fails to parse', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    // \frac needs two arguments → KaTeX cannot parse it.
    const nodes = md.renderNodes({ content: 'before $\\frac{1}$ after', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    // No broken/red error markup and no katex node at all for the bad formula.
    expect(json).not.toContain('katex');
    // surrounding text is untouched
    expect(json).toContain('before');
    expect(json).toContain('after');
  });

  it('uses the onError fallback when a formula fails to parse', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({
      extensions: [Latex({ onError: () => [{ name: 'text', attrs: { value: '⚠formula' } }] })],
    });
    const nodes = md.renderNodes({ content: '$\\frac{1}$', platform: 'alipay' });
    expect(JSON.stringify(nodes)).toContain('⚠formula');
  });
});

// ---------------------------------------------------------------------------
// CodeHighlight
// ---------------------------------------------------------------------------

describe('CodeHighlight', () => {
  it('ships a light theme by default on both mini-program platforms', () => {
    for (const file of ['style.wxss', 'style.acss']) {
      const css = readFileSync(
        new URL(`../plugins/CodeHighlight/${file}`, import.meta.url),
        'utf8',
      );
      expect(css).toContain('Light syntax theme');
      expect(css).toContain('background: #f6f8fa');
      expect(css).toContain('color: #24292f');
      expect(css).not.toContain('background: #111827');
    }
  });

  it('highlights JavaScript code', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```js\nconst x = 1;\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('hljs');
    expect(json).toContain('language-javascript');
  });

  it('turns highlighted source newlines into explicit break nodes', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const nodes = md.renderNodes({
      content: '```js\nconst md = new XMarkdownMini();\nconst nodes = md.renderNodes({ content });\n```',
      platform: 'wechat',
    });
    const codeBlock = flattenInlineNodes(nodes).find((node) => node.name === 'pre');

    expect(codeBlock?.children?.some((node) => node.name === 'br')).toBe(true);
  });

  it('decodes numeric HTML entities emitted by highlight.js', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ extensions: [CodeHighlight()], escapeText: false });
    const nodes = md.renderNodes({
      content: "```js\nconst value = 'quoted';\n```",
      platform: 'alipay',
    });
    const flat = flattenInlineNodes(nodes);
    const json = JSON.stringify(flat);

    expect(json).toContain("'quoted'");
    expect(json).not.toContain('&#x27;');
  });

  it('falls back to default when no language specified', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```\nplain text\n```', platform: 'alipay' });
    // No language → CodeHighlight returns null → built-in code handler runs
    const json = JSON.stringify(nodes);
    expect(json).toContain('pre');
    expect(json).not.toContain('hljs');
  });

  it('only highlights registered languages', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    // Default common languages don't include ruby — verify fallback behavior
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```ruby\ndef hello\nend\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    // ruby not in common set → CodeHighlight returns null → built-in code handler
    expect(json).not.toContain('hljs');
    expect(json).toContain('pre');
  });
});
