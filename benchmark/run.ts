// Bench entrypoint — loads corpora, registers all scenarios, runs tinybench,
// emits benchmark/results.json in the schema documented in benchmark/README.md.
//
// Run with `npm run bench` (which goes through tsx). Override default time
// with --time <ms>; default 500ms balances stat quality vs CI wall time.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Bench } from 'tinybench';

import { registerParseScenarios, type ParseSample } from './scenarios/parse.bench.js';
import { registerPipelineScenarios, type PipelineSample } from './scenarios/pipeline.bench.js';
import {
  registerStreamingScenarios,
  type StreamingSample,
} from './scenarios/streaming.bench.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchDir = __dirname;
const samplesDir = join(benchDir, 'samples');

function arg(flag: string, fallback: string): string {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const time = Number(arg('--time', '500'));
const warmupIterations = Number(arg('--warmup', '50'));

// --- load corpora ---

// markdown-it's own samples are .md/.txt; exclude the NOTICE we vendored alongside.
const NON_CORPUS = new Set(['NOTICE.md', 'README.md']);

function loadMarkdownItSamples(): ParseSample[] {
  const dir = join(samplesDir, 'markdown-it');
  return readdirSync(dir)
    .filter((f) => /\.(md|txt)$/.test(f) && !NON_CORPUS.has(f))
    .sort()
    .map((f) => ({ name: f, content: readFileSync(join(dir, f), 'utf8') }));
}

function loadStreamingSamples(): { parse: ParseSample[]; streaming: StreamingSample[] } {
  const dir = join(samplesDir, 'streaming');
  const longPath = join(dir, 'ai-chat-long.md');
  const chunksPath = join(dir, 'ai-chat-chunked.json');
  const longContent = readFileSync(longPath, 'utf8');
  const chunks: string[] = JSON.parse(readFileSync(chunksPath, 'utf8'));

  return {
    parse: [{ name: basename(longPath), content: longContent }],
    streaming: [{ name: basename(longPath), chunks }],
  };
}

// --- main ---

async function main(): Promise<void> {
  const mdItSamples = loadMarkdownItSamples();
  const streamingCorpus = loadStreamingSamples();

  // The parse scenario covers both markdown-it corpus and the long AI-chat doc
  // (it's a great "real-world long doc" companion to the micro-fixtures).
  const parseSamples: ParseSample[] = [...mdItSamples, ...streamingCorpus.parse];
  const pipelineSamples: PipelineSample[] = parseSamples;

  const bench = new Bench({ time, warmupIterations });
  registerParseScenarios(bench, parseSamples);
  registerPipelineScenarios(bench, pipelineSamples);
  registerStreamingScenarios(bench, streamingCorpus.streaming);

  console.log(
    `running ${bench.tasks.length} scenarios (time=${time}ms, warmup=${warmupIterations} iters)…`,
  );
  await bench.run();

  const out: {
    node: string;
    timestamp: string;
    options: { time: number; warmupIterations: number };
    scenarios: Record<string, { hz: number; rme: number; samples: number }>;
  } = {
    node: process.version,
    timestamp: new Date().toISOString(),
    options: { time, warmupIterations },
    scenarios: {},
  };

  let failed = 0;
  for (const task of bench.tasks) {
    if (!task.result || task.result.error) {
      failed += 1;
      console.error(`  FAIL  ${task.name}  ${task.result?.error?.message ?? 'no result'}`);
      continue;
    }
    out.scenarios[task.name] = {
      hz: task.result.throughput.mean,
      rme: task.result.latency.rme,
      samples: task.result.latency.samples.length,
    };
  }

  writeFileSync(join(benchDir, 'results.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(
    `done: ${Object.keys(out.scenarios).length} ok, ${failed} failed -> benchmark/results.json`,
  );

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
