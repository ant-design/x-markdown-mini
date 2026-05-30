import { describe, it, expect, vi } from 'vitest';
import { XMarkdownMini, tokensToWechat, tokensToWechatNodes } from '../index.js';
import type { MarkedExtension, Token, Tokens, XMarkdownExtension } from '../index.js';

/**
 * Custom inline extension: turns @username into a `mention` token.
 * Useful for proving Marked tokenizer extensions are honored.
 */
const mentionExtension: MarkedExtension = {
  extensions: [
    {
      name: 'mention',
      level: 'inline',
      start(src: string): number | undefined {
        const m = src.match(/@/);
        return m?.index;
      },
      tokenizer(src: string): Tokens.Generic | undefined {
        const m = /^@([a-zA-Z0-9_-]+)/.exec(src);
        if (!m) return undefined;
        return {
          type: 'mention',
          raw: m[0],
          username: m[1],
        } as unknown as Tokens.Generic;
      },
    },
  ],
};

describe('XMarkdownMini — extensions', () => {
  it('accepts extensions: MarkedExtension[] in constructor', () => {
    const md = new XMarkdownMini({ extensions: [mentionExtension] });
    expect(md).toBeInstanceOf(XMarkdownMini);
  });

  it('parse() sees tokens produced by a custom tokenizer extension', () => {
    const md = new XMarkdownMini({ extensions: [mentionExtension] });
    const tokens = md.parse('Hi @alice and @bob');
    // The mention extension is inline, so mentions live inside the paragraph's children.
    const para = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    const mentions = (para?.tokens ?? []).filter((t) => t.type === 'mention');
    expect(mentions.length).toBe(2);
    expect((mentions[0] as Tokens.Generic).username).toBe('alice');
    expect((mentions[1] as Tokens.Generic).username).toBe('bob');
  });

  it('walkTokens hook is invoked once per token during parse()', () => {
    const seen: string[] = [];
    const walkExt: MarkedExtension = {
      walkTokens(token: Token): void {
        seen.push(token.type);
      },
    };
    const md = new XMarkdownMini({ extensions: [walkExt] });
    md.parse('# Title\n\nPara.');
    expect(seen).toContain('heading');
    expect(seen).toContain('paragraph');
  });

  it('multiple extensions compose (mention + walkTokens both active)', () => {
    const walked: string[] = [];
    const walkExt: MarkedExtension = {
      walkTokens(token: Token): void {
        walked.push(token.type);
      },
    };
    const md = new XMarkdownMini({ extensions: [mentionExtension, walkExt] });
    const tokens = md.parse('hello @charlie');
    const para = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((para.tokens ?? []).some((t) => t.type === 'mention')).toBe(true);
    expect(walked).toContain('mention');
  });

  it('per-call extensions are active for one-shot render()', () => {
    const md = new XMarkdownMini();
    const tokens = md.render({
      content: 'hello @delta',
      extensions: [mentionExtension],
    });
    const para = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((para.tokens ?? []).some((t) => t.type === 'mention')).toBe(true);
  });

  it('streaming per-call extensions do not leak after completion', () => {
    const md = new XMarkdownMini();
    let tokens: Token[] = [];

    md.render({
      content: 'hello @stream',
      streaming: { hasNextChunk: false },
      extensions: [mentionExtension],
      onPatch: (next) => {
        tokens = next;
      },
    });

    const streamedPara = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((streamedPara.tokens ?? []).some((t) => t.type === 'mention')).toBe(true);

    const after = md.parse('hello @plain');
    const afterPara = after.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((afterPara.tokens ?? []).some((t) => t.type === 'mention')).toBe(false);
  });

  it('no extensions: legacy XMarkdownMini behavior preserved (mention is plain text)', () => {
    const md = new XMarkdownMini();
    const tokens = md.parse('hi @alice');
    const para = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((para.tokens ?? []).some((t) => t.type === 'mention')).toBe(false);
  });

  it('extensions do NOT leak across XMarkdownMini instances', () => {
    const a = new XMarkdownMini({ extensions: [mentionExtension] });
    const b = new XMarkdownMini();
    const aTokens = a.parse('hi @x');
    const bTokens = b.parse('hi @x');
    const aPara = aTokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    const bPara = bTokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph;
    expect((aPara.tokens ?? []).some((t) => t.type === 'mention')).toBe(true);
    expect((bPara.tokens ?? []).some((t) => t.type === 'mention')).toBe(false);
  });

  it('streaming render with extensions: onPatch is called without throwing on unknown tokens', () => {
    // Stage 3 contract: even though `mention` is not mapped to a MiniNode (the legacy
    // tokensToWechat/Alipay drops unknown token types), the pipeline must not throw.
    // Users who want rich rendering of custom tokens are expected to use parse() + their
    // own renderer (Stage 2b's full Token→component flow will land that natively).
    const md = new XMarkdownMini({ extensions: [mentionExtension] });
    const patches: unknown[][] = [];
    expect(() => {
      md.renderNodes({
        content: 'hi @alice',
        streaming: { hasNextChunk: false },
        onPatch: (nodes) => patches.push(nodes),
      });
    }).not.toThrow();
    // At least one patch emitted (even if mention got dropped from the tree)
    expect(patches.length).toBeGreaterThan(0);
  });

  it('renders custom extension tokens through colocated miniRenderer', () => {
    const mentionWithRenderer: XMarkdownExtension = {
      extensions: [
        {
          name: 'mention',
          level: 'inline',
          start(src: string): number | undefined {
            const m = src.match(/@/);
            return m?.index;
          },
          tokenizer(src: string): Tokens.Generic | undefined {
            const m = /^@([a-zA-Z0-9_-]+)/.exec(src);
            if (!m) return undefined;
            return {
              type: 'mention',
              raw: m[0],
              username: m[1],
            } as unknown as Tokens.Generic;
          },
          miniRenderer(token) {
            const username = (token as Tokens.Generic).username as string;
            return {
              name: 'span',
              attrs: { class: 'md-mention' },
              children: [{ name: 'text', attrs: { value: `@${username}` } }],
            };
          },
        },
      ],
    };

    const md = new XMarkdownMini({
      extensions: [mentionWithRenderer],
    });

    const nodes = md.renderNodes({ content: 'hi @alice', platform: 'wechat' });
    expect(JSON.stringify(nodes)).toContain('@alice');
    expect(JSON.stringify(nodes)).toContain('md-mention');
  });
});

describe('tokensToWechatNodes / tokensToAlipayNodes — pre-lexed Token[] entry', () => {
  it('tokensToWechatNodes accepts Token[] directly (skips lexer)', () => {
    const md = new XMarkdownMini();
    const tokens = md.parse('# Heading');
    const nodes = tokensToWechatNodes(tokens, { escapeText: false });
    expect(nodes[0]?.name).toBe('h1');
  });

  it('backward-compat: tokensToWechat(string) still works unchanged', () => {
    const nodes = tokensToWechat('# Heading', { escapeText: false });
    expect(nodes[0]?.name).toBe('h1');
  });
});
