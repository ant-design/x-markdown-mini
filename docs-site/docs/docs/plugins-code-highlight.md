---
title: 代码高亮
order: 1
nav:
  title: Docs
  order: 4
group:
  title: B 插件
  order: 3
---

# 代码高亮

`CodeHighlight` 基于 `highlight.js`，覆盖 marked 的围栏代码块 token。没有语言或语言未知时会回退到内置普通代码块渲染。

## 使用

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

## 样式

```css
/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";

/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";
```

默认会注册常用语言：JavaScript、TypeScript、Python、Java、CSS、XML、JSON、SQL、Bash、Shell、C、C++、Go、Rust、YAML、Markdown、Diff、Plaintext。

## 自定义语言

```ts
import python from 'highlight.js/lib/languages/python';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

CodeHighlight({
  languages: { python },
  hljsOptions: { ignoreIllegals: true },
});
```

