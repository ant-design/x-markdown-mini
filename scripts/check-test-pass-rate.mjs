// Reads vitest JSON output and gates on a minimum pass rate.
// Usage:  node scripts/check-test-pass-rate.mjs [--file test-results.json] [--min 95]
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const file = resolve(root, arg('--file', 'test-results.json'));
const min = Number(arg('--min', '95'));

if (!existsSync(file)) {
  console.error(`[check-test-pass-rate] not found: ${file}`);
  process.exit(2);
}

const data = JSON.parse(readFileSync(file, 'utf8'));
const total = data.numTotalTests ?? 0;
const passed = data.numPassedTests ?? 0;
const failed = data.numFailedTests ?? 0;

if (total === 0) {
  console.error('[check-test-pass-rate] no tests reported');
  process.exit(2);
}

const rate = (passed / total) * 100;
const summary = `${passed}/${total} passed (${rate.toFixed(2)}%), ${failed} failed`;

if (rate < min) {
  console.error(`[check-test-pass-rate] FAIL — ${summary}; required ≥ ${min}%`);
  process.exit(1);
}

console.log(`[check-test-pass-rate] OK — ${summary}; required ≥ ${min}%`);
