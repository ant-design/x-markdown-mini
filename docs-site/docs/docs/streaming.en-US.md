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

The processor treats "two consecutive blank lines outside a fenced code block" as a safe boundary: blocks before the boundary are committed and never re-parsed; each round only parses the tail. Streamed input often stops mid-syntax. The default `streamingFixup: 'remend'` only touches the uncommitted tail: unclosed bold, code fences and formulas are completed temporarily, and the tail is re-parsed when the next chunk arrives. Committed stable blocks are never affected.

`semantic` controls the patch rhythm: chunks split on punctuation and newlines, `charDelay` advances characters within a chunk, and overly long sentences fall back to `maxChunkSize`. When `chunkDelay` and `charDelay` are both 0, no `setTimeout` is involved and `onPatch` fires synchronously on the production path.

The code below is loaded from real mini-program page files. The page keeps one preview on the right; demos and platforms switch inside the same control set.

<code src="../../src/demos/streaming/StreamingDocDemo.tsx" inline></code>

Without the component, the JS API works the same way:

```ts
renderNodes({
  content: accumulatedMarkdown, // everything received so far
  platform: 'wechat',
  streaming: { hasNextChunk: true },
  onPatch: (nodes) => this.setData({ nodes }),
});
```

> Why "two consecutive blank lines"?
> A single blank line may still continue a loose list; a double blank line outside a fence is an unambiguous block terminator in CommonMark. Conservative, but stable.

## API

### StreamingConfig

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hasNextChunk` | `boolean` | - | Whether more input follows. `false` flushes the remainder and ends the round |
| `semantic` | `boolean \| SemanticStreamingConfig` | `false` | Semantic chunking toggle / config |
| `enableAnimation` | `boolean` | `false` | Per-character fade-in for streamed blocks |

`streaming: true` is equivalent to `{ hasNextChunk: true, semantic: true, enableAnimation: true }`.

### SemanticStreamingConfig

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `delimiters` | `RegExp` | sentence / punctuation | Semantic delimiter regex |
| `maxChunkSize` | `number` | - | Max chars per chunk; long sentences split by length |
| `chunkDelay` | `number \| number[]` | `0` | Delay between chunks (ms); array ramps by rendered-block index |
| `charDelay` | `number \| number[]` | `0` | Per-character delay within a chunk (ms); array ramps by rendered-block index |
