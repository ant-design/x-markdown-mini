import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `## 组件渲染

把 Markdown 字符串绑定到 \`content\`，组件内部完成解析和渲染。

- 独立实例，互不干扰
- 卸载时自动重置流式状态
- [查看 API](https://github.com/ant-design/x-markdown-mini)
`;

const SCRIPT = `Page({
  data: {
    content: '## 组件渲染\\n\\n把 Markdown 字符串绑定到 content…',
  },
  onComplete() {
    console.log('render complete');
  },
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<x-markdown
  content="{{content}}"
  selectable="{{true}}"
  onRenderComplete="onComplete"
/>`,
      script: SCRIPT,
      json: `{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`,
    }}
    wechat={{
      template: `<x-markdown
  content="{{content}}"
  selectable="{{true}}"
  bind:rendercomplete="onComplete"
/>`,
      script: SCRIPT,
      json: `{
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`,
    }}
  />
);
