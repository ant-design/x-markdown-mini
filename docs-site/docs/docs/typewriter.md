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
