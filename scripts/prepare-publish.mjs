// Publish-from-dist: make the published tarball's ROOT be the contents of dist/.
//
// Why: Alipay's mini-program compiler resolves npm subpaths RAW from the package
// root filesystem and does NOT honor package.json#exports. With the library nested
// under dist/, a clean import like `@ant-design/x-markdown-mini/es/Markdown/index`
// can't be found (CE1000.01) — Alipay would need an explicit `dist/` prefix.
// By publishing the dist/ directory itself as the package, `es/`, `plugins/`,
// `shared/`, `index.js`, and `miniprogram_dist/` all sit at the package root, so
// the same no-`dist/` import resolves on every platform (Alipay reads the root,
// WeChat reads miniprogram_dist via package.json#miniprogram, npm reads main/exports).
//
// This script runs at the END of `npm run build`. Release = `npm publish dist`
// (see the "release" npm script). The local build still emits to dist/ unchanged,
// so size/bundle gates that read dist/ are unaffected.
import { copyFileSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const src = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

// Paths in the published manifest are relative to the dist/ root (no `dist/` segment).
const pub = {
  name: src.name,
  version: src.version,
  description: src.description,
  main: 'index.js',
  module: 'index.mjs',
  types: 'index.d.ts',
  miniprogram: 'miniprogram_dist',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './index.mjs',
      require: './index.js',
    },
    './es/*': './es/*',
    './shared/*': './shared/*',
    './components/*': './components/*',
    './plugins/Latex': {
      types: './plugins/Latex/index.d.ts',
      import: './plugins/Latex/index.mjs',
      require: './plugins/Latex/index.js',
    },
    './plugins/CodeHighlight': {
      types: './plugins/CodeHighlight/index.d.ts',
      import: './plugins/CodeHighlight/index.mjs',
      require: './plugins/CodeHighlight/index.js',
    },
    './package.json': './package.json',
  },
  // Mini-program component entries register themselves through top-level
  // `Component({...})` calls. They must remain side-effectful or Alipay's
  // bundler can remove the registration while keeping templates and styles.
  sideEffects: src.sideEffects,
  keywords: src.keywords,
  license: src.license,
  // marked/remend are bundled (tsup noExternal), so the published package has no
  // runtime dependencies. devDependencies/scripts are intentionally dropped.
  dependencies: src.dependencies ?? {},
  engines: src.engines,
  publishConfig: src.publishConfig,
  repository: src.repository,
  homepage: src.homepage,
  bugs: src.bugs,
};

if (!existsSync(dist)) {
  throw new Error('[prepare-publish] dist/ not found — run the build first');
}

writeFileSync(join(dist, 'package.json'), JSON.stringify(pub, null, 2) + '\n');

// The changelog files live under changelog/ in the repo but still ship at the
// published package root (dist root) for npm/GitHub discoverability, so their
// source path differs from their destination basename.
const rootFiles = [
  { from: 'README.md', to: 'README.md' },
  { from: 'README.en-US.md', to: 'README.en-US.md' },
  { from: 'LICENSE', to: 'LICENSE' },
  { from: 'changelog/CHANGELOG.zh-CN.md', to: 'CHANGELOG.zh-CN.md' },
  { from: 'changelog/CHANGELOG.en-US.md', to: 'CHANGELOG.en-US.md' },
];
for (const { from, to } of rootFiles) {
  const src = join(root, from);
  if (existsSync(src)) copyFileSync(src, join(dist, to));
}

console.log(
  `[x-markdown-mini] prepared dist/ as publish root (v${pub.version}); release with: npm publish dist`,
);
