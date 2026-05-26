import { describe, it, expect } from 'vitest';
import { XMarkdownMini } from '../index.js';
import type { Plugin, TokenRenderer } from '../index.js';
import { htmlToMiniNodes } from '../plugins/shared/htmlToMiniNodes.js';

// ---------------------------------------------------------------------------
// Plugin type + flattening
// ---------------------------------------------------------------------------

describe('Plugin interface', () => {
  it('flattens plugins into extensions and tokenRenderers', () => {
    const customExt = {
      extensions: [
        {
          name: 'test',
          level: 'inline' as const,
          start(src: string) { return src.indexOf('!'); },
          tokenizer(src: string) {
            const m = /^!([a-z]+)/.exec(src);
            if (!m) return undefined;
            return { type: 'test', raw: m[0], value: m[1] } as any;
          },
        },
      ],
    };

    const customRenderer: TokenRenderer = {
      token: 'test',
      render(token) {
        return { name: 'span', attrs: { class: 'test' }, children: [{ name: 'text', attrs: { value: (token as any).value } }] };
      },
    };

    const plugin: Plugin = { extensions: [customExt], tokenRenderers: [customRenderer] };

    const md = new XMarkdownMini({ plugins: [plugin] });
    const tokens = md.parse('hello !world');
    const para = tokens.find((t) => t.type === 'paragraph') as any;
    expect(para.tokens.some((t: any) => t.type === 'test')).toBe(true);

    const nodes = md.renderNodes({ content: 'hello !world', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('test');
    expect(json).toContain('world');
  });

  it('plugins compose with standalone extensions and tokenRenderers', () => {
    const extA = {
      extensions: [{
        name: 'extA', level: 'inline' as const,
        start(src: string) { return src.indexOf('@'); },
        tokenizer(src: string) {
          const m = /^@(\w+)/.exec(src);
          if (!m) return undefined;
          return { type: 'extA', raw: m[0], user: m[1] } as any;
        },
      }],
    };

    const md = new XMarkdownMini({
      extensions: [extA],
      tokenRenderers: [{ token: 'extA', render: (t) => ({ name: 'span', children: [{ name: 'text', attrs: { value: `@${(t as any).user}` } }] }) }],
      plugins: [{
        extensions: [{
          extensions: [{
            name: 'extB', level: 'inline' as const,
            start(src: string) { return src.indexOf('+'); },
            tokenizer(src: string) {
              const m = /^\+(\w+)/.exec(src);
              if (!m) return undefined;
              return { type: 'extB', raw: m[0], tag: m[1] } as any;
            },
          }],
        }],
        tokenRenderers: [{ token: 'extB', render: (t) => ({ name: 'span', children: [{ name: 'text', attrs: { value: `+${(t as any).tag}` } }] }) }],
      }],
    });

    // Verify standalone extension (extA from extensions[]) works
    const tokensA = md.parse('@alice');
    const paraA = tokensA.find((t) => t.type === 'paragraph') as any;
    expect(paraA.tokens.map((t: any) => t.type)).toContain('extA');

    // Verify plugin extension (extB from plugins[]) works
    const tokensB = md.parse('+beta');
    const paraB = tokensB.find((t) => t.type === 'paragraph') as any;
    expect(paraB.tokens.map((t: any) => t.type)).toContain('extB');

    // Verify both render simultaneously
    const nodes = md.renderNodes({ content: '@alice +beta', platform: 'wechat' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('@alice');
    expect(json).toContain('+beta');
  });

  it('empty plugins array has no effect', () => {
    const md = new XMarkdownMini({ plugins: [] });
    const tokens = md.parse('hello **world**');
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('no plugins: legacy behavior preserved', () => {
    const md = new XMarkdownMini();
    const nodes = md.renderNodes({ content: '# Hello', platform: 'alipay' });
    expect(nodes[0]?.name).toBe('h1');
  });
});

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
// CodeHighlight plugin — tokenRenderer override
// ---------------------------------------------------------------------------

describe('CodeHighlight plugin', () => {
  // We import dynamically to avoid bundling hljs in the test context
  // if it's not available, but since it's a devDep it should be.

  it('override: tokenRenderers for "code" takes priority over built-in', () => {
    const customRenderer: TokenRenderer = {
      token: 'code',
      render(token) {
        return [{ name: 'pre', attrs: { class: 'custom-code' }, children: [{ name: 'text', attrs: { value: (token as any).text ?? '' } }] }];
      },
    };

    const md = new XMarkdownMini({ tokenRenderers: [customRenderer] });
    const nodes = md.renderNodes({ content: '```js\nconsole.log("hi")\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('custom-code');
  });
});

// ---------------------------------------------------------------------------
// Latex plugin — tokenizer
// ---------------------------------------------------------------------------

describe('Latex plugin — tokenizer', () => {
  it('tokenizes inline math $...$', async () => {
    // Dynamic import to avoid test bundling issues
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ plugins: [Latex()] });
    const tokens = md.parse('The formula $x^2$ is simple');
    const para = tokens.find((t) => t.type === 'paragraph') as any;
    const types = para.tokens.map((t: any) => t.type);
    expect(types).toContain('inlineKatex');
  });

  it('tokenizes block math $$...$$', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ plugins: [Latex()] });
    // Block math requires newline after $$ (matching the old @alipay/markdown-x-math pattern)
    const tokens = md.parse('$$\nx^2 + y^2 = z^2\n$$');
    const types = tokens.map((t: any) => t.type);
    expect(types).toContain('blockKatex');
  });

  it('inline math renders to MiniNode with katex class', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ plugins: [Latex()] });
    const nodes = md.renderNodes({ content: '$x^2$', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex');
  });

  it('block math renders to MiniNode with katex-display class', async () => {
    const { default: Latex } = await import('../plugins/Latex/index.js');
    const md = new XMarkdownMini({ plugins: [Latex()] });
    const nodes = md.renderNodes({ content: '$$\nx^2\n$$', platform: 'wechat' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('katex-display');
  });
});

// ---------------------------------------------------------------------------
// CodeHighlight plugin
// ---------------------------------------------------------------------------

describe('CodeHighlight plugin', () => {
  it('highlights JavaScript code', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ plugins: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```js\nconst x = 1;\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    expect(json).toContain('hljs');
    expect(json).toContain('language-javascript');
  });

  it('falls back to default when no language specified', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    const md = new XMarkdownMini({ plugins: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```\nplain text\n```', platform: 'alipay' });
    // No language → CodeHighlight returns null → built-in code handler runs
    const json = JSON.stringify(nodes);
    expect(json).toContain('pre');
    expect(json).not.toContain('hljs');
  });

  it('only highlights registered languages', async () => {
    const { default: CodeHighlight } = await import('../plugins/CodeHighlight/index.js');
    // Default common languages don't include ruby — verify fallback behavior
    const md = new XMarkdownMini({ plugins: [CodeHighlight()] });
    const nodes = md.renderNodes({ content: '```ruby\ndef hello\nend\n```', platform: 'alipay' });
    const json = JSON.stringify(nodes);
    // ruby not in common set → CodeHighlight returns null → built-in code handler
    expect(json).not.toContain('hljs');
    expect(json).toContain('pre');
  });
});