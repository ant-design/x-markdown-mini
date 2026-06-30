---
title: 公式
order: 2
nav:
  title: Docs
  order: 4
group:
  title: B 插件
  order: 3
---

# 公式

`Latex` 插件基于 KaTeX，把行内公式和块级公式转换成 `MiniNode[]`。插件只负责节点生成，页面样式需要额外引入（见 demo 的 style 文件）。

## 引入

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
```

## 代码示例

支持 `$...$`、`$$...$$`、`\(...\)`、`\[...\]` 四种定界符。

<code src="../../src/demos/plugins/LatexDemo.tsx"></code>

## 错误处理

`throwOnError: false` 时错误公式按原文输出；也可以用 `onError` 自定义错误节点：

```ts
Latex({
  onError: (tex, err) => [
    {
      name: 'text',
      attrs: { value: `[公式错误: ${err.message}]` },
    },
  ],
});
```
