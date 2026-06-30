import { describe, it, expect } from 'vitest';
import { advanceSegments, initSegmentState, type SegmentState } from './animationSegments';

function feed(values: string[]): SegmentState {
  let state = initSegmentState();
  for (const v of values) state = advanceSegments(state, v);
  return state;
}

function text(state: SegmentState): string {
  return state.segments.map((s) => s.text).join('');
}

describe('advanceSegments', () => {
  it('appends new tail as a fresh segment (typewriter)', () => {
    let state = feed(['a', 'aa', 'aaa']);
    const idsBefore = state.segments.map((s) => s.id);
    state = advanceSegments(state, 'aaab');
    expect(text(state)).toBe('aaab');
    // every previously-shown char keeps its segment id (no re-animation)
    for (const id of idsBefore) expect(state.segments.some((s) => s.id === id)).toBe(true);
    // exactly one new segment for the appended tail
    const newSegs = state.segments.filter((s) => !idsBefore.includes(s.id));
    expect(newSegs).toEqual([expect.objectContaining({ text: 'b' })]);
  });

  it('does NOT re-animate already-shown text when markers are absorbed (the bug)', () => {
    // Real frame sequence for the leaf before "**bold**" closes:
    // "aaa " grows, then transient "*"/"**" markers appear, then get absorbed
    // back to "aaa " when the bold span splits off into a sibling <strong>.
    const before = feed(['aaa ', 'aaa *', 'aaa **']);
    const idsForAaa = before.segments
      .reduce<{ id: number; start: number; end: number }[]>((acc, s) => {
        const start = acc.length ? acc[acc.length - 1].end : 0;
        acc.push({ id: s.id, start, end: start + s.text.length });
        return acc;
      }, [])
      .filter((seg) => seg.start < 'aaa '.length)
      .map((seg) => seg.id);

    const after = advanceSegments(before, 'aaa ');

    expect(text(after)).toBe('aaa ');
    // No NEW segment id may be allocated — nothing genuinely new appeared, so the
    // already-faded "aaa " must keep its ids and never re-fade.
    for (const s of after.segments) {
      expect(idsForAaa).toContain(s.id);
    }
    expect(after.nextId).toBe(before.nextId);
  });

  it('keeps the common prefix stable and only fades a genuinely new tail after a marker swap', () => {
    const before = feed(['aaa ', 'aaa **']);
    const prefixIds = new Set(
      (() => {
        let consumed = 0;
        const ids: number[] = [];
        for (const s of before.segments) {
          if (consumed < 'aaa '.length) ids.push(s.id);
          consumed += s.text.length;
        }
        return ids;
      })(),
    );
    const after = advanceSegments(before, 'aaa bold');
    expect(text(after)).toBe('aaa bold');
    // "aaa " keeps stable ids; "bold" is one new fading segment.
    const newSegs = after.segments.filter((s) => !prefixIds.has(s.id));
    expect(newSegs.map((s) => s.text).join('')).toBe('bold');
  });

  it('resets to a single fading segment when content is wholly replaced', () => {
    const before = feed(['hello world']);
    const after = advanceSegments(before, 'totally different');
    expect(text(after)).toBe('totally different');
    expect(after.segments).toHaveLength(1);
  });

  it('is idempotent for an unchanged value (StrictMode double-render safe)', () => {
    const before = feed(['aaa ', 'aaa b']);
    const after = advanceSegments(before, 'aaa b');
    expect(after).toBe(before);
  });
});
