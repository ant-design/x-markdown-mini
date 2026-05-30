// 脚注 marker + popover（微信）。内容自包含在 content 属性，本地弹层。
Component({
  properties: {
    label: { type: String, value: '注' },
    content: { type: String, value: '' },
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
