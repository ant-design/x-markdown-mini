---
title: 动画
order: 3
nav:
  title: Docs
  order: 4
group:
  title: 流式
  order: 2
---

# 动画

流式动画只标记新出现的块级节点，用于 AI 输出时的轻量淡入。它不重排已提交内容，也不会在稳定块复用时重复播放。

## 引入

在渲染配置里开启 `enableAnimation`，再在小程序样式文件中定义 `md-animate-block`：

```ts
streaming: { hasNextChunk: true, enableAnimation: true }
```

## 代码示例

<code src="../../src/demos/streaming/Animation.tsx"></code>

`enableAnimation: true` 时，每个块级节点的 `class` 会拼上 `md-animate-block`。在小程序 WXSS / ACSS 写：

```css
.md-animate-block {
  animation: md-fade-in 240ms ease-out both;
}
@keyframes md-fade-in {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

CSS 动画在节点首次出现时跑一次 —— 后续 commit 进入 `stableNodes` 后引用不变，不会重放。
