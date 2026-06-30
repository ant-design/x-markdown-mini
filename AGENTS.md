# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # tsup → patch-modern-regex → copy-miniprogram-dist → copy-component-assets
npm test               # vitest run --coverage  (one-shot, not watch)
npm run test:ci        # same + JSON reporter → test-results.json (CI gate consumes this)
npm run lint           # eslint src --ext .ts
npm run bench          # tinybench → benchmark/results.json
npm run bench:check    # bench + fail if any x-markdown-mini scenario regressed >10% vs baseline.json
npm run bench:update   # bench + promote results.json → baseline.json (commit alongside perf change)
npm run check:bundle   # size budgets + ES2018 syntax (es-check) + no named-group regex leak — needs prior build
npm run check:test-rate -- --min 95  # gate on pass rate from test-results.json
npm run docs           # build + dumi dev server (docs-site/), live preview of mini-program shells
```

Single test: `npx vitest run src/__tests__/tokensToWechat.test.ts` (path) or `npx vitest run -t "<a href>"` (name filter).

`npm test` re-runs the full suite; vitest watch mode is intentionally not the default — CI and local dev both want the one-shot.

## Public API surface

Three entry points, all backed by a shared `defaultInstance = new XMarkdownMini()` singleton in `src/index.ts`:

- `parse(content)` → marked `Token[]`. Pure lex, no platform mapping.
- `render(content)` / `render(props)` → marked `Token[]`. Same as parse, but the props form supports `streaming`/`onPatch` callbacks for streaming token consumers who do their own rendering.
- `renderNodes(props)` → `MiniNode[]` for mini-program components. Picks a platform renderer based on `props.platform` (default `'auto'`).

For concurrent streams, **construct `new XMarkdownMini(opts)` per view** — the singleton's streaming state is shared across callers. The bundled mini-program components do this in `attached`/`didMount` and `reset()` in `detached`/`didUnmount`.

`XMarkdownMiniOptions`:
- `escapeText` (default `true`) — HTML-entity escape text node values. The default is `true` because the `MiniNode` shape is rich-text-nodes-compatible by lineage (and `<rich-text>` would decode entities); the bundled `MiniNodeRenderer` components pass `false` because their `<text>{{value}}</text>` does not decode entities.
- `streamingFixup` (default `'remend'`) — tail auto-completion of unfinished markdown during streaming (`**bo` → `**bo**`, etc.). `false` disables it; a function replaces it. Only the streaming paths use it; one-shot parse/render never call fixup.
- `gfm` (default `true`) — GFM tables, strikethrough, autolinks. Per-call `renderNodes(props)` / `render(props)` accept a `gfm?` override.
- `breaks` (default `false`) — soft line breaks become `<br>`. Per-call `renderNodes(props)` / `render(props)` accept a `breaks?` override.
- `extensions: (XMarkdownExtension | MarkedExtension)[]` — forwarded to `new Marked(...)`, instance-scoped (never mutates the global marked singleton). Extensions are baked in at construction and cannot vary per call.
- `components: string[]` — whitelist of literal custom-component tags that get an auto-synthesized inline tokenizer (`<ant-button>X</ant-button>` → MiniNode named `ant-button`). User-registered extensions with the same name win over the synth.

## Architecture: direct-to-platform transformer

```
markdown string → marked.lexer → Token[] → tokensToWechat / tokensToAlipay → MiniNode[]
```

`renderNodes` resolves the target platform (`resolvePlatform`), looks up a `PlatformRenderer` from `RENDERERS` in `src/platforms/index.ts`, and calls `renderer.renderTokens(tokens, ctx)`. There is **no intermediate IR layer, no separate adapter step, no platform-agnostic transformer**. Platform quirks (wechat's `<a data-href>` rewrite, alipay's https-only images, alipay dropping `<ol start>`) are baked directly into the per-platform transformer. The output `MiniNode` tree (`{ name, attrs, children, animate }`, hast-shaped — rich-text-nodes-compatible by lineage) is rendered by the in-repo `MiniNodeRenderer` component, which dispatches on `node.name` to native primitives (`<text>` / `<view>` / `<image>` / `<scroll-view>`). We render the tree ourselves rather than feeding it to native `<rich-text>`: `<rich-text>` is an HTML-rich-text renderer that would re-impose a tag/attr whitelist, strip events, and block per-node animation — pointless when the tree is already our own structured data.

See `docs/experiments/2026-05-pipeline-architecture.md` for the empirical A/B/C comparison that drove this design (C beat A by ~17% throughput, eliminated UnifiedNode intermediate and capability-matrix adapter).

- `src/platforms/wechat/tokensToWechat.ts` / `src/platforms/alipay/tokensToAlipay.ts` — independent transformers, ~95% structurally identical, ~12 lines of platform-specific divergence. `marked` is a real dependency bundled via tsup `noExternal`.
- **Platform list**: `Platform` is `'wechat' | 'alipay'` (declared in `src/platforms/types.ts`). Default fallback when runtime detection fails is `'alipay'`.
- Runtime detection in `src/platforms/index.ts` reads `typeof my` / `typeof wx` (not `globalThis[...]`) because old Alipay base libraries lack `globalThis`, and `typeof` on an undeclared identifier doesn't throw.
- `src/streaming/StreamingProcessor.ts` is **generic and transformer-agnostic** — `StreamingProcessor<T>` takes a `transform: (markdown) => T[]` callback. `XMarkdownMini` instantiates it twice with different `T`: once for `Token[]` (the `renderTokens` path used by `render(props)`) and once for `MiniNode[]` (the `renderNodes(props)` path). Each transform closure captures the marked options, render context, and (for nodes) the resolved platform renderer.
- StreamingProcessor caches "stable" blocks: commits any region terminated by a **double-blank-line outside a fenced code block**, never re-runs the transformer on it, and only re-runs on the tail each tick. When `chunkDelay` and `charDelay` are both 0 (prod path), `setTimeout` is bypassed entirely and `onPatch` fires synchronously. `fixup` (remend) only runs on the *uncommitted tail*, never on stable nodes.
- `src/components/shared/flattenInline.ts` (operates on `MiniNode`) and `src/components/shared/flattenInlineTokens.ts` (operates on marked `Token`) flatten inline trees because mini-program `<text>` cannot nest custom components. The shipped `MiniNodeRenderer` components require flattened input before `setData`.

**Adding a new platform** = copy `src/platforms/wechat/` to `src/platforms/<new>/`, modify the ~12 lines of platform divergence (`<a>`, `<ol start>`, `<img src>` handling), then in `src/platforms/index.ts` add the new value to the `Platform` union, append a detector to `DETECTORS`, and register a renderer in `RENDERERS`. The accepted trade-off: heading dispatch, list flattening, table rebuild, escape, and most other semantic mapping are duplicated across transformers — bug fixes must be applied to each file.

## Marked extensions + custom token renderers

`XMarkdownMini` exposes `extensions` for end-user extensibility (LaTeX, code highlight, mentions, etc.):

- `extensions: (XMarkdownExtension | MarkedExtension)[]` is fed to `new Marked(...extensions)`, fully isolated from the global marked singleton. Includes the usual marked surface (`extensions`/`tokenizer`/`renderer`/`walkTokens`/`hooks`). `walkTokens` is re-invoked inside `parse()` because marked's `lexer()` skips it.
- `XMarkdownExtension` is the preferred shape — each tokenizer entry can colocate `miniRenderer(token, ctx) => MiniNode | MiniNode[]` (no HTML round-trip). A marked-style `renderer(token) => string` is also accepted and run through `htmlToMiniNodes`. Without any matching renderer, unknown tokens are silently dropped. Resolution lives in `src/platforms/shared/customTokenRenderer.ts` (extensions first).

This is the supported way to add LaTeX, code-block highlighting (lazy-loaded), or app-specific syntax without forking transformers.

## Build outputs (tsup config has 4 entries)

The repo ships one library twice plus four component bundles. The duplication is structural — don't try to "deduplicate":

- `dist/index.{js,mjs}` — npm consumers + Alipay package root (Alipay reads the default package root).
- `dist/miniprogram_dist/index.js` — WeChat-only CJS copy. WeChat reads `package.json#miniprogram` to find this subtree as a package root. **This file is not built by tsup directly** — `scripts/copy-miniprogram-dist.mjs` copies `dist/index.js` over after the tsup build to avoid bundling marked + remend twice.
- `dist/{,miniprogram_dist/}shared/flattenInline.js` — `flattenInlineNodes` shipped twice, once per package root. The wechat copy is also produced by `copy-miniprogram-dist.mjs`.
- `dist/{es,miniprogram_dist/es}/{Markdown,MiniNodeRenderer}/index.js` — component wrappers. Built with `bundle: true` but a custom esbuild plugin (`externalRuntimePlugin` in `tsup.config.ts`) marks `../../../index.js` and `../../shared/flattenInline.js` as external and rewrites them to `../../…` so the wrappers only carry component logic and `require` the core from the same package root.

Source layout for components (`src/components/<platform>/<Comp>/`) ships co-located template assets (`.axml`/`.acss`/`.sjs` for alipay, `.wxml`/`.wxss`/`.wxs` for wechat) plus an `index.json` and the wrapper `index.ts`.

Build post-steps:
- `scripts/patch-modern-regex.mjs` rewrites every `(?<name>…)` regex literal in `dist/index.js` and `dist/index.mjs` into `new RegExp("…")`. Required because Alipay's compile-time JS parser rejects named-capture-group regex literals even though the runtime supports them. `marked` ships such literals; without this patch Alipay's IDE refuses to compile. Runs **before** `copy-miniprogram-dist.mjs` so the wechat copy inherits the patched form.
- `scripts/copy-miniprogram-dist.mjs` (post-patch) copies `dist/index.js` + `dist/shared/flattenInline.js` into `dist/miniprogram_dist/` so the wechat package root mirrors the alipay one without a second tsup build.
- `scripts/copy-component-assets.mjs` copies `.axml/.acss/.sjs/.wxml/.wxss/.wxs/.json` from `src/components/{alipay,wechat}/` into the right `dist/` subtree, and syncs `dist/` (or `dist/miniprogram_dist/`) into `examples/{alipay,wechat}/dist/` so the example mini-programs are openable in their respective IDEs without symlinks.

## CI gates (`.github/workflows/ci.yml`)

A PR is green only if all of these pass:
- Tests on Node 18/20/22 with **pass-rate ≥ 95%** (full failures don't immediately fail CI; the gate reads `test-results.json`).
- Bundle: per-file size budgets (raw + gzip), ES2018 syntax via `es-check`, and zero named-group regex literals in the post-patch dist. Budgets in `scripts/check-bundle.mjs` are tuned to ~108 KB raw / ~26 KB gzip for the main library (covers marked + remend + per-instance `Marked` overhead). Bump them together with whatever change moved the size.
- Bench (Node 20 only): every `*/x-markdown-mini/*` scenario must stay within 10% of `benchmark/baseline.json`. For an intentional perf change, run `npm run bench:update` and commit the new baseline in the same PR, explaining *why* in the commit message.

## TypeScript target vs runtime target

`tsconfig.json` is `ES2020` for IDE/typecheck; tsup outputs `target: 'es2018'`. **ES2018 is the floor** — `check:bundle` runs `es-check es2018` against the dist. Don't introduce syntax newer than that in source code that ends up bundled (optional chaining `?.` and nullish coalescing `??` are ES2020 features that es-check 7 accepts when the bundler down-emits them, but anything beyond — e.g. logical assignment, top-level `await` — will fail the gate).
