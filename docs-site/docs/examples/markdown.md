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

在小程序工程里 npm install 后，按需引用支付宝 / 微信对应的 component path：

```json
// app.json / page index.json
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/alipay/markdown"
  }
}
```

## 基础用法

最常见的一次性渲染：传入完整 markdown，组件直接渲染。

<code src="../../src/demos/markdown/Basic.tsx"></code>

## GFM 表格

lexer 默认开启 gfm，`|---|` 形式的管道表格直接出 `<table>`。

<code src="../../src/demos/markdown/Table.tsx"></code>

## 围栏代码块

识别 ` ```lang ` 头，输出 `<pre><code class="language-xxx">`；不支持 `<pre>` 的端会降级为 `<div>`。

<code src="../../src/demos/markdown/CodeBlock.tsx"></code>
