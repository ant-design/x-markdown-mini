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

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
  selectable: true,
});
```

```xml
<!-- 微信 / 支付宝页面中消费 nodes -->
<rich-text nodes="{{nodes}}" />
```

`renderNodes` 是最短路径：输入 Markdown，输出当前平台可渲染的 `MiniNode[]`。`platform: 'auto'` 会自动检测运行环境，也可以显式传入 `'wechat'` 或 `'alipay'`。

## 创建隔离实例

并发流式渲染时不要复用默认单例。每个视图创建自己的 `XMarkdownMini` 实例，组件卸载时调用 `reset()`。

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  escapeText: false,
  gfm: true,
  breaks: false,
});

const nodes = md.renderNodes({
  content,
  platform: 'wechat',
});

md.reset();
```

## 小程序组件

组件用法适合页面里直接绑定 Markdown 字符串。组件内部会创建独立实例，并在生命周期结束时重置流式状态。

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

```xml
<x-markdown
  content="{{content}}"
  selectable="{{true}}"
  streaming="{{false}}"
/>
```

## GFM 和换行

```ts
renderNodes({
  content: '| A | B |\n| - | - |\n| 1 | 2 |',
  platform: 'alipay',
  gfm: true,
});

renderNodes({
  content: 'line 1\nline 2',
  platform: 'wechat',
  breaks: true,
});
```

`gfm` 控制表格、删除线、自动链接等 GFM 能力；`breaks` 控制软换行是否转换成 `<br>`。

