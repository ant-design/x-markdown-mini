# @ant-design/x-markdown-mini

> A lightweight, streaming-friendly Markdown renderer for mini-programs.

[![npm version](https://img.shields.io/npm/v/@ant-design/x-markdown-mini.svg)](https://www.npmjs.com/package/@ant-design/x-markdown-mini)
[![license](https://img.shields.io/npm/l/@ant-design/x-markdown-mini.svg)](./LICENSE)

**English** · [中文](./README.zh-CN.md)

- **Light** — built-in `marked` lexer, ~103 KB ESM / ~25 KB gzip, ES2018.
- **Streaming** — incremental parsing; stable blocks are parsed once, only the tail re-lexes each tick.
- **Cross-platform** — WeChat & Alipay today, one component path, automatic runtime detection.
- **Extensible** — marked tokenizer / `walkTokens` / hooks plus colocated `miniRenderer`; LaTeX and code-highlight plugins included.

## Install

```bash
npm install @ant-design/x-markdown-mini
```

## Quick start

The package ships ready-to-use **Markdown** / **MiniNodeRenderer** mini-program components. **Alipay and WeChat use the same import path** — WeChat resolves it through `package.json#miniprogram`, Alipay reads the package root.

```jsonc
// page.json — identical on Alipay & WeChat
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
```

```xml
<!-- Alipay page.axml -->
<markdown
  content="{{content}}"
  latex="{{true}}"
  highlight="{{true}}"
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  onRenderComplete="onComplete"
/>

<!-- WeChat page.wxml -->
<markdown
  content="{{content}}"
  latex
  highlight
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  bindrendercomplete="onComplete"
/>
```

`latex` / `highlight` are **boolean switches**: the component lazily `require`s and bakes in the matching plugin only when enabled, so pages that don't use them never pay for KaTeX (~487 KB). Element, KaTeX, and highlight styles are bundled with the component — no manual `@import` needed.

## Programmatic API

Three entry points, all backed by a shared singleton:

```ts
import { renderNodes, render, parse } from '@ant-design/x-markdown-mini';

// 1. Nodes for the bundled <mini-node-renderer> — render them yourself.
const nodes = renderNodes({ content: '# Hello\n\nWorld.', platform: 'auto', selectable: true });

// 2. marked Token[] — bring your own renderer. `render(str)` === `parse(str)`.
const tokens = parse('# Hello');
```

```xml
<mini-node-renderer nodes="{{nodes}}" />
```

> We render the `MiniNode` tree ourselves rather than feeding native `<rich-text>`, which would re-impose a tag/attr whitelist, strip events, and block per-node animation. The tree is already our own structured data.

## Streaming (render LLM output as it arrives)

```ts
// Each tick: pass the accumulated markdown so far.
renderNodes({
  content: accumulatedMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: true, semantic: true, enableAnimation: true },
  onPatch: (nodes) => this.setData({ nodes }),
});

// Final tick: hasNextChunk=false flushes the tail and fires onRenderComplete.
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

Blocks closed by a blank line are cached and never re-parsed; only the unstable tail re-lexes. When `chunkDelay` and `charDelay` are both `0`, `setTimeout` is skipped and `onPatch` fires synchronously. See [docs/streaming.md](./docs/streaming.md).

## Plugins: LaTeX & code highlighting

Loaded on demand — they don't affect the core bundle size (LaTeX ~486 KB, CodeHighlight ~184 KB).

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({ extensions: [Latex(), CodeHighlight()] });
```

- **Latex** — [KaTeX](https://katex.org/)-based, inline `$x^2$` and block `$$…$$`.
- **CodeHighlight** — [highlight.js](https://highlightjs.org/)-based, 18 common languages by default.

When using `<Markdown>` styles are bundled automatically. See [docs/extensions.md](./docs/extensions.md) for manual `@import` paths and options.

## Platform support

| Platform | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only images |
| -------- | :-----: | :-------: | :------------: | :----------: | :---------------: |
| WeChat   |   ✅    |    ✅     |       ✅       |      ✅      |                   |
| Alipay   |   ✅    |    ✅     |       ✅       |              |        ✅         |

Runtime detection picks the platform automatically (`platform: 'auto'`). See [docs/platforms.md](./docs/platforms.md).

## Documentation

- [Architecture](./docs/architecture.md) — the four-step pipeline, directory layout, why marked is bundled.
- [Streaming](./docs/streaming.md) — incremental parsing, typewriter mode, animation hooks.
- [Platforms](./docs/platforms.md) — capability matrix, fallback rules, custom platforms.
- [Extensions](./docs/extensions.md) — marked extensions, `miniRenderer`, Latex, CodeHighlight.

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

[MIT](./LICENSE)
