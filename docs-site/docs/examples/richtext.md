---
title: RichText 路径
order: 1
nav:
  title: Examples
  order: 2
group:
  title: 进阶
  order: 2
---

# RichText 路径

不想用封装组件，自己拼 `rich-text`。调 `render()` 拿 nodes 后由你 `setData`。

## 手动 render

直接调库的 render API 拿到节点数组，自己控制 setData 时机。

<code src="../../src/demos/richtext/Basic.tsx"></code>

## 微信链接拦截

微信 `rich-text` 不会自动响应 `<a>`，库会把 href 改写成 `data-href`，由你在 `bindtap` 里读出来跳转。

<code src="../../src/demos/richtext/LinkTap.tsx"></code>
