import React from 'react';
import { DocDemo, type DocDemoItem } from '../../components/DocDemo';

import basicAxml from '!!raw-loader!../../mini-demos/streaming/basic/alipay/index.axml';
import basicAcss from '!!raw-loader!../../mini-demos/streaming/basic/alipay/index.acss';
import basicAlipayJs from '!!raw-loader!../../mini-demos/streaming/basic/alipay/index.js';
import basicAlipayJson from '!!raw-loader!../../mini-demos/streaming/basic/alipay/index.json';
import basicWxml from '!!raw-loader!../../mini-demos/streaming/basic/wechat/index.wxml';
import basicWxss from '!!raw-loader!../../mini-demos/streaming/basic/wechat/index.wxss';
import basicWechatJs from '!!raw-loader!../../mini-demos/streaming/basic/wechat/index.js';
import basicWechatJson from '!!raw-loader!../../mini-demos/streaming/basic/wechat/index.json';

const demos: DocDemoItem[] = [
  {
    key: 'basic',
    title: '基础流式',
    description: '每轮传入累计 Markdown，最后一轮把 hasNextChunk 置为 false，内部会 flush 剩余 tail。',
    navTitle: '流式输出',
    markdown: '# 流式输出\n\n边喂数据边渲染。已稳定的块只解析一次。',
    animation: true,
    alipay: {
      template: basicAxml,
      script: basicAlipayJs,
      style: basicAcss,
      json: basicAlipayJson,
    },
    wechat: {
      template: basicWxml,
      script: basicWechatJs,
      style: basicWxss,
      json: basicWechatJson,
    },
  },
];

export default function StreamingDocDemo() {
  return <DocDemo demos={demos} codeMinHeight={560} />;
}
