---
title: 类型导出
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 参考
  order: 4
---

# 类型导出

类型导出覆盖渲染入参、节点形状、平台 renderer、marked token 和流式配置。业务侧通常只需要 `MiniNode` 与组件 props；插件和平台扩展会用到更底层的类型。

## 引入

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';
import type { MiniNode, StreamingConfig, XMarkdownMiniProps } from '@ant-design/x-markdown-mini';
```

## 代码示例

```ts
const nodes: MiniNode[] = renderNodes({
  content: '# Hello',
  platform: 'wechat',
});
```

- `XMarkdownMiniProps` — `render` 的入参
- `MiniNode` — 与 `rich-text` nodes 对齐的节点形状
- `Token` / `Tokens` / `MarkedExtension` — marked 原生 token 与扩展类型
- `TokenRenderer` — 自定义 marked token 到小程序节点的 renderer
- `Platform` / `PlatformInput`
- `PlatformCapabilities` / `PlatformRenderer`
- `StreamingConfig` / `SemanticStreamingConfig`
