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

// src/components/shared/flattenInline.ts
var flattenInline_exports = {};
__export(flattenInline_exports, {
  createTextAnimationState: () => createTextAnimationState,
  flattenInlineNodes: () => flattenInlineNodes,
  reconcileTextAnimation: () => reconcileTextAnimation,
  resetTextAnimation: () => resetTextAnimation
});
module.exports = __toCommonJS(flattenInline_exports);

// src/components/shared/textAnimation.ts
var ANIMATION_DURATION = 360;
function createTextAnimationState() {
  return { leaves: /* @__PURE__ */ new Map() };
}
function prefixLength(a, b) {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}
function visualSegment(segment, now) {
  const elapsed = Math.max(0, Math.floor(now - segment.bornAt));
  if (elapsed >= ANIMATION_DURATION) {
    return { k: segment.k, value: segment.value, bornAt: segment.bornAt };
  }
  return {
    k: segment.k,
    value: segment.value,
    bornAt: segment.bornAt,
    animate: true,
    style: elapsed ? `animation-delay:-${elapsed}ms` : "animation-delay:0ms"
  };
}
function reconcileTextAnimation(nodes, state, now = Date.now()) {
  const seen = /* @__PURE__ */ new Set();
  const visit = (list, path) => {
    var _a, _b, _c, _d;
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const nodePath = `${path}/${(_a = node.k) != null ? _a : i}:${node.name}`;
      if (node.name === "text") {
        const value = String((_c = (_b = node.attrs) == null ? void 0 : _b.value) != null ? _c : "");
        const prev = (_d = state.leaves.get(nodePath)) != null ? _d : { prev: "", nextId: 0, segments: [] };
        const prefix = prefixLength(prev.prev, value);
        const segments = [];
        let consumed = 0;
        for (const segment of prev.segments) {
          if (consumed >= prefix) break;
          const end = consumed + segment.value.length;
          segments.push({
            k: segment.k,
            value: end <= prefix ? segment.value : segment.value.slice(0, prefix - consumed),
            bornAt: segment.bornAt
          });
          consumed = end;
        }
        let nextId = prev.nextId;
        const tail = value.slice(prefix);
        if (tail) segments.push({ k: nextId++, value: tail, bornAt: now });
        state.leaves.set(nodePath, { prev: value, nextId, segments });
        seen.add(nodePath);
        node.animationSegments = segments.map((segment) => visualSegment(segment, now));
      }
      if (node.children) visit(node.children, `${nodePath}/children`);
      if (node.header) visit(node.header, `${nodePath}/header`);
    }
  };
  visit(nodes, "root");
  for (const key of state.leaves.keys()) {
    if (!seen.has(key)) state.leaves.delete(key);
  }
  return nodes;
}
function resetTextAnimation(state) {
  state.leaves.clear();
}

// src/components/shared/flattenInline.ts
function flattenInlineNodes(nodes) {
  const flat = nodes.map(walk);
  assignKeys(flat);
  return flat;
}
function assignKeys(list) {
  for (let i = 0; i < list.length; i++) {
    const n = list[i];
    n.k = i;
    if (n.children) assignKeys(n.children);
    if (n.header) assignKeys(n.header);
  }
}
var INLINE_TAGS = {
  strong: true,
  em: true,
  del: true,
  code: true,
  span: true
};
var TAG_CLASS = {
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
    if (hasClass(merged, "hljs") && value.indexOf("\n") >= 0) {
      const lines = value.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
          out.push({
            name: "text",
            attrs: merged ? { value: lines[i], class: merged } : { value: lines[i] }
          });
        }
        if (i < lines.length - 1) out.push({ name: "br", attrs: {} });
      }
      return;
    }
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
function hasClass(className, target) {
  return ` ${className} `.indexOf(` ${target} `) >= 0;
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
  createTextAnimationState,
  flattenInlineNodes,
  reconcileTextAnimation,
  resetTextAnimation
});
