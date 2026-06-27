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
  it('inlines KaTeX fonts as base64 (offline) for both platforms', () => {
    const wxss = readFileSync(
      new URL('../plugins/Latex/style.wxss', import.meta.url),
      'utf8',
    );
    const acss = readFileSync(
      new URL('../plugins/Latex/style.acss', import.meta.url),
      'utf8',
    );
    const fontsWxss = readFileSync(
      new URL('../plugins/Latex/fonts.wxss', import.meta.url),
      'utf8',
    );
    const fontsAcss = readFileSync(
      new URL('../plugins/Latex/fonts.acss', import.meta.url),
      'utf8',
    );

    // Each platform's style sheet pulls its own base64 font sheet — consumers
    // import a single style file and get working glyphs with no network/CDN.
    expect(wxss).toContain('@import "./fonts.wxss";');
    expect(acss).toContain('@import "./fonts.acss";');
    expect(wxss).toContain('font-family: "KaTeX_Main"');
    expect(acss).toContain('font-family: "KaTeX_Main"');
    expect(wxss).not.toMatch(/font-family:\s*KaTeX_/);
    expect(acss).not.toMatch(/font-family:\s*KaTeX_/);

    // Fonts are base64 data URIs, never CDN/http (broken inside a mini-program).
    for (const fonts of [fontsWxss, fontsAcss]) {
      expect(fonts).toContain('data:font/woff2;base64,');
      expect(fonts).not.toContain('http');
    }
    // The layout sheets must not ship dead CDN url() refs anymore.
    expect(wxss).not.toContain('http');
    expect(acss).not.toContain('http');
  });

  it('imports KaTeX fonts from the top-level Markdown component styles', () => {
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

    expect(alipayMarkdown).toMatch(
      /@import "\.\.\/\.\.\/plugins\/Latex\/fonts\.acss";[\s\S]*@import "\.\.\/\.\.\/plugins\/Latex\/style\.acss";/,
    );
    expect(wechatMarkdown).toMatch(
      /@import "\.\.\/\.\.\/plugins\/Latex\/fonts\.wxss";[\s\S]*@import "\.\.\/\.\.\/plugins\/Latex\/style\.wxss";/,
    );
    expect(alipayRenderer).toMatch(
      /^@import "\.\.\/\.\.\/plugins\/Latex\/fonts\.acss";\s*@import "\.\.\/\.\.\/plugins\/Latex\/style\.acss";/,
    );
    expect(wechatRenderer).toMatch(
      /^@import "\.\.\/\.\.\/plugins\/Latex\/fonts\.wxss";\s*@import "\.\.\/\.\.\/plugins\/Latex\/style\.wxss";/,
    );
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

  it('inline math renders to MiniNode with katex class', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$x^2$', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex');
    expect(json).toContain('katex-node');
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
