// Cross-library "parse" scenario: each library on the same corpus, measuring
// the minimum work to get from markdown string -> the library's native
// renderable form. For x-markdown-mini that's wechat-final nodes via
// tokensToWechat (representative of the platform transformers — wechat and
// alipay are ~95% structurally identical).
//
// Naming convention: `parse/<lib>/<sample>` — check-bench.mjs filters on
// `parse/x-markdown-mini/*` for the regression gate.
import { Bench } from 'tinybench';

import MarkdownIt from 'markdown-it';
import { marked } from 'marked';
import { remark } from 'remark';

import { tokensToWechat } from '../../src/core/tokensToWechat.js';

export interface ParseSample {
  name: string;
  content: string;
}

export function registerParseScenarios(bench: Bench, samples: ParseSample[]): void {
  const mdIt = new MarkdownIt();

  for (const { name, content } of samples) {
    bench.add(`parse/x-markdown-mini/${name}`, () => {
      tokensToWechat(content);
    });

    bench.add(`parse/markdown-it/${name}`, () => {
      mdIt.parse(content, {});
    });

    bench.add(`parse/marked/${name}`, () => {
      marked.lexer(content);
    });

    bench.add(`parse/remark/${name}`, () => {
      remark().parse(content);
    });
  }
}
