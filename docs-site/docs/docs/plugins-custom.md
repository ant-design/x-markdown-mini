---
title: 自定义插件
order: 3
nav:
  title: Docs
  order: 4
group:
  title: B 插件
  order: 3
---

# 自定义插件

自定义插件推荐使用 `XMarkdownExtension`：tokenizer 和 `miniRenderer` 写在同一个 extension 里，直接产出 `MiniNode`，不需要先转 HTML。

下面以脚注为例，实现 `Markdown[^1:一种轻量标记语言]`。

## 插件结构

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
            label: (m[1] ?? '注').trim(),
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

## 使用

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Footnote from '@ant-design/x-markdown-mini/plugins/Footnote';

const md = new XMarkdownMini({
  extensions: [Footnote()],
});

const nodes = md.renderNodes({
  content: 'Markdown[^1:一种轻量标记语言] 很适合文档。',
  platform: 'wechat',
});
```

内置 `Markdown` 组件也提供 `footnote` 属性。开启后，脚注节点会走 slot / 抽象节点路由，交给宿主页面渲染 marker 和 popover。

```xml
<x-markdown content="{{content}}" footnote="{{true}}" />
```

## 规则

- tokenizer 决定如何把源文本识别成 token。
- `miniRenderer` 决定 token 如何变成 `MiniNode`。
- 未被插件处理的 token 会继续走平台 renderer。
- 同名用户 extension 优先于自动合成的自定义组件 tokenizer。

