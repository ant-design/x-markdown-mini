---
title: API 参考
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 参考
  order: 4
---

# API 参考

## `render(markdown): Token[]`

JS 解析入口。返回 marked 原生 `Token[]`，不做平台渲染。

也支持流式：

```ts
render({
  content,
  streaming: { hasNextChunk: true },
  onPatch: (tokens) => {},
});
```

## `renderNodes(props): MiniNode[]`

节点渲染入口。一次性模式返回平台节点；流式模式通过 `onPatch` 推回，返回值为空数组。

| 字段               | 类型                              | 默认       | 说明                                                                                          |
| ------------------ | --------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `content`          | `string`                          | —          | Markdown 字符串（必填）                                                                       |
| `platform`         | `PlatformInput`                   | `'auto'`   | `'auto' \| 'wechat' \| 'alipay'` |
| `streaming`        | `boolean \| StreamingConfig`      | `false`    | 开启或自定义流式行为                                                                          |
| `selectable`       | `boolean`                         | `true`     | 文本是否可选择（适配各端尽量映射）                                                            |
| `gfm`              | `boolean`                          | —          | 覆盖实例默认 GFM 设置（表格、删除线、自动链接）                                              |
| `breaks`           | `boolean`                          | —          | 覆盖实例默认换行设置（`\n` → `<br>`）                                                         |
| `onRenderStart`    | `() => void`                      | —          | 开始回调                                                                                      |
| `onRenderProgress` | `(p: { markdown }) => void`       | —          | 每轮已输出 markdown                                                                           |
| `onRenderComplete` | `() => void`                      | —          | 结束回调                                                                                      |
| `onPatch`          | `(nodes) => void`                 | —          | 流式时每次解析完成的全量节点回调                                                              |

## `StreamingConfig`

| 字段              | 类型                                  | 默认     | 说明                                       |
| ----------------- | ------------------------------------- | -------- | ------------------------------------------ |
| `hasNextChunk`    | `boolean`                             | —        | 是否还有后续输入；`false` 时 flush 残余      |
| `semantic`        | `boolean \| SemanticStreamingConfig`  | `true`   | 语义切块开关 / 配置                        |
| `enableAnimation` | `boolean`                             | `true`   | 流式块淡入动画                             |

## `SemanticStreamingConfig`

| 字段           | 类型     | 默认                              | 说明               |
| -------------- | -------- | --------------------------------- | ------------------ |
| `delimiters`   | `RegExp` | `/[。？！……；：——，、\n]/`        | 语义切分正则       |
| `maxChunkSize` | `number` | `80`                              | 一句过长时的硬上限 |
| `chunkDelay`   | `number` | `0`                               | 块之间 ms 延迟     |
| `charDelay`    | `number` | `0`                               | 块内逐字 ms 延迟   |

## 低层 API

- `new XMarkdownMini({ escapeText?, streamingFixup?, gfm?, breaks?, extensions?, components? })` — 创建隔离实例。`extensions` 接收 `XMarkdownExtension[]` 或 `MarkedExtension[]`
- `md.parse(markdown): Token[]` — 直接拿 marked token
- `tokensToWechatNodes(tokens, ctx): MiniNode[]` — Token[] 转微信节点
- `tokensToAlipayNodes(tokens, ctx): MiniNode[]` — Token[] 转支付宝节点
- `getPlatformRenderer(platform): PlatformRenderer` — 查询平台 renderer 和能力
- `StreamingProcessor` — 直接控制流式处理（高级用法）
