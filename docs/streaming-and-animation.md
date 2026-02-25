# 流式与动画配置说明

## 流式

- **开关**：`streaming: true | SemanticStreamingConfig`，默认关闭。
- **语义分块**：`StreamingProcessor` 按 `delimiters`（默认 `/[。？！……；：——，、\n]/`）与 `maxChunkSize` 切块；`!hasNextChunk` 时把剩余 buffer 推入最后一块。
- **节奏**：`chunkDelays`（块间延迟）、`charDelays`（块内字符延迟，打字机效果）。
- **回调**：`onRenderProgress({ markdown })`、`onPatch(nodes)`、`onRenderComplete()`。

## 动画

- **开关**：`animation: true` 时，块级节点带 `animate: 'block'` 与 class `md-animate-block`。
- **样式**：由使用方在各端 CSS 中实现，例如：

  ```css
  .md-animate-block {
    animation: md-fade-in 0.3s ease-out;
  }
  @keyframes md-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  ```

- 文本级动画需在「通用递归组件」端用 `animation-text` 式组件配合 `chunkList` 实现，见架构文档 8.2 节。

## 使用示例

```ts
import { render } from '@ant-design/x-markdown-mini';

// 一次性
const nodes = render({ content: '# Hello', platform: 'wechat' });

// 流式
render({
  content: accumulatedMarkdown,
  hasNextChunk: true,
  streaming: { maxChunkSize: 60, chunkDelays: [100], charDelays: [20] },
  platform: 'wechat',
  onPatch: (nodes) => setData({ nodes }),
  onRenderComplete: () => setData({ hasNextChunk: false }),
});
```
