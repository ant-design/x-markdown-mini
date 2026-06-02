// 微信端真实流式对话客户端。
//
// wx.request 支持 enableChunked + onChunkReceived，可做到「真·逐 token 流式」：
//   网关 → SSE 分块(ArrayBuffer) → UTF-8 增量解码 → 行缓冲拆 data: 事件 → JSON.parse().data
//
// 与 service-completion-poc 中 AbstractChatProvider.transformMessage 同义：
// 每个事件 JSON 的 .data 若为字符串即追加正文；本 Demo 不处理工具调用对象。

const { ENDPOINT, MODEL, SYSTEM_PROMPT, TOOLS } = require('./config.js');

// 增量 UTF-8 解码器：跨分块边界可能切断多字节字符，保留不完整的尾字节到下一块。
function createUtf8Decoder() {
  let pending = [];
  return {
    decode(arrayBuffer) {
      const bytes = new Uint8Array(arrayBuffer);
      const buf = pending.concat(Array.prototype.slice.call(bytes));
      let i = 0;
      let out = '';
      while (i < buf.length) {
        const b = buf[i];
        let needed;
        let cp;
        if (b < 0x80) {
          cp = b;
          needed = 0;
        } else if (b >= 0xc0 && b < 0xe0) {
          cp = b & 0x1f;
          needed = 1;
        } else if (b >= 0xe0 && b < 0xf0) {
          cp = b & 0x0f;
          needed = 2;
        } else if (b >= 0xf0) {
          cp = b & 0x07;
          needed = 3;
        } else {
          i += 1; // 游离的续字节，跳过
          continue;
        }
        if (i + needed >= buf.length) break; // 尾部不完整，留到下一块
        for (let j = 1; j <= needed; j += 1) {
          cp = (cp << 6) | (buf[i + j] & 0x3f);
        }
        i += needed + 1;
        if (cp > 0xffff) {
          cp -= 0x10000;
          out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
        } else {
          out += String.fromCharCode(cp);
        }
      }
      pending = buf.slice(i);
      return out;
    },
  };
}

// 行缓冲 SSE 解析器：按 \n 切行，未结束的尾行留在缓冲，识别 data: 前缀与 [DONE]。
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
  // OpenAI 兼容形态兜底
  const delta = parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
  if (delta && typeof delta.content === 'string') return delta.content;
  return '';
}

// streamChat({ query }, { onChunk(delta, full), onDone(full), onError(err) }) → { abort }
function streamChat({ query }, handlers) {
  const onChunk = (handlers && handlers.onChunk) || function () {};
  const onDone = (handlers && handlers.onDone) || function () {};
  const onError = (handlers && handlers.onError) || function () {};

  const decoder = createUtf8Decoder();
  const parser = createSSEParser();
  let full = '';
  let settled = false;

  const handleEvent = (ev) => {
    if (!ev || ev.done) return;
    const text = chunkToText(ev.payload);
    if (text) {
      full += text;
      onChunk(text, full);
    }
  };

  const task = wx.request({
    url: ENDPOINT,
    method: 'POST',
    header: { 'content-type': 'application/json', Accept: 'text/event-stream' },
    data: { query, model: MODEL, system_prompt: SYSTEM_PROMPT, tools: TOOLS },
    enableChunked: true,
    success() {
      if (settled) return;
      parser.flush().forEach(handleEvent);
      settled = true;
      onDone(full);
    },
    fail(err) {
      if (settled) return;
      settled = true;
      onError(err);
    },
  });

  if (task && task.onChunkReceived) {
    task.onChunkReceived((res) => {
      const text = decoder.decode(res.data);
      if (text) parser.push(text).forEach(handleEvent);
    });
  }

  return {
    abort() {
      if (task && task.abort) task.abort();
    },
  };
}

module.exports = { streamChat };
