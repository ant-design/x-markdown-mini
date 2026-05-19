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
import { render } from '@ant-design/x-markdown-mini';

const nodes = render({
  content: '# Hello\n\nWorld.',
  platform: 'auto', // 默认自动识别 wx / my / tt / swan ...
  selectable: true,
});
```

```xml
<!-- 微信小程序 -->
<rich-text nodes="{{nodes}}" />
```

内部流水线四步：

1. **parse**：内置 `marked` lexer 解析 Markdown，并转成项目 IR
2. **IR → UnifiedNode**：与微信 `rich-text` 的 nodes 协议对齐
3. **adaptToPlatform**：按目标平台能力做属性级 / 标签级降级
4. **消费**：你 `setData({ nodes })` 即可
