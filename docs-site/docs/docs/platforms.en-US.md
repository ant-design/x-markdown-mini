---
title: Capability Matrix
order: 1
nav:
  title: Docs
  order: 4
group:
  title: Platforms
  order: 3
---

# Capability Matrix

The matrix documents which node capabilities each renderer preserves, and which platform differences it degrades. Application code should prefer the unified component path; the package root and `package.json#miniprogram` choose the right build.

## Introduce

```json
{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
```

## Code sample

```xml
<x-markdown content="{{content}}" />
```

| Platform | `<pre>` | `<table>` | `<blockquote>` | `<ol start>` | https-only image | `<video>` |
| -------- | :-----: | :-------: | :------------: | :----------: | :--------------: | :-------: |
| WeChat   |   ✅    |    ✅     |       ✅       |      ✅      |        —         |     —     |
| Alipay   |   ✅    |    ✅     |       ✅       |      —       |        ✅        |     —     |

The built-in platforms today are WeChat and Alipay only. To support another mini-program platform, add a renderer, component assets, and device / IDE verification — then add it to the matrix.
