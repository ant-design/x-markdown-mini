// 微信端对话 Agent：用 setTimeout 模拟模型流式返回，渲染 Markdown 回复。
const { streamChat } = require('./llm.js');
const CodeHighlight = require('../../dist/plugins/CodeHighlight/index.js').default;
const Latex = require('../../dist/plugins/Latex/index.js').default;

const markdownExtensions = [CodeHighlight(), Latex()];

// 打字机 + 语义分块配置：模型按行快速吐字，由 StreamingProcessor 以
// 「变速逐字 + 句读分块」节奏渲染（charDelay/chunkDelay 为数组时按块加速）。
const TYPEWRITER = { charDelay: [26, 18, 13, 10, 8], chunkDelay: [80, 55, 38, 26] };
// 生成中：还有后续输入，保留未完成片段。
const STREAM_ON = { hasNextChunk: true, semantic: TYPEWRITER, enableAnimation: true };
// 收尾：模型已结束，但仍交给打字机把缓冲里的剩余内容按节奏播完。
const STREAM_FLUSH = { hasNextChunk: false, semantic: TYPEWRITER, enableAnimation: true };

Page({
  data: {
    messages: [], // { id, role: 'user' | 'ai', content, streaming }
    input: '',
    sending: false,
    scrollAnchor: 'a0',
    markdownExtensions,
    suggestions: [
      '解释 x-markdown-mini 在微信小程序里的性能优势',
      '给我一段流式渲染 Markdown 的代码',
      '展示代码高亮和 LaTeX 公式',
      '如何把这个 demo 替换成真实模型接口',
    ],
  },

  _idSeq: 0,
  _anchorSeq: 0,
  _task: null,

  _scrollToBottom() {
    this.setData({ scrollAnchor: 'a' + (this._anchorSeq += 1) });
  },

  onUnload() {
    if (this._task && this._task.abort) this._task.abort();
    this._task = null;
  },

  onInput(e) {
    this.setData({ input: e.detail.value });
  },

  onSend() {
    this._sendText(this.data.input);
  },

  onTapSuggestion(e) {
    if (this.data.sending) return;
    this._sendText(e.currentTarget.dataset.text);
  },

  onReset() {
    if (this._task && this._task.abort) this._task.abort();
    this._task = null;
    this.setData({ messages: [], input: '', sending: false });
  },

  _sendText(rawText) {
    const text = (rawText || '').trim();
    if (!text || this.data.sending) return;

    const userId = 'm' + (this._idSeq += 1);
    const aiId = 'm' + (this._idSeq += 1);
    const messages = this.data.messages.concat([
      { id: userId, role: 'user', content: text, streaming: false },
      { id: aiId, role: 'ai', content: '', streaming: STREAM_ON },
    ]);
    const aiIndex = messages.length - 1;

    this.setData({ messages, input: '', sending: true });
    this._scrollToBottom();

    let acc = '';
    this._task = streamChat(
      { query: text },
      {
        onChunk: (_delta, full) => {
          acc = full;
          this.setData({ ['messages[' + aiIndex + '].content']: acc });
          this._scrollToBottom();
        },
        onDone: (full) => {
          // 不直接置 false（会一次性整段渲染），而是切到 hasNextChunk:false，
          // 让打字机把尾部缓冲按节奏播完，结束后停留为最终态。
          this.setData({
            ['messages[' + aiIndex + '].content']: full || acc || '（无内容）',
            ['messages[' + aiIndex + '].streaming']: STREAM_FLUSH,
            sending: false,
          });
          this._scrollToBottom();
          this._task = null;
        },
        onError: () => {
          this.setData({
            ['messages[' + aiIndex + '].content']: '请求失败，请稍后重试',
            ['messages[' + aiIndex + '].streaming']: false,
            sending: false,
          });
          this._task = null;
        },
      }
    );
  },
});
