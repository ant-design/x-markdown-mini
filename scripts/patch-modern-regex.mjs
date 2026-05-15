// Alipay mini-program's compile-time JS parser rejects regex literals that use
// ES2018 named capture groups (e.g. `(?<a>...)` / `\k<a>`). The runtime JSC/V8
// supports them at runtime, so we rewrite affected regex literals in the dist
// bundle to `new RegExp("source", "flags")` form. The string body is opaque
// to the parser and only validated at runtime.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Matches a regex literal whose body contains a named capture group `(?<name>`.
// Body cannot contain unescaped '/'; this is true for every named-group regex
// produced by the bundled `marked` library today.
const NAMED_GROUP_REGEX = /\/((?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+?)\/([gimsuy]*)(?=[\s,);.\]])/g;

function patch(file) {
  if (!existsSync(file)) return;
  const src = readFileSync(file, 'utf8');
  let count = 0;
  const out = src.replace(NAMED_GROUP_REGEX, (match, body, flags) => {
    if (!/\(\?<[a-zA-Z_][\w]*>/.test(body)) return match;
    count++;
    return flags
      ? `new RegExp(${JSON.stringify(body)}, ${JSON.stringify(flags)})`
      : `new RegExp(${JSON.stringify(body)})`;
  });
  if (count > 0) {
    writeFileSync(file, out);
    console.log(`[x-markdown-mini] patched ${count} named-group regex literal(s) in ${file}`);
  }
}

patch(join(distDir, 'index.js'));
patch(join(distDir, 'index.mjs'));
