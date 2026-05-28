---
title: Adapter Rules
order: 2
nav:
  title: Docs
  order: 4
group:
  title: Platforms
  order: 3
---

# Adapter Rules

All platforms share a single `adaptNodes(nodes, config)`. The rules:

- Always strip `selectable` from inner nodes (it's a `rich-text` component-level attribute)
- When `classMode='strip'`, strip `class` (most mini programs ignore inner class attributes)
- Drop unsupported `<video>` outright
- Tag-level fallback: `<pre>` / `<blockquote>` / `<table>` fall back to `<div>` on platforms that don't support them, keeping a `md-xxx` marker class
- Attribute-level fallback: drop `<ol start>` where unsupported; rewrite `http://` images to `https://`
- WeChat-specific: rewrite `<a href>` to `<a data-href>` and add `class="md-link"`

## WeChat `<a>` navigation

WeChat's `rich-text` does not handle `<a>` clicks automatically. The consumer must bind `bindtap` on the `<rich-text>` element and read `event.target.dataset.href`:

```xml
<rich-text nodes="{{nodes}}" bindtap="onTap" />
```

```js
onTap(e) {
  const href = e.target.dataset.href;
  if (href) wx.navigateTo({ url });
}
```
