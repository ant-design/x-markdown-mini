import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = fileURLToPath(new URL('..', import.meta.url));
const target = join(
  exampleRoot,
  'node_modules',
  'mp-html',
  'dist',
  'mp-alipay',
  'node',
  'node.js',
);

if (!existsSync(target)) {
  console.log('[x-markdown-mini] mp-html alipay node component is not installed');
  process.exit(0);
}

const source = readFileSync(target, 'utf8');
const fixed = source.replace('props:{childs:,opts:[]}', 'props:{childs:[],opts:[]}');

if (fixed !== source) {
  writeFileSync(target, fixed);
  console.log('[x-markdown-mini] patched mp-html alipay node component');
} else {
  console.log('[x-markdown-mini] mp-html alipay node component already patched');
}
