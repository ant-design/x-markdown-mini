export {};

import { getTableShadowState } from '../../shared/tableScroll.js';

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
    // Recursive MiniNodeRenderer instances must not inject host layout boxes.
    // KaTeX vlist/fraction positioning depends on one continuous box tree.
    virtualHost: true,
  },
  properties: {
    nodes: { type: Array, value: [] },
    selectable: { type: Boolean, value: true },
    animation: { type: Boolean, value: false },
    // 自定义组件标签白名单：命中的节点交给抽象节点 <custom-slot>（由宿主提供）渲染。
    slotComponents: { type: Array, value: [] },
  },
  data: {
    tableShadows: {} as Record<string, { left: boolean; right: boolean }>,
  },
  _tableViewportWidths: {} as Record<string, number>,
  _tableContentWidths: {} as Record<string, number>,
  _tableMeasureTimer: null as ReturnType<typeof setTimeout> | null,
  observers: {
    nodes(this: any) {
      this._scheduleTableMeasure();
    },
  },
  lifetimes: {
    detached(this: any) {
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      this._tableMeasureTimer = null;
    },
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
    _scheduleTableMeasure(this: any) {
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      // Streaming can patch nodes frequently. Measure after updates settle instead
      // of querying layout on every token burst.
      this._tableMeasureTimer = setTimeout(() => {
        this._tableMeasureTimer = null;
        this._measureTables();
      }, 160);
    },
    _measureTables(this: any) {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('.md-table-scroll').boundingClientRect();
      query.selectAll('.md-table').boundingClientRect();
      query.exec((result: any[]) => {
        const viewports = (result && result[0]) || [];
        const tables = (result && result[1]) || [];
        const tableByKey: Record<string, any> = {};
        const widths: Record<string, number> = {};
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
          widths[key] = viewportWidth;
          contentWidths[key] = tableWidth;
          shadows[key] = getTableShadowState(0, tableWidth, viewportWidth);
        }

        this._tableViewportWidths = widths;
        this._tableContentWidths = contentWidths;
        this.setData({ tableShadows: shadows });
      });
    },
    _tableScroll(this: any, e: any) {
      const key = String(e?.currentTarget?.dataset?.tableKey ?? '0');
      const viewportWidth = this._tableViewportWidths[key] || 0;
      const scrollLeft = Number(e?.detail?.scrollLeft) || 0;
      const eventScrollWidth = Number(e?.detail?.scrollWidth) || 0;
      const scrollWidth = eventScrollWidth || this._tableContentWidths[key] || viewportWidth;
      if (eventScrollWidth) this._tableContentWidths[key] = eventScrollWidth;
      const state = getTableShadowState(scrollLeft, scrollWidth, viewportWidth);
      const current = this.data.tableShadows[key];
      if (current && current.left === state.left && current.right === state.right) return;
      this.setData({ tableShadows: { ...this.data.tableShadows, [key]: state } });
    },
  },
});
