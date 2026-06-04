// Local mock chat client for the WeChat example.
// It keeps the same streamChat contract as a real model gateway:
// streamChat({ query }, { onChunk, onDone, onError }) -> { abort }

const BASE_DELAY = 280;
// 模型「按行快速吐字」：远快于打字机消费速度，缓冲会积压，
// 因此真正可见的节奏由 StreamingProcessor 的逐字 + 语义分块控制。
const LINE_DELAY = 18;

function pickReply(query) {
  const normalized = String(query || '').toLowerCase();

  if (normalized.indexOf('性能') >= 0 || normalized.indexOf('perf') >= 0) {
    return [
      '## 性能排查结论',
      '',
      '在微信小程序里，Markdown 渲染最容易被这几件事拖慢：',
      '',
      '1. **重复 parse 全文**：流式输出时每个 token 都全量重算，会把长回复拖成线性累积成本。',
      '2. **rich-text 白名单损耗**：先转 HTML 再交给 `<rich-text>`，事件、动画和部分属性会再次被过滤。',
      '3. **节点层级过深**：小程序 `<text>` 不能像 Web DOM 那样随便嵌套，内联节点需要提前压平。',
      '',
      '| 场景 | 建议 | 原因 |',
      '| --- | --- | --- |',
      '| 普通回答 | 直接用 `content` | 简单稳定 |',
      '| 流式回答 | 传 `streaming` | 只修补尾部内容 |',
      '| 多会话并发 | 每个 view 独立实例 | 避免共享流状态 |',
      '',
      '流式场景下也可以正常处理公式，例如 $T(n)=O(n)$；复杂公式适合单独成块：',
      '',
      '$$',
      '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
      '$$',
      '',
      '> 这个 demo 用 `setTimeout` 模拟模型返回；真实接入时只要把 `onChunk(delta, full)` 接到网关流即可。',
    ].join('\n');
  }

  if (
    normalized.indexOf('代码') >= 0 ||
    normalized.indexOf('code') >= 0 ||
    normalized.indexOf('latex') >= 0 ||
    normalized.indexOf('公式') >= 0
  ) {
    return [
      '## 代码高亮与 LaTeX',
      '',
      '页面默认启用了 `CodeHighlight()` 和 `Latex()`，所以模型返回里可以直接混合代码与公式。',
      '',
      '```js',
      'let full = "";',
      '',
      'modelStream.onChunk((delta) => {',
      '  full += delta;',
      '  this.setData({',
      '    "messages[0].content": full,',
      '    "messages[0].streaming": {',
      '      hasNextChunk: true,',
      '      enableAnimation: true,',
      '    },',
      '  });',
      '});',
      '```',
      '',
      '内联公式：$E = mc^2$。',
      '',
      '块级公式：',
      '',
      '$$',
      '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}',
      '$$',
      '',
      '- 用户气泡用普通 `<text>`。',
      '- Agent 气泡用 `<markdown content="{{...}}" />`。',
      '- 完成后把 `streaming` 设为 `false`。',
    ].join('\n');
  }

  return [
    '## Agent 回复',
    '',
    '我会把你的问题当成一个小程序真实对话场景来处理。',
    '',
    '### 当前判断',
    '',
    '- 渲染层应该直接使用已发布的 `@ant-design/x-markdown-mini` 组件。',
    '- 对话层只维护 `messages`、`input`、`sending` 三类状态。',
    '- 代码高亮和 LaTeX 通过 `extensions` 注入，不需要改组件源码。',
    '- 模型返回可以先用 `setTimeout` 模拟，后续替换为 `wx.request` 分块流。',
    '',
    '### 一个可落地的数据结构',
    '',
    '```js',
    '{',
    '  id: "m1",',
    '  role: "ai",',
    '  content: "## Markdown 回复",',
    '  streaming: { hasNextChunk: true, enableAnimation: true }',
    '}',
    '```',
    '',
    '公式也会随流式内容逐步修补，例如 $a^2+b^2=c^2$。',
    '',
    '这样页面只负责展示，模型客户端只负责把 Markdown 按块吐出来。两边边界很清楚。',
  ].join('\n');
}

function streamChat(params, handlers) {
  const onChunk = (handlers && handlers.onChunk) || function () {};
  const onDone = (handlers && handlers.onDone) || function () {};
  const onError = (handlers && handlers.onError) || function () {};

  const fullText = pickReply(params && params.query);
  const lines = fullText.split('\n');
  const timers = [];
  let li = 0;
  let full = '';
  let aborted = false;

  const schedule = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    timers.push(timer);
  };

  const pump = () => {
    if (aborted) return;

    try {
      if (li >= lines.length) {
        onDone(full);
        return;
      }

      // 逐行下发（保留换行），模拟模型成块返回；可见节奏交给打字机。
      const piece = lines[li] + (li < lines.length - 1 ? '\n' : '');
      li += 1;
      full += piece;
      onChunk(piece, full);
      schedule(pump, LINE_DELAY);
    } catch (err) {
      onError(err);
    }
  };

  schedule(pump, BASE_DELAY);

  return {
    abort() {
      aborted = true;
      while (timers.length) clearTimeout(timers.pop());
    },
  };
}

module.exports = { streamChat };
