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

Use `XMarkdownExtension` for custom syntax: put the tokenizer and `miniRenderer` in the same extension and emit `MiniNode` directly.

This example implements `Markdown[^1:a lightweight markup language]`.

## Extension

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
            attrs: { label: t.label, content: t.content, class: 'md-footnote' },
          };
        },
      },
    ],
  };
}
```

## Usage

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Footnote from '@ant-design/x-markdown-mini/plugins/Footnote';

const md = new XMarkdownMini({
  extensions: [Footnote()],
});

const nodes = md.renderNodes({
  content: 'Markdown[^1:a lightweight markup language] works well for docs.',
  platform: 'wechat',
});
```

The bundled `Markdown` component also exposes a `footnote` prop:

```xml
<x-markdown content="{{content}}" footnote="{{true}}" />
```

