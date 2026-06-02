# examples · 对话 Agent（真实 LLM）

`examples/wechat` 与 `examples/alipay` 的首页（`pages/index`）已从「Markdown 渲染演示」改造为
**可对话的 Agent**：调用真实模型网关，流式渲染回复，复用本仓库 `dist/` 里的 `markdown` 组件。

> `custom` / `footnote` 两个示例页保持不变，仍是组件能力演示。

## 模型接入

参考 `service-completion-poc` 的 `wohu` 流式接口，契约：

- **Endpoint**：`https://wohupygw-inc.antgroup-inc.cn/tool_chat_stream`（POST，JSON body）
- **Body**：`{ query, model: 'wohu_qwen3_30b_a3b', system_prompt, tools: [] }`
- **流式**：SSE 风格分块，每个 `data:` 事件的 JSON `.data` 为字符串增量（本 Demo 不接工具调用）

要改地址 / 模型 / system prompt，只改这一个文件：

- 微信：`examples/wechat/pages/index/config.js`
- 支付宝：`examples/alipay/pages/index/config.js`

返回形态兼容多种：`{ data: "..." }`（wohu）、OpenAI 的 `choices[0].delta.content`、纯文本增量。
解析逻辑见各端 `pages/index/llm.js`。

### 两端的流式差异

| 平台 | 机制 | 效果 |
| --- | --- | --- |
| 微信 | `wx.request({ enableChunked }) + onChunkReceived`，含增量 UTF-8 解码（跨分块不乱码）| 真·逐 token 流式 |
| 支付宝 | `my.request` 无稳定分块回调 → 整段取回后本地打字机回放 | 整段返回 + 排版动画 |

两端对页面暴露相同的 `streamChat({ query }, { onChunk, onDone, onError })`，页面代码一致。

## 在开发者工具里运行

该网关是**蚂蚁内网地址**，需在内网环境下运行，并关闭域名校验：

### 微信开发者工具
1. 打开 `examples/wechat` 目录（已设 `urlCheck: false`，默认免域名校验）。
2. 若仍被拦截：详情 → 本地设置 → 勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」。
3. 编译，进入首页直接输入对话。

### 支付宝小程序开发者工具
1. 打开 `examples/alipay` 目录。
2. 详情 / 设置 → 勾选「不校验合法域名」（关闭 HTTPS 证书 / 域名校验）。
3. 编译，进入首页直接输入对话。

## 已知限制

- 网关只接收单条 `query`，不带历史上下文（与参考实现一致）；界面展示完整会话，但每轮仅发送最新一句。
  如需多轮上下文，可在 `llm.js` 里把历史拼进 `query` / `system_prompt`。
- 工具调用（`ToolsCall` / `manifest.json` 工具发现）为 PoC Web 专用，未移植。
