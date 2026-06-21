import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../..');

describe('Alipay inline links', () => {
  it('stays inline and exposes a visible pressed state', () => {
    const axml = readFileSync(
      resolve(root, 'src/components/alipay/MiniNodeRenderer/index.axml'),
      'utf8',
    );
    const acss = readFileSync(
      resolve(root, 'src/components/alipay/Markdown/index.acss'),
      'utf8',
    );

    expect(axml).toMatch(
      /<block\s+a:elif="\{\{node\.name === 'a'\}\}">[\s\S]*?<text[\s\S]*?hover-class="md-link--active"/,
    );
    expect(axml).not.toMatch(/<view\s+a:elif="\{\{node\.name === 'a'\}\}"/);
    expect(acss).toMatch(/\.md-link\s*\{[\s\S]*?display:\s*inline/);
    expect(acss).toContain('.md-link--active');
    expect(acss).toMatch(/\.md-del\s*\{[\s\S]*?text-decoration:\s*line-through/);
  });
});
