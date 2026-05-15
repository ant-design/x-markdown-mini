---
title: 自定义平台
order: 3
nav:
  title: Docs
  order: 4
group:
  title: 平台
  order: 3
---

# 自定义平台

需要兼容矩阵之外的平台或 H5 网页？用 `toOtherNodes` + 自定义能力：

```ts
import { toOtherNodes } from '@ant-design/x-markdown-mini';

const html = toOtherNodes(nodes, {
  preSupported: true,
  tableSupported: true,
  blockquoteSupported: true,
  olStartSupported: true,
  httpsOnlyImages: false,
  videoSupported: true,
});
```
