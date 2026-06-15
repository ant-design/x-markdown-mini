---
title: Component Usage
order: 1
nav:
  title: Docs
  order: 4
group:
  title: A Components
  order: 2
---

# Component Usage

The `Markdown` component takes a Markdown string; `MiniNodeRenderer` takes a node array. Prefer `Markdown` in business pages, and reach for `MiniNodeRenderer` only when you need full control of the node tree.

The component creates an isolated instance internally and resets streaming state at the end of its lifecycle.

<code src="../../src/demos/components/ComponentsDocDemo.tsx" inline></code>

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown content |
| `streaming` | `boolean \| StreamingConfig` | `false` | Enable streaming rendering |
| `selectable` | `boolean` | `true` | Whether text is selectable |
| `gfm` | `boolean` | instance default | Enable GFM |
| `breaks` | `boolean` | instance default | Convert soft breaks to `<br>` |
| `components` | `string[]` | `null` | Custom component tag allowlist |
| `footnote` | `boolean` | `false` | Enable the built-in footnote extension |

Render events: WeChat fires `renderstart` / `renderprogress` / `rendercomplete` via `triggerEvent`; Alipay uses `onRenderStart` / `onRenderProgress` / `onRenderComplete`.

`components` declares which tags may pass through. Matched tags go down the slot / abstract-node path and are rendered by the page's own components.

A user extension with the same name takes precedence over the auto-synthesized custom-component tokenizer.

When you call `renderNodes` yourself to cache nodes or post-process the tree, hand the result to `MiniNodeRenderer`.

The component flattens inline nodes first, because mini-program `<text>` cannot nest custom components.
