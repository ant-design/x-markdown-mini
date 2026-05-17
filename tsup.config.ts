import { defineConfig } from 'tsup';

// Mini-program 组件源码里写的是 `../../../index.js` / `../../shared/flattenInline.js`，
// 在 src 里能解析（components/<platform>/Markdown/ → src/index.ts 是 3 上、
// → src/components/shared/flattenInline.js 是 2 上）。
//
// 构建后组件输出目录变成：
//   dist/es/<Comp>/index.js                          (alipay 默认包根)
//   dist/miniprogram_dist/es/<Comp>/index.js         (wechat 通过 package.json#miniprogram 进入)
//
// 此时 core 需要走 `../../index.js`（2 上即可到达 dist 或 dist/miniprogram_dist）；
// shared/flattenInline 仍是 `../../shared/flattenInline.js`（路径串不变）。
//
// 用 bundle: true + 这个插件，把 core 引用 mark 为 external 并把字符串改写为输出端正确的相对路径，
// 组件输出就只剩 wrapper 代码，core 由各自包根的 index.js 提供。
const externalCorePlugin = {
  name: 'external-core',
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

export default defineConfig([
  // 1) 主库 bundle — npm 消费方 + 支付宝默认包根
  {
    entry: { index: 'src/index.ts' },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: false,
    splitting: false,
    target: 'es2018',
    noExternal: ['marked'],
  },
  // 2) 微信专用主库副本 — wechat 通过 miniprogram 字段把 dist/miniprogram_dist 当包根，
  //    `import { render } from '@ant-design/x-markdown-mini'` 解析到这里。
  {
    entry: { index: 'src/index.ts' },
    outDir: 'dist/miniprogram_dist',
    format: ['cjs'],
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: 'es2018',
    noExternal: ['marked'],
  },
  // 3) shared helpers（两份，分别放在 alipay/wechat 各自的包根下）
  {
    entry: { 'shared/flattenInline': 'src/components/shared/flattenInline.ts' },
    outDir: 'dist',
    format: ['cjs'],
    bundle: false,
    dts: false,
    clean: false,
    target: 'es2018',
  },
  {
    entry: { 'shared/flattenInline': 'src/components/shared/flattenInline.ts' },
    outDir: 'dist/miniprogram_dist',
    format: ['cjs'],
    bundle: false,
    dts: false,
    clean: false,
    target: 'es2018',
  },
  // 4) Alipay 组件 — bundle: true 但 core/shared external，输出只剩 wrapper 逻辑
  {
    entry: {
      'es/Markdown/index': 'src/components/alipay/Markdown/index.ts',
      'es/RichText/index': 'src/components/alipay/RichText/index.ts',
    },
    outDir: 'dist',
    format: ['cjs'],
    bundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: 'es2018',
    esbuildPlugins: [externalCorePlugin],
  },
  // 5) Wechat 组件 — 同上，输出到 miniprogram_dist 子树
  {
    entry: {
      'es/Markdown/index': 'src/components/wechat/Markdown/index.ts',
      'es/RichText/index': 'src/components/wechat/RichText/index.ts',
    },
    outDir: 'dist/miniprogram_dist',
    format: ['cjs'],
    bundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    target: 'es2018',
    esbuildPlugins: [externalCorePlugin],
  },
]);
