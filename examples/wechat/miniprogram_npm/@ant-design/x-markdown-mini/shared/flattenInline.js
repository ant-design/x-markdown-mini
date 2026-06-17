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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var flattenInline_exports = {};
__export(flattenInline_exports, {
  flattenInlineNodes: () => flattenInlineNodes
});
module.exports = __toCommonJS(flattenInline_exports);
function flattenInlineNodes(nodes) {
  return nodes.map(walk);
}
const INLINE_TAGS = {
  strong: true,
  em: true,
  del: true,
  code: true,
  span: true
};
const TAG_CLASS = {
  strong: "md-strong",
  em: "md-em",
  del: "md-del"
  // 'code' 不在此处加类：行内 codespan 由 transformer 直接打 md-inline-code，
  // 而代码块内的 <code>（在 <pre> 中）不应带行内药丸底色。
  // 'span' 不附加额外 class
};
function isKatex(node) {
  var _a;
  const cls = (_a = node.attrs) == null ? void 0 : _a.class;
  return typeof cls === "string" && cls.indexOf("katex") > -1;
}
function walk(node) {
  if (isKatex(node)) return node;
  if (!node.children || node.children.length === 0) return node;
  if (node.name === "a") {
    return __spreadProps(__spreadValues({}, node), { children: flattenChildren(node.children) });
  }
  return __spreadProps(__spreadValues({}, node), { children: flattenChildren(node.children) });
}
function flattenChildren(children) {
  const out = [];
  for (const c of children) {
    flattenOne(c, "", out);
  }
  return out;
}
function flattenOne(n, classChain, out) {
  var _a, _b, _c, _d, _e, _f, _g;
  if (n.name === "text") {
    const value = (_b = (_a = n.attrs) == null ? void 0 : _a.value) != null ? _b : "";
    if (!value) return;
    const merged = mergeClass(classChain, (_c = n.attrs) == null ? void 0 : _c.class);
    out.push({ name: "text", attrs: merged ? { value, class: merged } : { value } });
    return;
  }
  if (n.name === "br") {
    out.push({ name: "br", attrs: {} });
    return;
  }
  if (isKatex(n)) {
    out.push(n);
    return;
  }
  if (n.name === "a") {
    out.push(__spreadProps(__spreadValues({}, n), { children: flattenChildren((_d = n.children) != null ? _d : []) }));
    return;
  }
  if (n.name === "img") {
    out.push(n);
    return;
  }
  if (INLINE_TAGS[n.name]) {
    const next = mergeClass(
      classChain,
      (_e = n.attrs) == null ? void 0 : _e.class,
      (_f = TAG_CLASS[n.name]) != null ? _f : ""
    );
    for (const c of (_g = n.children) != null ? _g : []) flattenOne(c, next, out);
    return;
  }
  out.push(walk(n));
}
function mergeClass(...parts) {
  const seen = /* @__PURE__ */ new Set();
  for (const p of parts) {
    if (!p) continue;
    for (const tok of p.split(/\s+/)) {
      if (tok) seen.add(tok);
    }
  }
  return Array.from(seen).join(" ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flattenInlineNodes
});
