---
title: 流式渲染
order: 2
nav:
  title: Examples
  order: 2
group:
  title: 组件
  order: 1
---

# 流式渲染

让 LLM 边吐边渲。已稳定块缓存为 `stableNodes`，仅未稳定的 tail 重 lex；同时支持语义切块的打字机节奏。

## 基础流式

每次 setData 把累计的 markdown 全量传入；`hasNextChunk=false` 时触发 `onRenderComplete`。

<code src="../../src/demos/streaming/Basic.tsx"></code>

## 打字机模式

`chunkDelay` / `charDelay` 控制语义切块的逐句、逐字推进节奏。

<code src="../../src/demos/streaming/Typewriter.tsx"></code>

## 块级淡入动画

每个块级节点 class 拼上 `md-animate-block`；CSS 控制淡入节奏，已稳定块不会重放。

<code src="../../src/demos/streaming/Animation.tsx"></code>
