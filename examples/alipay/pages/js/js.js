// JS 接入：页面自己 require 核心 + 插件，调用 renderNodes() 直出节点，
// 交给底层 MiniNodeRenderer 渲染。比组件接入多了显式装配，换来对实例/扩展的完全控制。
// 支付宝从「包根文件系统」原样解析 npm 子路径（不认 package.json#exports），
// 所以子路径必须带显式 dist/ 前缀，指向真实文件位置。
const { XMarkdownMini } = require('@ant-design/x-markdown-mini/dist/index.js');
const CodeHighlight = require('@ant-design/x-markdown-mini/dist/plugins/CodeHighlight/index.js').default;
const Latex = require('@ant-design/x-markdown-mini/dist/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('@ant-design/x-markdown-mini/dist/shared/flattenInline.js');
const { SAMPLE } = require('../sample.js');

Page({
  data: {
    nodes: [],
  },

  onLoad() {
    // 每个视图独立一个实例（流式状态不共享）。escapeText:false 因为 MiniNodeRenderer
    // 的 <text>{{value}}</text> 不会解码实体。
    const md = new XMarkdownMini({
      escapeText: false,
      extensions: [CodeHighlight(), Latex({ katexOptions: { throwOnError: false } })],
    });
    md.renderNodes({
      content: SAMPLE,
      platform: 'alipay',
      // mini-program 的 <text> 不能嵌套自定义组件，setData 前先扁平化内联树。
      onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
    });
  },
});
