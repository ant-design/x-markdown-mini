---
title: Changelog
---

# Changelog

User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.

> The site's `/changelog` timeline is generated from this file (`docs-site/scripts/build-changelog.mjs` parses the `## version` / `` `date` `` / `- **type**: …` structure). Add a new block at the top when releasing; `npm run changelog` helps assemble entries from merged PRs. Types are **Breaking** / **Added** / **Fixed** / **Improved**.

## 1.1.0

`2026-08-31`

- **Added**: built-in `<details>` support. `<details><summary>…</summary>…</details>` previously rendered as raw text — marked's html tokenizer splits the region at blank lines into several unrelated tokens, so the opening and closing tags leaked around otherwise-rendered content. A built-in block tokenizer now captures the whole region: `<summary>` becomes a plain-text title (tags stripped), the body is lexed as regular block markdown (including blank-line-separated paragraphs and lists), and `<details open>` starts expanded. The bundled `MiniNodeRenderer` (WeChat / Alipay) renders it as a collapsible section — tapping the summary row toggles it, collapsed by default. **Behavior change:** `parse()` / `render()` now emit a new `details` token type and this markdown no longer takes the raw `html` text path; an extension registered as `name: 'details'` still overrides the built-in entirely.
- **Fixed**: per-call extensions passed to `render(props)` / `renderNodes(props)` leaked into later calls. `applyPerCallExtensions` snapshotted `marked.defaults` with a shallow spread, but marked's `use()` mutates the existing `defaults.extensions` container and the `renderer` / `tokenizer` instances **in place**, so the snapshot aliased the very objects it was meant to restore. This previously only triggered when the instance already had `extensions` configured (container already present). All three are now cloned preserving their prototypes.
- **Improved**: the built-in `<details>` tokenizer adds roughly 1.3 KB raw (~0.4 KB gzip) to the main library; `check-bundle` size budgets were raised to match.

## 1.0.2

`2026-07-07`

- **Fixed**: KaTeX formulas fell back to the system font on the Alipay real device. On device `my.loadFontFace` only accepts an https network font whose domain is on the download allowlist; package-local ttf paths and base64 data URIs work only in the simulator (they appeared to work in this repo's own examples only because the examples sync the fonts to the project root). KaTeX fonts now load from a whitelisted CDN (`mdn.alipayobjects.com`, 20 ttf). **Consumers must add the font CDN domain to their mini-program download allowlist.** WeChat keeps its resolvable local `miniprogram_npm` ttf (first) + shared CDN (fallback).
- **Fixed**: whole-page flicker while streaming formulas. `MiniNodeRenderer` re-registered a font-ready callback on every chunk, and the callback fired synchronously once fonts were cached, unmounting/remounting the entire render tree each chunk. Each component instance now reflows at most once, and only when there is a formula, fonts aren't ready yet, and streaming is not in progress.
- **Fixed**: ordered-list markers (e.g. `1.`) wrapped across lines while streaming. The per-character entrance animation split the marker into separate `<text>` boxes, so `1` and `.` broke onto different lines inside the 28rpx-wide marker column. Markers now render as a single `<text>`, matching WeChat.
- **Fixed**: bundlers that honor `package.json#exports` (e.g. Minifish 2.0) couldn't resolve and failed to load the `<markdown>` component. Added `./es/Markdown/index` and `./es/MiniNodeRenderer/index` no-extension subpath export maps (Node's `*` glob does not auto-append extensions).
- **Improved**: removed the inlined base64 font data module (`katex-font-data.js`) and the Alipay-root ttf; the font loader is now shipped once per package root (`shared/loadKatexFonts.js`) instead of inlined into every component wrapper. Smaller package.

## 1.0.1

`2026-07-05`

- **Added**: extensions can override built-in element rendering. When an extension's `name` matches a built-in token type (e.g. `table`, `code`), its `miniRenderer` fully takes over that token's rendering. Previously only `code` supported this; now `table` can be overridden too. Providing only a `miniRenderer` (no `tokenizer`) keeps marked's built-in parsing; returning `null` falls back to the built-in rendering.
- **Fixed**: `\[ … \]` display math was not recognized when it immediately followed a text line (no blank separator). `blockKatex` had no `start`, so the line was absorbed into the paragraph and its `\[`/`\]` degraded to escape tokens; a block `start` now interrupts the paragraph and recognizes the display math.
- **Fixed**: the whole bundle blanked on iOS < 15.4 / older base libraries. The bundled `marked` lexer calls `Array.prototype.at` (`.at(-1)`), which those engines lack, throwing `x.at is not a function` — `tsup` only lowers syntax (not built-in methods) and `es-check` (syntax-only) couldn't catch it. Ships a guarded, non-enumerable `Array/String#at` polyfill loaded before any lexer code, plus a `check-bundle` gate against other un-polyfilled runtime methods.
- **Fixed**: inline code `code` showed spurious gaps mid-word while streaming. The per-character / per-segment entrance animation splits the inline-code text into several leaf `<text>` nodes, and each leaf carried the `md-inline-code` pill's padding, margin and background — so the pills tiled with visible gaps (worst on Alipay, which splits per character).
  - The pill box (background / padding / radius) now paints only on the outer container; the split character leaves use a font-only `md-inline-code-txt` class instead (Alipay `<text>` does not inherit font-family, so the monospace font must stay on the leaf). Fixed on both WeChat and Alipay.

## 1.0.0

`2026-07-03`

- **Breaking**: `XMarkdownMiniOptions` collapsed. `lexerOptions` / top-level `extensions` / `plugins` are gone, replaced by a single `options: { gfm?, breaks?, extensions? }` bag. The `Plugin` type is removed.
  - Migration: `{ extensions: [...] }` → `{ options: { extensions: [...] } }`; `{ plugins: [Latex(), CodeHighlight()] }` → `{ options: { extensions: [Latex(), CodeHighlight()] } }`; `{ lexerOptions: { gfm } }` → `{ options: { gfm } }`.
- **Breaking**: the bundled `<markdown />` component renames its `plugins` prop to `extensions`.
- **Added**: `MarkedConfig` exported, describing the constructor's marked-side configuration bag.
- **Added**: bundle marked's lexer into the build. Full ESM bundle around 103 KB / ~25 KB gzip.
- **Added**: streaming incremental parsing — committed blocks are cached as `stableNodes`, only the tail is re-lexed.
- **Added**: WeChat / Alipay `PlatformRenderer`, exposing platform capabilities and the token-to-node entry point.
- **Added**: `XMarkdownExtension` interface — colocates the tokenizer and its `miniRenderer` on a single object. `tokenRenderers` is retained as a fallback.
- **Fixed**: animation-class merge bug — with `animation` enabled, block-level nodes no longer drop their semantic class.
- **Improved**: when `chunkDelay = charDelay = 0`, skip the setTimeout chain and push synchronously.
- **Improved**: emit semantic `<strong>` / `<em>` instead of `<b>` / `<i>`.
