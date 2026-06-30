"use strict";

// src/components/wechat/Markdown/index.ts
var import__ = require("../../index.js");
var import_flattenInline = require("../../shared/flattenInline.js");

// src/components/shared/loadKatexFonts.ts
var CDN = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts";
var PACKAGE_NAME = "@ant-design/x-markdown-mini";
var ALIPAY_LOCAL_BASES = [
  "/node_modules/" + PACKAGE_NAME + "/katex-fonts",
  "/katex-fonts"
];
var WECHAT_LOCAL_BASES = [
  "/miniprogram_npm/" + PACKAGE_NAME + "/katex-fonts",
  "/katex-fonts"
];
var FACES = [
  { file: "KaTeX_Main-Regular.woff", alipayFile: "KaTeX_Main-Regular.ttf", family: "KaTeX_Main", weight: "normal", style: "normal", alipayFamily: "KaTeX_Main" },
  { file: "KaTeX_Math-Italic.woff", alipayFile: "KaTeX_Math-Italic.ttf", family: "KaTeX_Math", weight: "normal", style: "italic", alipayFamily: "KaTeX_MathItalic" },
  { file: "KaTeX_Main-Bold.woff", alipayFile: "KaTeX_Main-Bold.ttf", family: "KaTeX_Main", weight: "bold", style: "normal", alipayFamily: "KaTeX_MainBold" },
  { file: "KaTeX_Main-Italic.woff", alipayFile: "KaTeX_Main-Italic.ttf", family: "KaTeX_Main", weight: "normal", style: "italic", alipayFamily: "KaTeX_MainItalic" },
  { file: "KaTeX_Math-BoldItalic.woff", alipayFile: "KaTeX_Math-BoldItalic.ttf", family: "KaTeX_Math", weight: "bold", style: "italic", alipayFamily: "KaTeX_MathBoldItalic" },
  { file: "KaTeX_Main-BoldItalic.woff", alipayFile: "KaTeX_Main-BoldItalic.ttf", family: "KaTeX_Main", weight: "bold", style: "italic", alipayFamily: "KaTeX_MainBoldItalic" },
  { file: "KaTeX_Size1-Regular.woff", alipayFile: "KaTeX_Size1-Regular.ttf", family: "KaTeX_Size1", weight: "normal", style: "normal", alipayFamily: "KaTeX_Size1" },
  { file: "KaTeX_Size2-Regular.woff", alipayFile: "KaTeX_Size2-Regular.ttf", family: "KaTeX_Size2", weight: "normal", style: "normal", alipayFamily: "KaTeX_Size2" },
  { file: "KaTeX_Size3-Regular.woff", alipayFile: "KaTeX_Size3-Regular.ttf", family: "KaTeX_Size3", weight: "normal", style: "normal", alipayFamily: "KaTeX_Size3" },
  { file: "KaTeX_Size4-Regular.woff", alipayFile: "KaTeX_Size4-Regular.ttf", family: "KaTeX_Size4", weight: "normal", style: "normal", alipayFamily: "KaTeX_Size4" },
  { file: "KaTeX_AMS-Regular.woff", alipayFile: "KaTeX_AMS-Regular.ttf", family: "KaTeX_AMS", weight: "normal", style: "normal", alipayFamily: "KaTeX_AMS" },
  { file: "KaTeX_SansSerif-Regular.woff", alipayFile: "KaTeX_SansSerif-Regular.ttf", family: "KaTeX_SansSerif", weight: "normal", style: "normal", alipayFamily: "KaTeX_SansSerif" },
  { file: "KaTeX_SansSerif-Bold.woff", alipayFile: "KaTeX_SansSerif-Bold.ttf", family: "KaTeX_SansSerif", weight: "bold", style: "normal", alipayFamily: "KaTeX_SansSerifBold" },
  { file: "KaTeX_SansSerif-Italic.woff", alipayFile: "KaTeX_SansSerif-Italic.ttf", family: "KaTeX_SansSerif", weight: "normal", style: "italic", alipayFamily: "KaTeX_SansSerifItalic" },
  { file: "KaTeX_Caligraphic-Regular.woff", alipayFile: "KaTeX_Caligraphic-Regular.ttf", family: "KaTeX_Caligraphic", weight: "normal", style: "normal", alipayFamily: "KaTeX_Caligraphic" },
  { file: "KaTeX_Caligraphic-Bold.woff", alipayFile: "KaTeX_Caligraphic-Bold.ttf", family: "KaTeX_Caligraphic", weight: "bold", style: "normal", alipayFamily: "KaTeX_CaligraphicBold" },
  { file: "KaTeX_Fraktur-Regular.woff", alipayFile: "KaTeX_Fraktur-Regular.ttf", family: "KaTeX_Fraktur", weight: "normal", style: "normal", alipayFamily: "KaTeX_Fraktur" },
  { file: "KaTeX_Fraktur-Bold.woff", alipayFile: "KaTeX_Fraktur-Bold.ttf", family: "KaTeX_Fraktur", weight: "bold", style: "normal", alipayFamily: "KaTeX_FrakturBold" },
  { file: "KaTeX_Script-Regular.woff", alipayFile: "KaTeX_Script-Regular.ttf", family: "KaTeX_Script", weight: "normal", style: "normal", alipayFamily: "KaTeX_Script" },
  { file: "KaTeX_Typewriter-Regular.woff", alipayFile: "KaTeX_Typewriter-Regular.ttf", family: "KaTeX_Typewriter", weight: "normal", style: "normal", alipayFamily: "KaTeX_Typewriter" }
];
var started = false;
var ready = false;
var readyCallbacks = [];
function callSafe(cb) {
  if (!cb) return;
  try {
    cb();
  } catch (e) {
  }
}
function sourcesForFace(f, isAlipay) {
  const localBases = isAlipay ? ALIPAY_LOCAL_BASES : WECHAT_LOCAL_BASES;
  const sources = [];
  for (let i = 0; i < localBases.length; i++) {
    sources.push('url("' + localBases[i] + "/" + f.alipayFile + '")');
  }
  if (!isAlipay) sources.push('url("' + CDN + "/" + f.file + '")');
  return sources;
}
function loadFace(api, opts, done) {
  let index = 0;
  const tryNext = () => {
    const source = opts.sources[index++];
    if (!source) {
      done();
      return;
    }
    api.loadFontFace({
      global: true,
      family: opts.family,
      source,
      desc: opts.desc,
      success: done,
      fail: tryNext
    });
  };
  tryNext();
}
function loadKatexFonts(onReady) {
  const isAlipay = typeof my !== "undefined" && typeof my.loadFontFace === "function";
  const api = isAlipay ? my : typeof wx !== "undefined" && typeof wx.loadFontFace === "function" ? wx : null;
  if (!api) {
    callSafe(onReady);
    return;
  }
  if (ready) {
    callSafe(onReady);
    return;
  }
  if (onReady) readyCallbacks.push(onReady);
  if (started) return;
  started = true;
  let done = 0;
  const total = FACES.length;
  const tick = () => {
    done++;
    if (done >= total && !ready) {
      ready = true;
      const callbacks = readyCallbacks;
      readyCallbacks = [];
      for (let i = 0; i < callbacks.length; i++) callSafe(callbacks[i]);
    }
  };
  for (let i = 0; i < FACES.length; i++) {
    const f = FACES[i];
    loadFace(api, {
      // 支付宝：唯一 family + 统一 normal/normal（CSS 的 .kxf-* 也请求 normal/normal，确定性命中，
      // 斜/粗由字体文件本身提供）；微信：原始 family + 真实 style/weight（rich-text 内部按此选字面）。
      family: isAlipay ? f.alipayFamily : f.family,
      // 包内本地 ttf 零网络、零白名单；微信保留 CDN woff 兜底。
      sources: sourcesForFace(f, isAlipay),
      desc: isAlipay ? { style: "normal", weight: "normal" } : { style: f.style, weight: f.weight }
    }, tick);
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
