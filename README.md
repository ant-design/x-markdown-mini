# @ant-design/x-markdown-mini

> 多小程序、轻量、流式友好的 Markdown 渲染器。

- **轻**：零依赖（无 `marked`），ESM 整库 ~30KB / gzip ~7.8KB
- **流**：增量解析，已稳定块只 parse 一次；onPatch 推回全量统一节点
- **多端**：微信 / 支付宝 / 抖音 / 百度 / QQ / 快手 / 钉钉 / 京东，统一 API + 自动识别
- **可扩展**：能力矩阵驱动适配，未列入的平台用 `toOtherNodes` 即插即用

## 安装

```bash
npm install @ant-design/x-markdown-mini
# 或
pnpm add @ant-design/x-markdown-mini
```

## 两种用法

### A. 直接用现成的小程序组件（推荐 / 默认 Alipay）

包内附带了开箱即用的 **Alipay** 与 **微信** 小程序组件，把它注册到 `usingComponents` 即可：

```jsonc
// page.json （Alipay）
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/alipay/markdown"
  }
}
```

```xml
<!-- page.axml -->
<markdown
  content="{{content}}"
  animation="{{true}}"
  selectable="{{true}}"
  streaming="{{ { done: !hasNextChunk, semantic: true } }}"
  hasNextChunk="{{hasNextChunk}}"
  onRenderComplete="onComplete"
/>
```

微信小程序：

```jsonc
// page.json
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/wechat/markdown"
  }
}
```

```xml
<!-- page.wxml -->
<markdown
  content="{{content}}"
  animation="{{true}}"
  selectable="{{true}}"
  streaming="{{ { done: !hasNextChunk, semantic: true } }}"
  hasNextChunk="{{hasNextChunk}}"
  bindrendercomplete="onComplete"
/>
```

组件内部已经把 `runPipeline` / `StreamingProcessor` 接好，直接 `setData` 节点；
样式（`.md-paragraph` / `.md-heading` / `.md-code-block` …）随组件 `acss` / `wxss`
一起加载，可在外层覆盖。

### B. 仅取节点数据，自己渲染

```ts
import { render } from '@ant-design/x-markdown-mini';

const nodes = render({
  content: '# Hello\n\nWorld.',
  platform: 'auto',     // 默认自动识别 wx / my / tt / swan ...
  selectable: true,
});
```

```xml
<!-- 微信小程序原生 rich-text -->
<rich-text nodes="{{nodes}}" />
```

## 流式渲染（LLM 边出边渲）

```ts
// 流式进行中：每来一段累计 markdown 就调用一次
render({
  content: accumulatedMarkdown,
  platform: 'wechat',
  streaming: { done: false, semantic: true, enableAnimation: true },
  onPatch: (nodes) => this.setData({ nodes }),
});

// 最后一轮：done=true，flush 残余并触发 onRenderComplete
render({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { done: true },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

底层做了什么：

1. 已经被空行收尾的块缓存为 `stableNodes`，不再重解析
2. 仅未稳定的「最后一段」每轮重 lex
3. 默认 `chunkDelay = charDelay = 0` 时**完全跳过 setTimeout**，同步推回

详见 [docs/streaming.md](./docs/streaming.md)。

## 平台自动识别 + 能力矩阵

| 平台      | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only 图片 | `<video>` |
| --------- | :-----: | :-------: | :------------: | :----------: | :-------------: | :-------: |
| 微信      | ✅      | ✅        | ✅             | ✅           |                 |           |
| 支付宝    | ✅      | ✅        | ✅             |              | ✅              |           |
| 抖音      | ✅      | ✅        | ✅             | ✅           | ✅              | ✅        |
| 百度      |         |           | ✅             |              |                 |           |
| QQ        |         | ✅        | ✅             | ✅           |                 |           |
| 快手      |         |           |                |              | ✅              |           |
| 钉钉      |         |           | ✅             |              |                 |           |
| 京东      |         |           |                |              |                 |           |

不支持的标签会自动降级（`<pre>` → `<div class="md-code-block">` 等）。详见
[docs/platforms.md](./docs/platforms.md)。

## 在线预览（手机壳模拟）

```bash
npm run build
cd docs-site && npm install && npm run dev
```

打开 http://localhost:5173/ ，或 http://localhost:5173/preview.html 看真机壳样式。
详见 [docs-site/README.md](./docs-site/README.md)。

## 文档

- [架构](./docs/architecture.md) — 流水线四步、目录结构、为何替换 marked
- [流式](./docs/streaming.md) — 增量解析、打字机模式、动画 hooks
- [平台](./docs/platforms.md) — 能力矩阵、降级规则、自定义平台

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
