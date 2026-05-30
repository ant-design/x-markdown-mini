// 自包含倒计时自定义组件（无外部依赖，纯演示 components + slot-scope）。
// markdown 里写 <countdown seconds="15" label="限时优惠" />，
// 经 components 白名单合成节点后，由页面 slot-scope 渲染到这里。
Component({
  props: {
    seconds: 0,
    label: '',
    // 整个 MiniNode（含 tag / attrs），页面通过 data-data 透传过来。
    data: null,
    onFinish: null,
    onTap: null,
  },
  data: {
    remain: 0,
    done: false,
  },
  timer: null,
  didMount() {
    this._start();
  },
  didUpdate(prevProps) {
    if (prevProps.seconds !== this.props.seconds) this._start();
  },
  didUnmount() {
    this._clear();
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
      const total = Number(this.props.seconds) || 0;
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
      if (this.props.onFinish) this.props.onFinish({ label: this.props.label });
    },
    onTapCard() {
      if (this.props.onTap) {
        this.props.onTap({ label: this.props.label, remain: this.data.remain });
      }
    },
  },
});
