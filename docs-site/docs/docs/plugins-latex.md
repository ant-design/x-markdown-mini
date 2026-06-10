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

`Latex` 插件基于 KaTeX，把行内公式和块级公式转换成 `MiniNode[]`。插件只负责节点生成，页面样式需要额外引入。

## 使用

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [
    Latex({
      katexOptions: { throwOnError: false },
    }),
  ],
});

const nodes = md.renderNodes({
  content: '质能方程：$E=mc^2$',
  platform: 'alipay',
});
```

## 支持语法

```md
行内公式：$E=mc^2$

块级公式：
$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

也支持 \( a^2 + b^2 = c^2 \) 和 \[ x = y + z \]
```

## 样式

```css
/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";

/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";
```

## 错误处理

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

