// Gate on performance regression of x-markdown-mini scenarios vs baseline.
//
// Compares benchmark/results.json against benchmark/baseline.json. For each
// scenario whose name starts with `<group>/x-markdown-mini/` (we only gate
// our own code, not the comparison libs), computes a relative regression:
//
//   regression = (baseline.hz - current.hz) / baseline.hz
//
// Fails if regression > --threshold (default 0.10 = 10%). Faster-than-baseline
// runs are always OK. Other libs' results are reported informationally only.
//
// Usage: node scripts/check-bench.mjs [--threshold 0.10]
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const threshold = Number(arg('--threshold', '0.10'));
const resultsPath = resolve(root, arg('--results', 'benchmark/results.json'));
const baselinePath = resolve(root, arg('--baseline', 'benchmark/baseline.json'));

if (!existsSync(resultsPath)) {
  console.error(`[check-bench] missing ${resultsPath} — run \`npm run bench\` first`);
  process.exit(2);
}
if (!existsSync(baselinePath)) {
  console.error(
    `[check-bench] missing ${baselinePath} — run \`npm run bench:update\` to seed it`,
  );
  process.exit(2);
}

const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

const OWN_LIB_PATTERN = /^[^/]+\/x-markdown-mini\//;
// Reference parsers benchmarked in the SAME run as our code. GitHub-hosted
// runners vary wildly in absolute throughput (shared vCPUs, noisy neighbors),
// so comparing our raw hz to a baseline recorded on another machine flags every
// scenario as a "regression" when the runner is merely ~2x slower overall.
// Instead, estimate this machine's speed relative to the baseline machine from
// the reference libs (present in both runs) and normalize our numbers by that
// factor before gating — turning the gate into "did we regress *relative to the
// reference parsers*", which is what we actually care about and is
// environment-invariant.
const REF_LIB_PATTERN = /^[^/]+\/(?:marked|markdown-it|remark)\//;

function median(nums) {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const refRatios = [];
for (const [name, cur] of Object.entries(results.scenarios)) {
  if (!REF_LIB_PATTERN.test(name)) continue;
  const base = baseline.scenarios[name];
  if (base && base.hz > 0 && cur.hz > 0) refRatios.push(cur.hz / base.hz);
}
// k > 1 → this machine is faster than the baseline machine; k < 1 → slower.
// Fall back to 1 (raw comparison) if no reference scenarios exist.
const speedFactor = median(refRatios) ?? 1;

const violations = [];
const ownRows = [];
let missingBaseline = 0;
let extraneousBaseline = 0;

for (const [name, cur] of Object.entries(results.scenarios)) {
  if (!OWN_LIB_PATTERN.test(name)) continue;
  const base = baseline.scenarios[name];
  if (!base) {
    missingBaseline += 1;
    ownRows.push({ name, base: null, cur, normalizedHz: cur.hz / speedFactor, regression: null });
    continue;
  }
  // Correct current hz for machine speed, then compare to the baseline.
  const normalizedHz = cur.hz / speedFactor;
  const regression = (base.hz - normalizedHz) / base.hz;
  ownRows.push({ name, base, cur, normalizedHz, regression });
  if (regression > threshold) {
    violations.push({ name, base, cur, normalizedHz, regression });
  }
}

// Count baseline entries that no longer exist in results — informational, not a fail.
for (const name of Object.keys(baseline.scenarios)) {
  if (!OWN_LIB_PATTERN.test(name)) continue;
  if (!(name in results.scenarios)) extraneousBaseline += 1;
}

// --- report ---
console.log(
  `check-bench: threshold ${(threshold * 100).toFixed(1)}%, ` +
    `baseline ${baselinePath.replace(root + '/', '')} (node ${baseline.node}), ` +
    `current ${resultsPath.replace(root + '/', '')} (node ${results.node})`,
);
console.log(
  `  machine-speed factor k=${speedFactor.toFixed(3)} (median over ${refRatios.length} reference-lib ` +
    `scenarios); current hz normalized by 1/k before gating`,
);
console.log('');

const pct = (n) => `${(n * 100).toFixed(2)}%`;
const fmtHz = (n) => `${n.toFixed(0).padStart(10)} hz`;

for (const row of ownRows.sort((a, b) => a.name.localeCompare(b.name))) {
  if (row.base == null) {
    console.log(`  NEW   ${row.name}  ${fmtHz(row.cur.hz)}  (no baseline entry)`);
    continue;
  }
  const mark = row.regression > threshold ? 'FAIL' : row.regression > 0 ? 'slow' : 'OK  ';
  const delta = row.regression >= 0 ? `-${pct(row.regression)}` : `+${pct(-row.regression)}`;
  console.log(
    `  ${mark}  ${row.name.padEnd(56)}  ${fmtHz(row.normalizedHz)}  vs  ${fmtHz(row.base.hz)}  ${delta}  (raw ${row.cur.hz.toFixed(0)})`,
  );
}

console.log('');
if (missingBaseline > 0) {
  console.log(
    `  note: ${missingBaseline} x-markdown-mini scenario(s) have no baseline entry — ` +
      `treated as informational; run \`npm run bench:update\` if these are intentional.`,
  );
}
if (extraneousBaseline > 0) {
  console.log(
    `  note: ${extraneousBaseline} x-markdown-mini scenario(s) exist in baseline but not in current results.`,
  );
}

if (violations.length > 0) {
  console.error('');
  console.error(`check-bench: ${violations.length} regression(s) exceed ${pct(threshold)} (after k=${speedFactor.toFixed(3)} normalization):`);
  for (const v of violations) {
    console.error(`  ${v.name}: ${v.normalizedHz.toFixed(0)} hz (norm) vs baseline ${v.base.hz.toFixed(0)} hz (-${pct(v.regression)})`);
  }
  process.exit(1);
}

console.log('check-bench: all x-markdown-mini scenarios within threshold');
