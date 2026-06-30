// 组件接入：页面只把内容塞给 <markdown>，latex / highlight 由组件内部 bake，
// 插件与样式都随 usingComponents 自动带上 —— 页面不 require 任何插件、不 @import 任何样式。
const { SAMPLE } = require('../sample.js');
const { createStreamPlayer } = require('../streaming.js');

const STATUS_TEXT = {
  idle: '完整内容',
  streaming: 'AI 正在输出',
  done: '流式完成',
};

Page({
  data: {
    streamContent: SAMPLE,
    streamingEnabled: false,
    streamingActive: false,
    semanticEnabled: true,
    animationEnabled: true,
    streamingConfig: false,
    streamingStatus: STATUS_TEXT.idle,
  },

  onLoad() {
    this.streamPlayer = createStreamPlayer({
      content: SAMPLE,
      onFrame: (content, streaming, status) =>
        this.setData({
          streamContent: content,
          streamingActive: streaming,
          streamingConfig: status === 'idle' ? false : this._streamingConfig(streaming),
          streamingStatus: STATUS_TEXT[status],
        }),
    });
  },

  onStreamingChange(e) {
    const enabled = e.detail.value;
    this.setData({ streamingEnabled: enabled });
    if (enabled) this.streamPlayer.play();
    else this.streamPlayer.showAll();
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

  _changeOption(name, enabled) {
    const restart = this.data.streamingEnabled;
    if (restart) this.streamPlayer.showAll();
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
  },
});
