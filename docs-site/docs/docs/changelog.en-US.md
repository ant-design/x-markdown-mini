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

User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.

## Introduce

```bash
npm install @ant-design/x-markdown-mini@latest
```

## Code sample

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex(), CodeHighlight()],
});
```

## 1.0.0

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
