import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const FENCE = '```';

// 一段「停在半路」的流式输入：粗体和代码围栏都没闭合
const TAIL = `**正在生成的要点

${FENCE}ts
const value = '代码还没写完`;

const USAGE = `// 默认 streamingFixup: 'remend'，只作用于未提交的 tail。
// 左侧 input.md 是模型停在半路的原始输入，
// 手机里是补全后的渲染结果：粗体、围栏代码都被临时闭合。

// 完全按原始输入渲染：
new XMarkdownMini({ streamingFixup: false });

// 或者自定义补全函数：
new XMarkdownMini({
  streamingFixup: (tail) => tail + '\\n',
});`;

export default () => (
  <DemoCard
    markdown={TAIL}
    streamingTail
    files={[
      { name: 'input.md', lang: 'md', code: TAIL },
      { name: 'fixup.ts', lang: 'ts', code: USAGE },
    ]}
  />
);
