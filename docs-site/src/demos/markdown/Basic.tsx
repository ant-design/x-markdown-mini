import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# x-markdown-mini

支持 **加粗**、*斜体* 与 \`inline code\`。

- 列表项一
- 列表项二
- [Ant Design](https://ant.design)

> 引用块：用于演示 blockquote 的渲染降级。
`;

const COMMON_STYLE = `.page { padding: 24rpx; }
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}`;

const SCRIPT = `Page({
  data: {
    content: \`# x-markdown-mini

支持 **加粗**、*斜体* 与 \\\`inline code\\\`。

- 列表项一
- 列表项二
- [Ant Design](https://ant.design)
\`,
  },
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,
      script: SCRIPT,
      style: COMMON_STYLE,
      json: `{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/alipay/markdown"
  }
}`,
    }}
    wechat={{
      template: `<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,
      script: SCRIPT,
      style: COMMON_STYLE,
      json: `{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/wechat/markdown"
  }
}`,
    }}
  />
);
