// Gate on dist/ size budgets + miniprogram compatibility checks.
//
// Three checks:
//   1. Size budgets per file (raw + gzip) — fail on regression past budget.
//   2. No ES2018 named-capture-group regex literals leak into dist/
//      (Alipay's compile-time parser rejects `(?<name>...)` even though
//       runtime JSC/V8 supports it; scripts/patch-modern-regex.mjs converts
//       them to new RegExp("...") form. This verifies the patch ran.)
//   3. No object-spread syntax leaks into dist/. Alipay IDE rejects object
//      spread in dependencies even though it is valid ES2018.
//   4. Bundle syntax stays within ES2018 (delegates to `es-check`).
//   5. Published manifest preserves component registration side effects.
//
// Runs after `npm run build`. Exits non-zero on any violation.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const require = createRequire(import.meta.url);

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
  // raw +1 KB：typewriter mode now requeues unrendered chunks when a new
  // cumulative streaming update arrives before the previous timer chain drains.
  // raw/gzip +~0.6 KB：StreamingProcessor 变速打字机（chunkDelay/charDelay 支持
  //   number[] 随块加速）+ grapheme-safe 切分（Intl.Segmenter，回退 Array.from）。
  // raw +~1.1 KB：小程序产物降到 es2017，避免支付宝 IDE 拒绝对象展开语法。
  // mjs raw 118→119：htmlToMiniNodes 改用 sticky 正则按 lastIndex 匹配（消除遍历
  //   KaTeX/hljs HTML 时每个 `<` 的子串分配）+ StreamingProcessor 复用 match.index。
  //   实测 mjs raw ~118.14 KB / gzip 不变 ~29 KB；index.js 仍在 120 内。
  // raw +~1.2 KB：代码块/表格 header 改为数据驱动（renderer 产出默认 header +
  //   copyButton 帮助函数 + buildCodeHeader/buildTableHeader）。实测 mjs raw
  //   ~119.62 KB、index.js ~121.17 KB；预算上调留 ~1 KB headroom。
  // raw +~0.6 KB：patch-modern-regex 把 marked 的 \p{L}\p{N}\p{P}\p{S} 展开成
  //   ASCII+BMP 字符区间（修复微信真机 "Invalid property name in character class"
  //   导致整包 require 失败白屏），展开串比 \p{X} 长。
  { file: 'index.mjs', rawMax: 122 * KB, gzipMax: 30 * KB },
  { file: 'index.js', rawMax: 124 * KB, gzipMax: 31 * KB },
  // 微信专用主库副本（通过 package.json#miniprogram 进入）
  { file: 'miniprogram_dist/index.js', rawMax: 124 * KB, gzipMax: 31 * KB },
  // 共享 helper（alipay 包根 + wechat 包根 各一份）。JS 接入复用时间戳
  // 动画协调器完整内联后约 7.59 KB，只让新增字符渐显，避免微信旧字符重复播放；
  // 入口必须自包含，不能留下未发布的 ./textAnimation.js require。
  // 8→9：新增 resolveLinkHref（anchor 叶子取 href 供 _tap 复制+Toast，两端共用），未压缩
  // 入口含注释后约 8.28 KB。
  { file: 'shared/flattenInline.js', rawMax: 9 * KB },
  { file: 'miniprogram_dist/shared/flattenInline.js', rawMax: 9 * KB },
  // Alipay 组件
  // 5→7：内联 loadKatexFonts（20 个 KaTeX 字面 + loadFontFace 全局注册，仅 latex 时调用），
  // 修复支付宝真机组件作用域 @font-face 不生效，wrapper 约 6.0 KB。
  // 7→13：支付宝真机需要多路径 TTF 字体探测 + 包内字体 root/path 兼容，Markdown wrapper
  // 约 12.0 KB。
  { file: 'es/Markdown/index.js', rawMax: 13 * KB },
  // MiniNodeRenderer 表格溢出测量、缓存和滚动阴影增加约 4 KB wrapper 源码。
  // 7→10：JS 接入页（裸 <mini-node-renderer>，不经 <Markdown>）也要注册 KaTeX 字体，
  // 故此处同样内联 shared/loadKatexFonts（20 个字面，约 +2.4 KB）→ wrapper 约 9.4 KB。
  // 早先这里只有一个仅注册 KaTeX_Math 的本地残桩，体积小但真机其余字体回退系统字体。
  // 10→16：同上，JS 接入直接使用 MiniNodeRenderer，也必须携带支付宝真机字体注册逻辑。
  { file: 'es/MiniNodeRenderer/index.js', rawMax: 16 * KB },
  { file: 'components/Markdown/index.js', rawMax: 13 * KB },
  { file: 'components/MiniNodeRenderer/index.js', rawMax: 16 * KB },
  // Wechat 组件
  // Timestamped typewriter segments resume CSS animation after WeChat rebuilds
  // the node tree; the state reconciler adds ~2.8 KB to the wrapper. The
  // latex/highlight opt-in plugin bake-in (require + extension assembly) adds ~0.5 KB.
  // MiniNodeRenderer table overflow measurement + position-aware edge shadows
  // add ~4 KB to the wrapper (selector query, cached geometry, scroll handler).
  // 7→10：同上叠加 loadKatexFonts；微信 wrapper（含动画协调器）约 9.0 KB。
  // 10→15：微信 Markdown wrapper 同步携带字体路径候选与注册逻辑，约 14.1 KB。
  { file: 'miniprogram_dist/es/Markdown/index.js', rawMax: 15 * KB },
  // 7→8：微信 MiniNodeRenderer 加入同一字体注册入口后约 7.2 KB。
  { file: 'miniprogram_dist/es/MiniNodeRenderer/index.js', rawMax: 8 * KB },
  { file: 'miniprogram_dist/components/Markdown/index.js', rawMax: 15 * KB },
  { file: 'miniprogram_dist/components/MiniNodeRenderer/index.js', rawMax: 8 * KB },
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
const OBJECT_SPREAD_REGEX = /\{\s*\.\.\./;

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

// --- 2b. unicode property escape scan ---
// WeChat's runtime JS engine throws on `\p{...}` ("Invalid property name in
// character class"), aborting the whole bundle's require → blank page.
// scripts/patch-modern-regex.mjs must down-level every `\p{X}` (both `\p{` regex
// literals and `\\p{` new RegExp string bodies).
console.log('\nCompatibility (unicode property escapes):');
for (const file of COMPAT_FILES) {
  const path = join(dist, file);
  if (!existsSync(path)) continue;
  const src = readFileSync(path, 'utf8');
  const leaked = (src.match(/\\p\{[A-Za-z]+\}/g) || []).length;
  if (leaked > 0) {
    errors.push(
      `[compat] ${file} contains ${leaked} unicode property escape(s) (\\p{...}) — ` +
        `scripts/patch-modern-regex.mjs did not run or needs an update; WeChat will blank-screen.`,
    );
    console.log(`  FAIL  ${file} — ${leaked} leaked \\p{...}`);
  } else {
    console.log(`  OK    ${file}`);
  }
}

// --- 3. object-spread syntax scan ---
console.log('\nCompatibility (object-spread syntax):');
for (const file of COMPAT_FILES) {
  const path = join(dist, file);
  if (!existsSync(path)) continue;
  const src = readFileSync(path, 'utf8');
  if (OBJECT_SPREAD_REGEX.test(src)) {
    errors.push(
      `[compat] ${file} contains object-spread syntax — Alipay IDE rejects this in package dependencies.`,
    );
    console.log(`  FAIL  ${file}`);
  } else {
    console.log(`  OK    ${file}`);
  }
}

// --- 4. ES2018 syntax check via es-check ---
// Run twice: once for ESM (.mjs needs --module) and once for CJS (.js).
console.log('\nCompatibility (ES2018 syntax via es-check):');
function runEsCheck(label, extraArgs, files) {
  if (files.length === 0) return;
  const esCheckBin = join(dirname(require.resolve('es-check/package.json')), 'index.js');
  const args = [esCheckBin, ...extraArgs, 'es2018', ...files.map((f) => join('dist', f))];
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
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

// --- 5. component registration side effects ---
// Mini-program component wrappers register themselves through a top-level
// `Component({...})` call. Marking the package side-effect-free lets Alipay's
// bundler remove that call while retaining templates/styles, which only fails
// later at runtime with a misleading "reading 'options'" error.
console.log('\nPublished manifest (component side effects):');
const publishedManifestPath = join(dist, 'package.json');
if (!existsSync(publishedManifestPath)) {
  errors.push('[manifest] missing dist/package.json — did prepare-publish run?');
  console.log('  FAIL  dist/package.json is missing');
} else {
  const publishedManifest = JSON.parse(readFileSync(publishedManifestPath, 'utf8'));
  if (publishedManifest.sideEffects !== true) {
    errors.push(
      '[manifest] dist/package.json must set sideEffects: true so mini-program Component() registration is retained.',
    );
    console.log(`  FAIL  sideEffects is ${JSON.stringify(publishedManifest.sideEffects)}`);
  } else {
    console.log('  OK    sideEffects is true');
  }
}

console.log('\nPublished shared helper exports:');
for (const file of ['shared/flattenInline.js', 'miniprogram_dist/shared/flattenInline.js']) {
  const path = join(dist, file);
  try {
    const helper = require(path);
    const expected = [
      'flattenInlineNodes',
      'createTextAnimationState',
      'reconcileTextAnimation',
      'resetTextAnimation',
    ];
    const missing = expected.filter((name) => typeof helper[name] !== 'function');
    if (missing.length) throw new Error(`missing ${missing.join(', ')}`);
    console.log(`  OK    ${file}`);
  } catch (error) {
    errors.push(`[exports] ${file} is not self-contained: ${error.message}`);
    console.log(`  FAIL  ${file}`);
  }
}

console.log('');
if (errors.length) {
  for (const e of errors) console.error(e);
  console.error(`\ncheck-bundle: ${errors.length} violation(s)`);
  process.exit(1);
}
console.log('check-bundle: all checks passed');
