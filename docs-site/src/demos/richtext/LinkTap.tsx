import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# 链接拦截

微信路径会把 \`<a href>\` 改写成 \`data-href\`，需消费方在 \`bindtap\` 里读 \`event.target.dataset.href\`。
`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<view class="card">
  <!-- 支付宝 axml 的 <a> 自动可点，无需拦截 -->
  <rich-text nodes="{{nodes}}" />
</view>`,
      script: `import { render } from '@ant-design/x-markdown-mini';

Page({
  data: {
    nodes: render({
      content: '点 [Ant Design](https://ant.design) 试试',
      platform: 'alipay',
    }),
  },
});`,
    }}
    wechat={{
      template: `<view class="card">
  <rich-text nodes="{{nodes}}" bindtap="onTap" />
</view>`,
      script: `import { render } from '@ant-design/x-markdown-mini';

Page({
  data: {
    nodes: render({
      content: '点 [Ant Design](https://ant.design) 试试',
      platform: 'wechat',
    }),
  },
  onTap(e) {
    const href = e.target.dataset.href;
    if (href) wx.navigateTo({ url: href });
  },
});`,
    }}
  />
);
