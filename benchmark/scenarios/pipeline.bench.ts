// x-markdown-mini "pipeline" scenario: the full one-shot render path —
// runPipeline(content) = parse + IR + irToUnifiedNodes. Adapter step is
// platform-dependent so it's intentionally excluded here; covered separately
// in streaming.bench.ts implicitly (XMarkdownMini.render with adapt:true).
//
// Naming: `pipeline/x-markdown-mini/<sample>`.
import { Bench } from 'tinybench';

import { runPipeline } from '../../src/pipeline.js';

export interface PipelineSample {
  name: string;
  content: string;
}

export function registerPipelineScenarios(bench: Bench, samples: PipelineSample[]): void {
  for (const { name, content } of samples) {
    bench.add(`pipeline/x-markdown-mini/${name}`, () => {
      runPipeline(content);
    });
  }
}
