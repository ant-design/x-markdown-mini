export {};

import { getTableShadowState } from '../../shared/tableScroll.js';

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
  data: {
    tableShadows: {} as Record<string, { left: boolean; right: boolean }>,
  },
  tableViewportWidths: {} as Record<string, number>,
  tableContentWidths: {} as Record<string, number>,
  tableMeasureTimer: null as ReturnType<typeof setTimeout> | null,
  didMount(this: any) {
    this._scheduleTableMeasure();
  },
  didUpdate(this: any, prevProps: MiniNodeRendererProps) {
    if (prevProps.nodes !== this.props.nodes) this._scheduleTableMeasure();
  },
  didUnmount(this: any) {
    if (this.tableMeasureTimer !== null) clearTimeout(this.tableMeasureTimer);
    this.tableMeasureTimer = null;
  },
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
    _scheduleTableMeasure(this: any) {
      if (this.tableMeasureTimer !== null) clearTimeout(this.tableMeasureTimer);
      this.tableMeasureTimer = setTimeout(() => {
        this.tableMeasureTimer = null;
        this._measureTables();
      }, 160);
    },
    _measureTables(this: any) {
      const query = my.createSelectorQuery().in(this);
      query.selectAll('.md-table-scroll').boundingClientRect();
      query.selectAll('.md-table').boundingClientRect();
      query.exec((result: any[]) => {
        const viewports = (result && result[0]) || [];
        const tables = (result && result[1]) || [];
        const tableByKey: Record<string, any> = {};
        const viewportWidths: Record<string, number> = {};
        const contentWidths: Record<string, number> = {};
        const shadows: Record<string, { left: boolean; right: boolean }> = {};

        for (let i = 0; i < tables.length; i++) {
          const key = String(tables[i]?.dataset?.tableKey ?? i);
          tableByKey[key] = tables[i];
        }
        for (let i = 0; i < viewports.length; i++) {
          const viewport = viewports[i];
          const key = String(viewport?.dataset?.tableKey ?? i);
          const viewportWidth = Number(viewport?.width) || 0;
          const tableWidth = Number(tableByKey[key]?.width) || viewportWidth;
          viewportWidths[key] = viewportWidth;
          contentWidths[key] = tableWidth;
          shadows[key] = getTableShadowState(0, tableWidth, viewportWidth);
        }

        this.tableViewportWidths = viewportWidths;
        this.tableContentWidths = contentWidths;
        this.setData({ tableShadows: shadows });
      });
    },
    _tableScroll(this: any, e: any) {
      const key = String(e?.currentTarget?.dataset?.tableKey ?? '0');
      const viewportWidth = this.tableViewportWidths[key] || 0;
      const scrollLeft = Number(e?.detail?.scrollLeft) || 0;
      const eventScrollWidth = Number(e?.detail?.scrollWidth) || 0;
      const contentWidth = eventScrollWidth || this.tableContentWidths[key] || viewportWidth;
      if (eventScrollWidth) this.tableContentWidths[key] = eventScrollWidth;
      const state = getTableShadowState(scrollLeft, contentWidth, viewportWidth);
      const current = this.data.tableShadows[key];
      if (current && current.left === state.left && current.right === state.right) return;
      this.setData({ tableShadows: { ...this.data.tableShadows, [key]: state } });
    },
  },
});
