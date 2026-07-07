// After the main tsup build, copy dist/index.js → dist/miniprogram_dist/index.js
// and dist/shared/flattenInline.js → dist/miniprogram_dist/shared/flattenInline.js.
// This avoids rebuilding the same source twice (tsup entry #2 and flattenInline entries #3-4).
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distRoot = join(root, 'dist');
const mpRoot = join(distRoot, 'miniprogram_dist');

function copy(src, dest) {
  if (!existsSync(src)) {
    console.warn(`[copy-miniprogram-dist] source not found: ${src}`);
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

// Main library CJS bundle
copy(join(distRoot, 'index.js'), join(mpRoot, 'index.js'));

// Shared helpers
copy(
  join(distRoot, 'shared', 'flattenInline.js'),
  join(mpRoot, 'shared', 'flattenInline.js'),
);
copy(
  join(distRoot, 'shared', 'loadKatexFonts.js'),
  join(mpRoot, 'shared', 'loadKatexFonts.js'),
);

console.log('[x-markdown-mini] copied index.js + shared/{flattenInline,loadKatexFonts}.js to miniprogram_dist');