import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `### 平台差异对照

| 能力 | 微信 | 支付宝 |
| --- | --- | --- |
| 链接 | \`data-href\` | 文本降级 |
| 列表 start | 支持 | 降级 |

~~手写 rich-text 节点~~ 交给 renderer 处理。

仓库地址：https://github.com/ant-design/x-markdown-mini
`;

const USAGE = `renderNodes({
  content,      // 见 input.md
  platform: 'auto',
  gfm: true,    // 默认开启：表格 / 删除线 / 自动链接
});`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    gfm
    files={[
      { name: 'usage.ts', lang: 'ts', code: USAGE },
      { name: 'input.md', lang: 'md', code: MARKDOWN },
    ]}
  />
);
