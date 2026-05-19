// x-markdown-mini "streaming" scenario: simulate an LLM feed where each chunk
// is delivered as a delta. Per StreamingProcessor's API contract we hand it
// the *cumulative* content prefix on each call, with hasNextChunk=true until
// the final delta. chunkDelay/charDelay are zero so the processor runs
// synchronously and the measured op = full streaming render of one document.
//
// Each iteration uses a fresh XMarkdownMini instance via beforeEach so the
// internal stable-block cache doesn't carry between iterations.
//
// Naming: `streaming/x-markdown-mini/<sample>`.
import { Bench } from 'tinybench';

import { XMarkdownMini } from '../../src/index.js';

export interface StreamingSample {
  name: string;
  chunks: string[];
}

export function registerStreamingScenarios(bench: Bench, samples: StreamingSample[]): void {
  for (const { name, chunks } of samples) {
    let md: XMarkdownMini | null = null;

    bench.add(
      `streaming/x-markdown-mini/${name}`,
      () => {
        // md is set in beforeEach; non-null assertion is safe inside fn.
        const inst = md!;
        let acc = '';
        for (let i = 0; i < chunks.length; i++) {
          acc += chunks[i];
          inst.render({
            content: acc,
            // Disable platform adapter and pin platform to skip auto-detect
            // (which logs every call and is irrelevant in a benchmark env).
            platform: 'alipay',
            streaming: { hasNextChunk: i < chunks.length - 1 },
            onPatch: noopPatch,
          });
        }
      },
      {
        beforeEach: () => {
          md = new XMarkdownMini({ adapt: false });
        },
      },
    );
  }
}

function noopPatch(): void {
  // intentional no-op: we measure render cost, not consumer cost
}
