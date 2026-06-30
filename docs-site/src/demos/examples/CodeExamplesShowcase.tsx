import React from 'react';
import { DocDemo, type DocDemoItem } from '../../components/DocDemo';

import renderNodesAxml from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.axml';
import renderNodesAcss from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.acss';
import renderNodesAlipayJs from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.js';
import renderNodesAlipayJson from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.json';
import renderNodesWxml from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.wxml';
import renderNodesWxss from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.wxss';
import renderNodesWechatJs from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.js';
import renderNodesWechatJson from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.json';

const RENDER_NODES_MARKDOWN = `# Hello

**x-markdown-mini** 把 Markdown 直接转换成端侧节点。

- 无需 WebView
- 无需 HTML 白名单
`;

const demos: DocDemoItem[] = [
  {
    key: 'render-nodes',
    title: '直接生成节点',
    description: '推荐先用 renderNodes 生成 MiniNode[]，再交给 MiniNodeRenderer 或自定义渲染组件接管。',
    navTitle: '直接生成节点',
    previewTitle: '真实页面文件',
    platformNotes: {
      alipay: 'index.axml / dist components',
      wechat: 'index.wxml / components',
    },
    markdown: RENDER_NODES_MARKDOWN,
    alipay: {
      template: renderNodesAxml,
      script: renderNodesAlipayJs,
      style: renderNodesAcss,
      json: renderNodesAlipayJson,
    },
    wechat: {
      template: renderNodesWxml,
      script: renderNodesWechatJs,
      style: renderNodesWxss,
      json: renderNodesWechatJson,
    },
  },
];

export default function CodeExamplesShowcase() {
  return <DocDemo demos={demos} codeMinHeight={560} />;
}
