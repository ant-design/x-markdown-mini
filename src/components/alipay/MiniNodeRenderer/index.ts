export {};

declare const Component: (opts: Record<string, unknown>) => void;
declare const my: any;

function copyToClipboard(text: string): void {
  if (!text) return;
  my.setClipboard({
    text,
    success: () => my.showToast({ content: '已复制', duration: 1200 }),
    fail: () => my.showToast({ content: '复制失败' }),
  });
}

interface MiniNodeRendererProps {
  nodes: unknown[];
  selectable: boolean;
  animation: boolean;
  /** 自定义组件标签白名单：命中的节点交给宿主作用域插槽渲染。 */
  slotComponents: string[];
  onTap?: (e?: unknown) => void;
  onAppear?: (e?: unknown) => void;
}

const defaultProps: MiniNodeRendererProps = {
  nodes: [],
  selectable: true,
  animation: false,
  slotComponents: [],
};

Component({
  props: defaultProps,
  methods: {
    _tap(this: any, e: unknown) {
      this.props.onTap?.(e);
    },
    _appear(this: any, e: unknown) {
      this.props.onAppear?.(e);
    },
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
  },
});
