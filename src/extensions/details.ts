import type { Token, Tokens } from 'marked';
import type { XMarkdownExtension } from '../types.js';

/**
 * Built-in `<details>` support.
 *
 * marked's html tokenizer splits a `<details>` block at the first blank line,
 * so `<details>` with a markdown body arrives as several unrelated tokens and
 * used to render as raw text. This block tokenizer runs before the built-in
 * html tokenizer and captures the whole `<details>…</details>` region in one
 * `details` token:
 *
 * - `summary`: plain text of the leading `<summary>…</summary>` (tags stripped)
 * - `open`: whether the opening tag carries the `open` attribute
 * - `tokens`: the body lexed as block markdown
 *
 * The shared miniNodeRenderer maps it to a `details` MiniNode that the bundled
 * MiniNodeRenderer components render as a collapsible section.
 *
 * Limitation: the body match is non-greedy to the first `</details>`, so
 * same-tag nesting does not nest (mirrors the `components` sugar limitation).
 */
export interface DetailsToken extends Tokens.Generic {
  type: 'details';
  raw: string;
  summary: string;
  open: boolean;
  tokens: Token[];
}

const DETAILS_RE =
  /^ {0,3}<details((?:\s+[^>]*?)?)>\s*(?:<summary(?:\s+[^>]*?)?>([\s\S]*?)<\/summary>)?([\s\S]*?)<\/details>[ \t]*(?:\n+|$)/i;

export const detailsExtension: XMarkdownExtension = {
  extensions: [
    {
      name: 'details',
      level: 'block',
      start(src: string) {
        const i = src.toLowerCase().indexOf('<details');
        return i < 0 ? undefined : i;
      },
      tokenizer(this: any, src: string): DetailsToken | undefined {
        const m = DETAILS_RE.exec(src);
        if (!m) return undefined;
        const summary = (m[2] ?? '').replace(/<[^>]+>/g, '').trim();
        const body = (m[3] ?? '').trim();
        const tokens: Token[] = [];
        if (body) this.lexer.blockTokens(body, tokens);
        return {
          type: 'details',
          raw: m[0],
          summary,
          open: /(?:^|\s)open(?:\s|=|$)/i.test(m[1] ?? ''),
          tokens,
        };
      },
    },
  ],
};
