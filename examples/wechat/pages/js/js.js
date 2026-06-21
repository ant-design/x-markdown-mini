// JS 接入：页面自己 require 核心 + 插件，调用 renderNodes() 直出节点，
// 交给底层 MiniNodeRenderer 渲染。比组件接入多了显式装配，换来对实例/扩展的完全控制。
const { XMarkdownMini } = require('@ant-design/x-markdown-mini/index.js');
const CodeHighlight = require('@ant-design/x-markdown-mini/plugins/CodeHighlight/index.js').default;
const Latex = require('@ant-design/x-markdown-mini/plugins/Latex/index.js').default;
const {
  createTextAnimationState,
  flattenInlineNodes,
  reconcileTextAnimation,
  resetTextAnimation,
} = require('@ant-design/x-markdown-mini/shared/flattenInline.js');
const { SAMPLE } = require('../sample.js');
const { createStreamPlayer } = require('../streaming.js');

const STATUS_TEXT = {
  idle: '完整内容',
  streaming: 'AI 正在输出',
  done: '流式完成',
};

Page({
  data: {
    nodes: [],
    streamingEnabled: false,
    streamingActive: false,
    streamingStatus: STATUS_TEXT.idle,
  },

  onLoad() {
    this.textAnimation = createTextAnimationState();
    // 每个视图独立一个实例（流式状态不共享）。escapeText:false 因为 MiniNodeRenderer
    // 的 <text>{{value}}</text> 不会解码实体。
    this.md = new XMarkdownMini({
      escapeText: false,
      extensions: [CodeHighlight(), Latex({ katexOptions: { throwOnError: false } })],
    });

    this.streamPlayer = createStreamPlayer({
      content: SAMPLE,
      onFrame: (content, streaming, status) => {
        this.setData({
          streamingActive: streaming,
          streamingStatus: STATUS_TEXT[status],
        });
        this._render(content, streaming);
      },
    });
    this.streamPlayer.showAll();
  },

  _render(content, streaming) {
    this.md.renderNodes({
      content,
      platform: 'wechat',
      streaming,
      // mini-program 的 <text> 不能嵌套自定义组件，setData 前先扁平化内联树。
      onPatch: (nodes) => {
        const flat = flattenInlineNodes(nodes);
        if (!streaming) resetTextAnimation(this.textAnimation);
        this.setData({
          nodes: streaming
            ? reconcileTextAnimation(flat, this.textAnimation)
            : flat,
        });
      },
    });
  },

  onStreamingChange(e) {
    const enabled = e.detail.value;
    this.setData({ streamingEnabled: enabled });
    this.md.reset();
    resetTextAnimation(this.textAnimation);
    if (enabled) this.streamPlayer.play();
    else this.streamPlayer.showAll();
  },

  onUnload() {
    this.streamPlayer.dispose();
    this.md.reset();
    resetTextAnimation(this.textAnimation);
  },
});
