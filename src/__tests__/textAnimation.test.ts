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

  it('keeps a completed segment in the same animation layout state', () => {
    const state = createTextAnimationState();
    reconcileTextAnimation(paragraph('a'), state, 100);

    const completed = reconcileTextAnimation(paragraph('a'), state, 500);
    expect(completed[0].children?.[0].animationSegments).toEqual([
      {
        k: 0,
        value: 'a',
        bornAt: 100,
        style: 'animation-delay:-360ms;animation-play-state:paused',
      },
    ]);
  });

  it('finalizes the last stream frame without discarding segment wrappers', () => {
    const state = createTextAnimationState();
    reconcileTextAnimation(paragraph('a'), state, 100);

    const completed = reconcileTextAnimation(paragraph('ab'), state, 160, true);
    expect(completed[0].children?.[0].animationSegments).toEqual([
      {
        k: 0,
        value: 'a',
        bornAt: 100,
        style: 'animation-delay:-360ms;animation-play-state:paused',
      },
      {
        k: 1,
        value: 'b',
        bornAt: 160,
        style: 'animation-delay:-360ms;animation-play-state:paused',
      },
    ]);
  });

  it('animates flattened link leaves so they stay in the same inline run', () => {
    const state = createTextAnimationState();
    const nodes: MiniNode[] = [
      {
        name: 'p',
        children: [
          {
            name: 'a',
            attrs: { value: 'link', class: 'md-link', 'data-href': 'https://e.com' },
          },
        ],
      },
    ];

    const animated = reconcileTextAnimation(nodes, state, 100);
    expect(animated[0].children?.[0].animationSegments?.[0].value).toBe('link');
  });
});
