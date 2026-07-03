# @ant-design/x-markdown-mini

> 面向小程序的轻量、流式友好的 Markdown 渲染器。

[![npm version](https://img.shields.io/npm/v/@ant-design/x-markdown-mini.svg)](https://www.npmjs.com/package/@ant-design/x-markdown-mini)
[![license](https://img.shields.io/npm/l/@ant-design/x-markdown-mini.svg)](./LICENSE)

[English](./README.md) · **中文**

- **轻** — 内置 `marked` lexer，ESM 整库约 103 KB / gzip 约 25 KB，ES2018。
- **流** — 增量解析；已稳定块只解析一次，每轮仅重新 lex 末段。
- **双端** — 当前支持微信与支付宝，统一组件路径，运行时自动识别。
- **可扩展** — marked tokenizer / `walkTokens` / hooks，外加 colocated `miniRenderer`；内置 LaTeX 与代码高亮插件。

## 安装

```bash
npm install @ant-design/x-markdown-mini
```

## 快速开始

包内附带开箱即用的 **Markdown** / **MiniNodeRenderer** 小程序组件。**支付宝与微信使用同一条导入路径** —— 微信通过 `package.json#miniprogram` 解析，支付宝读取包根。

```jsonc
// page.json —— 支付宝与微信写法一致
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
```

```xml
<!-- 支付宝 page.axml -->
<markdown
  content="{{content}}"
  latex="{{true}}"
  highlight="{{true}}"
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  onRenderComplete="onComplete"
/>

<!-- 微信 page.wxml -->
<markdown
  content="{{content}}"
  latex
  highlight
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  bindrendercomplete="onComplete"
/>
```

`latex` / `highlight` 是**布尔开关**：命中后组件内部按需 `require` 并 bake 对应插件，未开启的页面不会为 KaTeX（约 487 KB）付出体积。元素样式以及 KaTeX、代码高亮样式都随组件加载，无需手动 `@import`。

## 编程式 API

三个入口，共享同一个单例：

```ts
import { renderNodes, render, parse } from '@ant-design/x-markdown-mini';

// 1. 给内置 <mini-node-renderer> 的节点 —— 自己渲染。
const nodes = renderNodes({ content: '# Hello\n\nWorld.', platform: 'auto', selectable: true });

// 2. marked Token[] —— 自带渲染器。render(str) === parse(str)。
const tokens = parse('# Hello');
```

```xml
<mini-node-renderer nodes="{{nodes}}" />
```

> 我们**自己渲染**这棵 `MiniNode` 树，而不是交给原生 `<rich-text>`。`<rich-text>` 会重新套用标签/属性白名单、屏蔽事件、无法逐节点动画 —— 而节点树本就是我们自己构建的结构化数据。

## 流式渲染（LLM 边出边渲）

```ts
// 每一轮：传入累计到目前为止的 markdown。
renderNodes({
  content: accumulatedMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: true, semantic: true, enableAnimation: true },
  onPatch: (nodes) => this.setData({ nodes }),
});

// 最后一轮：hasNextChunk=false，flush 残余并触发 onRenderComplete。
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

被空行收尾的块会被缓存、不再重解析，仅未稳定的末段每轮重 lex。当 `chunkDelay` 与 `charDelay` 都为 `0` 时跳过 `setTimeout`，`onPatch` 同步推回。详见 [docs/streaming.md](./docs/streaming.md)。

## 插件：LaTeX 与代码高亮

按需加载，不影响主包体积（LaTeX 约 486 KB，CodeHighlight 约 184 KB）。

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({ extensions: [Latex(), CodeHighlight()] });
```

- **Latex** —— 基于 [KaTeX](https://katex.org/)，支持行内 `$x^2$` 与块级 `$$…$$`。
- **CodeHighlight** —— 基于 [highlight.js](https://highlightjs.org/)，默认支持 18 种常用语言。

使用 `<Markdown>` 时样式自动随组件加载。手动 `@import` 路径与配置详见 [docs/extensions.md](./docs/extensions.md)。

## 平台支持

| 平台   | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 |
| ------ | :-----: | :-------: | :------------: | :----------: | :-------------: |
| 微信   |   ✅    |    ✅     |       ✅       |      ✅      |                 |
| 支付宝 |   ✅    |    ✅     |       ✅       |              |       ✅        |

运行时自动识别平台（`platform: 'auto'`）。详见 [docs/platforms.md](./docs/platforms.md)。

## 文档

- [架构](./docs/architecture.md) —— 流水线四步、目录结构、为何内置 marked。
- [流式](./docs/streaming.md) —— 增量解析、打字机模式、动画 hooks。
- [平台](./docs/platforms.md) —— 能力矩阵、降级规则、自定义平台。
- [扩展](./docs/extensions.md) —— marked 扩展、`miniRenderer`、Latex、CodeHighlight。

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

[MIT](./LICENSE)
