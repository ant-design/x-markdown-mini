// Gate on dist/ size budgets + miniprogram compatibility checks.
//
// Three checks:
//   1. Size budgets per file (raw + gzip) — fail on regression past budget.
//   2. No ES2018 named-capture-group regex literals leak into dist/
//      (Alipay's compile-time parser rejects `(?<name>...)` even though
//       runtime JSC/V8 supports it; scripts/patch-modern-regex.mjs converts
//       them to new RegExp("...") form. This verifies the patch ran.)
//   3. Bundle syntax stays within ES2018 (delegates to `es-check`).
//
// Runs after `npm run build`. Exits non-zero on any violation.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const KB = 1024;

// Budgets are based on the 2026-05 baseline post-remend + Marked instance
// integration (index.mjs ~102 KB / gzip ~24 KB, index.js ~104 KB / gzip ~25 KB)
// with ~5 KB raw / ~1 KB gzip headroom. The bundle ships:
// - marked (~30 KB raw): the markdown lexer
// - remend (~16 KB raw): streamingFixup auto-completion of unclosed markdown
// - Marked instance per XMarkdownMini (~1 KB extra over static Lexer.lex) for
//   per-instance extensions / walkTokens isolation
// - htmlToMiniNodes (~5 KB raw / +1 KB gzip): now pulled into the main bundle
//   to support the colocated `XMarkdownTokenizerExtension.renderer` HTML
//   fallback path through customTokenRenderer.
const BUDGETS = [
  // 主库（npm 消费方 + 支付宝默认包根）
  // gzip 28→29 KB：components 合成节点新增 `tag` 字段（宿主 slot/抽象节点按
  //   node.tag 分发自定义组件）。
  // raw +2 KB：内置轻量 Footnote 扩展（`[^标签:内容]` 行内脚注，组件可按名启用）
  //   打进主 bundle，raw ~114.4 KB / mjs ~112.8 KB。
  // raw +1 KB：typewriter mode now requeues unrendered chunks when a new
  // cumulative streaming update arrives before the previous timer chain drains.
  // raw/gzip +~0.6 KB：StreamingProcessor 变速打字机（chunkDelay/charDelay 支持
  //   number[] 随块加速）+ grapheme-safe 切分（Intl.Segmenter，回退 Array.from）。
  { file: 'index.mjs', rawMax: 117 * KB, gzipMax: 30 * KB },
  { file: 'index.js', rawMax: 118 * KB, gzipMax: 30 * KB },
  // 微信专用主库副本（通过 package.json#miniprogram 进入）
  { file: 'miniprogram_dist/index.js', rawMax: 118 * KB, gzipMax: 30 * KB },
  // 共享 helper（alipay 包根 + wechat 包根 各一份）
  { file: 'shared/flattenInline.js', rawMax: 5 * KB },
  { file: 'miniprogram_dist/shared/flattenInline.js', rawMax: 5 * KB },
  // Alipay 组件
  { file: 'es/Markdown/index.js', rawMax: 5 * KB },
  { file: 'es/MiniNodeRenderer/index.js', rawMax: 5 * KB },
  { file: 'components/Markdown/index.js', rawMax: 5 * KB },
  { file: 'components/MiniNodeRenderer/index.js', rawMax: 5 * KB },
  // Wechat 组件
  { file: 'miniprogram_dist/es/Markdown/index.js', rawMax: 5 * KB },
  { file: 'miniprogram_dist/es/MiniNodeRenderer/index.js', rawMax: 5 * KB },
  { file: 'miniprogram_dist/components/Markdown/index.js', rawMax: 5 * KB },
  { file: 'miniprogram_dist/components/MiniNodeRenderer/index.js', rawMax: 5 * KB },
  // Plugin bundles (separate entries — not counted against main lib budget)
  // KaTeX includes font data and CSS; highlight.js/lib/common bundles ~18 languages.
  { file: 'plugins/Latex/index.js', rawMax: 500 * KB, gzipMax: 110 * KB },
  { file: 'plugins/CodeHighlight/index.js', rawMax: 200 * KB, gzipMax: 50 * KB },
  { file: 'miniprogram_dist/plugins/Latex/index.js', rawMax: 500 * KB, gzipMax: 110 * KB },
  { file: 'miniprogram_dist/plugins/CodeHighlight/index.js', rawMax: 200 * KB, gzipMax: 50 * KB },
];

// Files whose JS source must pass the syntax + named-group checks.
// 主库已覆盖 core 代码；组件文件是 wrapper（小），但重复检查它们能捕获将来的回归。
// 按 module system 拆：.mjs 需要 --module，.js 是 CJS。
const COMPAT_ESM_FILES = ['index.mjs'];
const COMPAT_CJS_FILES = [
  'index.js',
  'miniprogram_dist/index.js',
  'shared/flattenInline.js',
  'miniprogram_dist/shared/flattenInline.js',
  'es/Markdown/index.js',
  'es/MiniNodeRenderer/index.js',
  'components/Markdown/index.js',
  'components/MiniNodeRenderer/index.js',
  'miniprogram_dist/es/Markdown/index.js',
  'miniprogram_dist/es/MiniNodeRenderer/index.js',
  'miniprogram_dist/components/Markdown/index.js',
  'miniprogram_dist/components/MiniNodeRenderer/index.js',
  'plugins/Latex/index.js',
  'plugins/CodeHighlight/index.js',
  'miniprogram_dist/plugins/Latex/index.js',
  'miniprogram_dist/plugins/CodeHighlight/index.js',
];
const COMPAT_FILES = [...COMPAT_ESM_FILES, ...COMPAT_CJS_FILES];

// Same regex as scripts/patch-modern-regex.mjs — finds regex literals whose
// body contains a named capture group `(?<name>` or backreference `\k<name>`.
const NAMED_GROUP_REGEX = /\/((?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+?)\/([gimsuy]*)(?=[\s,);.\]])/g;

const errors = [];
const rows = [];

function fmt(bytes) {
  return `${(bytes / KB).toFixed(2)} KB`;
}

// --- 1. size budgets ---
for (const { file, rawMax, gzipMax } of BUDGETS) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    errors.push(`[size] missing ${file} — did you forget to build?`);
    continue;
  }
  const raw = statSync(path).size;
  const gzip = gzipMax != null ? gzipSync(readFileSync(path)).length : null;

  const rawOk = raw <= rawMax;
  const gzipOk = gzip == null || gzip <= gzipMax;

  rows.push({
    file,
    raw: `${fmt(raw)} / ${fmt(rawMax)}`,
    rawOk,
    gzip: gzip == null ? '—' : `${fmt(gzip)} / ${fmt(gzipMax)}`,
    gzipOk,
  });

  if (!rawOk) {
    errors.push(`[size] ${file} raw ${fmt(raw)} > budget ${fmt(rawMax)}`);
  }
  if (!gzipOk) {
    errors.push(`[size] ${file} gzip ${fmt(gzip)} > budget ${fmt(gzipMax)}`);
  }
}

console.log('Bundle size:');
for (const r of rows) {
  const mark = r.rawOk && r.gzipOk ? 'OK  ' : 'FAIL';
  console.log(`  ${mark}  ${r.file.padEnd(46)}  raw ${r.raw}   gzip ${r.gzip}`);
}

// --- 2. named-group regex literal scan ---
console.log('\nCompatibility (named-group regex literals):');
for (const file of COMPAT_FILES) {
  const path = join(dist, file);
  if (!existsSync(path)) continue;
  const src = readFileSync(path, 'utf8');
  let leaked = 0;
  src.replace(NAMED_GROUP_REGEX, (_match, body) => {
    if (/\(\?<[a-zA-Z_][\w]*>/.test(body)) leaked += 1;
    return '';
  });
  if (leaked > 0) {
    errors.push(
      `[compat] ${file} contains ${leaked} regex literal(s) with named capture groups — ` +
        `scripts/patch-modern-regex.mjs did not run, or its match pattern needs an update.`,
    );
    console.log(`  FAIL  ${file} — ${leaked} leaked literal(s)`);
  } else {
    console.log(`  OK    ${file}`);
  }
}

// --- 3. ES2018 syntax check via es-check ---
// Run twice: once for ESM (.mjs needs --module) and once for CJS (.js).
console.log('\nCompatibility (ES2018 syntax via es-check):');
function runEsCheck(label, extraArgs, files) {
  if (files.length === 0) return;
  const args = ['--no-install', 'es-check', ...extraArgs, 'es2018', ...files.map((f) => join('dist', f))];
  const r = spawnSync('npx', args, { cwd: root, encoding: 'utf8' });
  if (r.status === 0) {
    console.log(`  OK    ${label} (${files.length} file${files.length === 1 ? '' : 's'})`);
    return;
  }
  const out = (r.stdout || '') + (r.stderr || '');
  errors.push(
    `[compat] es-check ${label} failed (exit ${r.status}):\n` +
      out.split('\n').filter(Boolean).map((l) => '         ' + l).join('\n'),
  );
  console.log(`  FAIL  ${label}`);
}
runEsCheck('ESM (.mjs)', ['--module'], COMPAT_ESM_FILES);
runEsCheck('CJS (.js)', [], COMPAT_CJS_FILES);

console.log('');
if (errors.length) {
  for (const e of errors) console.error(e);
  console.error(`\ncheck-bundle: ${errors.length} violation(s)`);
  process.exit(1);
}
console.log('check-bundle: all checks passed');
