---
title: Changelog
order: 3
nav:
  title: Docs
  order: 4
group:
  title: Reference
  order: 4
---

# Changelog

## 0.1.0 _(unreleased)_

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
