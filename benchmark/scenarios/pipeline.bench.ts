// x-markdown-mini "pipeline" scenario: full one-shot render to a platform
// (wechat target chosen as the default — both platform transformers are
// ~95% identical so one is representative). Measures the prod path:
// markdown string -> wechat-final nodes via tokensToWechat.
//
// Naming: `pipeline/x-markdown-mini/<sample>`.
import { Bench } from 'tinybench';

import { tokensToWechat } from '../../src/platforms/wechat/tokensToWechat.js';

export interface PipelineSample {
  name: string;
  content: string;
}

export function registerPipelineScenarios(bench: Bench, samples: PipelineSample[]): void {
  for (const { name, content } of samples) {
    bench.add(`pipeline/x-markdown-mini/${name}`, () => {
      tokensToWechat(content);
    });
  }
}
