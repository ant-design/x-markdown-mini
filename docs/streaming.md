# 流式渲染

LLM 一边吐字，UI 一边出节点。本库的流式策略围绕两个目标：

1. **稳定**：已经渲染完的块不会因为后续 token 改变结构（避免「跳变」）
2. **省**：不要每来一个 token 就把整段 markdown 从头解析一次

## 配置

```ts
import { render } from '@ant-design/x-markdown-mini';

render({
  content,                       // 当前累计的全部 markdown
  streaming: {
    done: false,                 // 还有后续 chunk
    semantic: true,              // 按句/标点切块（默认）
    enableAnimation: true,       // 给新块打 md-animate-block 类，CSS 做淡入
  },
  onPatch: (nodes) => {
    // setData({ nodes }) — 每轮把节点全量推回 UI
  },
});
```

最后一轮把 `done: true` 设上，处理器会把残余 buffer flush 出去并触发 `onRenderComplete`。

## 增量策略

每次 `render()` 接收新的累计 `content`，处理器会做两件事：

1. **commit 已稳定块**：扫描已渲染文本，找出「不在 fenced code 内」且「连续两个空行」的位置作为安全边界，前面的内容只 parse 一次并缓存为 `stableNodes`
2. **重解析未稳定 tail**：只对 commit 点之后的字符走一次 lexer，与 `stableNodes` 拼接后通过 `onPatch` 推回

```
   committedLen
       ▼
┌────────────────────────────┬─────────────────┐
│  stableNodes (缓存，不变)  │  tail (重解析)  │
└────────────────────────────┴─────────────────┘
              │                       │
              └────── concat ─────────┘
                         │
                  onPatch(nodes)
```

为什么用「双连续空行」？因为单个空行还可能是 loose 列表或松散块引用的延续；双空行外加非 fence 内是 CommonMark 语义上明确的块终止。规则保守但稳定。

## 打字机模式

`chunkDelay` 或 `charDelay` 任一 > 0 时，处理器会按语义切块（`delimiters` 默认 `/[。？！……；：——，、\n]/`）逐块推进 `renderedText`，每步都走一次「commit + tail re-parse + onPatch」。

```ts
streaming: {
  semantic: { delimiters: /[。！？\n]/, maxChunkSize: 60, chunkDelay: 50, charDelay: 20 },
}
```

| 参数            | 含义                                                |
| --------------- | --------------------------------------------------- |
| `delimiters`    | 语义切分正则                                        |
| `maxChunkSize`  | 一句过长时的硬上限                                  |
| `chunkDelay`    | 块之间的 ms 延迟（视觉节奏）                        |
| `charDelay`     | 块内逐字 ms 延迟（典型打字机）                      |

两个延迟都为 0（默认）时**完全跳过 setTimeout**，直接同步推回 —— 这是常规生产流式的最快路径。

## 动画

`enableAnimation: true` 时，每个块级节点的 class 会拼上 `md-animate-block`。在小程序 WXSS / ACSS 写：

```css
.md-animate-block {
  animation: md-fade-in 240ms ease-out both;
}
@keyframes md-fade-in {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: none; }
}
```

CSS 动画在节点首次出现时跑一次 —— 后续 commit 进入 `stableNodes` 后引用不变，不会重放。

## 与 `onPatch` 协议

`onPatch(nodes)` 推回的是「**当前为止的全量统一节点**」，而不是 diff。消费方：

```ts
onPatch: (nodes) => {
  this.setData({ nodes });   // 微信
  // 或 my.setData / tt.setData
}
```

由于 `stableNodes` 引用稳定，rich-text 内部的 diff（如有）能跳过这部分。
