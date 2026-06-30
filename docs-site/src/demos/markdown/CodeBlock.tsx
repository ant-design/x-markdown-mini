import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `## 围栏代码块

\`\`\`js
const greet = (name) => \`Hello \${name}\`;
greet('mini');
\`\`\`
`;

const SCRIPT = `Page({
  data: {
    content: '\\\`\\\`\\\`js\\nconst greet = (name) => \\\`Hello \\\${name}\\\`;\\n\\\`\\\`\\\`',
  },
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    alipay={{
      template: `<view class="card">
  <markdown content="{{content}}" />
</view>`,
      script: SCRIPT,
    }}
    wechat={{
      template: `<view class="card">
  <markdown content="{{content}}" />
</view>`,
      script: SCRIPT,
    }}
  />
);
