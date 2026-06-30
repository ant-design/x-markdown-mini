// Down-levels two classes of ES2018 regex syntax that the Alipay compile-time
// parser and/or the WeChat runtime JS engine reject, even though Node/V8 accept
// them:
//
//   1. Named capture groups (`(?<a>...)` / `\k<a>`) — Alipay's *compile-time*
//      parser rejects the literal. We rewrite affected literals to
//      `new RegExp("source", "flags")`, whose body is opaque to the parser.
//
//   2. Unicode property escapes (`\p{L}` `\p{N}` `\p{P}` `\p{S}`) — the WeChat
//      mini-program JS engine throws at *runtime* ("Invalid property name in
//      character class") when `new RegExp(... \p{...} ...)` is constructed, so
//      `marked`'s module load aborts and the whole bundle fails to require
//      (blank page). Lookbehind is fine: marked feature-detects it and the
//      engine supports it; only `\p{...}` is missing. We replace the property
//      escapes with ASCII + BMP-range approximations (good enough for marked's
//      emphasis/word-boundary delimiter-run checks). Applied to both regex
//      literals (`\p{L}`) and `new RegExp` string bodies (`\\p{L}`).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Matches a regex literal whose body contains a named capture group `(?<name>`.
// Body cannot contain unescaped '/'; this is true for every named-group regex
// produced by the bundled `marked` library today.
const NAMED_GROUP_REGEX = /\/((?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+?)\/([gimsuy]*)(?=[\s,);.\]])/g;

// Character-class fragments replacing each `\p{X}` (drop-in inside `[...]`).
// `\p{L}` letters → ASCII letters + everything ≥ U+00C0 (covers CJK, accents);
// `\p{N}` numbers → 0-9; `\p{P}`/`\p{S}` punctuation/symbols → ASCII punct+sym.
const PROP_FRAGMENT = {
  L: 'A-Za-z\\u00C0-\\uFFFF',
  N: '0-9',
  P: '\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E',
  S: '\\u0024\\u002B\\u003C-\\u003E\\u005E\\u0060\\u007C\\u007E',
};

// Replace every `\p{X}` (literal, one backslash) and `\\p{X}` (inside a
// `new RegExp("...")` string, two backslashes) with its ASCII/BMP fragment.
// String form is handled first so the literal pass can't corrupt it.
function downlevelUnicodeProps(src) {
  let s = src;
  let count = 0;
  for (const name of ['L', 'N', 'P', 'S']) {
    const frag = PROP_FRAGMENT[name];
    const stringFrag = frag.replace(/\\u/g, '\\\\u'); // `\u` → `\\u` for string bodies
    const stringForm = '\\\\p{' + name + '}'; // file text: \\p{X}
    const literalForm = '\\p{' + name + '}'; // file text: \p{X}
    while (s.indexOf(stringForm) !== -1) { s = s.replace(stringForm, stringFrag); count++; }
    while (s.indexOf(literalForm) !== -1) { s = s.replace(literalForm, frag); count++; }
  }
  return { out: s, count };
}

function patch(file) {
  if (!existsSync(file)) return;
  const src = readFileSync(file, 'utf8');
  let count = 0;
  let out = src.replace(NAMED_GROUP_REGEX, (match, body, flags) => {
    if (!/\(\?<[a-zA-Z_][\w]*>/.test(body)) return match;
    count++;
    return flags
      ? `new RegExp(${JSON.stringify(body)}, ${JSON.stringify(flags)})`
      : `new RegExp(${JSON.stringify(body)})`;
  });
  const props = downlevelUnicodeProps(out);
  out = props.out;
  if (count > 0 || props.count > 0) {
    writeFileSync(file, out);
    console.log(
      `[x-markdown-mini] patched ${count} named-group + ${props.count} unicode-property regex(es) in ${file}`,
    );
  }
}

patch(join(distDir, 'index.js'));
patch(join(distDir, 'index.mjs'));

// Plugin bundles — KaTeX and hljs may contain named-group regexes
for (const plugin of ['Latex', 'CodeHighlight']) {
  patch(join(distDir, 'plugins', plugin, 'index.js'));
  patch(join(distDir, 'miniprogram_dist', 'plugins', plugin, 'index.js'));
}
