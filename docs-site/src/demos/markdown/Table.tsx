import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `## GFM 表格

| 平台   | platform   |
|--------|------------|
| 微信   | \`wechat\`  |
| 支付宝 | \`alipay\`  |
| 抖音   | \`douyin\`  |
`;

const SCRIPT = `Page({
  data: {
    content: \`| 平台 | platform |
|------|----------|
| 微信 | wechat   |
| 支付宝 | alipay |\`,
  },
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<view class="card">
  <markdown content="{{content}}" />
</view>`,
      script: SCRIPT,
    }}
    wechat={{
      template: `<view class="card">
  <markdown content="{{content}}" />
</view>`,
      script: SCRIPT,
    }}
  />
);
