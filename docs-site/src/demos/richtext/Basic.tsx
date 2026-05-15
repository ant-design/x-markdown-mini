import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# 原生 rich-text

只想要节点数组、不想用封装组件时，自己 \`render()\` 后 \`setData(nodes)\`。
`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<view class="card">
  <rich-text nodes="{{nodes}}" />
</view>`,
      script: `import { render } from '@ant-design/x-markdown-mini';

Page({
  data: { nodes: [] },
  onLoad() {
    const nodes = render({
      content: '# Hello\\n\\nWorld.',
      platform: 'alipay',
      selectable: true,
    });
    this.setData({ nodes });
  },
});`,
      json: `{ "usingComponents": {} }`,
    }}
    wechat={{
      template: `<view class="card">
  <rich-text nodes="{{nodes}}" />
</view>`,
      script: `import { render } from '@ant-design/x-markdown-mini';

Page({
  data: { nodes: [] },
  onLoad() {
    const nodes = render({
      content: '# Hello\\n\\nWorld.',
      platform: 'wechat',
      selectable: true,
    });
    this.setData({ nodes });
  },
});`,
      json: `{ "usingComponents": {} }`,
    }}
  />
);
