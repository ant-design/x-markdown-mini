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

## 流式补全

流式输入经常停在不完整 Markdown 上，例如：

```md
**正在生成

```ts
const value =
```

默认 `streamingFixup: 'remend'` 只作用在尚未提交的 tail 上，会临时补齐粗体、围栏代码、公式等未闭合语法，让当前片段能被 marked 稳定解析。等后续 chunk 到来后，tail 会重新解析，不会污染已经提交的稳定块。

如果业务希望完全按原始输入渲染，可以关闭：

```ts
const md = new XMarkdownMini({
  streamingFixup: false,
});
```

也可以传入自定义函数：

```ts
const md = new XMarkdownMini({
  streamingFixup: (tail) => tail.endsWith('```') ? tail : `${tail}\n\`\`\``,
});
```

## 语义化分块

`semantic` 控制 UI patch 的节奏。默认按中文、英文常见标点和换行切块，避免一个 token 一个 token 地刷屏，也避免长句迟迟不出。

```ts
renderNodes({
  content: accumulatedMarkdown,
  platform: 'alipay',
  streaming: {
    hasNextChunk: true,
    semantic: {
      delimiters: /[。？！；，、\n]/,
      maxChunkSize: 80,
      chunkDelay: 0,
      charDelay: 0,
    },
  },
  onPatch: (nodes) => this.setData({ nodes }),
});
```

`chunkDelay` 和 `charDelay` 都为 0 时不会走 `setTimeout`，生产路径会同步触发 `onPatch`。

## 增量策略

处理器在每次更新时找出「不在 fenced code 内」且「连续两个空行」的位置作为安全边界。纯 JS 路径返回 marked `Token[]`；组件路径会在 tokens 之后进入平台 renderer。两条路径都会先对 tail 字符串做流式 fixup，再进入 marked lexer。

:::info 为何用「双连续空行」？
单个空行还可能是 loose 列表的延续；双空行 + 非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。
:::
