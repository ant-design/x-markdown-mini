// JS 接入：页面自己 require 核心 + 插件，调用 renderNodes() 直出节点，
// 交给底层 MiniNodeRenderer 渲染。比组件接入多了显式装配，换来对实例/扩展的完全控制。
// 包以「dist 内容即包根」的形式发布（npm publish ./dist），故 es/ plugins/ shared/ index.js
// 都在包根；支付宝直接读包根、微信经 miniprogram_dist，两端子路径一致、均无 dist/ 段。
const { XMarkdownMini } = require('@ant-design/x-markdown-mini/index.js');
const CodeHighlight = require('@ant-design/x-markdown-mini/plugins/CodeHighlight/index.js').default;
const Latex = require('@ant-design/x-markdown-mini/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('@ant-design/x-markdown-mini/shared/flattenInline.js');
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
    semanticEnabled: true,
    animationEnabled: true,
    streamingStatus: STATUS_TEXT.idle,
  },

  onLoad() {
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
        this._render(content, streaming, status !== 'idle');
      },
    });
    this.streamPlayer.showAll();
  },

  _streamingConfig(hasNextChunk) {
    return {
      hasNextChunk,
      semantic: this.data.semanticEnabled
        ? true
        : false,
      enableAnimation: this.data.animationEnabled,
    };
  },

  _render(content, hasNextChunk, inStreamingSession) {
    const streaming = inStreamingSession
      ? this._streamingConfig(hasNextChunk)
      : false;
    this.md.renderNodes({
      content,
      platform: 'alipay',
      streaming,
      // mini-program 的 <text> 不能嵌套自定义组件，setData 前先扁平化内联树。
      onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
    });
  },

  onStreamingChange(e) {
    const enabled = e.detail.value;
    this.setData({ streamingEnabled: enabled });
    this.md.reset();
    if (enabled) this.streamPlayer.play();
    else this.streamPlayer.showAll();
  },

  _changeOption(name, enabled) {
    const restart = this.data.streamingEnabled;
    this.streamPlayer.showAll();
    this.md.reset();
    this.setData({ [name]: enabled });
    if (restart) setTimeout(() => this.streamPlayer.play(), 0);
  },

  onSemanticChange(e) {
    this._changeOption('semanticEnabled', e.detail.value);
  },

  onAnimationChange(e) {
    this._changeOption('animationEnabled', e.detail.value);
  },

  onUnload() {
    this.streamPlayer.dispose();
    this.md.reset();
  },
});
