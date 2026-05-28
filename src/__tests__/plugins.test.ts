import { describe, it, expect } from 'vitest';
import { XMarkdownMini } from '../index.js';
import type { XMarkdownExtension } from '../index.js';
import { htmlToMiniNodes } from '../plugins/shared/htmlToMiniNodes.js';

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
  });

  it('block math renders to MiniNode with katex-display class', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ extensions: [Latex()] });
    const nodes = md.renderNodes({ content: '$$\nx^2\n$$', platform: 'wechat' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex-display');
  });
});

// ---------------------------------------------------------------------------
// CodeHighlight
// ---------------------------------------------------------------------------

describe('CodeHighlight', () => {
  it('highlights JavaScript code', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```js\nconst x = 1;\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('hljs');
    expect(json).toContain('language-javascript');
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
