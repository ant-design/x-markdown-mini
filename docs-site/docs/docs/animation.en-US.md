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

When `enableAnimation: true`, every block-level node gets `md-animate-block` appended to its `class`. In your mini-program WXSS / ACSS file:

<code src="../../src/demos/streaming/Animation.tsx"></code>

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
