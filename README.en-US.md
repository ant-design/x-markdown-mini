<div align="center"><a name="readme-top"></a>

<img height="120" src="https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/jQfZRq8yiZcAAAAAgDAAAAgADlJoAQFr/original">

<h1>Ant Design X Markdown Mini</h1>

Streaming-friendly, lightweight, cross-platform Markdown renderer for mini-programs

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url]

[Changelog](./changelog/CHANGELOG.en-US.md) · [Report a Bug][github-issues-bug-report] · [Request a Feature][github-issues-feature-request] · English · [中文](./README.md)

[npm-image]: https://img.shields.io/npm/v/@ant-design/x-markdown-mini.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ant-design/x-markdown-mini
[download-image]: https://img.shields.io/npm/dm/@ant-design/x-markdown-mini.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x-markdown-mini
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x-markdown-mini?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x-markdown-mini
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new
[antd-image]: https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square
[antd-url]: https://ant.design

</div>

## ✨ Features

Uses [`marked`](https://github.com/markedjs/marked) as the base lexer, bundled and patched for mini-program runtimes — direct-to-native rendering, no `<rich-text>` and no HTML round-trip.

- 🚀 Born for speed — a low-level compiler that lexes to tokens, no long-term caching or blocking.
- 🤖 Streaming-friendly, purpose-built for rendering LLM Markdown as it arrives.
- ⚖️ Lightweight — built-in `marked` lexer, ~103 KB ESM / ~25 KB gzip, ES2018 floor.
- 📱 Cross-platform — WeChat & Alipay today, one component path, automatic runtime detection.
- 🎨 Native by default — renders to `<text>` / `<view>` / `<image>` / `<scroll-view>`, per-node animation friendly.
- 🔧 Rich plugins — on-demand LaTeX (KaTeX) and code highlighting (highlight.js), never in the core bundle.
- 😊 Compatible — CommonMark & GFM via `marked`, plus a colocated `miniRenderer` extension surface.

## Compatibility

Built and shipped for the two major mini-program runtimes, resolved through a single import path with automatic runtime detection (`platform: 'auto'`). Platform differences (e.g. Alipay auto-upgrades images to https, ordered-list markers render as text so numbering starts identically on both) are smoothed over by the library at render time — nothing for consumers to handle.

See [docs/platforms.md](./docs/platforms.md) for the full capability matrix and fallback rules.

## Supported Markdown Specs

Consistent with [`marked`](https://github.com/markedjs/marked):

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## 📦 Installation

**We recommend using [npm](https://www.npmjs.com/), [yarn](https://github.com/yarnpkg/yarn/), or [pnpm](https://pnpm.io/) for development.** This allows for easy debugging in development and safe production deployment, enjoying the benefits of the entire ecosystem and toolchain.

```bash
npm install @ant-design/x-markdown-mini
```

```bash
yarn add @ant-design/x-markdown-mini
```

```bash
pnpm add @ant-design/x-markdown-mini
```

## Example

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

## Documentation

- [Architecture](./docs/architecture.md) — the four-step pipeline, directory layout, why marked is bundled.
- [Streaming](./docs/streaming.md) — incremental parsing, typewriter mode, animation hooks.
- [Platforms](./docs/platforms.md) — capability matrix, fallback rules, custom platforms.
- [Extensions](./docs/extensions.md) — marked extensions, `miniRenderer`, Latex, CodeHighlight.

## Web / H5

This library targets mini-programs. If you need Markdown rendering on the **web / H5**, use the equally streaming-friendly [`@ant-design/x-markdown`](https://www.npmjs.com/package/@ant-design/x-markdown).

## How to Contribute

Before participating in any form, please read the [Contributor Guide](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md). If you wish to contribute, feel free to submit a [Pull Request](https://github.com/ant-design/x/pulls) or [report a Bug](https://github.com/ant-design/x/issues).

> We highly recommend reading [How To Ask Questions The Smart Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs.html). Better questions are more likely to get help.

## Community Support

If you encounter problems during use, you can seek help through the following channels. We also encourage experienced users to help newcomers through these channels.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)

## License

[MIT](./LICENSE)
