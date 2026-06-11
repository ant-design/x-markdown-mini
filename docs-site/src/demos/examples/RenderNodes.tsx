import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# Hello

**x-markdown-mini** 把 Markdown 直接转换成端侧节点。

- 无需 WebView
- 无需 HTML 白名单
`;

const SCRIPT = `const { renderNodes } = require('@ant-design/x-markdown-mini');

Page({
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content: '# Hello\\n\\n**x-markdown-mini** 把 Markdown 直接转换成端侧节点。',
        platform: 'auto', // 自动检测，也可显式传 'wechat' / 'alipay'
        selectable: true,
      }),
    });
  },
});`;

const TEMPLATE = `<rich-text nodes="{{nodes}}" />`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{ template: TEMPLATE, script: SCRIPT }}
    wechat={{ template: TEMPLATE, script: SCRIPT }}
  />
);
