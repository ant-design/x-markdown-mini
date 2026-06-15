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

## Code block / table header

Code blocks and tables ship with a header bar by default: a code block shows its language on the left and a copy button (copies the raw code) on the right; a table shows "表格" on the left and a copy button (copies the Markdown source) on the right.

Disable or customize:

```ts
import { XMarkdownMini, copyButton } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  codeBlock: { header: false },                 // no code-block header
  table: {
    header: ({ markdown }) => [                  // custom table header
      { name: 'text', attrs: { class: 'md-tableblock-title', value: 'Table' } },
      copyButton(markdown),                      // copy button (copies the markdown source)
    ],
  },
});
```

`header` accepts `true` (default header) / `false` (no header) / a function returning custom `MiniNode`s. The function runs during `renderNodes` and returns static nodes; use `copyButton(payload)` to build a button the component recognizes as copyable. The code header function receives `{ lang, text, token }`; the table header function receives `{ markdown, token }`.
