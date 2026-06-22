import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

describe('platform presentation consistency', () => {
  it('keeps links in the surrounding inline text flow (shared element styles)', () => {
    // 元素级样式现统一在共享 elements.css，构建时复制为各端 MiniNodeRenderer 的
    // elements.{wxss,acss} 并 @import，微信/支付宝共用同一份。
    const css = source('../components/shared/elements.css');
    expect(css).toMatch(/\.md-link\s*\{[^}]*display:\s*inline;/s);
  });

  it('centers Alipay display math in a full-width block', () => {
    const acss = source('../plugins/Latex/style.acss');
    expect(acss).toMatch(
      /\.katex-display\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;[^}]*text-align:\s*center;/s,
    );
  });
});
