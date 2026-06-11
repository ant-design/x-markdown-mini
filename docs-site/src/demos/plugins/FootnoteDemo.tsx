import React from 'react';
import { Footnote } from '@ant-design/x-markdown-mini';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `Markdown[^1:一种轻量标记语言] 很适合移动端阅读，
也方便模型流式输出[^2:LLM 逐 token 返回文本]。
`;

const USAGE = `import { XMarkdownMini, Footnote } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  extensions: [Footnote()],
});

// 产出 name: 'footnote' 的 MiniNode，
// marker 与弹层由宿主页面渲染（组件层走 slot / 抽象节点）
const nodes = md.renderNodes({ content, platform: 'auto' });`;

const TEMPLATE = `<!-- 内置 Markdown 组件直接开 footnote 属性 -->
<x-markdown content="{{content}}" footnote="{{true}}" />`;

const EXTENSIONS = [Footnote()];

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    extensions={EXTENSIONS}
    files={[
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'index.axml / wxml', lang: 'xml', code: TEMPLATE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
