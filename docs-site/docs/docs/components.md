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

组件层由 `Markdown` 和 `MiniNodeRenderer` 组成。推荐业务页面优先使用 `Markdown`，只有需要完全接管节点树时再直接使用 `MiniNodeRenderer`。

## Markdown 组件

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

```xml
<x-markdown
  content="{{content}}"
  streaming="{{streaming}}"
  selectable="{{true}}"
  footnote="{{true}}"
/>
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown 内容 |
| `streaming` | `boolean \| StreamingConfig` | `false` | 是否开启流式渲染 |
| `selectable` | `boolean` | `true` | 文本是否可选择 |
| `gfm` | `boolean` | 实例默认值 | 是否启用 GFM |
| `breaks` | `boolean` | 实例默认值 | 软换行是否转 `<br>` |
| `components` | `string[]` | `null` | 自定义组件标签白名单 |
| `footnote` | `boolean` | `false` | 是否启用内置脚注扩展 |

微信组件通过 `triggerEvent` 抛出 `renderstart`、`renderprogress`、`rendercomplete`；支付宝组件对应 `onRenderStart`、`onRenderProgress`、`onRenderComplete`。

## 自定义组件标签

`components` 用来声明允许透传的标签名。命中的自定义标签会进入 slot / 抽象节点渲染路径，适合把业务组件嵌入 Markdown。

```xml
<x-markdown
  content="{{content}}"
  components="{{['countdown']}}"
/>
```

```md
活动结束倒计时：<countdown value="3600"></countdown>
```

用户注册的 marked extension 优先级高于自动合成的自定义组件 tokenizer。

## MiniNodeRenderer

`MiniNodeRenderer` 接收已经生成好的 `MiniNode[]`。当你需要自己调用 `renderNodes`、缓存节点、或对节点树做二次处理时使用它。

```xml
<mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
```

组件内部会先 flatten inline 节点，因为小程序 `<text>` 不能嵌套自定义组件。

