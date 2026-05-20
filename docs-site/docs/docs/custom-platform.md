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

当前内置平台只有微信和支付宝。新增平台时应补 renderer、组件产物和对应测试：

```ts
import type { PlatformRenderer } from '@ant-design/x-markdown-mini';
import { tokensToWechatNodes } from '@ant-design/x-markdown-mini';

export const customRenderer: PlatformRenderer = {
  name: 'wechat',
  capabilities: {
    supportsOlStart: true,
    requiresHttpsImage: false,
    anchorHrefMode: 'data-href',
    supportsTable: true,
    supportsPre: true,
    supportsBlockquote: true,
  },
  renderTokens: tokensToWechatNodes,
};
```

真正发布新平台还需要在 `src/platform.ts` 增加平台类型与运行时探测，并在 `src/platforms/index.ts` 注册 renderer。
