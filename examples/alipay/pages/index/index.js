const FULL = `# x-markdown-mini · Alipay

支持 **加粗**、*斜体* 与 \`inline code\`。

- 列表项一
- 列表项二
  - 嵌套
- [Ant Design](https://ant.design)

> 引用块：用于演示 blockquote 的渲染降级。

\`\`\`js
const greet = (name) => \`Hello \${name}\`;
greet('mini');
\`\`\`

| 列 A | 列 B |
| --- | --- |
| 1   | 2   |
| 3   | 4   |
`;

let timer = null;

Page({
  data: {
    content: FULL,
    streaming: false,
  },
  onUnload() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  reset() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    this.setData({
      content: FULL,
      streaming: false,
    });
  },
  startStream() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    this.setData({
      content: '',
      streaming: { hasNextChunk: true, enableAnimation: true },
    });
    let i = 0;
    const STEP = 4;
    const tick = () => {
      i = Math.min(i + STEP, FULL.length);
      const done = i >= FULL.length;
      this.setData({
        content: FULL.slice(0, i),
        streaming: { hasNextChunk: !done, enableAnimation: true },
      });
      if (!done) {
        timer = setTimeout(tick, 50);
      } else {
        timer = null;
      }
    };
    tick();
  },
  onRenderComplete() {
    console.log('[markdown] render complete');
  },
});
