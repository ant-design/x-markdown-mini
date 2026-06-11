import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `活动倒计时：<countdown value="3600"></countdown>

命中 \`components\` 白名单的标签会作为节点透传，由页面自己的组件渲染。
`;

const SCRIPT = `Page({
  data: {
    content: '活动倒计时：<countdown value="3600"></countdown>',
    tags: ['countdown'],
  },
});`;

const TEMPLATE = `<x-markdown content="{{content}}" components="{{tags}}" />`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    components={['countdown']}
    alipay={{ template: TEMPLATE, script: SCRIPT }}
    wechat={{ template: TEMPLATE, script: SCRIPT }}
  />
);
