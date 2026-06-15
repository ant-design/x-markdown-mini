---
title: 介绍
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 介绍
  order: 1
---

# 介绍

`@ant-design/x-markdown-mini` 是面向微信、支付宝小程序的 Markdown 渲染器。它的目标不是把 Web HTML 塞进小程序，而是把 Markdown 直接转换成端侧可消费的 `MiniNode[]`，再由组件渲染为小程序原生节点。

## 引入

```bash
npm install @ant-design/x-markdown-mini
```

微信侧通过 `package.json#miniprogram` 读取 `dist/miniprogram_dist`；支付宝侧读取包根 `dist/index.js`。构建产物已经按两个小程序包根分别准备好。

## 代码示例

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
});
```

## 特性

- **小程序优先**：输出结构按微信、支付宝的能力做保守映射，链接、图片、列表、表格等平台差异由 renderer 处理。
- **流式友好**：内置稳定块缓存、tail fixup 和语义化分块，适合 AI 对话、长文生成、逐段输出。
- **高性能路径**：链路保持短路径：`markdown string -> marked Token[] -> tokensToWechat / tokensToAlipay -> MiniNode[]`。
- **强扩展**：插件可以定义 tokenizer 和 `miniRenderer`，直接产出小程序节点，不需要 HTML round-trip。
- **组件可控**：内置微信、支付宝 `Markdown` / `MiniNodeRenderer` 组件，也可以只使用 `renderNodes` 自己接管渲染。

## 渲染链路

```txt
Markdown
  -> marked.lexer
  -> Token[]
  -> tokensToWechat / tokensToAlipay
  -> MiniNode[]
  -> MiniNodeRenderer
```

平台分歧留在平台 transformer 内部。例如微信会为链接保留 `data-href`，支付宝会处理图片协议和部分列表属性降级。业务侧通常只需要指定 `platform`，或使用默认的 `auto` 检测。

## 什么时候使用

- AI 对话、智能客服、搜索问答等需要持续输出 Markdown 的场景。
- 内容详情页、说明页、知识库页等需要在小程序内可靠渲染 Markdown 的场景。
- 需要公式、代码高亮、脚注或自定义标签，但不想把 Web 富文本白名单问题带进小程序的场景。
