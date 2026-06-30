# Benchmark (Node side)

CPU benchmark for `@ant-design/x-markdown-mini`'s core pipeline against
mainstream JS markdown libraries, with a CI regression gate. For the
WeChat-runtime end-to-end comparison see [`examples/wechat-benchmark/`](../examples/wechat-benchmark).

## Layout

```
benchmark/
  samples/
    markdown-it/              # 27 fixtures vendored from markdown-it (MIT)
    streaming/
      ai-chat-long.md         # ~8KB LLM-style document (codeblocks/tables/lists)
      ai-chat-chunked.json    # deterministic chunk sequence for streaming bench
      build-chunks.mjs        # regenerates the chunked JSON from the .md
  scenarios/
    parse.bench.ts            # 4-way: x-markdown-mini vs markdown-it vs marked vs remark
    pipeline.bench.ts         # x-markdown-mini full one-shot (tokensToWechat)
    streaming.bench.ts        # XMarkdownMini fed chunk-by-chunk
  run.ts                      # tinybench driver, writes results.json
  baseline.json               # committed perf baseline — only edit via bench:update
  results.json                # not committed; ephemeral output of `npm run bench`
```

## Commands

```bash
npm run bench           # run all scenarios -> benchmark/results.json
npm run bench:check     # run + compare against baseline.json, fail if any
                        # x-markdown-mini scenario regressed >10%
npm run bench:update    # run + promote results.json to baseline.json
                        # (commit the baseline alongside the perf change)
```

Per-scenario thresholds and the comparison logic live in `scripts/check-bench.mjs`.

## CI integration

`.github/workflows/ci.yml` runs `npm run bench:check` on Node 20 on every PR.
A 10% slowdown on any `*/x-markdown-mini/*` scenario fails the build. We
intentionally don't gate the comparison libraries' numbers — they're for
context, not for protecting *their* perf.

## Updating the baseline

After an intentional perf change:

```bash
npm run bench:update          # rewrites baseline.json
git add benchmark/baseline.json
git commit -m "bench: ... — <why the numbers moved>"
```

The "why" matters: future-you reading `git log benchmark/baseline.json` should
understand whether a baseline shift was a planned optimization, an upstream
dependency bump, or an unintended consequence that needs investigation.

## Notes

- **Why not benchmark mp-html / towxml / wemark here?** Those libraries depend
  on WeChat / Alipay runtime globals (`wx`, `my`) and produce platform-native
  WXML, not Node-runnable output. Trying to mock the runtime would give
  unreliable numbers. They're benchmarked end-to-end in the real miniprogram
  project under `examples/wechat-benchmark/`.
- **Why three Node libraries (markdown-it / marked / remark)?** marked is what
  x-markdown-mini wraps internally so it's the floor we can't beat; markdown-it
  is the industry reference for "fast pure-JS markdown parser"; remark
  represents the unified ecosystem (mdast). These three bracket the perf
  envelope.
- **Why a 500ms run time per case?** Empirically gives <2% RME on the small
  fixtures while keeping the full bench under ~75s wall time on Node 20. The
  long doc (`ai-chat-long.md`) and the streaming case naturally get more
  iterations because they finish each run quickly.
