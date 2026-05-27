import { describe, it, expect } from 'vitest';
import { XMarkdownMini } from '../index.js';
import type { MiniNode, TokenRenderer, XMarkdownExtension } from '../index.js';

// Find the first MiniNode whose `name` matches `tagName` in a depth-first walk.
function findNode(nodes: MiniNode[], tagName: string): MiniNode | undefined {
  for (const n of nodes) {
    if (n.name === tagName) return n;
    if (n.children) {
      const found = findNode(n.children, tagName);
      if (found) return found;
    }
  }
  return undefined;
}

describe('components: string[] sugar', () => {
  it('inline component with text content', () => {
    const md = new XMarkdownMini({ components: ['ant-button'] });
    const nodes = md.renderNodes({
      content: '点击 <ant-button>查看详情</ant-button> 了解更多。',
      platform: 'alipay',
    });
    const button = findNode(nodes, 'ant-button');
    expect(button).toBeDefined();
    expect(button!.children).toBeDefined();
    expect(button!.children!.length).toBeGreaterThan(0);
    const innerText = JSON.stringify(button!.children);
    expect(innerText).toContain('查看详情');
  });

  it('self-closing component has no children', () => {
    const md = new XMarkdownMini({ components: ['ant-icon'] });
    const nodes = md.renderNodes({
      content: '图标：<ant-icon type="check-circle" />',
      platform: 'alipay',
    });
    const icon = findNode(nodes, 'ant-icon');
    expect(icon).toBeDefined();
    expect(icon!.children).toBeUndefined();
    expect(icon!.attrs?.type).toBe('check-circle');
  });

  it('parses mixed attributes: quoted, unquoted, boolean', () => {
    const md = new XMarkdownMini({ components: ['ant-button'] });
    const nodes = md.renderNodes({
      content: `<ant-button type="primary" size='large' shape=round disabled>X</ant-button>`,
      platform: 'alipay',
    });
    const button = findNode(nodes, 'ant-button');
    expect(button).toBeDefined();
    expect(button!.attrs?.type).toBe('primary');
    expect(button!.attrs?.size).toBe('large');
    expect(button!.attrs?.shape).toBe('round');
    expect(button!.attrs?.disabled).toBe(true);
  });

  it('multiple components in one paragraph', () => {
    const md = new XMarkdownMini({ components: ['ant-button', 'ant-icon'] });
    const nodes = md.renderNodes({
      content: 'A <ant-button>B</ant-button> C <ant-icon type="x" /> D',
      platform: 'alipay',
    });
    const button = findNode(nodes, 'ant-button');
    const icon = findNode(nodes, 'ant-icon');
    expect(button).toBeDefined();
    expect(icon).toBeDefined();
    expect(icon!.attrs?.type).toBe('x');
  });

  it('component containing inline markdown lexes children recursively', () => {
    const md = new XMarkdownMini({ components: ['ant-button'] });
    const nodes = md.renderNodes({
      content: '<ant-button>**bold** here</ant-button>',
      platform: 'alipay',
    });
    const button = findNode(nodes, 'ant-button');
    expect(button).toBeDefined();
    const strong = findNode(button!.children ?? [], 'strong');
    expect(strong).toBeDefined();
    const json = JSON.stringify(button!.children);
    expect(json).toContain('bold');
  });

  it('tag NOT in components whitelist falls back to marked html token', () => {
    // No `components` option → no tokenizer registered → marked treats
    // `<ant-button>...</ant-button>` as an inline HTML token. Output should
    // not crash and should not produce an `ant-button` MiniNode.
    const md = new XMarkdownMini();
    const nodes = md.renderNodes({
      content: 'before <ant-button>X</ant-button> after',
      platform: 'alipay',
    });
    expect(findNode(nodes, 'ant-button')).toBeUndefined();
    // The original text should still appear somewhere in the output.
    expect(JSON.stringify(nodes)).toContain('before');
  });

  it('user-supplied extension with same name wins over built-in synth', () => {
    // The synth lives at the END of `extensions[]` so the user override
    // (registered via the explicit `extensions` option) is matched first by
    // renderCustomToken's first-match-wins loop.
    const userExt: XMarkdownExtension = {
      extensions: [
        {
          name: 'customTag:ant-button',
          miniRenderer: () => ({
            name: 'span',
            attrs: { class: 'user-override' },
            children: [{ name: 'text', attrs: { value: 'OVERRIDDEN' } }],
          }),
        },
      ],
    };

    const md = new XMarkdownMini({
      components: ['ant-button'],
      extensions: [userExt],
    });
    const nodes = md.renderNodes({
      content: '<ant-button>X</ant-button>',
      platform: 'alipay',
    });
    const json = JSON.stringify(nodes);
    expect(json).toContain('user-override');
    expect(json).toContain('OVERRIDDEN');
    // The default synth output (an `ant-button` named node) must NOT appear.
    expect(findNode(nodes, 'ant-button')).toBeUndefined();
  });

  it('empty component <tag></tag> has no children', () => {
    const md = new XMarkdownMini({ components: ['ant-icon'] });
    const nodes = md.renderNodes({
      // Need surrounding inline context so marked's block lexer doesn't
      // claim `<ant-icon></ant-icon>` as a standalone block-HTML token
      // before the inline tokenizer gets a chance.
      content: 'x <ant-icon></ant-icon> y',
      platform: 'alipay',
    });
    const icon = findNode(nodes, 'ant-icon');
    expect(icon).toBeDefined();
    expect(icon!.children).toBeUndefined();
  });

  it('legacy TokenRenderer coexists with synth (synth wins via extensions)', () => {
    // Sanity: legacy split shape still works even when components sugar is on.
    // The synth extension wins (extensions are consulted first by
    // renderCustomToken); this test just verifies legacy registration
    // doesn't crash with the sugar.
    const renderer: TokenRenderer = {
      token: 'customTag:ant-icon',
      render: () => ({ name: 'span', attrs: { class: 'legacy' } }),
    };
    const md = new XMarkdownMini({
      components: ['ant-icon'],
      tokenRenderers: [renderer],
    });
    const nodes = md.renderNodes({
      // Inline context — see comment in the empty-component test above.
      content: 'hi <ant-icon />',
      platform: 'alipay',
    });
    // The synth extension wins, so the output is an `ant-icon` named node.
    expect(findNode(nodes, 'ant-icon')).toBeDefined();
    // And the legacy override does NOT fire.
    expect(JSON.stringify(nodes)).not.toContain('legacy');
  });
});
