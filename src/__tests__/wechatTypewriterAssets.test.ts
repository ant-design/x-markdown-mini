import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const WXML = readFileSync(
  new URL('../components/wechat/MiniNodeRenderer/index.wxml', import.meta.url),
  'utf8',
);
describe('wechat MiniNodeRenderer typewriter assets', () => {
  it('renders timestamped segments with a resumable negative delay', () => {
    expect(WXML).toContain('wx:for="{{node.animationSegments}}"');
    expect(WXML).toContain('style="{{segment.style || \'\'}}"');
    expect(WXML).toContain("segment.animate ? 'md-anim-char' : ''");
    expect(WXML).not.toContain('<animation-text');
    expect(WXML).not.toContain('wx:for="{{u.charsOf(node)}}"');
  });
});
