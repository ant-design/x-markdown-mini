import { defineConfig } from 'tsup';

const MINI_PROGRAM_TARGET = 'es2017';

// Mini-program 组件源码里写的是 `../../../index.js` / `../../shared/flattenInline.js`，
// 在 src 里能解析（components/<platform>/Markdown/ → src/index.ts 是 3 上、
// → src/components/shared/flattenInline.js 是 2 上）。
//
// 构建后组件输出目录变成：
//   dist/es/<Comp>/index.js and dist/components/<Comp>/index.js
//   dist/miniprogram_dist/es/<Comp>/index.js and dist/miniprogram_dist/components/<Comp>/index.js
//
// 此时主库 API 需要走 `../../index.js`（2 上即可到达 dist 或 dist/miniprogram_dist）；
// shared/flattenInline 仍是 `../../shared/flattenInline.js`（路径串不变）。
//
// 用 bundle: true + 这个插件，把主库引用 mark 为 external 并把字符串改写为输出端正确的相对路径，
// 组件输出就只剩 wrapper 代码，主库 API 由各自包根的 index.js 提供。
const externalRuntimePlugin = {
  name: 'external-runtime',
  setup(build: any) {
    build.onResolve({ filter: /^\.\.\/\.\.\/\.\.\/index\.js$/ }, () => ({
      path: '../../index.js',
      external: true,
    }));
    build.onResolve({ filter: /^\.\.\/\.\.\/shared\/flattenInline\.js$/ }, () => ({
      path: '../../shared/flattenInline.js',
      external: true,
    }));
  },
};

// 插件源码在 src/plugins/<Name>/index.ts，引用主库是 `../../index.js`（2 上）。
// 构建后插件输出到 dist/plugins/<Name>/index.js，到 dist/index.js 也是 2 上，路径不变。
// 但插件 bundle 需要 noExternal 卡住 katex / highlight.js，同时 external 掉主库避免重复。
const externalRuntimePluginForPlugins = {
  name: 'external-runtime-plugins',
  setup(build: any) {
    // src/plugins/Latex/index.ts → ../../index.js  (unchanged after build)
    build.onResolve({ filter: /^\.\.\/\.\.\/index\.js$/ }, () => ({
      path: '../../index.js',
      external: true,
    }));
    // Main library bundled deps — don't duplicate them in plugin bundles
    build.onResolve({ filter: /^(marked|remend)$/ }, () => ({
      path: '../../index.js',
      external: true,
    }));
  },
};

export default defineConfig([
  // 1) 主库 bundle — npm 消费方 + 支付宝默认包根
  {
    entry: { index: 'src/index.ts' },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    noExternal: ['marked', 'remend'],
  },
  // 2) shared helpers（仅主 dist；miniprogram_dist 副本由 copy-miniprogram-dist.mjs 生成）
  {
    entry: { 'shared/flattenInline': 'src/components/shared/flattenInline.ts' },
    outDir: 'dist',
    format: ['cjs'],
    bundle: false,
    dts: false,
    clean: false,
    target: MINI_PROGRAM_TARGET,
  },
  // 3) Alipay 组件 — bundle: true 但 runtime/shared external，输出只剩 wrapper 逻辑
  {
    entry: {
      'es/Markdown/index': 'src/components/alipay/Markdown/index.ts',
      'es/MiniNodeRenderer/index': 'src/components/alipay/MiniNodeRenderer/index.ts',
      'components/Markdown/index': 'src/components/alipay/Markdown/index.ts',
      'components/MiniNodeRenderer/index': 'src/components/alipay/MiniNodeRenderer/index.ts',
    },
    outDir: 'dist',
    format: ['cjs'],
    bundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    esbuildPlugins: [externalRuntimePlugin],
  },
  // 4) Wechat 组件 — 同上，输出到 miniprogram_dist 子树
  {
    entry: {
      'es/Markdown/index': 'src/components/wechat/Markdown/index.ts',
      'es/MiniNodeRenderer/index': 'src/components/wechat/MiniNodeRenderer/index.ts',
      'components/Markdown/index': 'src/components/wechat/Markdown/index.ts',
      'components/MiniNodeRenderer/index': 'src/components/wechat/MiniNodeRenderer/index.ts',
    },
    outDir: 'dist/miniprogram_dist',
    format: ['cjs'],
    bundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    esbuildPlugins: [externalRuntimePlugin],
  },
  // 5) Plugin bundles — alipay 默认包根
  //    Each plugin bundles its own deps (katex, highlight.js) but externalises
  //    the main library (marked + remend already in dist/index.js).
  {
    entry: {
      'plugins/Latex/index': 'src/plugins/Latex/index.ts',
      'plugins/CodeHighlight/index': 'src/plugins/CodeHighlight/index.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    noExternal: ['katex', 'highlight.js'],
    esbuildPlugins: [externalRuntimePluginForPlugins],
  },
  // 6) Plugin bundles — wechat 子树（由 copy-miniprogram-dist.mjs 不再需要，
  //    因为 tsup 直接输出；保留此入口以保持一致性）
  {
    entry: {
      'plugins/Latex/index': 'src/plugins/Latex/index.ts',
      'plugins/CodeHighlight/index': 'src/plugins/CodeHighlight/index.ts',
    },
    outDir: 'dist/miniprogram_dist',
    format: ['cjs'],
    bundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    noExternal: ['katex', 'highlight.js'],
    esbuildPlugins: [externalRuntimePluginForPlugins],
  },
]);
