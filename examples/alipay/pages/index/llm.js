// Local mock chat client for the Alipay example.
// It keeps the same streamChat contract as a real model gateway:
// streamChat({ query }, { onChunk, onDone, onError }) -> { abort }

const BASE_DELAY = 260;
// 模型「按行快速吐字」：远快于打字机消费速度，缓冲会积压，
// 因此真正可见的节奏由 StreamingProcessor 的逐字 + 语义分块控制。
const LINE_DELAY = 18;

function includesAny(text, words) {
  return words.some((word) => text.indexOf(word) >= 0);
}

function pickReply(query) {
  const normalized = String(query || '').toLowerCase();

  if (includesAny(normalized, ['性能', 'perf', '优势'])) {
    return [
      '## 性能排查结论',
      '',
      '支付宝小程序里的 Markdown Agent 最怕三件事：',
      '',
      '1. **每个分块都重算全文**：长回复会被拖成越来越重的尾部更新。',
      '2. **HTML rich-text 白名单**：事件、动画和部分属性会被二次过滤。',
      '3. **内联节点过深**：小程序文本节点不适合保留 Web DOM 式嵌套。',
      '',
      '| 场景 | 做法 | 收益 |',
      '| --- | --- | --- |',
      '| 普通回答 | 直接传 `content` | 简单稳定 |',
      '| 流式回答 | 传 `streaming` | 尾部修补，稳定块缓存 |',
      '| 复杂回答 | 注入扩展 | 代码、公式、脚注走结构化节点 |',
      '',
      '公式也可以在流式过程中逐步修补：$T(n)=O(n)$。',
      '',
      '$$',
      '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
      '$$',
      '',
      '补充脚注[^1:这个脚注由 Footnote 扩展产出，再交给支付宝 scoped slot 渲染弹层。]。',
    ].join('\n');
  }

  if (
    includesAny(normalized, ['代码', 'code', '流式', '接口', '接入']) &&
    !includesAny(normalized, ['latex', '公式', '脚注', '表格'])
  ) {
    return [
      '## 流式渲染接入方式',
      '',
      '页面只维护一条不断增长的 Markdown 字符串：',
      '',
      '```js',
      'let full = "";',
      '',
      'streamChat({ query }, {',
      '  onChunk(delta, nextFull) {',
      '    full = nextFull;',
      '    this.setData({',
      '      ["messages[" + aiIndex + "].content"]: full,',
      '    });',
      '  },',
      '  onDone(finalText) {',
      '    this.setData({',
      '      ["messages[" + aiIndex + "].content"]: finalText,',
      '      ["messages[" + aiIndex + "].streaming"]: false,',
      '    });',
      '  },',
      '});',
      '```',
      '',
      'Agent 气泡里直接渲染：',
      '',
      '```axml',
      '<markdown',
      '  content="{{item.content}}"',
      '  streaming="{{item.streaming}}"',
      '  extensions="{{markdownExtensions}}"',
      '  footnote="{{true}}"',
      '/>',
      '```',
    ].join('\n');
  }

  if (includesAny(normalized, ['latex', '公式', '脚注', '表格', '高亮'])) {
    return [
      '## 复杂 Markdown 能力展示',
      '',
      '这条回复同时包含 **代码高亮**、LaTeX、脚注和 GFM 表格。',
      '',
      '| 能力 | 当前状态 | 渲染路径 |',
      '| --- | --- | --- |',
      '| 代码高亮 | 支持 | `CodeHighlight()` |',
      '| LaTeX | 支持 | `Latex()` |',
      '| 脚注 | 支持 | `Footnote()` + scoped slot |',
      '| 表格 | 支持 | GFM token → Alipay MiniNode |',
      '',
      '行内公式：$E = mc^2$。',
      '',
      '块级公式：',
      '',
      '$$',
      '\\int_0^1 x^2\\,dx = \\frac{1}{3}',
      '$$',
      '',
      '脚注 marker 可以点击[^demo:脚注内容保存在 MiniNode.attrs.content，页面层决定弹层样式和交互。]。',
      '',
      '```ts',
      'import { XMarkdownMini } from "@ant-design/x-markdown-mini";',
      '',
      'const md = new XMarkdownMini({',
      '  extensions: [Footnote(), CodeHighlight(), Latex()],',
      '});',
      '```',
    ].join('\n');
  }

  return [
    '## Agent 回复',
    '',
    '我会把你的输入当成支付宝小程序里的真实 Agent 消息处理。',
    '',
    '- 用户消息使用普通文本气泡。',
    '- Agent 消息交给 `<markdown />`。',
    '- 生成中设置 `streaming: { hasNextChunk: true, enableAnimation: true }`。',
    '- 结束后把 `streaming` 设为 `false`。',
    '',
    '> 现在的 `llm.js` 是本地 mock。接真实模型时，只替换 `streamChat` 内部实现，页面状态机不用动。',
    '',
    '也可以混合公式 $a^2+b^2=c^2$ 和脚注[^note:默认回复也会验证脚注 slot 是否工作。]。',
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
