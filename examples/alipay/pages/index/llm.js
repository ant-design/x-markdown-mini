// 支付宝端真实对话客户端。
//
// 支付宝 my.request 没有稳定的分块回调（onChunkReceived），无法做到真·边收边渲染，
// 因此采用「整段获取 → 本地打字机回放」的降级方案（设计已确认）：
//   my.request 拿到完整 SSE 响应体 → 解析所有 data: 事件拼出全文 → setTimeout 逐段
//   通过 onChunk 吐出，交给组件的 streaming 排版动画。
// 对页面而言，回调签名与微信端完全一致（onChunk/onDone/onError），页面代码可复用。

const { ENDPOINT, MODEL, SYSTEM_PROMPT, TOOLS } = require('./config.js');

// 行缓冲 SSE 解析器：识别 data: 前缀与 [DONE]。整段解析时一次 push 完即可。
function createSSEParser() {
  let buffer = '';
  const toEvent = (rawLine) => {
    const line = rawLine.replace(/\r$/, '').trim();
    if (!line) return null;
    let payload = line;
    if (line.indexOf('data:') === 0) payload = line.slice(5).trim();
    if (payload === '[DONE]') return { done: true };
    return { payload };
  };
  return {
    push(text) {
      buffer += text;
      const events = [];
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const ev = toEvent(buffer.slice(0, idx));
        buffer = buffer.slice(idx + 1);
        if (ev) events.push(ev);
      }
      return events;
    },
    flush() {
      const ev = toEvent(buffer);
      buffer = '';
      return ev ? [ev] : [];
    },
  };
}

// 单个事件 payload → 正文增量。容忍多种返回形态，优先 wohu 的 { data }。
function chunkToText(payload) {
  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (e) {
    return payload; // 非 JSON：当作纯文本增量
  }
  if (typeof parsed === 'string') return parsed;
  if (parsed && typeof parsed.data === 'string') return parsed.data;
  if (parsed && parsed.data && typeof parsed.data === 'object') return ''; // 工具调用对象：本 Demo 忽略
  const delta = parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
  if (delta && typeof delta.content === 'string') return delta.content;
  return '';
}

function parseFullBody(body) {
  const parser = createSSEParser();
  const events = parser.push(body).concat(parser.flush());
  let full = '';
  events.forEach((ev) => {
    if (ev.done) return;
    full += chunkToText(ev.payload);
  });
  return full;
}

// streamChat({ query }, { onChunk(delta, full), onDone(full), onError(err) }) → { abort }
function streamChat({ query }, handlers) {
  const onChunk = (handlers && handlers.onChunk) || function () {};
  const onDone = (handlers && handlers.onDone) || function () {};
  const onError = (handlers && handlers.onError) || function () {};

  let timer = null;
  let aborted = false;

  my.request({
    url: ENDPOINT,
    method: 'POST',
    headers: { 'content-type': 'application/json', Accept: 'text/event-stream' },
    data: { query, model: MODEL, system_prompt: SYSTEM_PROMPT, tools: TOOLS },
    dataType: 'text',
    success(res) {
      if (aborted) return;
      const raw = res && res.data;
      const body = typeof raw === 'string' ? raw : raw ? JSON.stringify(raw) : '';
      const fullText = parseFullBody(body);
      if (!fullText) {
        onDone('');
        return;
      }
      // 本地打字机回放，复用组件的流式排版动画。
      const STEP = 2;
      let i = 0;
      const tick = () => {
        if (aborted) return;
        i = Math.min(i + STEP, fullText.length);
        const slice = fullText.slice(0, i);
        onChunk(slice, slice);
        if (i < fullText.length) {
          timer = setTimeout(tick, 28);
        } else {
          timer = null;
          onDone(fullText);
        }
      };
      tick();
    },
    fail(err) {
      if (aborted) return;
      onError(err);
    },
  });

  return {
    abort() {
      aborted = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}

module.exports = { streamChat };
