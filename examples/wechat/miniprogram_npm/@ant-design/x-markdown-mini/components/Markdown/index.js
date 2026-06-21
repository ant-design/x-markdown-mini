"use strict";

// src/components/wechat/Markdown/index.ts
var import__ = require("../../index.js");
var import_flattenInline = require("../../shared/flattenInline.js");

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

// src/components/wechat/Markdown/index.ts
function bakeExtensions(footnote, latex, highlight) {
  const exts = [];
  if (footnote) exts.push((0, import__.Footnote)());
  if (highlight) exts.push(require("../../plugins/CodeHighlight/index.js").default());
  if (latex)
    exts.push(
      require("../../plugins/Latex/index.js").default({
        katexOptions: { throwOnError: false }
      })
    );
  return exts;
}
Component({
  options: {
    multipleSlots: true,
    styleIsolation: "shared"
  },
  properties: {
    content: { type: String, value: "" },
    streaming: { type: null, value: false },
    selectable: { type: Boolean, value: true },
    gfm: { type: null, value: null },
    breaks: { type: null, value: null },
    className: { type: String, value: "" },
    extensions: { type: null, value: null },
    components: { type: null, value: null },
    footnote: { type: Boolean, value: false },
    // 开启内置插件（组件内部 require + bake），无需页面传入函数型扩展。
    latex: { type: Boolean, value: false },
    highlight: { type: Boolean, value: false }
  },
  data: {
    nodes: [],
    slotComponents: []
  },
  md: null,
  textAnimation: createTextAnimationState(),
  lifetimes: {
    attached() {
      this.textAnimation = createTextAnimationState();
      this._build();
      this._render();
    },
    detached() {
      var _a;
      (_a = this.md) == null ? void 0 : _a.reset();
      resetTextAnimation(this.textAnimation);
      this.md = null;
    }
  },
  observers: {
    // `components` / `footnote` / `latex` / `highlight` 都 bake 进 marked 实例，变更需重建。
    "components, footnote, latex, highlight"() {
      if (this.md) {
        this._build();
        this._render();
      }
    },
    "content, streaming, selectable, extensions, gfm, breaks"() {
      if (this.md) this._render();
    }
  },
  methods: {
    _build() {
      var _a, _b;
      const components = (_a = this.data.components) != null ? _a : [];
      const footnote = !!this.data.footnote;
      const extensions = bakeExtensions(footnote, !!this.data.latex, !!this.data.highlight);
      (_b = this.md) == null ? void 0 : _b.reset();
      resetTextAnimation(this.textAnimation);
      this.md = new import__.XMarkdownMini({ escapeText: false, components, extensions });
      const slotComponents = footnote ? components.concat(["footnote"]) : components;
      this.setData({ slotComponents });
    },
    _render() {
      var _a, _b, _c;
      const data = this.data;
      this.md.renderNodes({
        content: data.content,
        platform: "wechat",
        streaming: data.streaming,
        selectable: data.selectable,
        gfm: (_a = data.gfm) != null ? _a : void 0,
        breaks: (_b = data.breaks) != null ? _b : void 0,
        extensions: (_c = data.extensions) != null ? _c : void 0,
        onRenderStart: () => this.triggerEvent("renderstart"),
        onRenderProgress: (payload) => this.triggerEvent("renderprogress", payload),
        onRenderComplete: () => this.triggerEvent("rendercomplete"),
        onPatch: (nodes) => {
          const flat = (0, import_flattenInline.flattenInlineNodes)(nodes);
          if (!data.streaming) resetTextAnimation(this.textAnimation);
          this.setData({
            nodes: data.streaming ? reconcileTextAnimation(flat, this.textAnimation) : flat
          });
        }
      });
    },
    _tap(e) {
      this.triggerEvent("tap", e);
    },
    _appear(e) {
      this.triggerEvent("appear", e);
    }
  }
});
