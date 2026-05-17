---
title: Markdown
order: 1
nav:
  title: Examples
  order: 2
group:
  title: 组件
  order: 1
---

# Markdown

高层组件：传入 markdown 字符串，组件内部走 parse → IR → UnifiedNode → 平台节点 → rich-text 渲染。

## Introduction

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

## 基础用法

最常见的一次性渲染：传入完整 markdown，组件直接渲染。

<code src="../../src/demos/markdown/Basic.tsx"></code>

## GFM 表格

lexer 默认开启 gfm，`|---|` 形式的管道表格直接出 `<table>`。

<code src="../../src/demos/markdown/Table.tsx"></code>

## 围栏代码块

识别 ` ```lang ` 头，输出 `<pre><code class="language-xxx">`；不支持 `<pre>` 的端会降级为 `<div>`。

<code src="../../src/demos/markdown/CodeBlock.tsx"></code>
