---
title: Code Highlight
order: 1
nav:
  title: Docs
  order: 4
group:
  title: B Plugins
  order: 3
---

# Code Highlight

`CodeHighlight` uses `highlight.js` to override fenced code block rendering. Blocks without a language, or with an unknown language, fall back to the built-in code renderer.

## Usage

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({
  content: '```ts\nconst answer: number = 42;\n```',
  platform: 'wechat',
});
```

## Styles

```css
/* WeChat .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";

/* Alipay .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";
```

## Custom languages

```ts
import python from 'highlight.js/lib/languages/python';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

CodeHighlight({
  languages: { python },
  hljsOptions: { ignoreIllegals: true },
});
```

