// 脚注语法 [^标签:内容]：标签做 marker（[1]），内容做 popover 文本（自包含）。
const CONTENT = `# 脚注 Demo

Markdown[^1:一种轻量级标记语言，2004 年由 John Gruber 创建] 是一种纯文本格式，
广泛用于文档与聊天场景[^2:例如 GitHub、各类 AI 助手的回复渲染]。

点击正文里的上标 **[1] / [2]** 即可弹出脚注内容。普通语法不受影响：
**加粗**、*斜体*、\`inline code\`、[链接](https://ant.design)。
`;

Page({
  data: {
    content: CONTENT,
  },
});
