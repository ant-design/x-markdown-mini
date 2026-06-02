// 支付宝端对话 Agent demo：用 setTimeout mock 模型返回，流式渲染 Markdown。
const { streamChat } = require('./llm.js');

Page({
  data: {
    messages: [], // { id, role, isUser, rowClass, content, streaming }
    input: '',
    sending: false,
    promptDisabledClass: '',
    scrollAnchor: 'a0',
    prompts: [
      { id: 'table', text: '展示一个表格，对比 x-markdown-mini 的能力' },
      { id: 'code', text: '给我一段接入 Agent 流式渲染的代码' },
      { id: 'scene', text: '解释这个 demo 为什么贴近真实支付宝小程序场景' },
    ],
  },

  _idSeq: 0,
  _anchorSeq: 0,
  _task: null,

  _scrollToBottom() {
    this.setData({ scrollAnchor: 'a' + (this._anchorSeq += 1) });
  },

  _userMessage(id, content) {
    return {
      id,
      role: 'user',
      isUser: true,
      rowClass: 'row-user',
      content,
      streaming: false,
    };
  },

  _aiMessage(id) {
    return {
      id,
      role: 'ai',
      isUser: false,
      rowClass: 'row-ai',
      content: '',
      streaming: { hasNextChunk: true, enableAnimation: true },
    };
  },

  onUnload() {
    if (this._task && this._task.abort) this._task.abort();
    this._task = null;
  },

  onInput(e) {
    this.setData({ input: e.detail.value });
  },

  onPromptTap(e) {
    if (this.data.sending) return;
    const text = e.currentTarget.dataset.text;
    if (!text) return;
    this._sendText(text);
  },

  onSend() {
    const text = (this.data.input || '').trim();
    this._sendText(text);
  },

  _sendText(text) {
    if (!text || this.data.sending) return;

    const userId = 'm' + (this._idSeq += 1);
    const aiId = 'm' + (this._idSeq += 1);
    const messages = this.data.messages.concat([this._userMessage(userId, text), this._aiMessage(aiId)]);
    const aiIndex = messages.length - 1;

    this.setData({ messages, input: '', sending: true, promptDisabledClass: 'prompt-chip-disabled' });
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
          this.setData({
            ['messages[' + aiIndex + '].content']: full || acc || '（无内容）',
            ['messages[' + aiIndex + '].streaming']: false,
            sending: false,
            promptDisabledClass: '',
          });
          this._scrollToBottom();
          this._task = null;
        },
        onError: () => {
          this.setData({
            ['messages[' + aiIndex + '].content']: '请求失败，请稍后重试',
            ['messages[' + aiIndex + '].streaming']: false,
            sending: false,
            promptDisabledClass: '',
          });
          this._task = null;
        },
      }
    );
  },
});
