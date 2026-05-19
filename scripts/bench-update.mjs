// Promote benchmark/results.json to benchmark/baseline.json.
//
// Run this manually after an intentional performance change (optimization,
// algorithm swap) and commit the new baseline alongside the code change. The
// commit message should briefly explain *why* the baseline moved.
//
// Usage: node scripts/bench-update.mjs
import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const src = resolve(root, 'benchmark/results.json');
const dst = resolve(root, 'benchmark/baseline.json');

if (!existsSync(src)) {
  console.error(`[bench-update] missing ${src} — run \`npm run bench\` first`);
  process.exit(2);
}

copyFileSync(src, dst);
console.log(`[bench-update] baseline updated: benchmark/baseline.json`);
console.log('  remember to:');
console.log('    1. inspect the diff (git diff benchmark/baseline.json)');
console.log('    2. commit it WITH the code change that moved perf');
console.log('    3. mention the *why* in the commit message');
