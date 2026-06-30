---
title: 能力矩阵
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 平台
  order: 3
---

# 能力矩阵

能力矩阵说明 renderer 会保留哪些节点能力、会降级哪些平台差异。业务侧优先使用统一组件路径，由包根和 `package.json#miniprogram` 负责选择对应产物。

## 引入

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

## 代码示例

```xml
<x-markdown content="{{content}}" />
```

| 平台   | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 | `<video>` |
| ------ | :-----: | :-------: | :------------: | :----------: | :-------------: | :-------: |
| 微信   |   ✅    |    ✅     |       ✅       |      ✅      |        —        |     —     |
| 支付宝 |   ✅    |    ✅     |       ✅       |      —       |       ✅        |     —     |

当前内置平台只有微信和支付宝。其它小程序平台应先补 renderer、组件产物和真机/开发者工具验证，再写入矩阵。

## 统一组件入口

推荐统一引用组件路径：

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

支付宝使用包根 `dist/components/*`，微信通过 `package.json#miniprogram` 使用
`dist/miniprogram_dist/components/*`。业务侧不需要判断平台。
