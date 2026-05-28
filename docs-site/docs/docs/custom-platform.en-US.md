---
title: Custom Platform
order: 3
nav:
  title: Docs
  order: 4
group:
  title: Platforms
  order: 3
---

# Custom Platform

The built-in platforms today are WeChat and Alipay only. To add a new platform, provide a renderer, component assets, and matching tests:

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

Shipping a new platform also requires adding the platform type to `src/platforms/types.ts`, plus runtime detection and renderer registration in `src/platforms/index.ts`.
