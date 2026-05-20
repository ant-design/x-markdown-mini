# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # tsup → patch-modern-regex → copy-component-assets (full dist/)
npm test               # vitest run --coverage  (one-shot, not watch)
npm run test:ci        # same + JSON reporter → test-results.json (CI gate consumes this)
npm run lint           # eslint src --ext .ts
npm run bench          # tinybench → benchmark/results.json
npm run bench:check    # bench + fail if any x-markdown-mini scenario regressed >10% vs baseline.json
npm run bench:update   # bench + promote results.json → baseline.json (commit alongside perf change)
npm run check:bundle   # size budgets + ES2018 syntax (es-check) + no named-group regex leak — needs prior build
npm run check:test-rate -- --min 95  # gate on pass rate from test-results.json
```

Single test: `npx vitest run src/__tests__/tokensToWechat.test.ts` (path) or `npx vitest run -t "<a href>"` (name filter).

`npm test` re-runs the full suite; vitest watch mode is intentionally not the default — CI and local dev both want the one-shot.

## Architecture: direct-to-platform transformer

```
markdown string → tokensToWechat(content)   → wechat-final nodes
markdown string → tokensToAlipay(content)   → alipay-final nodes
```

`XMarkdownMini.render` picks one based on resolved target platform. There is **no intermediate IR layer, no separate adapter step, no platform-agnostic transformer**. Platform quirks (wechat's `<a data-href>` rewrite, alipay's https-only images, alipay dropping `<ol start>`) are baked directly into the per-platform transformer. The output node tree (`{ name, attrs, children, animate }`, hast-shaped) is consumed by either native `<rich-text>` or by the in-repo self-rendering components, which dispatch on `node.name` to native primitives (`<text>` / `<view>` / `<image>` / `<scroll-view>`).

See `docs/experiments/2026-05-pipeline-architecture.md` for the empirical A/B/C comparison that drove this design (C beat A by ~17% throughput, eliminated UnifiedNode intermediate and capability-matrix adapter).

- `src/core/tokensToWechat.ts` / `tokensToAlipay.ts` — independent transformers, ~95% structurally identical, ~12 lines of platform-specific divergence. `marked` is a real dependency bundled via tsup `noExternal` (README's "no marked" claim is outdated).
- `escapeText` (default `true`) toggles HTML-entity escaping on text node values. Native `<rich-text>` consumers want `true` (it decodes entities). The in-repo self-rendering components pass `false` because `<text>{{value}}</text>` does not decode entities.
- **Platform list**: `Platform` is `'wechat' | 'alipay'`. README and `docs/platforms.md` still describe 8 platforms (douyin/baidu/qq/kuaishou/dingtalk/jd/other) but those code paths were removed — treat those docs as stale.
- `src/streaming/StreamingProcessor.ts` is **transformer-agnostic** — it takes a `transform: (markdown) => UnifiedNode[]` callback in config. The caller (XMarkdownMini) closes over the transformer choice + render context (escapeText / animation / lexerOptions). StreamingProcessor caches "stable" blocks: commits any region terminated by a double-blank-line outside a fenced code block, never re-runs the transformer on it, and only re-runs on the tail each tick. When `chunkDelay` and `charDelay` are both 0 (prod path), `setTimeout` is bypassed entirely and `onPatch` fires synchronously.
- `src/components/shared/flattenInline.ts` derives marker classes (`md-strong` / `md-em` / `md-del` / `md-inline-code`) from `node.name` during inline-tree flattening, since the transformers themselves strip classes (rich-text ignores them anyway, and self-render templates compute class from name via wxs/sjs helpers).

**Adding a new platform** = copy `tokensToWechat.ts`, rename, modify the ~12 lines of platform divergence (`<a>`, `<ol start>`, `<img src>` handling). Then add the new value to `Platform` union and wire it through `pickTransform` in `src/index.ts`. The accepted trade-off: heading dispatch, list flattening, table rebuild, escape, and most other semantic mapping are duplicated across transformers — bug fixes must be applied to each file.

## Two render entry points

- `render(props)` — global function. **Shares a single `StreamingProcessor` across all callers** — fine for one Markdown view per page, broken for concurrent streams.
- `new XMarkdownMini({ adapt?, escapeText? })` — instantiate per Markdown view when you have multiple concurrent streams. The mini-program components do this in `attached`/`didMount` and `reset()` in `detached`/`didUnmount`.

`runPipeline(content, opts)` from `src/pipeline.ts` is the one-shot path (no streaming, no adapter). `renderOnce` is the same plus lifecycle callbacks but no platform adapt.

## Build outputs (tsup config has 5 entries)

The repo ships one library twice plus four component bundles. The duplication is structural — don't try to "deduplicate":

- `dist/index.{js,mjs}` — npm consumers + Alipay package root (Alipay reads the default package root).
- `dist/miniprogram_dist/index.js` — WeChat-only CJS copy. WeChat reads `package.json#miniprogram` to find this subtree as a package root.
- `dist/{,miniprogram_dist/}shared/flattenInline.js` — `flattenInlineNodes` shipped twice, once per package root. Mini-program `<text>` can't nest custom components, so the components flatten the inline tree before `setData`.
- `dist/{es,miniprogram_dist/es}/{Markdown,RichText}/index.js` — component wrappers. Built with `bundle: true` but a custom esbuild plugin (`externalCorePlugin` in `tsup.config.ts`) marks `../../../index.js` and `../../shared/flattenInline.js` as external and rewrites them to `../../…` so the wrappers only carry component logic and `require` the core from the same package root.

Build post-steps:
- `scripts/patch-modern-regex.mjs` rewrites every `(?<name>…)` regex literal in `dist/index.js`, `dist/index.mjs`, and `dist/miniprogram_dist/index.js` into `new RegExp("…")`. Required because Alipay's compile-time JS parser rejects named-capture-group regex literals even though the runtime supports them. `marked` ships such literals; without this patch Alipay's IDE refuses to compile.
- `scripts/copy-component-assets.mjs` copies `.axml/.acss/.sjs/.wxml/.wxss/.wxs/.json` from `src/components/{alipay,wechat}/` into the right `dist/` subtree, and syncs `dist/` (or `dist/miniprogram_dist/`) into `examples/{alipay,wechat}/dist/` so the example mini-programs are openable in their respective IDEs without symlinks.

## CI gates (`.github/workflows/ci.yml`)

A PR is green only if all of these pass:
- Tests on Node 18/20/22 with **pass-rate ≥ 95%** (full failures don't immediately fail CI; the gate reads `test-results.json`).
- Bundle: per-file size budgets (raw + gzip), ES2018 syntax via `es-check`, and zero named-group regex literals in the post-patch dist. Budgets live in `scripts/check-bundle.mjs` — bump them together with whatever change moved the size.
- Bench (Node 20 only): every `*/x-markdown-mini/*` scenario must stay within 10% of `benchmark/baseline.json`. For an intentional perf change, run `npm run bench:update` and commit the new baseline in the same PR, explaining *why* in the commit message.

## TypeScript target vs runtime target

`tsconfig.json` is `ES2020` for IDE/typecheck; tsup outputs `target: 'es2018'`. **ES2018 is the floor** — `check:bundle` runs `es-check es2018` against the dist. Don't introduce syntax newer than that in source code that ends up bundled (optional chaining `?.` and nullish coalescing `??` are ES2020 features that es-check 7 accepts when the bundler down-emits them, but anything beyond — e.g. logical assignment, top-level `await` — will fail the gate).
