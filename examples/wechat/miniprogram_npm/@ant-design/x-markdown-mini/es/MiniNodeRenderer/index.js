"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  methods: {
    _tap(e) {
      this.triggerEvent("tap", e, { bubbles: true, composed: true });
    },
    _appear(e) {
      this.triggerEvent("appear", e, { bubbles: true, composed: true });
    }
  }
});
