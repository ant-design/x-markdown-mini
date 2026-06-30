import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const WXML = readFileSync(
  new URL('../components/wechat/MiniNodeRenderer/index.wxml', import.meta.url),
  'utf8',
);
describe('wechat MiniNodeRenderer typewriter assets', () => {
  it('renders timestamped segments with resumable character animation', () => {
    expect(WXML).toContain('wx:for="{{node.animationSegments}}"');
    expect(WXML).toContain('style="{{segment.style || \'\'}}"');
    expect(WXML).toContain("segment.animate ? 'md-anim-char' : ''");
    expect(WXML).not.toContain('<animation-text');
    expect(WXML).not.toContain('wx:for="{{u.charsOf(node)}}"');
  });

  it('renders link leaves as direct text siblings in the surrounding flow', () => {
    expect(WXML).toMatch(/<text\s+wx:elif="\{\{node\.name === 'a'\}\}"/);
    expect(WXML).toContain('>{{u.valueOf(node)}}</text>');
    expect(WXML).not.toContain('<block wx:elif="{{node.name === \'a\'}}">');
  });

  it('applies semantic classes to the character segments that paint decoration', () => {
    expect(WXML).toContain('class="{{u.classOf(node)}} {{segment.animate ? \'md-anim-char\' : \'\'}}"');
  });

  it('does not turn inline text runs into inline-block via user-select', () => {
    const textTags = WXML.match(/<text\b[^>]*>/gs) ?? [];
    expect(textTags.some((tag) => tag.includes('user-select='))).toBe(false);
    expect(textTags.some((tag) => tag.includes('selectable="{{selectable}}"'))).toBe(true);
  });
});
