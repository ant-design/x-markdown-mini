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

```ts
render({
  content: accumulatedMarkdown, // 当前累计的全部 markdown
  platform: 'wechat',
  streaming: {
    done: false, // 还有后续 chunk
    semantic: true, // 按句/标点切块（默认）
    enableAnimation: true, // 给新块打 md-animate-block 类，CSS 做淡入
  },
  onPatch: (nodes) => this.setData({ nodes }),
});

// 最后一轮：done=true，flush 残余并触发 onRenderComplete
render({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { done: true },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

## 增量策略

处理器在每次更新时找出「不在 fenced code 内」且「连续两个空行」的位置作为安全边界。前面的内容只 parse 一次并缓存为 `stableNodes`；只对边界之后的 tail 重新 lex。

:::info 为何用「双连续空行」？
单个空行还可能是 loose 列表的延续；双空行 + 非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。
:::
