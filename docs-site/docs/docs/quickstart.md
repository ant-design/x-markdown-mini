---
title: 快速开始
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 入门
  order: 1
---

# 快速开始

三步上手：安装 → 调 `render` → 把节点喂给小程序的 `rich-text`。

## 安装

```bash
npm install @ant-design/x-markdown-mini
# 或
pnpm add @ant-design/x-markdown-mini
```

## 组件接入

在小程序工程里 npm install 后，支付宝 / 微信使用**同一条路径**：

```json
// app.json / page index.json
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
```

> 微信通过 `package.json#miniprogram` 字段自动解析到 wechat 子树（`dist/miniprogram_dist/`），
> 支付宝走默认包根（`dist/`）。同一个导入路径在两端分别命中 `.wxml`/`.acss` 对应文件。

### 基础用法

最常见的一次性渲染：传入完整 markdown，组件直接渲染。

<code src="../../src/demos/markdown/Basic.tsx"></code>

### GFM 表格

lexer 默认开启 gfm，`|---|` 形式的管道表格直接出 `<table>`。

<code src="../../src/demos/markdown/Table.tsx"></code>

### 围栏代码块

识别 ` ```lang ` 头，输出 `<pre><code class="language-xxx">`；不支持 `<pre>` 的端会降级为 `<div>`。

<code src="../../src/demos/markdown/CodeBlock.tsx"></code>

## API 接入

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\nWorld.',
  platform: 'auto', // 默认自动识别 my / wx
  selectable: true,
});
```

```xml
<!-- 微信小程序 -->
<rich-text nodes="{{nodes}}" />
```

内部流水线：

1. **parse**：内置 `marked` lexer 解析 Markdown，得到 `Token[]`
2. **renderer**：按目标平台把 `Token[]` 转成 `MiniNode[]`
3. **消费**：你 `setData({ nodes })` 即可