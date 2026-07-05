---
title: Changelog
---

# Changelog

User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.

> The site's `/changelog` timeline is generated from this file (`docs-site/scripts/build-changelog.mjs` parses the `## version` / `` `date` `` / `- **type**: …` structure). Add a new block at the top when releasing; `npm run changelog` helps assemble entries from merged PRs. Types are **Breaking** / **Added** / **Fixed** / **Improved**.

## 1.0.1

`2026-07-04`

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
