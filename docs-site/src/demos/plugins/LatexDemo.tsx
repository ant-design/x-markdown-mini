import React from 'react';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `质能方程：$E=mc^2$

块级公式：

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

也支持 \\( a^2 + b^2 = c^2 \\) 与 \\[ x = y + z \\]
`;

const USAGE = `import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex({ katexOptions: { throwOnError: false } })],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`;

const STYLE = `/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";

/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`;

const EXTENSIONS = [Latex({ katexOptions: { throwOnError: false } })];

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    extensions={EXTENSIONS}
    files={[
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'style', lang: 'css', code: STYLE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
