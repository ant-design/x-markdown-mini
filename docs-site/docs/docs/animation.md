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

`enableAnimation: true` 时，每个块级节点的 `class` 会拼上 `md-animate-block`。在小程序 WXSS / ACSS 写：

<code src="../../src/demos/streaming/Animation.tsx"></code>

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