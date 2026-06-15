---
title: Introduction
order: 1
nav:
  title: Docs
  order: 4
group:
  title: Introduction
  order: 1
---

# Introduction

`@ant-design/x-markdown-mini` is a Markdown renderer for WeChat and Alipay mini programs. It does not force Web HTML into a mini-program runtime. Markdown is converted directly into `MiniNode[]`, then rendered by mini-program components.

## Introduce

```bash
npm install @ant-design/x-markdown-mini
```

WeChat reads the `dist/miniprogram_dist` package root through `package.json#miniprogram`; Alipay reads the package-root build.

## Code sample

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
});
```

## Features

- **Mini-program first**: output is mapped conservatively for WeChat and Alipay capabilities.
- **Streaming friendly**: stable-block caching, tail fixup, and semantic chunking are built in for AI chat and generated content.
- **Short render path**: `markdown string -> marked Token[] -> tokensToWechat / tokensToAlipay -> MiniNode[]`.
- **Extensible**: extensions can define tokenizers and `miniRenderer` functions that produce mini-program nodes directly.
- **Component ready**: use the bundled `Markdown` / `MiniNodeRenderer` components, or call `renderNodes` and own the rendering layer.

## Pipeline

```txt
Markdown
  -> marked.lexer
  -> Token[]
  -> tokensToWechat / tokensToAlipay
  -> MiniNode[]
  -> MiniNodeRenderer
```

Platform differences stay inside the platform transformer. For example, WeChat link handling and Alipay image/list fallbacks are handled by the renderer, not by business code.

## When to use it

- AI chat, customer support, search answers, and any UI that streams Markdown.
- Mini-program content pages, docs, knowledge bases, or help centers.
- Formula, code-highlight, footnote, or custom-tag rendering without native `rich-text` whitelist surprises.
