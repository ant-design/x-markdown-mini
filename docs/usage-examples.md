# 各端使用示例

## 微信小程序

```ts
import { render } from '@ant-design/x-markdown-mini';

Page({
  data: { nodes: [] },
  onLoad() {
    const nodes = render({
      content: '# 标题\n\n段落 **加粗**。',
      platform: 'wechat',
      selectable: true,
    });
    this.setData({ nodes });
  },
});
```

```html
<rich-text nodes="{{nodes}}" />
```

## 支付宝小程序

```ts
import { render } from '@ant-design/x-markdown-mini';

const nodes = render({
  content: markdownString,
  platform: 'alipay',
});
```

## 抖音小程序

```ts
import { render } from '@ant-design/x-markdown-mini';

const nodes = render({
  content: markdownString,
  platform: 'douyin',
});
```

## 流式渲染（通用）

```ts
import { render } from '@ant-design/x-markdown-mini';

// 每收到一段 content 调用一次，流未结束前 hasNextChunk 为 true
render({
  content: accumulatedMarkdown,
  hasNextChunk: true,
  streaming: true,
  platform: 'wechat',
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => this.setData({ hasNextChunk: false }),
});

// 流结束
render({
  content: fullMarkdown,
  hasNextChunk: false,
  streaming: true,
  platform: 'wechat',
  onPatch: (nodes) => this.setData({ nodes }),
  onRenderComplete: () => {},
});
```

## 按端单独调用适配器

```ts
import { runPipeline, toWechatNodes, toAlipayNodes } from '@ant-design/x-markdown-mini';

const unified = runPipeline('# Hi', { animation: true });
const wechatNodes = toWechatNodes(unified);
const alipayNodes = toAlipayNodes(unified);
```
