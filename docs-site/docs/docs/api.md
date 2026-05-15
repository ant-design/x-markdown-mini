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

## `render(props): UnifiedNode[]`

主入口。一次性模式返回适配后节点；流式模式通过 `onPatch` 推回，返回值为空数组。

| 字段               | 类型                              | 默认       | 说明                                                                                          |
| ------------------ | --------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| `content`          | `string`                          | —          | Markdown 字符串（必填）                                                                       |
| `platform`         | `PlatformInput`                   | `'auto'`   | `'auto' \| 'wechat' \| 'alipay' \| 'douyin' \| 'baidu' \| 'qq' \| 'kuaishou' \| 'dingtalk' \| 'jd' \| 'other'` |
| `streaming`        | `boolean \| StreamingConfig`      | `false`    | 开启或自定义流式行为                                                                          |
| `animation`        | `boolean`                         | `false`    | 是否给块级节点加 `md-animate-block` class                                                     |
| `selectable`       | `boolean`                         | `true`     | 文本是否可选择（适配各端尽量映射）                                                            |
| `options`          | `LexerOptions`                    | —          | 解析选项，如 `{ gfm, breaks }`                                                                |
| `onRenderStart`    | `() => void`                      | —          | 开始回调                                                                                      |
| `onRenderProgress` | `(p: { markdown }) => void`       | —          | 每轮已输出 markdown                                                                           |
| `onRenderComplete` | `() => void`                      | —          | 结束回调                                                                                      |
| `onPatch`          | `(nodes) => void`                 | —          | 流式时每次解析完成的全量节点回调                                                              |

## `StreamingConfig`

| 字段              | 类型                                  | 默认     | 说明                                       |
| ----------------- | ------------------------------------- | -------- | ------------------------------------------ |
| `done`            | `boolean`                             | `false`  | 本轮是否结束流式（结束时 flush 残余）      |
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

- `parse(markdown, options): IRNode[]` — 直接拿 IR 树
- `parseInline(text, options): IRNode[]` — 单独解析行内
- `irToUnifiedNodes(ir, opts): UnifiedNode[]` — IR 转统一节点
- `runPipeline(content, opts): UnifiedNode[]` — 一次性流水线
- `adaptToPlatform(nodes, platform): UnifiedNode[]` — 按平台适配
- `adaptNodes(nodes, config): UnifiedNode[]` — 自定义配置适配
- `StreamingProcessor` — 直接控制流式处理（高级用法）
