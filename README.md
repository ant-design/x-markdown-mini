<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/jQfZRq8yiZcAAAAAgDAAAAgADlJoAQFr/original">

<h1>Ant Design X Markdown Mini</h1>

面向小程序的流式友好、轻量、跨端 Markdown 渲染器

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url]

[更新日志](./CHANGELOG.zh-CN.md) · [报告 Bug][github-issues-bug-report] · [提交需求][github-issues-feature-request] · [English](./README.en-US.md) · 中文

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

## ✨ 特性

以 [`marked`](https://github.com/markedjs/marked) 作为底层 lexer，针对小程序运行时打包并 patch —— 直出原生节点，不走 `<rich-text>`，无 HTML 往返。

- 🚀 为速度而生 —— 底层编译器直接 lex 成 token，无长期缓存、无阻塞。
- 🤖 流式友好，为 LLM Markdown 边出边渲而设计。
- ⚖️ 轻量 —— 内置 `marked` lexer，ESM 整库约 103 KB / gzip 约 25 KB，ES2018 下限。
- 📱 跨端 —— 当前支持微信与支付宝，统一组件路径，运行时自动识别。
- 🎨 原生直出 —— 渲染为 `<text>` / `<view>` / `<image>` / `<scroll-view>`，天然支持逐节点动画。
- 🔧 丰富插件 —— 按需加载 LaTeX（KaTeX）与代码高亮（highlight.js），绝不进入主包。
- 😊 兼容 —— 基于 `marked` 的 CommonMark 与 GFM，外加 colocated `miniRenderer` 扩展面。

## 兼容性

面向两大主流小程序运行时构建与发布，通过同一条导入路径解析，运行时自动识别（`platform: 'auto'`）。

| 平台   | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 |
| ------ | :-----: | :-------: | :------------: | :----------: | :-------------: |
| 微信   |   ✅    |    ✅     |       ✅       |      ✅      |                 |
| 支付宝 |   ✅    |    ✅     |       ✅       |              |       ✅        |

完整能力矩阵与降级规则详见 [docs/platforms.md](./docs/platforms.md)。

## 支持的 Markdown 规范

与 [`marked`](https://github.com/markedjs/marked) 保持一致：

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## 📦 安装

**推荐使用 [npm](https://www.npmjs.com/)、[yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/) 进行开发。** 便于开发调试与生产部署，充分享受整个生态与工具链的便利。

```bash
npm install @ant-design/x-markdown-mini
```

```bash
yarn add @ant-design/x-markdown-mini
```

```bash
pnpm add @ant-design/x-markdown-mini
```

## 示例

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

## 文档

- [架构](./docs/architecture.md) —— 流水线四步、目录结构、为何内置 marked。
- [流式](./docs/streaming.md) —— 增量解析、打字机模式、动画 hooks。
- [平台](./docs/platforms.md) —— 能力矩阵、降级规则、自定义平台。
- [扩展](./docs/extensions.md) —— marked 扩展、`miniRenderer`、Latex、CodeHighlight。

## Web / H5 场景

本库专注小程序。若你需要 **Web / H5** 端的 Markdown 渲染，可使用同样流式友好的 [`@ant-design/x-markdown`](https://www.npmjs.com/package/@ant-design/x-markdown)。

## 如何贡献

在参与任何形式的贡献前，请先阅读[贡献者指南](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md)。若愿意贡献，欢迎提交 [Pull Request](https://github.com/ant-design/x/pulls) 或[报告 Bug](https://github.com/ant-design/x/issues)。

> 我们强烈推荐阅读[《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)与[《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs.html)。好的提问更容易得到帮助。

## 社区支持

如果在使用过程中遇到问题，可通过以下渠道寻求帮助。我们也鼓励有经验的用户通过这些渠道帮助新人。

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)

## License

[MIT](./LICENSE)
