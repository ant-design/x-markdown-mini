// 真实模型代理网关配置（参考 service-completion-poc 的 wohu tool_chat_stream）。
// 该网关为蚂蚁内网地址：需在「微信开发者工具 → 详情 → 本地设置 → 不校验合法域名」
// （本项目 project.config.json 已设 urlCheck:false），并在蚂蚁内网环境下运行。
module.exports = {
  ENDPOINT: 'https://wohupygw-inc.antgroup-inc.cn/tool_chat_stream',
  MODEL: 'wohu_qwen3_30b_a3b',
  // 不使用工具调用；要求始终中文 + Markdown 输出。
  SYSTEM_PROMPT:
    '你是一个友好、专业的中文 AI 助手。请始终使用简体中文回答，回答可使用 Markdown 格式（标题、列表、代码块、表格等）。',
  TOOLS: [],
};
