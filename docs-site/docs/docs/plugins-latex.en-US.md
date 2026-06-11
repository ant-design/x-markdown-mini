---
title: Formula
order: 2
nav:
  title: Docs
  order: 4
group:
  title: B Plugins
  order: 3
---

# Formula

The `Latex` plugin uses KaTeX to convert inline and block formulas into `MiniNode[]`. The plugin only generates nodes; import the stylesheet separately (see the style file in the demo).

## Usage

Supports the `$...$`, `$$...$$`, `\(...\)` and `\[...\]` delimiters.

<code src="../../src/demos/plugins/LatexDemo.tsx"></code>

## Error handling

With `throwOnError: false`, a broken formula renders as its source text; use `onError` to emit custom error nodes instead:

```ts
Latex({
  onError: (tex, err) => [
    {
      name: 'text',
      attrs: { value: `[formula error: ${err.message}]` },
    },
  ],
});
```
