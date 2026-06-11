import React from 'react';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import { PhonePreview } from '../../components/PhonePreview';
import './HeroPhonePreview.less';

const EXTENSIONS = [Latex({ katexOptions: { throwOnError: false } })];

const MARKDOWN = `### Native node output

The same Markdown renders directly to mini-program \`MiniNode[]\`, without WebView and without asking \`rich-text\` to guess.

| Feature | Output |
| --- | --- |
| Links | \`data-href\` |
| Images | HTTPS guard |
| Lists | Platform nodes |

\`\`\`ts
renderNodes({
  platform: 'alipay',
  streaming: true,
})
\`\`\`

Math stays in the node pipeline: $E=mc^2$

- CommonMark / GFM
- Stable-block cache, rerendering only the tail
- WeChat / Alipay native node output
`;

export default function HeroPhonePreviewEn() {
  return (
    <figure className="xmd-hero-media xmd-hero-phone-preview">
      <PhonePreview
        platform="alipay"
        navTitle="Markdown output"
        markdown={MARKDOWN}
        extensions={EXTENSIONS}
        gfm
        streamingTail
        className="xmd-hero-phone"
      />
    </figure>
  );
}
