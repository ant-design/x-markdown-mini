---
title: 一次性渲染
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 入门
  order: 1
---

# 一次性渲染

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\nWorld.',
  platform: 'auto', // 默认自动识别 my / wx
  selectable: true,
});
```

```xml
<!-- 微信小程序 -->
<rich-text nodes="{{nodes}}" />
```

内部流水线：

1. **parse**：内置 `marked` lexer 解析 Markdown，得到 `Token[]`
2. **renderer**：按目标平台把 `Token[]` 转成 `MiniNode[]`
3. **消费**：你 `setData({ nodes })` 即可
