const { XMarkdownMini } = require('@ant-design/x-markdown-mini');

const left = new XMarkdownMini();
const right = new XMarkdownMini();

Page({
  data: {
    leftNodes: [],
    rightNodes: [],
  },
  onLoad() {
    this.setData({
      leftNodes: left.renderNodes({
        content: '# 会话 A\n\n**第一路** 流式内容。',
        platform: 'alipay',
        streaming: { hasNextChunk: true, semantic: { chunkDelay: 0, charDelay: 0 } },
      }),
      rightNodes: right.renderNodes({
        content: '# 会话 B\n\n第二路内容互不污染。',
        platform: 'alipay',
        streaming: { hasNextChunk: true, semantic: { chunkDelay: 0, charDelay: 0 } },
      }),
    });
  },
  onUnload() {
    left.reset();
    right.reset();
  },
});
