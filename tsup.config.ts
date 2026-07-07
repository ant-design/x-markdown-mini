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
    // loadKatexFonts 现含 20 条 CDN 映射 + 全部字面 + 就绪 API，体量已不小；像 flattenInline
    // 一样 external 成每个包根一份的 shared 模块，避免内联进 4×2 个组件 wrapper 造成体积膨胀。
    build.onResolve({ filter: /^\.\.\/\.\.\/shared\/loadKatexFonts\.js$/ }, () => ({
      path: '../../shared/loadKatexFonts.js',
      external: true,
    }));
    // 组件内部按需 require 插件（CodeHighlight / Latex），把 KaTeX/highlight.js 留在
    // 各自的 plugin bundle 里，绝不打进组件 wrapper。源码写 `../../../plugins/<N>/index.js`
    // （src 里 3 上能解析到 src/plugins/<N>）；输出端组件在 dist/{es,components}/<Comp>/，
    // 到 dist/plugins/<N> 是 2 上，改写成 `../../plugins/<N>/index.js` 并 external。
    build.onResolve({ filter: /^\.\.\/\.\.\/\.\.\/plugins\// }, (args: any) => ({
      path: args.path.replace('../../../plugins/', '../../plugins/'),
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
    // resolve: ['marked'] 把 marked 的 Token/Tokens/MarkedExtension 类型「内联」进
    // 产出的 .d.ts，而不是留下 `import ... from 'marked'`。这样 marked 才能从
    // dependencies 降级为 devDependency（它已被 noExternal 打包进 index.js，不是
    // 运行时外部依赖），消费方零外部依赖、微信 构建npm 不会再去编译独立的 marked。
    dts: { resolve: ['marked'] },
    clean: false,
    sourcemap: false,
    splitting: false,
    target: MINI_PROGRAM_TARGET,
    noExternal: ['marked', 'remend'],
  },
  // 2) shared helpers（仅主 dist；miniprogram_dist 副本由 copy-miniprogram-dist.mjs 生成）
  {
    entry: {
      'shared/flattenInline': 'src/components/shared/flattenInline.ts',
      // loadKatexFonts external 成独立 shared 模块（见 externalRuntimePlugin），组件 wrapper
      // 只 require 它、不内联——净减每个组件包体，且加到 WeChat MiniNodeRenderer 也几乎零成本。
      'shared/loadKatexFonts': 'src/components/shared/loadKatexFonts.ts',
    },
    outDir: 'dist',
    format: ['cjs'],
    // Bundle the text-animation re-exports into this single published helper;
    // consumers only receive shared/flattenInline.js, not source-adjacent files.
    bundle: true,
    dts: false,
    clean: false,
    splitting: false,
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
    // 同主库：插件类型经主库间接引用 marked，内联以免 .d.ts 漏出 `from 'marked'`。
    dts: { resolve: ['marked'] },
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
