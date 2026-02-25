import { defineConfig } from 'vitest/config';
import base from './tsconfig.json' with { type: 'json' };

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    extensions: ['.ts'],
  },
  esbuild: {
    target: (base as { compilerOptions?: { target?: string } }).compilerOptions?.target ?? 'es2020',
  },
});
