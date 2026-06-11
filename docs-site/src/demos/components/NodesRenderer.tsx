import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `### 自己接管节点

先 \`renderNodes\` 拿到 \`MiniNode[]\`，做缓存或二次处理，再交给 \`MiniNodeRenderer\`。
`;

const SCRIPT = `const { renderNodes } = require('@ant-design/x-markdown-mini');

Page({
  onLoad() {
    const nodes = renderNodes({
      content: '### 自己接管节点\\n\\n先 renderNodes 拿到 MiniNode[]…',
      platform: 'auto',
    });
    // 这里可以缓存 nodes 或做二次处理
    this.setData({ nodes });
  },
});`;

const TEMPLATE = `<mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: TEMPLATE,
      script: SCRIPT,
      json: `{
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/dist/components/MiniNodeRenderer/index"
  }
}`,
    }}
    wechat={{
      template: TEMPLATE,
      script: SCRIPT,
      json: `{
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}`,
    }}
  />
);
