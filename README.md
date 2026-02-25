# @ant-design/x-markdown-mini

多小程序场景下的高性能、强扩展、流式友好的 Markdown 渲染器。

## 核心思路

- 使用 **marked Lexer** 得到 Token 树，转成统一 **IR（结构化 JSON 树）**
- IR 转成**统一 rich-text 节点数组**
- 各端通过薄适配将统一节点转为该端 `rich-text` 所需格式（微信 / 支付宝 / 抖音等）

## 架构说明

- [整体架构](./docs/architecture-overview.md)
- [实现 Checklist](./docs/implementation-checklist.md)
- [IR 与统一节点](./docs/ir-and-nodes.md)
- [流式与动画配置](./docs/streaming-and-animation.md)
- [各端使用示例](./docs/usage-examples.md)

## 安装

```bash
npm install @ant-design/x-markdown-mini marked
# 或
pnpm add @ant-design/x-markdown-mini marked
```

## 使用示例（规划）

```ts
import { render } from '@ant-design/x-markdown-mini';

const nodes = render({
  content: '# Hello\n\nWorld.',
  platform: 'wechat',
  selectable: true,
});
// 微信小程序: <rich-text nodes="{{nodes}}" />
```

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
