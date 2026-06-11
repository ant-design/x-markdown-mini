---
title: Custom Plugin
order: 3
nav:
  title: Docs
  order: 4
group:
  title: B Plugins
  order: 3
---

# Custom Plugin

Use `XMarkdownExtension` for custom syntax: the tokenizer and `miniRenderer` live in the same extension and emit `MiniNode` directly, with no HTML round-trip.

## Result

The built-in footnote plugin as an example, using the syntax `Markdown[^1:a lightweight markup language]`. The host page renders the marker and popover; the built-in `Markdown` component just needs its `footnote` prop.

<code src="../../src/demos/plugins/FootnoteDemo.tsx"></code>

## Plugin structure

The full implementation of the footnote plugin above:

```ts
import type { MiniNode, Tokens, XMarkdownExtension } from '@ant-design/x-markdown-mini';

const RULE = /^\[\^(?:([^\]:]+):)?([\s\S]+?)\]/;

export function Footnote(): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'footnote',
        level: 'inline',
        start(src: string): number | undefined {
          const i = src.indexOf('[^');
          return i < 0 ? undefined : i;
        },
        tokenizer(src: string): Tokens.Generic | undefined {
          const m = RULE.exec(src);
          if (!m) return undefined;
          return {
            type: 'footnote',
            raw: m[0],
            label: (m[1] ?? 'note').trim(),
            content: m[2].trim(),
          } as unknown as Tokens.Generic;
        },
        miniRenderer(token): MiniNode {
          const t = token as unknown as { label: string; content: string };
          return {
            name: 'footnote',
            tag: 'footnote',
            attrs: {
              label: t.label,
              content: t.content,
              class: 'md-footnote',
            },
          };
        },
      },
    ],
  };
}
```

## Rules

- The tokenizer decides how source text becomes a token.
- `miniRenderer` decides how a token becomes a `MiniNode`.
- Tokens not handled by a plugin continue through the platform renderer.
- A user extension with the same name takes precedence over the auto-synthesized custom-component tokenizer.
