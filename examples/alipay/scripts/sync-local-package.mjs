import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = join(exampleRoot, '..', '..');
const source = join(repoRoot, 'dist');
const target = join(exampleRoot, 'node_modules', '@ant-design', 'x-markdown-mini');

if (!existsSync(join(source, 'package.json'))) {
  throw new Error('[x-markdown-mini] build dist first: npm run build');
}

rmSync(target, { force: true, recursive: true });
mkdirSync(dirname(target), { recursive: true });
cpSync(source, target, { recursive: true, dereference: true });

console.log('[x-markdown-mini] synced local dist into Alipay node_modules');
