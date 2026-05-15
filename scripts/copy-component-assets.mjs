// 1. Copy mini-program static assets (.axml/.acss/.json/.sjs/.wxml/.wxss/.wxs)
//    from src/components/** to dist/components/**, preserving layout.
// 2. Sync the platform-specific dist subset into examples/{wechat,alipay}/dist/
//    so each example folder is a self-contained mini-program project that
//    WeChat / Alipay DevTools can open directly.
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcRoot = join(root, 'src', 'components');
const distRoot = join(root, 'dist');
const distComponentsRoot = join(distRoot, 'components');
const examplesRoot = join(root, 'examples');

const STATIC_EXT = /\.(axml|acss|json|sjs|wxml|wxss|wxs)$/;

function walkAssets(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      walkAssets(p);
    } else if (STATIC_EXT.test(name)) {
      const rel = relative(srcRoot, p);
      const dest = join(distComponentsRoot, rel);
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(p, dest);
    }
  }
}

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const sp = join(src, name);
    const dp = join(dest, name);
    const s = statSync(sp);
    if (s.isDirectory()) copyTree(sp, dp);
    else copyFileSync(sp, dp);
  }
}

walkAssets(srcRoot);
console.log('[x-markdown-mini] component static assets copied to dist/components');

// Sync dist → examples/{platform}/dist
if (existsSync(examplesRoot)) {
  for (const platform of ['wechat', 'alipay']) {
    const exampleDir = join(examplesRoot, platform);
    if (!existsSync(exampleDir)) continue;

    const out = join(exampleDir, 'dist');
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });

    // Top-level dist files (index.js / index.mjs / .d.ts)
    for (const name of readdirSync(distRoot)) {
      const sp = join(distRoot, name);
      if (statSync(sp).isFile()) copyFileSync(sp, join(out, name));
    }
    // Platform components + shared helpers
    for (const sub of [platform, 'shared']) {
      const src = join(distComponentsRoot, sub);
      if (existsSync(src)) copyTree(src, join(out, 'components', sub));
    }
    console.log(`[x-markdown-mini] examples/${platform}/dist synced`);
  }
}
