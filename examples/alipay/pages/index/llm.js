// 支付宝端 Agent mock：用 setTimeout 模拟模型分块返回。
// 页面层仍使用真实流式客户端的回调形态，后续接入网关时只需要替换本文件。

function includesAny(text, words) {
  return words.some((word) => text.indexOf(word) >= 0);
}

function mockAgentReply(query) {
  const lower = query.toLowerCase();

  if (includesAny(lower, ['table', '表格', '对比', 'compare'])) {
    return [
      '下面用一个 **GFM 表格** 展示 `x-markdown-mini` 在 Agent 场景里的价值：',
      '',
      '| 能力 | Demo 中的表现 | 对真实业务的意义 |',
      '| --- | --- | --- |',
      '| 流式渲染 | `setTimeout` 分块追加 Markdown | 模型边生成，页面边排版 |',
      '| 复杂结构 | 表格、列表、代码块混排 | 回答不是纯文本时也稳定 |',
      '| 小程序组件 | 通过 `<markdown />` 组件渲染 | 不依赖 `<rich-text>` 的白名单 |',
      '',
      '结论：这个 demo 应该突出 **真实小程序接入方式**，而不是把精力浪费在假网络请求上。',
    ].join('\n');
  }

  if (includesAny(lower, ['code', '代码', 'api', '接入'])) {
    return [
      '可以把 Agent 返回看成一段不断增长的 Markdown 字符串：',
      '',
      '```js',
      "streamChat({ query }, {",
      '  onChunk(delta, full) {',
      "    this.setData({ ['messages[' + aiIndex + '].content']: full });",
      '  },',
      '  onDone(full) {',
      "    this.setData({ ['messages[' + aiIndex + '].streaming']: false });",
      '  },',
      '});',
      '```',
      '',
      '页面只关心两件事：',
      '',
      '1. 把 `content` 传给 `<markdown content="{{...}}" />`。',
      '2. 生成中传入 `streaming`，结束后改成 `false`。',
    ].join('\n');
  }

  if (includesAny(lower, ['agent', '场景', '真实', 'demo'])) {
    return [
      '这是一个更贴近真实支付宝小程序的 Agent demo：',
      '',
      '- 用户消息直接走普通文本气泡。',
      '- Agent 消息交给 `x-markdown-mini` 渲染 Markdown。',
      '- `setTimeout` 模拟模型增量返回，触发组件的流式排版能力。',
      '- 示例内容覆盖 **加粗**、列表、表格、代码块等高频 LLM 输出形态。',
      '',
      '> 真正接模型时，保留页面结构，只替换 `pages/index/llm.js` 的 `streamChat` 实现即可。',
    ].join('\n');
  }

  return [
    '我收到的问题是：',
    '',
    '> ' + query,
    '',
    '下面给一个 Markdown 结构化回复，方便观察渲染效果：',
    '',
    '### 建议',
    '',
    '1. 用 npm 包里的支付宝组件作为页面入口。',
    '2. 用本地 mock 固定输出，避免 demo 受网络和鉴权影响。',
    '3. 保持流式回调协议，后续接真实模型时改动最小。',
    '',
    '这类 demo 的重点不是“回答多聪明”，而是证明 **LLM 输出的 Markdown 在支付宝小程序里能稳定、渐进、可控地渲染**。',
  ].join('\n');
}

function nextChunkSize(index) {
  if (index < 24) return 2;
  if (index < 96) return 4;
  return 8;
}

// streamChat({ query }, { onChunk(delta, full), onDone(full), onError(err) }) -> { abort }
function streamChat({ query }, handlers) {
  const onChunk = (handlers && handlers.onChunk) || function () {};
  const onDone = (handlers && handlers.onDone) || function () {};

  let timer = null;
  let aborted = false;
  const fullText = mockAgentReply(query);
  let index = 0;

  const tick = () => {
    if (aborted) return;

    const prev = index;
    index = Math.min(index + nextChunkSize(index), fullText.length);
    const slice = fullText.slice(0, index);
    onChunk(fullText.slice(prev, index), slice);

    if (index < fullText.length) {
      timer = setTimeout(tick, 36);
      return;
    }

    timer = setTimeout(() => {
      if (aborted) return;
      timer = null;
      onDone(fullText);
    }, 120);
  };

  timer = setTimeout(tick, 260);

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
