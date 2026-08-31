export {};

import { getTableShadowState } from '../../shared/tableScroll.js';
import { resolveLinkHref } from '../../shared/flattenInline.js';
import { ensureKatexFonts } from '../../shared/loadKatexFonts.js';

declare const Component: (opts: Record<string, unknown>) => void;
declare const wx: any;

// JS 接入页直接用 <mini-node-renderer>（不经 <Markdown>），KaTeX rich-text 靠全局 loadFontFace
// 解析字形，故字体注册必须也在这里触发——否则微信 JS 接入的公式会整片回退系统字体。
function hasKatexNodes(nodes: any[] | undefined): boolean {
  return !!nodes && nodes.some((node: any) =>
    !!node && (String((node.attrs || {}).class || '').indexOf('katex') > -1 ||
    hasKatexNodes(node.children)));
}

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
    // No virtualHost: it suppressed the host node so depth-2 recursive instances
    // rendered into the parent flow, but under `style: v2` that detached inline
    // text/anchors (links dropped to their own line) and stopped text-decoration
    // (strikethrough) from painting. KaTeX — the only reason it was added — now
    // renders inside a single <rich-text>, so the continuous-box-tree need is gone.
    // Alipay uses the identical recursive structure without virtualHost and is correct.
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
    // Per-node-index override of <details> open state; unset = node's own
    // `open` attr (see wxs detailsOpenState).
    detailsOpen: {} as Record<string, boolean>,
  },
  _tableViewportWidths: {} as Record<string, number>,
  _tableContentWidths: {} as Record<string, number>,
  _tableMeasureTimer: null as ReturnType<typeof setTimeout> | null,
  _mounted: false,
  observers: {
    nodes(this: any, nodes: any[]) {
      if (hasKatexNodes(nodes)) ensureKatexFonts();
      this._scheduleTableMeasure();
    },
  },
  lifetimes: {
    attached(this: any) {
      this._mounted = true;
      if (hasKatexNodes(this.data.nodes)) ensureKatexFonts();
      this._scheduleTableMeasure();
    },
    detached(this: any) {
      this._mounted = false;
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      this._tableMeasureTimer = null;
    },
  },
  methods: {
    _tap(this: any, e: any) {
      // 链接内置交互：小程序无法直接打开外部 http(s) 链接，命中 anchor 叶子时把
      // href 复制到剪贴板并 Toast 提示。叶子 <text> 的原生 tap 带 dataset.data（整棵
      // node）；上层 mini-node-renderer 经 triggerEvent 重新包裹后 currentTarget 上无
      // data-data → resolveLinkHref 返回 null，因此复制只在叶子层触发一次、不会重复。
      const href = resolveLinkHref(e?.currentTarget?.dataset?.data);
      if (href) {
        wx.setClipboardData({
          data: href,
          success: () => wx.showToast({ title: '链接已复制', icon: 'none', duration: 1500 }),
        });
      }
      // 仍向上冒泡 tap，宿主与页面可自定义（如跳转 web-view）。
      this.triggerEvent('tap', e, { bubbles: true, composed: true });
    },
    _appear(this: any, e: unknown) {
      this.triggerEvent('appear', e, { bubbles: true, composed: true });
    },
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
    _toggleDetails(this: any, e: any) {
      const ds = (e && e.currentTarget && e.currentTarget.dataset) || {};
      this.setData({ ['detailsOpen.' + ds.i]: !ds.open });
    },
    _scheduleTableMeasure(this: any) {
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      // Streaming can patch nodes frequently. Measure after updates settle instead
      // of querying layout on every token burst.
      this._tableMeasureTimer = setTimeout(() => {
        this._tableMeasureTimer = null;
        if (!this._mounted) return;
        this._measureTables();
      }, 160);
    },
    _measureTables(this: any) {
      if (!this._mounted) return;
      const query = wx.createSelectorQuery().in(this);
      query.selectAll('.md-table-scroll').boundingClientRect();
      query.selectAll('.md-table').boundingClientRect();
      query.exec((result: any[]) => {
        if (!this._mounted) return;
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
