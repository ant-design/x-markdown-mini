---
title: Code Examples
order: 2
nav:
  title: Docs
  order: 4
group:
  title: Introduction
  order: 1
---

# Code Examples

These examples are backed by real mini-program page files. Switching to WeChat shows `index.wxml` / `index.wxss` and WeChat component paths; switching to Alipay shows `index.axml` / `index.acss` and Alipay component paths.

The recommended path is generating `MiniNode[]` first, then rendering through `MiniNodeRenderer` or the bundled `Markdown` component. `rich-text` is ecosystem context, not the preferred integration path here.

<code src="../../src/demos/examples/CodeExamplesShowcase.tsx" inline></code>

## API

`renderNodes(props)` and the bundled `Markdown` component share these render options:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown text (full or accumulated streaming content) |
| `platform` | `'auto' \| 'wechat' \| 'alipay'` | `'auto'` | Target platform; `auto` detects at runtime |
| `streaming` | `false \| true \| StreamingConfig` | `false` | Streaming rendering, see [Streaming](/docs/streaming-en) |
| `selectable` | `boolean` | `true` | Whether text is selectable |
| `gfm` | `boolean` | `true` | GFM tables / strikethrough / autolinks |
| `breaks` | `boolean` | `false` | Convert soft `\n` to `<br>` |
| `extensions` | `(XMarkdownExtension \| MarkedExtension)[]` | `[]` | Extensions (LaTeX / code highlight / custom syntax) |
| `onRenderStart` / `onRenderProgress` / `onRenderComplete` | `() => void` | - | Render lifecycle callbacks |
| `onPatch` | `(nodes: MiniNode[]) => void` | - | Per-round callback during streaming, for `setData` |
