const { renderNodes } = require('@ant-design/x-markdown-mini');

const content = '软换行也会换行：\n第一行\n第二行\n\n（默认 breaks: false 时，上面三行会合并成一段。）';

Page({
  data: {
    nodes: [],
  },
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content,
        platform: 'wechat',
        breaks: true,
      }),
    });
  },
});
