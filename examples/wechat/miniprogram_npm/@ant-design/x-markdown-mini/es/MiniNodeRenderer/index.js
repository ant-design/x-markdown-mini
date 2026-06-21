"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/wechat/MiniNodeRenderer/index.ts
var MiniNodeRenderer_exports = {};
module.exports = __toCommonJS(MiniNodeRenderer_exports);

// src/components/shared/tableScroll.ts
function getTableShadowState(scrollLeft, scrollWidth, viewportWidth) {
  const left = Math.max(0, scrollLeft);
  const content = Math.max(0, scrollWidth);
  const viewport = Math.max(0, viewportWidth);
  const overflow = content > viewport + 1;
  return {
    left: overflow && left > 1,
    right: overflow && left + viewport < content - 1
  };
}

// src/components/wechat/MiniNodeRenderer/index.ts
function copyToClipboard(text) {
  if (!text) return;
  wx.setClipboardData({
    data: text,
    success: () => wx.showToast({ title: "\u5DF2\u590D\u5236", icon: "none", duration: 1200 }),
    fail: () => wx.showToast({ title: "\u590D\u5236\u5931\u8D25", icon: "none" })
  });
}
Component({
  options: {
    multipleSlots: true,
    styleIsolation: "shared"
  },
  properties: {
    nodes: { type: Array, value: [] },
    selectable: { type: Boolean, value: true },
    animation: { type: Boolean, value: false },
    // 自定义组件标签白名单：命中的节点交给抽象节点 <custom-slot>（由宿主提供）渲染。
    slotComponents: { type: Array, value: [] }
  },
  data: {
    tableShadows: {}
  },
  _tableViewportWidths: {},
  _tableContentWidths: {},
  _tableMeasureTimer: null,
  observers: {
    nodes() {
      this._scheduleTableMeasure();
    }
  },
  lifetimes: {
    detached() {
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      this._tableMeasureTimer = null;
    }
  },
  methods: {
    _tap(e) {
      this.triggerEvent("tap", e, { bubbles: true, composed: true });
    },
    _appear(e) {
      this.triggerEvent("appear", e, { bubbles: true, composed: true });
    },
    _copy(e) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard(ds && ds.copy || "");
    },
    _scheduleTableMeasure() {
      if (this._tableMeasureTimer !== null) clearTimeout(this._tableMeasureTimer);
      this._tableMeasureTimer = setTimeout(() => {
        this._tableMeasureTimer = null;
        this._measureTables();
      }, 160);
    },
    _measureTables() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll(".md-table-scroll").boundingClientRect();
      query.selectAll(".md-table").boundingClientRect();
      query.exec((result) => {
        var _a, _b, _c, _d, _e, _f;
        const viewports = result && result[0] || [];
        const tables = result && result[1] || [];
        const tableByKey = {};
        const widths = {};
        const contentWidths = {};
        const shadows = {};
        for (let i = 0; i < tables.length; i++) {
          const key = String((_c = (_b = (_a = tables[i]) == null ? void 0 : _a.dataset) == null ? void 0 : _b.tableKey) != null ? _c : i);
          tableByKey[key] = tables[i];
        }
        for (let i = 0; i < viewports.length; i++) {
          const viewport = viewports[i];
          const key = String((_e = (_d = viewport == null ? void 0 : viewport.dataset) == null ? void 0 : _d.tableKey) != null ? _e : i);
          const viewportWidth = Number(viewport == null ? void 0 : viewport.width) || 0;
          const tableWidth = Number((_f = tableByKey[key]) == null ? void 0 : _f.width) || viewportWidth;
          widths[key] = viewportWidth;
          contentWidths[key] = tableWidth;
          shadows[key] = getTableShadowState(0, tableWidth, viewportWidth);
        }
        this._tableViewportWidths = widths;
        this._tableContentWidths = contentWidths;
        this.setData({ tableShadows: shadows });
      });
    },
    _tableScroll(e) {
      var _a, _b, _c, _d, _e;
      const key = String((_c = (_b = (_a = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a.dataset) == null ? void 0 : _b.tableKey) != null ? _c : "0");
      const viewportWidth = this._tableViewportWidths[key] || 0;
      const scrollLeft = Number((_d = e == null ? void 0 : e.detail) == null ? void 0 : _d.scrollLeft) || 0;
      const eventScrollWidth = Number((_e = e == null ? void 0 : e.detail) == null ? void 0 : _e.scrollWidth) || 0;
      const scrollWidth = eventScrollWidth || this._tableContentWidths[key] || viewportWidth;
      if (eventScrollWidth) this._tableContentWidths[key] = eventScrollWidth;
      const state = getTableShadowState(scrollLeft, scrollWidth, viewportWidth);
      const current = this.data.tableShadows[key];
      if (current && current.left === state.left && current.right === state.right) return;
      this.setData({ tableShadows: __spreadProps(__spreadValues({}, this.data.tableShadows), { [key]: state }) });
    }
  }
});
