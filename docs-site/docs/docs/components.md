---
title: 组件使用
order: 1
nav:
  title: Docs
  order: 4
group:
  title: A 组件
  order: 2
---

# 组件使用

`Markdown` 组件接 Markdown 字符串，`MiniNodeRenderer` 接节点数组。业务页面优先用 `Markdown`，需要完全接管节点树时再用 `MiniNodeRenderer`。

组件内部创建独立实例，并在生命周期结束时重置流式状态。

<code src="../../src/demos/components/ComponentsDocDemo.tsx" inline></code>

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown 内容 |
| `streaming` | `boolean \| StreamingConfig` | `false` | 是否开启流式渲染 |
| `selectable` | `boolean` | `true` | 文本是否可选择 |
| `gfm` | `boolean` | 实例默认值 | 是否启用 GFM |
| `breaks` | `boolean` | 实例默认值 | 软换行是否转 `<br>` |
| `components` | `string[]` | `null` | 自定义组件标签白名单 |
| `footnote` | `boolean` | `false` | 是否启用内置脚注扩展 |

渲染事件：微信为 `renderstart` / `renderprogress` / `rendercomplete`（`triggerEvent`），支付宝为 `onRenderStart` / `onRenderProgress` / `onRenderComplete`。

`components` 声明允许透传的标签。命中的标签会进入 slot / 抽象节点渲染路径，由页面自己的组件渲染。

同名的用户 extension 优先于自动合成的自定义组件 tokenizer。

需要自己调用 `renderNodes`、缓存节点或做二次处理时，把结果交给 `MiniNodeRenderer`。

组件内部会先 flatten inline 节点，因为小程序 `<text>` 不能嵌套自定义组件。

## 代码块 / 表格 header

代码块与表格默认带一个 header 栏：代码块左侧显示语言名、右侧是复制按钮（复制原始代码）；表格左侧显示“表格”、右侧复制按钮（复制 Markdown 源）。

关闭或自定义：

```ts
import { XMarkdownMini, copyButton } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  codeBlock: { header: false },                 // 关闭代码块 header
  table: {
    header: ({ markdown }) => [                  // 自定义表格 header
      { name: 'text', attrs: { class: 'md-tableblock-title', value: 'Table' } },
      copyButton(markdown),                      // 复制按钮（点击复制 markdown 源）
    ],
  },
});
```

`header` 取值：`true`（默认 header）/ `false`（无 header）/ 函数（返回自定义 `MiniNode` 节点）。自定义函数在 `renderNodes` 阶段执行、返回静态节点；用 `copyButton(payload)` 拼一个会被组件识别为可复制的按钮。代码 header 函数收到 `{ lang, text, token }`，表格 header 函数收到 `{ markdown, token }`。
