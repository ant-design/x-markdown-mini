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

## 基础流式

每轮把累计的 Markdown 全量传入；最后一轮 `hasNextChunk: false` flush 残余内容并触发 `onRenderComplete`。

<code src="../../src/demos/streaming/Basic.tsx"></code>

不走组件时，JS API 的用法相同：

```ts
renderNodes({
  content: accumulatedMarkdown, // 当前累计的全部 markdown
  platform: 'wechat',
  streaming: { hasNextChunk: true },
  onPatch: (nodes) => this.setData({ nodes }),
});
```

## 流式补全

流式输入经常停在不完整语法上。默认 `streamingFixup: 'remend'` 只作用于尚未提交的 tail：粗体、围栏代码、公式等未闭合语法会被临时补齐，等后续 chunk 到来后 tail 重新解析，不会污染已提交的稳定块。

<code src="../../src/demos/streaming/Fixup.tsx"></code>

## 语义化分块（打字机）

`semantic` 控制 UI patch 的节奏：按标点和换行切块，`charDelay` 控制块内逐字推进，超长句按 `maxChunkSize` 兜底切。

<code src="../../src/demos/streaming/Typewriter.tsx"></code>

`chunkDelay` 和 `charDelay` 都为 0 时不走 `setTimeout`，生产路径同步触发 `onPatch`。

## 增量策略

处理器把「不在围栏代码内的双连续空行」作为安全边界：边界之前的块提交后不再重新解析，每轮只解析 tail。

:::info 为何用「双连续空行」？
单个空行还可能是 loose 列表的延续；双空行 + 非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。
:::
