---
title: Type Exports
order: 2
nav:
  title: Docs
  order: 4
group:
  title: Reference
  order: 4
---

# Type Exports

Type exports cover render props, node shape, platform renderers, marked tokens, and streaming config. Application code usually needs only `MiniNode` and component props; plugin and platform extensions use the lower-level types.

## Introduce

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';
import type { MiniNode, StreamingConfig, XMarkdownMiniProps } from '@ant-design/x-markdown-mini';
```

## Code sample

```ts
const nodes: MiniNode[] = renderNodes({
  content: '# Hello',
  platform: 'wechat',
});
```

- `XMarkdownMiniProps` — props for `render`
- `MiniNode` — the node shape aligned with `rich-text` nodes
- `Token` / `Tokens` / `MarkedExtension` — marked native token and extension types
- `TokenRenderer` — renderer that maps a custom marked token to mini-program nodes
- `Platform` / `PlatformInput`
- `PlatformCapabilities` / `PlatformRenderer`
- `StreamingConfig` / `SemanticStreamingConfig`
