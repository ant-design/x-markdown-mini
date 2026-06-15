export {};

declare const Component: (opts: Record<string, unknown>) => void;
declare const wx: any;

function copyToClipboard(text: string): void {
  if (!text) return;
  wx.setClipboardData({
    data: text,
    success: () => wx.showToast({ title: '已复制', icon: 'none', duration: 1200 }),
    fail: () => wx.showToast({ title: '复制失败', icon: 'none' }),
  });
}

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  properties: {
    nodes: { type: Array, value: [] },
    selectable: { type: Boolean, value: true },
    animation: { type: Boolean, value: false },
    // 自定义组件标签白名单：命中的节点交给抽象节点 <custom-slot>（由宿主提供）渲染。
    slotComponents: { type: Array, value: [] },
  },
  methods: {
    _tap(this: any, e: unknown) {
      this.triggerEvent('tap', e, { bubbles: true, composed: true });
    },
    _appear(this: any, e: unknown) {
      this.triggerEvent('appear', e, { bubbles: true, composed: true });
    },
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
  },
});
