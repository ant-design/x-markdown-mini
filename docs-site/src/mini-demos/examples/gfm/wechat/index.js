const { renderNodes } = require('@ant-design/x-markdown-mini');

const content = `### 平台差异对照

| 能力 | 微信 | 支付宝 |
| --- | --- | --- |
| 链接 | data-href | 文本降级 |
| 列表 start | 支持 | 降级 |

~~手写 rich-text 节点~~ 交给 renderer 处理。

仓库地址：https://github.com/ant-design/x-markdown-mini`;

Page({
  data: {
    nodes: [],
  },
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content,
        platform: 'wechat',
        gfm: true,
      }),
    });
  },
});
