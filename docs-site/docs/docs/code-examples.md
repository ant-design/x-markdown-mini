---
title: 代码示例
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 介绍
  order: 1
---

# 代码示例

## 直接生成节点

`renderNodes` 是最短路径：输入 Markdown，输出当前平台可渲染的 `MiniNode[]`，`<rich-text>` 可以直接消费。

<code src="../../src/demos/examples/RenderNodes.tsx"></code>

## GFM

表格、删除线、自动链接默认开启，按调用传 `gfm: false` 可关闭。

<code src="../../src/demos/examples/Gfm.tsx"></code>

## 软换行

`breaks: true` 把段落内的 `\n` 渲染成换行，适合聊天消息这类短文本。

<code src="../../src/demos/examples/Breaks.tsx"></code>

## 并发流式：隔离实例

默认单例的流式状态是共享的。并发流式渲染时，每个视图创建自己的实例，卸载时调用 `reset()`：

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini();

const nodes = md.renderNodes({ content, platform: 'wechat' });

md.reset(); // 视图卸载时重置流式状态
```
