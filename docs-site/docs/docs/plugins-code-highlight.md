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

`CodeHighlight` 基于 `highlight.js` 接管围栏代码块；没有语言或语言未知时回退到内置普通代码块。

## 使用

<code src="../../src/demos/plugins/CodeHighlightDemo.tsx"></code>

默认注册常用语言：JavaScript、TypeScript、Python、Java、CSS、XML、JSON、SQL、Bash、Shell、C、C++、Go、Rust、YAML、Markdown、Diff、Plaintext。

## 自定义语言

```ts
import python from 'highlight.js/lib/languages/python';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

CodeHighlight({
  languages: { python },
  hljsOptions: { ignoreIllegals: true },
});
```
