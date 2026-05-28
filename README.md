# @ant-design/x-markdown-mini

> 多小程序、轻量、流式友好的 Markdown 渲染器。

- **轻**：内置 `marked` lexer，ESM 整库约 103KB / gzip 约 25KB
- **流**：增量解析，已稳定块只 parse 一次；onPatch 推回全量统一节点
- **双端**：当前支持微信 / 支付宝，统一组件路径 + 自动识别
- **可扩展**：marked tokenizer / walkTokens / hooks + colocated `miniRenderer`；内置 LaTeX 和代码高亮扩展

## 安装

```bash
npm install @ant-design/x-markdown-mini
# 或
pnpm add @ant-design/x-markdown-mini
```

## 两种用法

### A. 直接用现成的小程序组件（推荐）

包内附带了开箱即用的 **Markdown** / **NodesRenderer** 小程序组件。**支付宝、微信使用同一条路径**——
微信开发者工具读取 `package.json#miniprogram` 字段，自动解析到 wechat 子树；支付宝则走默认包根。

```jsonc
// page.json（支付宝 & 微信都一样写）
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
  animation="{{true}}"
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  onRenderComplete="onComplete"
/>
```

```xml
<!-- 微信 page.wxml -->
<markdown
  content="{{content}}"
  animation="{{true}}"
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
  bindrendercomplete="onComplete"
/>
```

组件内部已经把 `XMarkdownMini` / `StreamingProcessor` 接好，直接 `setData` 节点；
样式（`.md-paragraph` / `.md-heading` / `.md-code-block` …）随组件 `acss` / `wxss`
一起加载，可在外层覆盖。

### B. 仅取节点数据，自己渲染

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\nWorld.',
  platform: 'auto',     // 默认自动识别 my / wx
  selectable: true,
});
```

```xml
<!-- 也可以直接交给小程序原生节点容器 -->
<rich-text nodes="{{nodes}}" />
```

### C. 仅解析 Markdown，自己适配

```ts
import { render, parse } from '@ant-design/x-markdown-mini';

const tokens = render('# Hello'); // 等同 parse('# Hello')，返回 marked Token[]
const sameTokens = parse('# Hello');

render({
  content: 'hello **wor',
  streaming: { hasNextChunk: true },
  onPatch: (tokens) => {
    // tokens 是经过 AI 流式字符串补全后再 marked.lex 的结果
  },
});
```

## 流式渲染（LLM 边出边渲）

```ts
// 流式进行中：每来一段累计 markdown 就调用一次
renderNodes({
  content: accumulatedMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: true, semantic: true, enableAnimation: true },
  onPatch: (nodes) => this.setData({ nodes }),
});

// 最后一轮：hasNextChunk=false，flush 残余并触发 onRenderComplete
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

底层做了什么：

1. 已经被空行收尾的块缓存为 `stableNodes`，不再重解析
2. 仅未稳定的「最后一段」每轮重 lex
3. 默认 `chunkDelay = charDelay = 0` 时**完全跳过 setTimeout**，同步推回

详见 [docs/streaming.md](./docs/streaming.md)。

## 插件：LaTeX & 代码高亮

插件按需引入，不影响主包体积（主库 ~105 KB gzip ~25 KB，Latex 插件 ~486 KB，CodeHighlight 插件 ~184 KB）。

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [Latex(), CodeHighlight()],
});
```

**样式引入**（在页面或组件样式文件中）：

```css
/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";
```

### Latex

基于 [KaTeX](https://katex.org/) 渲染数学公式。支持行内 `$x^2$` 和块级 `$$...\n...$$` 语法。

```ts
Latex({
  katexOptions: { throwOnError: false },  // 透传给 katex.renderToString()
  onError(tex, err) { /* 自定义错误回调 */ },
})
```

### CodeHighlight

基于 [highlight.js](https://highlightjs.org/) 的代码语法高亮。默认支持 18 种常用语言，可自定义子集。

```ts
import javascript from 'highlight.js/lib/languages/javascript';

CodeHighlight({
  languages: { javascript },  // 只注册需要的语言
  hljsOptions: { ignoreIllegals: true },
})
```

详见 [docs/extensions.md](./docs/extensions.md)。

## 平台自动识别 + 能力矩阵

| 平台      | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 | `<video>` |
| --------- | :-----: | :-------: | :------------: | :----------: | :-------------: | :-------: |
| 微信      | ✅      | ✅        | ✅             | ✅           |                 |           |
| 支付宝    | ✅      | ✅        | ✅             |              | ✅              |           |

当前仅内置微信和支付宝。新增平台时扩展 `src/platforms` 下的 renderer，并补组件输出目录。
详见 [docs/platforms.md](./docs/platforms.md)。

## 在线预览（手机壳模拟）

```bash
npm run build
cd docs-site && npm install && npm run dev
```

打开 http://localhost:5173/ ，或 http://localhost:5173/preview.html 看真机壳样式。
详见 [docs-site/README.md](./docs-site/README.md)。

## 文档

- [架构](./docs/architecture.md) — 流水线四步、目录结构、为何内置 marked
- [流式](./docs/streaming.md) — 增量解析、打字机模式、动画 hooks
- [平台](./docs/platforms.md) — 能力矩阵、降级规则、自定义平台
- [扩展](./docs/extensions.md) — marked 扩展、`miniRenderer`、Latex、CodeHighlight

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
