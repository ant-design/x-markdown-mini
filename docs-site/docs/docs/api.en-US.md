---
title: API Reference
order: 1
nav:
  title: Docs
  order: 4
group:
  title: Reference
  order: 4
---

# API Reference

The API is split into parsing, node rendering, and streaming configuration. Application pages should start with `renderNodes(props)` or the bundled components; use the lower-level APIs only when you need direct control over marked tokens, platform renderers, or streaming scheduling.

## Introduce

```ts
import { XMarkdownMini, render, renderNodes } from '@ant-design/x-markdown-mini';
```

## Code sample

```ts
const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
});
```

## `render(markdown): Token[]`

JS parser entry point. Returns the raw marked `Token[]` — no platform rendering.

It also supports streaming:

```ts
render({
  content,
  streaming: { hasNextChunk: true },
  onPatch: (tokens) => {},
});
```

## `renderNodes(props): MiniNode[]`

Node-rendering entry point. In one-shot mode returns platform nodes; in streaming mode patches are pushed via `onPatch` and the return value is an empty array.

| Field              | Type                              | Default    | Description                                                                                   |
| ------------------ | --------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `content`          | `string`                          | —          | Markdown string (required)                                                                    |
| `platform`         | `PlatformInput`                   | `'auto'`   | `'auto' \| 'wechat' \| 'alipay'` |
| `streaming`        | `boolean \| StreamingConfig`      | `false`    | Enable or customize streaming behavior                                                        |
| `selectable`       | `boolean`                         | `true`     | Whether text is selectable (mapped to platform support where possible)                        |
| `gfm`              | `boolean`                          | —          | Override instance GFM default (tables, strikethrough, autolinks)                              |
| `breaks`           | `boolean`                          | —          | Override instance breaks default (`\n` → `<br>`)                                              |
| `onRenderStart`    | `() => void`                      | —          | Render-start callback                                                                         |
| `onRenderProgress` | `(p: { markdown }) => void`       | —          | Markdown emitted so far, per pass                                                             |
| `onRenderComplete` | `() => void`                      | —          | Render-complete callback                                                                      |
| `onPatch`          | `(nodes) => void`                 | —          | Callback with the full node set after each streaming parse                                    |

## `StreamingConfig`

| Field             | Type                                  | Default  | Description                                            |
| ----------------- | ------------------------------------- | -------- | ------------------------------------------------------ |
| `hasNextChunk`    | `boolean`                             | —        | Whether more input is coming; on `false` the leftover is flushed |
| `semantic`        | `boolean \| SemanticStreamingConfig`  | `true`   | Toggle / configure semantic chunking                   |
| `enableAnimation` | `boolean`                             | `true`   | Fade-in animation for newly emitted streaming blocks   |

## `SemanticStreamingConfig`

| Field          | Type     | Default                           | Description                  |
| -------------- | -------- | --------------------------------- | ---------------------------- |
| `delimiters`   | `RegExp` | `/[。？！……；：——，、\n]/`        | Semantic split regex         |
| `maxChunkSize` | `number` | `80`                              | Hard cap for over-long sentences |
| `chunkDelay`   | `number` | `0`                               | ms delay between chunks      |
| `charDelay`    | `number` | `0`                               | ms delay between chars within a chunk |

## Low-level API

- `new XMarkdownMini({ escapeText?, streamingFixup?, gfm?, breaks?, extensions?, components? })` — create an isolated instance. `extensions` accepts `XMarkdownExtension[]` or `MarkedExtension[]`
- `md.parse(markdown): Token[]` — get marked tokens directly
- `tokensToWechatNodes(tokens, ctx): MiniNode[]` — convert `Token[]` to WeChat nodes
- `tokensToAlipayNodes(tokens, ctx): MiniNode[]` — convert `Token[]` to Alipay nodes
- `getPlatformRenderer(platform): PlatformRenderer` — look up a platform's renderer and capabilities
- `StreamingProcessor` — drive the streaming pipeline directly (advanced usage)
