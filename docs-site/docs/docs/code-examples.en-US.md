---
title: Code Examples
order: 2
nav:
  title: Docs
  order: 4
group:
  title: Introduction
  order: 1
---

# Code Examples

## Generate nodes directly

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
  selectable: true,
});
```

```xml
<!-- consume nodes in a WeChat / Alipay page -->
<rich-text nodes="{{nodes}}" />
```

`renderNodes` is the shortest path: Markdown in, platform-ready `MiniNode[]` out.

## Create an isolated instance

For concurrent streams, create one `XMarkdownMini` instance per view. Reset it when the view is destroyed.

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

## Mini-program component

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

## GFM and line breaks

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

