import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# 打字机模式

按句号、问号、换行切块；每块再按 charDelay 逐字推进。超长句按 maxChunkSize 兜底切。
`;

const SCRIPT = `Page({
  data: {
    content: '一段长长的对话内容…',
    streaming: {
      hasNextChunk: true,
      semantic: {
        delimiters: /[。！？\\n]/,
        maxChunkSize: 60,
        chunkDelay: 50,
        charDelay: 20,
      },
      enableAnimation: true,
    },
  },
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    animation
    alipay={{
      template: `<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,
      script: SCRIPT,
    }}
    wechat={{
      template: `<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,
      script: SCRIPT,
    }}
  />
);
