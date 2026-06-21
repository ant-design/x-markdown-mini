import katex from 'katex';
import type { MiniNode, Tokens, XMarkdownExtension } from '../../index.js';
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
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode,
      output: 'html',
      ...options.katexOptions,
      // The plugin owns error handling: force KaTeX to throw on invalid input
      // so we never emit its red `.katex-error` markup. This is intentionally
      // set after the spread so a caller's `throwOnError: false` cannot re-enable
      // the broken-formula output (common during streaming of partial formulas).
      throwOnError: true,
    });
  } catch (err) {
    // On a parse error don't render anything by default; `onError` can supply a
    // custom fallback (e.g. show the raw source) if a caller wants one.
    return options.onError ? options.onError(tex, err as Error) : [];
  }
  const nodes = htmlToMiniNodes(html, false);
  const markNodes = (list: MiniNode[]): void => {
    for (const node of list) {
      if (node.name !== 'text' && node.name !== 'br') {
        const current = String(node.attrs?.class ?? '');
        const marker = node.name === 'img' ? 'katex-node katex-img' : 'katex-node';
        node.attrs = { ...node.attrs, class: current ? `${current} ${marker}` : marker };
      }
      if (node.children) markNodes(node.children);
    }
  };
  markNodes(nodes);
  const wrapper = displayMode ? 'div' : 'span';
  const className = displayMode ? 'katex-display' : 'katex-inline';
  return [{ name: wrapper, attrs: { class: className }, children: nodes }];
}

export default function Latex(options: LatexOptions = {}): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'inlineKatex',
        level: 'inline',
        start: inlineStart,
        tokenizer: inlineKatexTokenizer,
        miniRenderer: (token) =>
          renderKatex((token as unknown as { text: string }).text, false, options),
      },
      {
        name: 'blockKatex',
        level: 'block',
        tokenizer: blockKatexTokenizer,
        miniRenderer: (token) =>
          renderKatex((token as unknown as { text: string }).text, true, options),
      },
    ],
  };
}
