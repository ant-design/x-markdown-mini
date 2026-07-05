import React from 'react';
import customTableExtensionSource from '!!raw-loader!./customTableExtension.ts';
import { DemoCard } from '../../components/DemoCard';
import { createCustomTableExtension } from './customTableExtension';

const MARKDOWN = `| 平台 | 状态 | 说明 |
| --- | --- | --- |
| 微信 | ✅ | 已支持 |
| 支付宝 | ✅ | 已支持 |
`;

const USAGE = `import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createCustomTableExtension } from './customTableExtension';

// name 命中内置 'table'：miniRenderer 完全接管表格渲染
//（与 CodeHighlight 覆盖 'code' 同理）。不提供 tokenizer，解析仍走内置分词器。
const md = new XMarkdownMini({
  extensions: [createCustomTableExtension()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`;

const EXTENSIONS = [createCustomTableExtension()];

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    extensions={EXTENSIONS}
    files={[
      { name: 'customTableExtension.ts', lang: 'ts', code: customTableExtensionSource },
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
