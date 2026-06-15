const { renderNodes } = require('@ant-design/x-markdown-mini');

const content = '# Hello\n\n**x-markdown-mini** 把 Markdown 直接转换成端侧节点。\n\n- 无需 WebView\n- 无需 HTML 白名单';

Page({
  data: {
    nodes: [],
  },
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content,
        platform: 'alipay',
        selectable: true,
      }),
    });
  },
});
