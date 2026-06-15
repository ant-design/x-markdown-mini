import React from 'react';
import { DocDemo, type DocDemoItem } from '../../components/DocDemo';

const BASIC_MARKDOWN = `## 组件渲染

把 Markdown 字符串绑定到 \`content\`，组件内部完成解析和渲染。

- 独立实例，互不干扰
- 卸载时自动重置流式状态
- [查看 API](https://github.com/ant-design/x-markdown-mini)
`;

const BASIC_SCRIPT = `Page({
  data: {
    content: '## 组件渲染\\n\\n把 Markdown 字符串绑定到 content…',
  },
  onComplete() {
    console.log('render complete');
  },
});`;

const BASIC_STYLE = `.page {
  padding: 16px;
}`;

const demos: DocDemoItem[] = [
  {
    key: 'markdown',
    title: 'Markdown 组件',
    description: '业务页优先接入 Markdown 组件。组件内部创建独立实例，并在生命周期结束时重置流式状态。',
    navTitle: 'Markdown 组件',
    markdown: BASIC_MARKDOWN,
    alipay: {
      template: `<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    onRenderComplete="onComplete"
  />
</view>`,
      script: BASIC_SCRIPT,
      style: BASIC_STYLE,
      json: `{
  "defaultTitle": "Markdown 组件",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/dist/components/Markdown/index"
  }
}`,
    },
    wechat: {
      template: `<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    bind:rendercomplete="onComplete"
  />
</view>`,
      script: BASIC_SCRIPT,
      style: BASIC_STYLE,
      json: `{
  "navigationBarTitleText": "Markdown 组件",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`,
    },
  },
];

export default function ComponentsDocDemo() {
  return <DocDemo demos={demos} codeMinHeight={560} />;
}
