// Splits ai-chat-long.md into a deterministic chunk sequence resembling LLM
// streaming output (~80 chars per chunk, preferring natural breakpoints).
//
// Output: ai-chat-chunked.json — an array of *delta* strings. Concatenated
// they reproduce the source file exactly. The streaming bench accumulates
// these into the cumulative-content prefix that StreamingProcessor expects.
//
// Re-run with: node benchmark/samples/streaming/build-chunks.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'ai-chat-long.md');
const OUT = join(__dirname, 'ai-chat-chunked.json');

// Tunables — chosen to be close to typical Claude/GPT token boundary sizes.
const TARGET = 80;
const MIN = 40;
const MAX = 120;

// Prefer to cut after one of these (in priority order): newline > CJK punct >
// ASCII sentence ender > space. Matches StreamingProcessor's own delimiter set.
const PREFERRED = ['\n', '。', '！', '？', '；', '：', '，', '、', '. ', '! ', '? ', '; ', ': ', ', ', ' '];

function nextCut(text, start) {
  if (start >= text.length) return -1;
  const end = Math.min(text.length, start + MAX);
  // Inside [start+MIN, start+MAX] look for the latest preferred breakpoint.
  // Walk preferences in order so '\n' wins over '，'.
  for (const sep of PREFERRED) {
    const windowStart = start + MIN;
    if (windowStart >= end) continue;
    const slice = text.slice(windowStart, end);
    const rel = slice.lastIndexOf(sep);
    if (rel >= 0) return windowStart + rel + sep.length;
  }
  // No preferred breakpoint — hard cut at TARGET.
  return Math.min(start + TARGET, text.length);
}

const src = readFileSync(SRC, 'utf8');
const chunks = [];
let i = 0;
while (i < src.length) {
  const cut = nextCut(src, i);
  if (cut <= i) {
    // safety: never produce empty / regressive chunks
    chunks.push(src.slice(i, i + 1));
    i += 1;
    continue;
  }
  chunks.push(src.slice(i, cut));
  i = cut;
}

const joined = chunks.join('');
if (joined !== src) {
  console.error('chunk reconstruction does not match source — refusing to write');
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(chunks, null, 0) + '\n');
console.log(
  `wrote ${chunks.length} chunks (avg ${Math.round(src.length / chunks.length)} chars) -> ${OUT}`,
);
