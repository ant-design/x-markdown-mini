---
title: Streaming Rendering
order: 1
nav:
  title: Docs
  order: 4
group:
  title: Streaming
  order: 2
---

# Streaming Rendering

The LLM streams tokens; the UI emits nodes alongside. The library's streaming strategy targets two goals:

1. **Stability**: blocks that have already rendered do not change structure when later tokens arrive (avoid "jumping")
2. **Frugality**: don't re-parse the entire string from scratch every time a single token shows up

## Basic streaming

Each setData call passes the accumulated Markdown in full; setting `hasNextChunk=false` triggers `onRenderComplete`.

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
  content: accumulatedMarkdown, // all Markdown accumulated so far
  platform: 'wechat',
  streaming: {
    hasNextChunk: true, // more chunks to come
    semantic: true, // chunk by sentence / punctuation (default)
    enableAnimation: true, // tag new blocks with md-animate-block; CSS handles fade-in
  },
  onPatch: (nodes) => this.setData({ nodes }),
});

// final pass: hasNextChunk=false, flush leftover and trigger onRenderComplete
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => console.log('done'),
});
```

## Incremental strategy

On every update, the processor finds positions that are "outside a fenced code block" AND "preceded by two consecutive blank lines" — those are safe block boundaries. The pure-JS path returns marked `Token[]`; the component path then feeds those tokens into the platform renderer. Both paths first run streaming fixup on the tail string before handing it to the marked lexer.

:::info Why "two consecutive blank lines"?
A single blank line can still be the continuation of a loose list. Two blank lines + outside a fence is an unambiguous block-terminator in CommonMark semantics. The rule is conservative but stable.
:::
