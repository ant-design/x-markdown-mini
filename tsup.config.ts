import { defineConfig } from 'tsup';

export default defineConfig([
  // 1) Main bundled library (the TS core consumers import from)
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
  // 2) Mini-program component controllers — kept unbundled so each compiles
  //    to its own file and require()'s the bundled core via '../../../index.js'.
  {
    entry: {
      'components/shared/flattenInline': 'src/components/shared/flattenInline.ts',
      'components/alipay/markdown/index': 'src/components/alipay/markdown/index.ts',
      'components/alipay/richtext/index': 'src/components/alipay/richtext/index.ts',
      'components/wechat/markdown/index': 'src/components/wechat/markdown/index.ts',
      'components/wechat/richtext/index': 'src/components/wechat/richtext/index.ts',
    },
    outDir: 'dist',
    format: ['cjs'],
    bundle: false,
    splitting: false,
    sourcemap: false,
    dts: false,
    clean: false,
    target: 'es2018',
  },
]);
