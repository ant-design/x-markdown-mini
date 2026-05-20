import { describe, it, expect } from 'vitest';
import { StreamingProcessor } from '../streaming/StreamingProcessor.js';
import { tokensToWechat } from '../core/tokensToWechat.js';
import type { UnifiedNode } from '../types.js';

function collect(): {
  patches: UnifiedNode[][];
  push: (proc: StreamingProcessor, content: string, hasNext: boolean) => void;
  done: () => boolean;
  proc: StreamingProcessor;
} {
  const patches: UnifiedNode[][] = [];
  let completed = false;
  const proc = new StreamingProcessor({
    transform: (md) => tokensToWechat(md),
    semanticEnabled: true,
    chunkDelay: 0,
    charDelay: 0,
    onUpdate: () => {},
    onPatch: (nodes) => patches.push(nodes),
    onComplete: () => {
      completed = true;
    },
  });
  return {
    patches,
    proc,
    push(p, content, hasNext) {
      p.handleContentUpdate(content);
      p.runRenderLoop(hasNext);
    },
    done: () => completed,
  };
}

describe('StreamingProcessor (zero-delay synchronous mode)', () => {
  it('emits one patch per push when delays are 0', () => {
    const { proc, patches, push } = collect();
    push(proc, '# Hi', true);
    expect(patches.length).toBe(1);
    push(proc, '# Hi\n\nPara.', true);
    expect(patches.length).toBe(2);
  });

  it('final state matches one-shot render of the same content', () => {
    const md = '# Title\n\nPara one.\n\n- a\n- b\n\n```js\nconst x = 1;\n```\n\n> quote\n';
    const { proc, patches, push } = collect();
    // arrive in 4 chunks
    const parts = [md.slice(0, 10), md.slice(10, 30), md.slice(30, 60), md];
    let acc = '';
    for (let i = 0; i < parts.length; i++) {
      acc = parts[i];
      push(proc, acc, i < parts.length - 1);
    }
    push(proc, md, false);

    const last = patches[patches.length - 1];
    const oneshot = tokensToWechat(md);
    expect(stripAttrs(last)).toEqual(stripAttrs(oneshot));
  });

  it('committed prefix nodes do not change between chunks', () => {
    // After two consecutive blank lines outside a fence, prior blocks should be stable.
    const { proc, patches, push } = collect();
    push(proc, '# Stable\n\n\n', true);
    const stableSnapshot = JSON.stringify(patches[patches.length - 1][0]);
    push(proc, '# Stable\n\n\nNow another paragraph.', true);
    const afterMore = JSON.stringify(patches[patches.length - 1][0]);
    expect(afterMore).toBe(stableSnapshot);
  });

  it('completes only when hasNext=false', () => {
    const { proc, patches, push, done } = collect();
    push(proc, '# Hi', true);
    expect(done()).toBe(false);
    push(proc, '# Hi\n\nPara.', false);
    expect(done()).toBe(true);
    expect(patches.length).toBeGreaterThanOrEqual(2);
  });

  it('handles non-prefix content (resets cleanly)', () => {
    const { proc, patches, push } = collect();
    push(proc, '# Hi', true);
    push(proc, '## Different', false);
    const last = patches[patches.length - 1];
    expect(last[0].name).toBe('h2');
  });
});

/** Drop animate / class to compare structural equivalence. */
function stripAttrs(nodes: UnifiedNode[]): UnifiedNode[] {
  return nodes.map((n) => {
    const out: UnifiedNode = { name: n.name, attrs: { ...n.attrs } };
    if (n.children) out.children = stripAttrs(n.children);
    return out;
  });
}
