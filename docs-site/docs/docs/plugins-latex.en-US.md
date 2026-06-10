---
title: Formula
order: 2
nav:
  title: Docs
  order: 4
group:
  title: B Plugins
  order: 3
---

# Formula

The `Latex` plugin uses KaTeX to convert inline and block formulas into `MiniNode[]`. Import the stylesheet separately in the target mini-program page or component.

## Usage

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex({ katexOptions: { throwOnError: false } })],
});

const nodes = md.renderNodes({
  content: 'Energy: $E=mc^2$',
  platform: 'alipay',
});
```

## Syntax

```md
Inline: $E=mc^2$

Block:
$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```

## Styles

```css
/* WeChat .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";

/* Alipay .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";
```

