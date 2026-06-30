---
title: 打字机模式
order: 2
nav:
  title: Docs
  order: 4
group:
  title: 流式
  order: 2
---

# 打字机模式

打字机模式用于需要可见逐字输出的场景。它复用流式处理器，只是在语义分块和字符推进之间加入延迟。

## 引入

在 `streaming.semantic` 里配置分隔符、块间延迟和块内字符延迟：

```ts
streaming: { semantic: true }
```

## 代码示例

<code src="../../src/demos/streaming/Typewriter.tsx"></code>

`chunkDelay` 或 `charDelay` 任一 > 0 时，处理器会按语义切块逐块推进，每步走一次「commit + tail re-parse + onPatch」。

```ts
streaming: {
  semantic: {
    delimiters: /[。！？\n]/,
    maxChunkSize: 60,
    chunkDelay: 50, // 块之间 ms 延迟
    charDelay: 20,  // 块内逐字 ms 延迟
  },
}
```

两个延迟都为 `0`（默认）时**完全跳过 setTimeout**，直接同步推回 —— 这是常规生产流式的最快路径。
