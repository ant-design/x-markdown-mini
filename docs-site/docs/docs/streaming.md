---
title: 流式渲染
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 流式
  order: 2
---

# 流式渲染

LLM 一边吐字，UI 一边出节点。流式策略围绕两个目标：

1. **稳定**：已渲染的块不会因后续 token 改变结构（避免「跳变」）
2. **省**：不随每个 token 把整段从头解析一次

处理器把「不在围栏代码内的双连续空行」作为安全边界：边界之前的块提交后不再重新解析，每轮只解析 tail。流式输入经常停在不完整语法上，默认 `streamingFixup: 'remend'` 只作用于尚未提交的 tail：粗体、围栏代码、公式等未闭合语法会被临时补齐，等后续 chunk 到来后 tail 重新解析，不会污染已提交的稳定块。

`semantic` 控制 UI patch 的节奏：按标点和换行切块，`charDelay` 控制块内逐字推进，超长句按 `maxChunkSize` 兜底切。`chunkDelay` 和 `charDelay` 都为 0 时不走 `setTimeout`，生产路径同步触发 `onPatch`。

下面的代码来自真实小程序页面文件。一个文档页只保留一个右侧预览，示例和平台都在同一组控件里切换。

<code src="../../src/demos/streaming/StreamingDocDemo.tsx" inline></code>

不走组件时，JS API 的用法相同：

```ts
renderNodes({
  content: accumulatedMarkdown, // 当前累计的全部 markdown
  platform: 'wechat',
  streaming: { hasNextChunk: true },
  onPatch: (nodes) => this.setData({ nodes }),
});
```

> 为何用「双连续空行」？
> 单个空行还可能是 loose 列表的延续；双空行 + 非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。

## API

### StreamingConfig

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasNextChunk` | `boolean` | - | 是否还有后续输入。`false` 时 flush 剩余内容并结束本轮 |
| `semantic` | `boolean \| SemanticStreamingConfig` | `false` | 语义分块开关 / 配置 |
| `enableAnimation` | `boolean` | `false` | 流式块逐字淡入动画 |

`streaming: true` 等价于 `{ hasNextChunk: true, semantic: true, enableAnimation: true }`。

### SemanticStreamingConfig

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `delimiters` | `RegExp` | 句 / 标点 | 语义分隔符正则 |
| `maxChunkSize` | `number` | - | 单块最大字符数，超长句强制按长度切 |
| `chunkDelay` | `number \| number[]` | `0` | 语义块之间延迟（ms），数组按已渲染块序号变速 |
| `charDelay` | `number \| number[]` | `0` | 块内逐字延迟（ms），数组按已渲染块序号变速 |
