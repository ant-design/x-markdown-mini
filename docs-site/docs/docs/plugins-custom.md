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

## 引入

```ts
import type { XMarkdownExtension } from '@ant-design/x-markdown-mini';
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
```

## 代码示例

以内置脚注插件为例，语法 `Markdown[^1:一种轻量标记语言]`。脚注节点由宿主页面渲染 marker 和弹层；内置 `Markdown` 组件直接开 `footnote` 属性即可。

<code src="../../src/demos/plugins/FootnoteDemo.tsx"></code>

## 插件结构

上面的脚注插件完整实现：

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

## 规则

- tokenizer 决定如何把源文本识别成 token。
- `miniRenderer` 决定 token 如何变成 `MiniNode`。
- 未被插件处理的 token 继续走平台 renderer。
- 同名用户 extension 优先于自动合成的自定义组件 tokenizer。

## 覆盖内置渲染（如 table）

extension 的 `name` 命中内置 token 类型（如 `table`、`code`）时，`miniRenderer` 会完全接管该 token 的渲染，替换内置结果。只提供 `miniRenderer`、不提供 `tokenizer` 时，解析仍走 marked 内置分词器，只有「Token → MiniNode」这一步被替换；返回 `null` 则回退到内置渲染。

下面把表格改渲染成「每行一条」的列表：

<code src="../../src/demos/plugins/CustomTableDemo.tsx"></code>
