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

The LLM streams tokens; the UI emits nodes alongside. The streaming strategy targets two goals:

1. **Stability**: blocks that have already rendered do not change structure when later tokens arrive (no "jumping")
2. **Frugality**: don't re-parse the whole string for every incoming token

## Basic streaming

Pass the accumulated Markdown in full on every round; the final round sets `hasNextChunk: false`, which flushes the remainder and triggers `onRenderComplete`.

<code src="../../src/demos/streaming/Basic.tsx"></code>

Without the component, the JS API works the same way:

```ts
renderNodes({
  content: accumulatedMarkdown, // everything received so far
  platform: 'wechat',
  streaming: { hasNextChunk: true },
  onPatch: (nodes) => this.setData({ nodes }),
});
```

## Streaming fixup

Streamed input often stops mid-syntax. The default `streamingFixup: 'remend'` only touches the uncommitted tail: unclosed bold, code fences and formulas are completed temporarily, and the tail is re-parsed when the next chunk arrives. Committed stable blocks are never affected.

<code src="../../src/demos/streaming/Fixup.tsx"></code>

## Semantic chunking (typewriter)

`semantic` controls the patch rhythm: chunks split on punctuation and newlines, `charDelay` advances characters within a chunk, and overly long sentences fall back to `maxChunkSize`.

<code src="../../src/demos/streaming/Typewriter.tsx"></code>

When `chunkDelay` and `charDelay` are both 0, no `setTimeout` is involved and `onPatch` fires synchronously on the production path.

## Incremental strategy

The processor treats "two consecutive blank lines outside a fenced code block" as a safe boundary: blocks before the boundary are committed and never re-parsed; each round only parses the tail.

:::info Why "two consecutive blank lines"?
A single blank line may still continue a loose list; a double blank line outside a fence is an unambiguous block terminator in CommonMark. Conservative, but stable.
:::
