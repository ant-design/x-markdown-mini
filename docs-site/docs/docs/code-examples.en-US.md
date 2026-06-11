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

`renderNodes` is the shortest path: Markdown in, platform-ready `MiniNode[]` out, consumable by `<rich-text>` as-is.

<code src="../../src/demos/examples/RenderNodes.tsx"></code>

## GFM

Tables, strikethrough and autolinks are on by default; pass `gfm: false` per call to turn them off.

<code src="../../src/demos/examples/Gfm.tsx"></code>

## Soft line breaks

`breaks: true` renders `\n` inside a paragraph as a line break, which suits short chat messages.

<code src="../../src/demos/examples/Breaks.tsx"></code>

## Concurrent streams: isolated instances

The default singleton shares its streaming state. For concurrent streaming views, create one instance per view and call `reset()` on unmount:

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini();

const nodes = md.renderNodes({ content, platform: 'wechat' });

md.reset(); // reset streaming state when the view unmounts
```
