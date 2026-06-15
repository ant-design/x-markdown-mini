import React from 'react';
import { DemoCard } from '../../components/DemoCard';

import alipayTemplate from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.axml';
import alipayStyle from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.acss';
import alipayScript from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.js';
import alipayJson from '!!raw-loader!../../mini-demos/examples/render-nodes/alipay/index.json';
import wechatTemplate from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.wxml';
import wechatStyle from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.wxss';
import wechatScript from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.js';
import wechatJson from '!!raw-loader!../../mini-demos/examples/render-nodes/wechat/index.json';

const MARKDOWN = `# Hello

**x-markdown-mini** 把 Markdown 直接转换成端侧节点。

- 无需 WebView
- 无需 HTML 白名单
`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: alipayTemplate,
      script: alipayScript,
      style: alipayStyle,
      json: alipayJson,
    }}
    wechat={{
      template: wechatTemplate,
      script: wechatScript,
      style: wechatStyle,
      json: wechatJson,
    }}
  />
);
