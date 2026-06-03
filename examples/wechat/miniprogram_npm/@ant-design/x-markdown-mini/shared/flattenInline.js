"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  del: "md-del",
  code: "md-inline-code"
  // 'span' 不附加额外 class
};
function walk(node) {
  if (!node.children || node.children.length === 0) return node;
  if (node.name === "a") {
    return { ...node, children: flattenChildren(node.children) };
  }
  return { ...node, children: flattenChildren(node.children) };
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
  if (n.name === "a") {
    out.push({ ...n, children: flattenChildren((_d = n.children) != null ? _d : []) });
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
