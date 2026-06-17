// 支付宝端对话 Agent：用 setTimeout 模拟模型流式返回，渲染 Markdown 回复。
const { streamChat } = require('./llm.js');
const { Footnote } = require('@ant-design/x-markdown-mini/dist/index.js');
const CodeHighlight = require('@ant-design/x-markdown-mini/dist/plugins/CodeHighlight/index.js').default;
const Latex = require('@ant-design/x-markdown-mini/dist/plugins/Latex/index.js').default;

const markdownExtensions = [
  Footnote(),
  CodeHighlight(),
  Latex({ katexOptions: { throwOnError: false } }),
];

// 页面只传简单标记，打字机/语义分块/动画的完整配置由 markdown 组件内部 bake。
// 生成中：还有后续输入，保留未完成片段。
const STREAM_ON = { hasNextChunk: true };
// 收尾：模型已结束，但仍交给打字机把缓冲里的剩余内容按节奏播完（不要置 false，
// 否则会一次性整段渲染）。
const STREAM_FLUSH = { hasNextChunk: false };

Page({
  data: {
    messages: [], // { id, role, isUser, rowClass, content, streaming }
    input: '',
    sending: false,
    scrollAnchor: 'a0',
    markdownExtensions,
    activeFootnote: null,
    suggestions: [
      { id: 'perf', text: '解释 x-markdown-mini 在支付宝小程序里的性能优势' },
      { id: 'stream', text: '给我一段流式渲染 Markdown 的代码' },
      { id: 'rich', text: '展示代码高亮、LaTeX、脚注和表格' },
      { id: 'api', text: '如何把这个 demo 替换成真实模型接口' },
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
    this.setData({ messages: [], input: '', sending: false, activeFootnote: null });
  },

  onFootnoteTap(e) {
    const { label, content } = e.currentTarget.dataset;
    this.setData({ activeFootnote: { label, content } });
  },

  onCloseFootnote() {
    this.setData({ activeFootnote: null });
  },

  noop() {},

  _sendText(rawText) {
    const text = (rawText || '').trim();
    if (!text || this.data.sending) return;

    const userId = 'm' + (this._idSeq += 1);
    const aiId = 'm' + (this._idSeq += 1);
    const messages = this.data.messages.concat([
      {
        id: userId,
        role: 'user',
        isUser: true,
        rowClass: 'row-user',
        content: text,
        streaming: false,
      },
      {
        id: aiId,
        role: 'ai',
        isUser: false,
        rowClass: 'row-ai',
        content: '',
        streaming: STREAM_ON,
      },
    ]);
    const aiIndex = messages.length - 1;

    this.setData({ messages, input: '', sending: true, activeFootnote: null });
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
