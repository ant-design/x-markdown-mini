import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `软换行也会换行：
第一行
第二行

（默认 \`breaks: false\` 时，上面三行会合并成一段。）
`;

const USAGE = `renderNodes({
  content,       // 见 input.md
  platform: 'auto',
  breaks: true,  // 软换行 \\n 渲染为 <br>，默认 false
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    breaks
    files={[
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
