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

LLM 一边吐字，UI 一边出节点。本库的流式策略围绕两个目标：

1. **稳定**：已经渲染完的块不会因为后续 token 改变结构（避免「跳变」）
2. **省**：不要每来一个 token 就把整段从头解析一次

## 基础流式

每次 setData 把累计的 markdown 全量传入；`hasNextChunk=false` 时触发 `onRenderComplete`。

<code src="../../src/demos/streaming/Basic.tsx"></code>

```ts
render({
  content: accumulatedMarkdown,
  streaming: { hasNextChunk: true },
  onPatch: (tokens) => {
    // marked Token[]
  },
});

renderNodes({
  content: accumulatedMarkdown, // 当前累计的全部 markdown
  platform: 'wechat',
  streaming: {
    hasNextChunk: true, // 还有后续 chunk
    semantic: true, // 按句/标点切块（默认）
    enableAnimation: true, // 给新块打 md-animate-block 类，CSS 做淡入
  },
  onPatch: (nodes) => this.setData({ nodes }),
});

// 最后一轮：hasNextChunk=false，flush 残余并触发 onRenderComplete
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

## 增量策略

处理器在每次更新时找出「不在 fenced code 内」且「连续两个空行」的位置作为安全边界。纯 JS 路径返回 marked `Token[]`；组件路径会在 tokens 之后进入平台 renderer。两条路径都会先对 tail 字符串做流式 fixup，再进入 marked lexer。

:::info 为何用「双连续空行」？
单个空行还可能是 loose 列表的延续；双空行 + 非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。
:::