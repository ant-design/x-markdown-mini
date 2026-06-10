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

The component layer contains `Markdown` and `MiniNodeRenderer`. Use `Markdown` for ordinary pages; use `MiniNodeRenderer` when you already own the node tree.

## Markdown

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

```xml
<x-markdown
  content="{{content}}"
  streaming="{{streaming}}"
  selectable="{{true}}"
  footnote="{{true}}"
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown content |
| `streaming` | `boolean \| StreamingConfig` | `false` | Enable streaming rendering |
| `selectable` | `boolean` | `true` | Whether text is selectable |
| `gfm` | `boolean` | instance default | Enable GFM |
| `breaks` | `boolean` | instance default | Convert soft breaks to `<br>` |
| `components` | `string[]` | `null` | Custom component tag allowlist |
| `footnote` | `boolean` | `false` | Enable the built-in footnote extension |

## Custom component tags

```xml
<x-markdown
  content="{{content}}"
  components="{{['countdown']}}"
/>
```

```md
Countdown: <countdown value="3600"></countdown>
```

User-registered marked extensions take precedence over auto-generated custom-component tokenizers.

## MiniNodeRenderer

```xml
<mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
```

Use it after calling `renderNodes` yourself, caching nodes, or post-processing the node tree.

