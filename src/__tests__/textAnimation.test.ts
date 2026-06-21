import { describe, expect, it } from 'vitest';
import {
  createTextAnimationState,
  reconcileTextAnimation,
} from '../components/shared/textAnimation.js';
import type { MiniNode } from '../types.js';

function paragraph(value: string): MiniNode[] {
  return [{ name: 'p', children: [{ name: 'text', attrs: { value } }] }];
}

describe('reconcileTextAnimation', () => {
  it('resumes active characters from elapsed time when WeChat rebuilds the tree', () => {
    const state = createTextAnimationState();
    reconcileTextAnimation(paragraph('a'), state, 100);

    const next = reconcileTextAnimation(paragraph('ab'), state, 160);
    const segments = next[0].children?.[0].animationSegments;

    expect(segments).toEqual([
      { k: 0, value: 'a', bornAt: 100, animate: true, style: 'animation-delay:-60ms' },
      { k: 1, value: 'b', bornAt: 160, animate: true, style: 'animation-delay:0ms' },
    ]);
  });

  it('removes animation after its visual duration has completed', () => {
    const state = createTextAnimationState();
    reconcileTextAnimation(paragraph('a'), state, 100);

    const completed = reconcileTextAnimation(paragraph('a'), state, 500);
    expect(completed[0].children?.[0].animationSegments).toEqual([
      { k: 0, value: 'a', bornAt: 100 },
    ]);
  });
});
