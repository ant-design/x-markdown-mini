"use strict";

// src/components/wechat/Markdown/index.ts
var import__ = require("../../index.js");
var import_flattenInline = require("../../shared/flattenInline.js");

// src/components/shared/loadKatexFonts.ts
var CDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts";
var FACES = [
  { family: "KaTeX_AMS", file: "KaTeX_AMS-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Caligraphic", file: "KaTeX_Caligraphic-Bold.woff", weight: "bold", style: "normal" },
  { family: "KaTeX_Caligraphic", file: "KaTeX_Caligraphic-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Fraktur", file: "KaTeX_Fraktur-Bold.woff", weight: "bold", style: "normal" },
  { family: "KaTeX_Fraktur", file: "KaTeX_Fraktur-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Main", file: "KaTeX_Main-Bold.woff", weight: "bold", style: "normal" },
  { family: "KaTeX_Main", file: "KaTeX_Main-BoldItalic.woff", weight: "bold", style: "italic" },
  { family: "KaTeX_Main", file: "KaTeX_Main-Italic.woff", weight: "normal", style: "italic" },
  { family: "KaTeX_Main", file: "KaTeX_Main-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Math", file: "KaTeX_Math-BoldItalic.woff", weight: "bold", style: "italic" },
  { family: "KaTeX_Math", file: "KaTeX_Math-Italic.woff", weight: "normal", style: "italic" },
  { family: "KaTeX_SansSerif", file: "KaTeX_SansSerif-Bold.woff", weight: "bold", style: "normal" },
  { family: "KaTeX_SansSerif", file: "KaTeX_SansSerif-Italic.woff", weight: "normal", style: "italic" },
  { family: "KaTeX_SansSerif", file: "KaTeX_SansSerif-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Script", file: "KaTeX_Script-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Size1", file: "KaTeX_Size1-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Size2", file: "KaTeX_Size2-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Size3", file: "KaTeX_Size3-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Size4", file: "KaTeX_Size4-Regular.woff", weight: "normal", style: "normal" },
  { family: "KaTeX_Typewriter", file: "KaTeX_Typewriter-Regular.woff", weight: "normal", style: "normal" }
];
var started = false;
function loadKatexFonts() {
  if (started) return;
  const api = typeof my !== "undefined" ? my : typeof wx !== "undefined" ? wx : null;
  if (!api || typeof api.loadFontFace !== "function") return;
  started = true;
  for (let i = 0; i < FACES.length; i++) {
    const f = FACES[i];
    api.loadFontFace({
      global: true,
      family: f.family,
      source: 'url("' + CDN + "/" + f.file + '")',
      desc: { style: f.style, weight: f.weight },
      success() {
      },
      fail() {
      }
    });
  }
}

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
function visualSegment(segment, now, complete) {
  const elapsed = Math.max(0, Math.floor(now - segment.bornAt));
  if (complete || elapsed >= ANIMATION_DURATION) {
    return {
      k: segment.k,
      value: segment.value,
      bornAt: segment.bornAt,
      style: `animation-delay:-${ANIMATION_DURATION}ms;animation-play-state:paused`
    };
  }
  return {
    k: segment.k,
    value: segment.value,
    bornAt: segment.bornAt,
    animate: true,
    style: elapsed ? `animation-delay:-${elapsed}ms` : "animation-delay:0ms"
  };
}
function reconcileTextAnimation(nodes, state, now = Date.now(), complete = false) {
  const seen = /* @__PURE__ */ new Set();
  const visit = (list, path) => {
    var _a, _b, _c, _d;
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      const nodePath = `${path}/${(_a = node.k) != null ? _a : i}:${node.name}`;
      if (node.name === "text" || node.name === "a") {
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
        node.animationSegments = segments.map(
          (segment) => visualSegment(segment, now, complete)
        );
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
function bakeExtensions(latex, highlight) {
  const exts = [];
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
    // 开启内置插件（组件内部 require + bake），无需页面传入函数型扩展。
    latex: { type: Boolean, value: false },
    highlight: { type: Boolean, value: false }
  },
  data: {
    nodes: [],
    slotComponents: [],
    animation: false
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
    // `components` / `latex` / `highlight` 都 bake 进 marked 实例，变更需重建。
    "components, latex, highlight"() {
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
      if (this.data.latex) loadKatexFonts();
      const extensions = bakeExtensions(!!this.data.latex, !!this.data.highlight);
      (_b = this.md) == null ? void 0 : _b.reset();
      resetTextAnimation(this.textAnimation);
      this.md = new import__.XMarkdownMini({ escapeText: false, components, extensions });
      this.setData({ slotComponents: components });
    },
    _render() {
      var _a, _b, _c;
      const data = this.data;
      const streamConfig = data.streaming;
      const animation = streamConfig === true || !!streamConfig && typeof streamConfig === "object" && streamConfig.enableAnimation !== false;
      this.setData({ animation });
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
          if (!animation) resetTextAnimation(this.textAnimation);
          this.setData({
            nodes: animation ? reconcileTextAnimation(
              flat,
              this.textAnimation,
              Date.now(),
              typeof streamConfig === "object" && !streamConfig.hasNextChunk
            ) : flat
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
