// 注意：synth tokenizer 是 inline 级，裸标签独占一行会被 marked 当成 HTML block，
// 因此自定义组件要带「行内上下文」（同段落里前后有文字）才能被识别。
const CONTENT = `# 自定义组件 Demo

通过 \`components: ['countdown']\` 注册后，markdown 里的 \`<countdown>\` 会被识别为
自定义组件节点。微信用 **抽象节点 generics** + dispatcher 组件渲染。

限时活动：<countdown seconds="15" label="限时优惠" /> 抓紧下单！

普通 markdown 不受影响：**加粗**、*斜体*、\`inline code\`、[链接](https://ant.design)。

倒数第二波：<countdown seconds="5" label="即将开抢" /> 别错过。
`;

Page({
  data: {
    content: CONTENT,
    logs: ['页面就绪，点击倒计时会在此记录（结束反馈由组件自身 toast）。'],
  },
  _log(line) {
    const logs = [line, ...this.data.logs].slice(0, 6);
    this.setData({ logs });
  },
  onNodeTap(e) {
    // markdown 容器冒泡上来的 tap（含被点节点的 data-data）。
    const node = e && e.detail && e.detail.currentTarget && e.detail.currentTarget.dataset
      ? e.detail.currentTarget.dataset.data
      : null;
    this._log(`节点点击：${node ? (node.name || '未知') : 'tap'}`);
    console.log('[markdown] node tap', e);
  },
});
