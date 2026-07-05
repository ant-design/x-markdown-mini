---
title: Changelog
---

# Changelog

User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.

> The site's `/changelog` timeline is generated from this file (`docs-site/scripts/build-changelog.mjs` parses the `## version` / `` `date` `` / `- **type**: …` structure). Add a new block at the top when releasing; `npm run changelog` helps assemble entries from merged PRs. Types are **Breaking** / **Added** / **Fixed** / **Improved**.

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
