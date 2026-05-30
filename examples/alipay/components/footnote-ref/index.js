// 脚注 marker + popover。内容自包含在 props.content（来自 [^标签:内容] 节点），
// 点击 marker 弹出浮层，点击遮罩关闭。
Component({
  props: {
    label: '注',
    content: '',
    data: null,
  },
  data: {
    open: false,
  },
  methods: {
    onToggle() {
      this.setData({ open: !this.data.open });
    },
    onClose() {
      this.setData({ open: false });
    },
  },
});
