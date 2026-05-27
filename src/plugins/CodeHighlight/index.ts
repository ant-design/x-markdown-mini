import hljs from 'highlight.js/lib/core';
import type { LanguageFn } from 'highlight.js';
import type { MiniNode, Token, Tokens, XMarkdownExtension } from '../../index.js';
import { htmlToMiniNodes } from '../shared/htmlToMiniNodes.js';

// Static imports of common language definitions — bundled by tsup (noExternal).
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import shellLang from 'highlight.js/lib/languages/shell';
import cLang from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import yaml from 'highlight.js/lib/languages/yaml';
import markdownLang from 'highlight.js/lib/languages/markdown';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';

export interface CodeHighlightOptions {
  /**
   * Map of language registrations. Keys are language names (or aliases),
   * values are the language definition modules from highlight.js.
   *
   * @example
   * ```ts
   * import javascript from 'highlight.js/lib/languages/javascript';
   * import python from 'highlight.js/lib/languages/python';
   * CodeHighlight({ languages: { javascript, python } })
   * ```
   *
   * When omitted, all commonly-used languages are registered automatically.
   */
  languages?: Record<string, LanguageFn>;
  /** Options forwarded to hljs.highlight(). */
  hljsOptions?: { ignoreIllegals?: boolean };
}

/** Common language aliases to canonical names. */
const ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'shell',
  yml: 'yaml',
  md: 'markdown',
  text: 'plaintext',
};

/** All common language modules for default registration. */
const COMMON_LANGUAGES: Record<string, LanguageFn> = {
  javascript,
  typescript,
  python,
  java,
  css,
  xml,
  json,
  sql,
  bash,
  shell: shellLang,
  c: cLang,
  cpp,
  go,
  rust,
  yaml,
  markdown: markdownLang,
  diff,
  plaintext,
};

/**
 * Register a language module. Silently ignores duplicate registrations.
 */
function safeRegister(name: string, mod: LanguageFn): void {
  try {
    hljs.registerLanguage(name, mod);
  } catch {
    // Already registered
  }
}

export default function CodeHighlight(options: CodeHighlightOptions = {}): XMarkdownExtension {
  const { languages, hljsOptions } = options;
  const ignoreIllegals = hljsOptions?.ignoreIllegals ?? true;

  // Register languages
  if (languages) {
    for (const [name, mod] of Object.entries(languages)) {
      safeRegister(name, mod);
    }
  } else {
    for (const [name, mod] of Object.entries(COMMON_LANGUAGES)) {
      safeRegister(name, mod);
    }
  }

  return {
    extensions: [
      {
        // No tokenizer — we only override the renderer for marked's built-in
        // `code` block token. Returning null from miniRenderer causes
        // renderCustomToken to produce [], and the platform `case 'code':`
        // handler then falls through to its default pre/code block rendering.
        name: 'code',
        miniRenderer: (token: Token, _ctx): MiniNode[] | null => {
          const t = token as Tokens.Code;
          const lang = t.lang?.trim();
          const text = t.text ?? '';

          if (!lang) return null; // No language — fall back to default rendering

          const resolved = ALIASES[lang] || lang;
          if (!hljs.getLanguage(resolved)) return null; // Unknown language — fall back

          try {
            const result = hljs.highlight(text, {
              language: resolved,
              ignoreIllegals,
            });

            const nodes = htmlToMiniNodes(result.value, false);
            return [
              {
                name: 'code',
                attrs: { class: `hljs language-${resolved}` },
                children: nodes,
              },
            ];
          } catch {
            return null; // Highlight failed — fall back to default rendering
          }
        },
      },
    ],
  };
}