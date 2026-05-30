// 注意：synth tokenizer 是 inline 级，裸标签独占一行会被 marked 当成 HTML block，
// 因此自定义组件要带「行内上下文」（同段落里前后有文字）才能被识别。
const CONTENT = `# 自定义组件 Demo

通过 \`components: ['countdown']\` 注册后，markdown 里的 \`<countdown>\` 会被识别为
自定义组件节点，交给页面 **slot-scope** 渲染。

限时活动：<countdown seconds="15" label="限时优惠" /> 抓紧下单！

普通 markdown 不受影响：**加粗**、*斜体*、\`inline code\`、[链接](https://ant.design)。

倒数第二波：<countdown seconds="5" label="即将开抢" /> 别错过。
`;

Page({
  data: {
    content: CONTENT,
    logs: ['页面就绪，倒计时结束/点击会在此记录。'],
  },
  _log(line) {
    const logs = [line, ...this.data.logs].slice(0, 6);
    this.setData({ logs });
  },
  onCountdownFinish(payload) {
    this._log(`倒计时结束：${payload && payload.label}`);
    my.showToast({ content: `「${payload && payload.label}」已结束` });
  },
  onCountdownTap(payload) {
    this._log(`点击倒计时：${payload && payload.label}（剩 ${payload && payload.remain} 秒）`);
  },
  onNodeTap(e) {
    // markdown 容器冒泡上来的 tap（含被点节点的 data-data）。
    console.log('[markdown] node tap', e);
  },
});
