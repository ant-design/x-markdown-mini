import type { MiniNode, MiniNodeAnimationSegment } from '../../types.js';

const ANIMATION_DURATION = 360;

interface TextLeafState {
  prev: string;
  nextId: number;
  segments: MiniNodeAnimationSegment[];
}

export interface TextAnimationState {
  leaves: Map<string, TextLeafState>;
}

export function createTextAnimationState(): TextAnimationState {
  return { leaves: new Map() };
}

function prefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

function visualSegment(
  segment: MiniNodeAnimationSegment,
  now: number,
): MiniNodeAnimationSegment {
  const elapsed = Math.max(0, Math.floor(now - segment.bornAt));
  if (elapsed >= ANIMATION_DURATION) {
    return { k: segment.k, value: segment.value, bornAt: segment.bornAt };
  }
  return {
    k: segment.k,
    value: segment.value,
    bornAt: segment.bornAt,
    animate: true,
    style: elapsed ? `animation-delay:-${elapsed}ms` : 'animation-delay:0ms',
  };
}

export function reconcileTextAnimation(
  nodes: MiniNode[],
  state: TextAnimationState,
  now = Date.now(),
): MiniNode[] {
  const seen = new Set<string>();

  const visit = (list: MiniNode[], path: string): void => {
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const nodePath = `${path}/${node.k ?? i}:${node.name}`;

      if (node.name === 'text') {
        const value = String(node.attrs?.value ?? '');
        const prev = state.leaves.get(nodePath) ?? { prev: '', nextId: 0, segments: [] };
        const prefix = prefixLength(prev.prev, value);
        const segments: MiniNodeAnimationSegment[] = [];
        let consumed = 0;

        for (const segment of prev.segments) {
          if (consumed >= prefix) break;
          const end = consumed + segment.value.length;
          segments.push({
            k: segment.k,
            value: end <= prefix
              ? segment.value
              : segment.value.slice(0, prefix - consumed),
            bornAt: segment.bornAt,
          });
          consumed = end;
        }

        let nextId = prev.nextId;
        const tail = value.slice(prefix);
        if (tail) segments.push({ k: nextId++, value: tail, bornAt: now });

        state.leaves.set(nodePath, { prev: value, nextId, segments });
        seen.add(nodePath);
        node.animationSegments = segments.map((segment) => visualSegment(segment, now));
      }

      if (node.children) visit(node.children, `${nodePath}/children`);
      if (node.header) visit(node.header, `${nodePath}/header`);
    }
  };

  visit(nodes, 'root');
  for (const key of state.leaves.keys()) {
    if (!seen.has(key)) state.leaves.delete(key);
  }
  return nodes;
}

export function resetTextAnimation(state: TextAnimationState): void {
  state.leaves.clear();
}
