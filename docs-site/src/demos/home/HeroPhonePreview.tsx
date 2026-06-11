import React from 'react';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import { PhonePreview } from '../../components/PhonePreview';
import './HeroPhonePreview.less';

const EXTENSIONS = [Latex({ katexOptions: { throwOnError: false } })];

const MARKDOWN = `### 原生节点输出

同一份 Markdown 直接渲染为端侧 \`MiniNode[]\`，不依赖 WebView，也不把 HTML 交给 \`rich-text\` 猜。

| 能力 | 输出 |
| --- | --- |
| 链接 | \`data-href\` |
| 图片 | HTTPS guard |
| 列表 | 平台节点 |

\`\`\`ts
renderNodes({
  platform: 'alipay',
  streaming: true,
})
\`\`\`

公式也走插件节点：$E=mc^2$

- CommonMark / GFM
- 稳定块缓存，只重跑尾部
- 微信 / 支付宝双端直出
`;

export default function HeroPhonePreview() {
  return (
    <figure className="xmd-hero-media xmd-hero-phone-preview">
      <PhonePreview
        platform="alipay"
        navTitle="Markdown 渲染结果"
        markdown={MARKDOWN}
        extensions={EXTENSIONS}
        gfm
        streamingTail
        className="xmd-hero-phone"
      />
    </figure>
  );
}
