# 如何为一个 React 应用接入 SSE 流式响应

好的，下面我来一步步讲清楚如何把后端的 **SSE (Server-Sent Events)** 流接入到一个 React 前端应用里，让你的对话气泡可以像 ChatGPT 那样**逐字增量出现**。整体可以拆成四个阶段：

1. 后端约定与 endpoint 形态
2. 前端的 `fetch` + `ReadableStream` 解码
3. React 侧的状态合并（增量 `setState`）
4. Markdown 渲染层的接入（重点）

---

## 1. 后端约定

最常见的 SSE 协议格式是这样的（HTTP `Content-Type: text/event-stream`）：

```
data: {"delta": "好", "id": "msg_123"}

data: {"delta": "的", "id": "msg_123"}

data: {"delta": "，", "id": "msg_123"}

data: [DONE]
```

注意每条事件之间用**两个换行**分隔，且每条事件以 `data: ` 起头。`[DONE]` 是 OpenAI / Anthropic 约定的"流结束"信号。

如果你用的是 Anthropic Messages API 的 `stream: true`，事件结构会更细：

| event | data 示意 | 说明 |
|---|---|---|
| `message_start` | `{ "type": "message_start", "message": {...} }` | 流开始 |
| `content_block_delta` | `{ "type": "content_block_delta", "delta": { "type": "text_delta", "text": "好" } }` | 文本增量（核心） |
| `message_delta` | `{ "type": "message_delta", "usage": {...} }` | 用量更新 |
| `message_stop` | `{ "type": "message_stop" }` | 流结束 |

---

## 2. 前端：`fetch` + `ReadableStream` 解码

`EventSource` API 看起来很合适但有几个坑：**不能自定义 header**（没法传 Authorization）、**只支持 GET**、断线重连机制和我们想要的不一致。所以更稳的做法是 `fetch` + 手工解码：

```ts
async function streamChat(prompt: string, onDelta: (text: string) => void): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Stream failed: HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 协议：事件之间用 \n\n 分隔
    let idx;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      if (!raw.startsWith('data: ')) continue;
      const payload = raw.slice('data: '.length);
      if (payload === '[DONE]') return;

      try {
        const evt = JSON.parse(payload);
        if (evt.type === 'content_block_delta' && evt.delta?.text) {
          onDelta(evt.delta.text);
        }
      } catch (err) {
        console.warn('parse SSE event failed:', err, raw);
      }
    }
  }
}
```

> 几个细节：
>
> - `TextDecoder` 必须传 `{ stream: true }`，否则末尾不完整的 UTF-8 多字节字符会被解坏（中文很容易踩到）。
> - 一定要循环 `indexOf('\n\n')`，因为一次 `read()` 可能返回**多条**事件，也可能返回**半条**事件。
> - 出错的事件要 `continue` 而不是 `throw`——网络层偶尔会发心跳之类的非业务事件。

---

## 3. React 状态合并

最容易踩的坑是**每个 delta 都触发一次 `setState`**，导致整个对话历史重新渲染。

❌ 不要这样写：

```tsx
const [messages, setMessages] = useState<Message[]>([]);

streamChat(prompt, (delta) => {
  setMessages((prev) => [
    ...prev.slice(0, -1),
    { ...prev.at(-1)!, content: prev.at(-1)!.content + delta },
  ]);
});
```

每条 delta 都会复制整个 `messages` 数组——一条消息 500 token，重复 500 次。

✅ 推荐的做法是把"正在流的那一条"单独存：

```tsx
const [messages, setMessages] = useState<Message[]>([]);
const [streaming, setStreaming] = useState('');

streamChat(prompt, (delta) => {
  setStreaming((prev) => prev + delta);
});

// 流结束时再 commit 进 messages
function onStreamEnd(): void {
  setMessages((prev) => [...prev, { role: 'assistant', content: streaming }]);
  setStreaming('');
}
```

更高级的方案是把"完成的消息"和"正在流的消息"用两个独立组件渲染，让 React 的 diff 范围只限制在当前流的那一条上。

---

## 4. Markdown 渲染层

如果你的回复里有 markdown（代码块、表格、列表），最大的挑战是：**delta 进来的时候 markdown 经常是"半截"的**。

比如 LLM 输出到一半时你可能拿到：

```
现在我们来看一段代码：

```js
function hello(
```

这里 ``` 还没闭合、函数定义也没写完。如果你每次 delta 都直接 `marked.parse(content)`，会出现：

- 代码块在闭合前被识别成普通行内文本，**`<` 之类的字符可能被 HTML 转义**
- 表格在最后一行没出全时**整张表都不渲染**
- 列表项的延续行在闭合前**会被当成新段落**

正确的做法是：

1. **稳定块缓存**：扫描已渲染文本，找最后一个"双空行 + 不在 fence 内"的位置，把它之前的内容一次解析、缓存、不再重做；
2. **tail 重解析**：只对"最后一个未闭合块"在每次 delta 时重新解析；
3. **节点级 diff**：把缓存节点和新 tail 节点拼起来 emit 给渲染层。

伪代码：

```ts
class StreamingProcessor {
  private stable: Node[] = [];
  private committedLen = 0;

  onDelta(delta: string): void {
    this.text += delta;
    this.advanceCommit();          // 推进 stable 缓存
    const tail = this.text.slice(this.committedLen);
    const tailNodes = parse(tail); // 只对未闭合的 tail 重新解析
    this.emit([...this.stable, ...tailNodes]);
  }

  private advanceCommit(): void {
    // 扫描已渲染文本，找位于 fence 之外的最后一个双空行
    // ...省略 fence 状态机...
    if (lastSafeOffset > this.committedLen) {
      const segment = this.text.slice(this.committedLen, lastSafeOffset);
      this.stable.push(...parse(segment));
      this.committedLen = lastSafeOffset;
    }
  }
}
```

这个套路在 OpenAI Playground、Claude、Cursor 里都能看到类似的实现。

---

## 5. 关于小程序的额外坑

如果你的目标是**小程序**而不是 Web，几个额外约束：

- 没有 `fetch` 的 `ReadableStream`——`wx.request` 只能等完整响应，但 `wx.connectSocket` 可以走 WebSocket
- 没有 DOM——markdown 输出要喂给 `rich-text` 组件的 `nodes` 属性，结构是约定好的 `{ name, attrs, children, text }` 树
- 微信的 `rich-text` 不允许某些属性（比如 `href`，要改写成 `data-href`），HTTP 图片要换成 HTTPS
- 支付宝小程序的 `rich-text` 不支持 `<ol start="x">`，要降级成普通列表

所以小程序场景下一般会用专门的库（比如 `@ant-design/x-markdown-mini`）来吸收这些差异，**它的输入是 markdown 字符串，输出是平台特定的 `nodes` 数组**。

---

## 总结

| 关注点 | 推荐方案 |
|---|---|
| 协议解码 | `fetch` + `ReadableStream` + `TextDecoder({ stream: true })` |
| 多事件分包 | 循环找 `\n\n`，半条事件留在 buffer |
| React 状态 | 把流中消息单独 state，commit 时再合并 |
| Markdown 渲染 | 稳定块缓存 + tail 重解析 + 节点 diff |
| 平台差异 | 小程序用专门库，Web 直接 `marked` / `markdown-it` |

整体下来代码量不大，**坑都在边界条件上**。建议至少加这几个 e2e 测试：

- ✅ 中文 UTF-8 多字节字符跨 chunk 分割
- ✅ 单条 SSE 事件横跨多个 `read()` 返回
- ✅ 代码块未闭合时的 HTML 转义
- ✅ 网络中断时的 reconnect / partial-state 保留
- ✅ 用户在流进行中切走/切回页面

希望有帮助 ~ 还有问题欢迎继续问 🙂
