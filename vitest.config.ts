import { defineConfig } from 'vitest/config';
import base from './tsconfig.json' with { type: 'json' };

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      // Mini-program component wrappers depend on host globals (Component, wx,
      // my, etc.) and can only be exercised on the platform itself — exclude
      // them from coverage so the table reflects code we actually unit-test.
      exclude: [
        'src/**/__tests__/**',
        'src/components/alipay/**',
        'src/components/wechat/**',
        'src/components/shared/**',
      ],
    },
  },
  resolve: {
    extensions: ['.ts'],
  },
  esbuild: {
    target: (base as { compilerOptions?: { target?: string } }).compilerOptions?.target ?? 'es2020',
  },
});
