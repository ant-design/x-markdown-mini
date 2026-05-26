import katex from 'katex';
import type { MarkedExtension, MiniNode, Plugin, RenderContext, Token, Tokens } from '../../index.js';
import { htmlToMiniNodes } from '../shared/htmlToMiniNodes.js';

export interface LatexOptions {
  /** Options forwarded to katex.renderToString(). */
  katexOptions?: katex.KatexOptions;
  /** Callback invoked when KaTeX rendering fails for a formula. */
  onError?: (tex: string, err: Error) => MiniNode[];
}

// KaTeX doesn't support {align*}; replace with {aligned} (same visual result).
function replaceAlign(text: string): string {
  return text.replace(/\{align\*\}/g, '{aligned}');
}

// --- Tokenizers ---

const inlineRule = /^(?:\${1,2}([^\$\n]+?)\${1,2}|\\\((.+?)\\\))/;
const blockRule = /^(\${1,2})\n([\s\S]+?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\])+?)\\\]/;

function inlineKatexTokenizer(this: any, src: string): Tokens.Generic | undefined {
  const match = src.match(inlineRule);
  if (!match) return undefined;
  const text = replaceAlign((match[1] || match[2]).trim());
  return {
    type: 'inlineKatex',
    raw: match[0],
    text,
    displayMode: false,
  } as unknown as Tokens.Generic;
}

function blockKatexTokenizer(this: any, src: string): Tokens.Generic | undefined {
  const match = src.match(blockRule);
  if (!match) return undefined;
  const text = replaceAlign((match[2] || match[3]).trim());
  return {
    type: 'blockKatex',
    raw: match[0],
    text,
    displayMode: true,
  } as unknown as Tokens.Generic;
}

function inlineStart(src: string): number | undefined {
  const dollarIndex = src.indexOf('$');
  const parenIndex = src.indexOf('\\(');
  if (dollarIndex === -1 && parenIndex === -1) return undefined;
  const index = Math.min(
    dollarIndex === -1 ? Infinity : dollarIndex,
    parenIndex === -1 ? Infinity : parenIndex,
  );
  // Verify the match is actually valid at this position
  const possible = src.slice(index);
  if (possible.match(inlineRule)) return index;
  // If not valid at first '$', skip past it and try from next occurrence
  return undefined;
}

// --- Renderers ---

function renderKatex(tex: string, displayMode: boolean, options: LatexOptions): MiniNode[] {
  try {
    const html = katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      output: 'html',
      ...options.katexOptions,
    });
    const nodes = htmlToMiniNodes(html, false);
    const wrapper = displayMode ? 'div' : 'span';
    const className = displayMode ? 'katex-display' : 'katex-inline';
    return [{ name: wrapper, attrs: { class: className }, children: nodes }];
  } catch (err) {
    if (options.onError) {
      return options.onError(tex, err as Error);
    }
    return [
      {
        name: 'span',
        attrs: { class: 'katex-error' },
        children: [{ name: 'text', attrs: { value: (err as Error).message } }],
      },
    ];
  }
}

export default function Latex(options: LatexOptions = {}): Plugin {
  const extension: MarkedExtension = {
    extensions: [
      {
        name: 'inlineKatex',
        level: 'inline',
        start: inlineStart,
        tokenizer: inlineKatexTokenizer,
      },
      {
        name: 'blockKatex',
        level: 'block',
        tokenizer: blockKatexTokenizer,
      },
    ],
  };

  const inlineRenderer = {
    token: 'inlineKatex',
    render: (token: Token, _ctx: RenderContext): MiniNode[] => {
      const t = token as unknown as { text: string; displayMode: boolean };
      return renderKatex(t.text, false, options);
    },
  };

  const blockRenderer = {
    token: 'blockKatex',
    render: (token: Token, _ctx: RenderContext): MiniNode[] => {
      const t = token as unknown as { text: string; displayMode: boolean };
      return renderKatex(t.text, true, options);
    },
  };

  return {
    extensions: [extension],
    tokenRenderers: [inlineRenderer, blockRenderer],
  };
}