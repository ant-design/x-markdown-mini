import React from 'react';
import footnoteExtensionSource from '!!raw-loader!./footnoteExtension.ts';
import { DemoCard } from '../../components/DemoCard';
import { createFootnoteExtension } from './footnoteExtension';

const MARKDOWN = `Markdown[^1:一种轻量标记语言] 很适合移动端阅读，
也方便模型流式输出[^2:LLM 逐 token 返回文本]。
`;

const USAGE = `import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createFootnoteExtension } from './footnoteExtension';

const md = new XMarkdownMini({
  extensions: [createFootnoteExtension()],
});

// 产出 name: 'footnote' 的 MiniNode，
// marker 与弹层由宿主页面渲染（组件层走 slot / 抽象节点）
const nodes = md.renderNodes({ content, platform: 'auto' });`;

const EXTENSIONS = [createFootnoteExtension()];

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    extensions={EXTENSIONS}
    files={[
      { name: 'footnoteExtension.ts', lang: 'ts', code: footnoteExtensionSource },
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
