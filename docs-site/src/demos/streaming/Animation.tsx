import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# 块级动画

新块淡入；已 commit 的块引用稳定，不重放。
`;

const STYLE = `.md-animate-block {
  animation: md-fade-in 320ms cubic-bezier(.2,.7,.2,1) both;
}
@keyframes md-fade-in {
  from { opacity: 0; transform: translateY(8rpx); }
  to   { opacity: 1; transform: none; }
}`;

const SCRIPT = `Page({
  data: {
    content: '# 动画\\n看每个段落进入时的淡入。',
    streaming: { hasNextChunk: false, enableAnimation: true },
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
      style: STYLE,
    }}
    wechat={{
      template: `<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,
      script: SCRIPT,
      style: STYLE,
    }}
  />
);
