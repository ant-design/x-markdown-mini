---
title: 适配规则
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 平台
  order: 3
---

# 适配规则

所有平台共享一份 `adaptNodes(nodes, config)`，规则：

- 始终移除内部节点的 `selectable`（属于 `rich-text` 组件级属性）
- `classMode='strip'` 时移除 `class`（多数小程序忽略内部 class）
- 不支持的 `<video>` 直接丢弃
- 标签级降级：`<pre>` / `<blockquote>` / `<table>` 在不支持时降为 `<div>`，并保留 `md-xxx` 标识 class
- 属性级降级：移除 `<ol start>`（如不支持），`http://` 图片 → `https://`
- 微信特有：`<a href>` → `<a data-href>` 并加 `class="md-link"`

## 微信 `<a>` 跳转

微信 `rich-text` 不会自动响应 `<a>` 跳转，消费方需在 `<rich-text>` 上绑 `bindtap` 并读 `event.target.dataset.href`：

```xml
<rich-text nodes="{{nodes}}" bindtap="onTap" />
```

```js
onTap(e) {
  const href = e.target.dataset.href;
  if (href) wx.navigateTo({ url });
}
```
