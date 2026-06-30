---
title: Animation
order: 3
nav:
  title: Docs
  order: 4
group:
  title: Streaming
  order: 2
---

# Animation

Streaming animation marks only newly emitted block nodes for a light fade-in during AI output. It does not reflow committed content or replay when stable blocks are reused.

## Introduce

Enable `enableAnimation` in the render config, then define `md-animate-block` in the mini-program stylesheet:

```ts
streaming: { hasNextChunk: true, enableAnimation: true }
```

## Code sample

<code src="../../src/demos/streaming/Animation.tsx"></code>

When `enableAnimation: true`, every block-level node gets `md-animate-block` appended to its `class`. In your mini-program WXSS / ACSS file:

```css
.md-animate-block {
  animation: md-fade-in 240ms ease-out both;
}
@keyframes md-fade-in {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

The CSS animation runs once when a node first appears — after subsequent commits push it into `stableNodes`, its reference stays the same and the animation does not replay.
