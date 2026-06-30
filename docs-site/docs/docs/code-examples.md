---
title: 代码示例
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 介绍
  order: 1
---

# 代码示例

代码示例展示真实的小程序页面文件。切到微信时会显示 `index.wxml` / `index.wxss` 和微信组件路径；切到支付宝时会显示 `index.axml` / `index.acss` 和支付宝组件路径。

推荐路径是先生成 `MiniNode[]`，再交给 `MiniNodeRenderer` 或内置 `Markdown` 组件渲染。`rich-text` 是小程序生态里的历史背景，不是这里的首选接入方式。

<code src="../../src/demos/examples/CodeExamplesShowcase.tsx" inline></code>

## API

`renderNodes(props)` 与内置 `Markdown` 组件共享下列渲染参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown 文本（全量或累计流式内容） |
| `platform` | `'auto' \| 'wechat' \| 'alipay'` | `'auto'` | 目标平台，`auto` 自动识别 |
| `streaming` | `false \| true \| StreamingConfig` | `false` | 流式渲染，详见[流式渲染](/docs/streaming) |
| `selectable` | `boolean` | `true` | 文本是否可选择 |
| `gfm` | `boolean` | `true` | GFM 表格 / 删除线 / 自动链接 |
| `breaks` | `boolean` | `false` | 软换行 `\n` 转 `<br>` |
| `extensions` | `(XMarkdownExtension \| MarkedExtension)[]` | `[]` | 扩展（LaTeX / 代码高亮 / 自定义语法） |
| `onRenderStart` / `onRenderProgress` / `onRenderComplete` | `() => void` | - | 渲染生命周期回调 |
| `onPatch` | `(nodes: MiniNode[]) => void` | - | 流式时每轮解析完成回调，用于 `setData` |
