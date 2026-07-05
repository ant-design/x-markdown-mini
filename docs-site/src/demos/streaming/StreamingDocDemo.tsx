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
    markdown:
      '# 流式输出\n\n' +
      '模型边生成，UI 边渲染，像打字机一样逐字呈现。\n\n' +
      '- 双空行外的稳定块只解析一次\n' +
      '- 每轮只重解析 tail\n' +
      '- **未闭合的粗体**、`未闭合行内代码` 会在 tail 自动补全\n\n' +
      '右上角可暂停 / 重播这段流式演示。',
    animation: true,
    autoStream: true,
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
