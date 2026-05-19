// Cross-library "parse" scenario: each library on the same corpus, measuring
// the minimum work it takes to get from markdown string -> the library's
// native intermediate form (tokens / mdast / IR). HTML render is excluded so
// numbers stay comparable across libraries with different output formats.
//
// Naming convention: `parse/<lib>/<sample>` — check-bench.mjs filters on
// `parse/x-markdown-mini/*` for the regression gate.
import { Bench } from 'tinybench';

import MarkdownIt from 'markdown-it';
import { marked } from 'marked';
import { remark } from 'remark';

import { parse as xParse } from '../../src/core/lexer.js';

export interface ParseSample {
  name: string;
  content: string;
}

export function registerParseScenarios(bench: Bench, samples: ParseSample[]): void {
  const mdIt = new MarkdownIt();

  for (const { name, content } of samples) {
    // x-markdown-mini's block-level IR (analogue of markdown-it's Token[]).
    bench.add(`parse/x-markdown-mini/${name}`, () => {
      xParse(content);
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
