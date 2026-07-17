import { describe, expect, it } from 'vitest';
import { XMarkdownMini } from '../XMarkdownMini.js';
import type { MiniNode } from '../types.js';

function renderWechat(content: string): MiniNode[] {
  return new XMarkdownMini({ escapeText: false }).renderNodes({
    content,
    platform: 'wechat',
  });
}

function flatten(nodes: MiniNode[]): MiniNode[] {
  const out: MiniNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    out.push(n);
    if (n.children) queue.push(...n.children);
  }
  return out;
}

describe('<details> block support', () => {
  it('renders an empty details block with its summary', () => {
    const out = renderWechat('<details>\n  <summary>Preview</summary>\n</details>');
    expect(out).toHaveLength(1);
    const details = out[0];
    expect(details.name).toBe('details');
    expect(details.attrs?.class).toBe('md-details');
    expect(details.attrs?.summary).toBe('Preview');
    expect(details.attrs?.open).toBeUndefined();
    expect(details.children ?? []).toHaveLength(0);
  });

  it('parses a markdown body that contains blank lines and lists', () => {
    const out = renderWechat(
      '<details>\n<summary>More</summary>\n\nSome **bold** text\n\n- item\n\n</details>\n\nafter',
    );
    expect(out[0].name).toBe('details');
    const inner = flatten(out[0].children ?? []);
    expect(inner.some((n) => n.name === 'strong')).toBe(true);
    expect(inner.some((n) => n.name === 'ul')).toBe(true);
    // No leaked raw html text inside or after the details block.
    const values = flatten(out).map((n) => String(n.attrs?.value ?? ''));
    expect(values.some((v) => v.includes('<details') || v.includes('</details'))).toBe(false);
    expect(out[out.length - 1].name).toBe('p');
  });

  it('honors the open attribute', () => {
    const out = renderWechat('<details open>\n<summary>S</summary>\n\nbody\n\n</details>');
    expect(out[0].attrs?.open).toBe(true);
  });

  it('strips tags from the summary and tolerates a missing summary', () => {
    const tagged = renderWechat('<details><summary><b>Bold</b> label</summary>\n\nx\n\n</details>');
    expect(tagged[0].attrs?.summary).toBe('Bold label');

    const none = renderWechat('<details>\n\njust a body\n\n</details>');
    expect(none[0].name).toBe('details');
    expect(none[0].attrs?.summary).toBe('');
    expect(flatten(none[0].children ?? []).some((n) => n.name === 'p')).toBe(true);
  });

  it('leaves other raw html blocks untouched', () => {
    const out = renderWechat('<section>\nplain\n</section>');
    expect(out[0].name).toBe('div');
    expect(out[0].children?.[0].attrs?.value).toContain('<section>');
  });

  it('lets a user extension named details take over rendering', () => {
    const md = new XMarkdownMini({
      escapeText: false,
      extensions: [
        {
          extensions: [
            {
              name: 'details',
              miniRenderer: () => ({ name: 'div', attrs: { class: 'custom-details' } }),
            },
          ],
        },
      ],
    });
    const out = md.renderNodes({
      content: '<details><summary>S</summary></details>',
      platform: 'wechat',
    });
    expect(out[0].attrs?.class).toBe('custom-details');
  });
});
