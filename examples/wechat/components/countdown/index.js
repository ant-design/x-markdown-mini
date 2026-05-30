// 自包含倒计时自定义组件（无外部依赖）。微信端通过 dispatcher + 抽象节点渲染到这里。
// 结束反馈自包含（内部 toast），避免依赖跨 generic 边界的事件冒泡；
// tap 仍走 markdown 的 bind:tap 链回到页面。
Component({
  properties: {
    seconds: { type: null, value: 0 },
    label: { type: String, value: '' },
    node: { type: Object, value: null },
  },
  data: {
    remain: 0,
    done: false,
  },
  timer: null,
  lifetimes: {
    attached() {
      this._start();
    },
    detached() {
      this._clear();
    },
  },
  observers: {
    seconds() {
      this._start();
    },
  },
  methods: {
    _clear() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    _start() {
      this._clear();
      const total = Number(this.data.seconds) || 0;
      this.setData({ remain: total, done: total <= 0 });
      if (total <= 0) {
        this._finish();
        return;
      }
      this.timer = setInterval(() => {
        const next = this.data.remain - 1;
        if (next <= 0) {
          this._clear();
          this.setData({ remain: 0, done: true });
          this._finish();
        } else {
          this.setData({ remain: next });
        }
      }, 1000);
    },
    _finish() {
      wx.showToast({ title: `「${this.data.label}」已结束`, icon: 'none' });
      this.triggerEvent('finish', { label: this.data.label });
    },
    onTapCard() {
      // 不 catch，让 tap 冒泡到 markdown 容器的 tap 链。
      this.triggerEvent('tap', { label: this.data.label, remain: this.data.remain });
    },
  },
});
