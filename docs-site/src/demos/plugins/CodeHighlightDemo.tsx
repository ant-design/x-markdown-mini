import React from 'react';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import { DemoCard } from '../../components/DemoCard';

const FENCE = '```';

const MARKDOWN = `高亮由 \`highlight.js\` 完成：

${FENCE}ts
function greet(name: string): string {
  // 模板字符串 + 类型标注
  return \`Hello, \${name}\`;
}
${FENCE}

未知语言会回退到普通代码块。
`;

const USAGE = `import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`;

const STYLE = `/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`;

const EXTENSIONS = [CodeHighlight()];

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
