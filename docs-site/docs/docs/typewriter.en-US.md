---
title: Typewriter Mode
order: 2
nav:
  title: Docs
  order: 4
group:
  title: Streaming
  order: 2
---

# Typewriter Mode

Typewriter mode is for visible character-by-character output. It reuses the streaming processor, adding delays between semantic chunks and characters.

## Introduce

Configure delimiters, inter-chunk delay, and per-character delay under `streaming.semantic`:

```ts
streaming: { semantic: true }
```

## Code sample

<code src="../../src/demos/streaming/Typewriter.tsx"></code>

When either `chunkDelay` or `charDelay` is > 0, the processor steps through semantic chunks one at a time. Each step runs one "commit + tail re-parse + onPatch" cycle.

```ts
streaming: {
  semantic: {
    delimiters: /[。！？\n]/,
    maxChunkSize: 60,
    chunkDelay: 50, // ms delay between chunks
    charDelay: 20,  // ms delay between chars within a chunk
  },
}
```

When both delays are `0` (default), the processor **skips setTimeout entirely** and pushes patches synchronously — the fastest path for ordinary production streaming.
