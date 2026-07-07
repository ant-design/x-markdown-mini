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

// src/components/shared/loadKatexFonts.ts
var loadKatexFonts_exports = {};
__export(loadKatexFonts_exports, {
  KATEX_FONT_CDN: () => KATEX_FONT_CDN,
  areKatexFontsReady: () => areKatexFontsReady,
  ensureKatexFonts: () => ensureKatexFonts,
  onKatexFontsReady: () => onKatexFontsReady
});
module.exports = __toCommonJS(loadKatexFonts_exports);
var PACKAGE_NAME = "@ant-design/x-markdown-mini";
var WECHAT_LOCAL_BASES = [
  "/miniprogram_npm/" + PACKAGE_NAME + "/dist/miniprogram_dist/katex-fonts",
  "/miniprogram_npm/" + PACKAGE_NAME + "/katex-fonts",
  "/katex-fonts"
];
var KATEX_FONT_CDN = {
  "KaTeX_Main-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/L-a2RqXz_KQAAAAAQ0AAAAgADlJoAQFr/KaTeX_Main-Regular.ttf",
  "KaTeX_Math-Italic.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/vG_gSZcjJTcAAAAAQfAAAAgADlJoAQFr/KaTeX_Math-Italic.ttf",
  "KaTeX_Main-Bold.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/yYAFSbELpiIAAAAAQyAAAAgADlJoAQFr/KaTeX_Main-Bold.ttf",
  "KaTeX_Main-Italic.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/6vKqS7mpABUAAAAAQhAAAAgADlJoAQFr/KaTeX_Main-Italic.ttf",
  "KaTeX_Math-BoldItalic.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/fugLS4TQ_TIAAAAAQeAAAAgADlJoAQFr/KaTeX_Math-BoldItalic.ttf",
  "KaTeX_Main-BoldItalic.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/XgjrS7wWTbAAAAAAQgAAAAgADlJoAQFr/KaTeX_Main-BoldItalic.ttf",
  "KaTeX_Size1-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/8TDlSpILzAkAAAAAQMAAAAgADlJoAQFr/KaTeX_Size1-Regular.ttf",
  "KaTeX_Size2-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/Z4PkT68y0dUAAAAAQLAAAAgADlJoAQFr/KaTeX_Size2-Regular.ttf",
  "KaTeX_Size3-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/7gtaRYkVdFQAAAAAQHAAAAgADlJoAQFr/KaTeX_Size3-Regular.ttf",
  "KaTeX_Size4-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/aW8uRJzwokwAAAAAQKAAAAgADlJoAQFr/KaTeX_Size4-Regular.ttf",
  "KaTeX_AMS-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/Wt0vQKdiQoIAAAAAQ-AAAAgADlJoAQFr/KaTeX_AMS-Regular.ttf",
  "KaTeX_SansSerif-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/ZLV_TIlyACIAAAAAQTAAAAgADlJoAQFr/KaTeX_SansSerif-Regular.ttf",
  "KaTeX_SansSerif-Bold.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/ra9YQp9FKE8AAAAAQYAAAAgADlJoAQFr/KaTeX_SansSerif-Bold.ttf",
  "KaTeX_SansSerif-Italic.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/CpvzTqKXKZ8AAAAAQWAAAAgADlJoAQFr/KaTeX_SansSerif-Italic.ttf",
  "KaTeX_Caligraphic-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/tZ8fTYt9JKsAAAAAQMAAAAgADlJoAQFr/KaTeX_Caligraphic-Regular.ttf",
  "KaTeX_Caligraphic-Bold.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/k9MMRZaHkWUAAAAAQMAAAAgADlJoAQFr/KaTeX_Caligraphic-Bold.ttf",
  "KaTeX_Fraktur-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/4htAQpf8VrQAAAAAQTAAAAgADlJoAQFr/KaTeX_Fraktur-Regular.ttf",
  "KaTeX_Fraktur-Bold.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/fCFXTrrddScAAAAAQTAAAAgADlJoAQFr/KaTeX_Fraktur-Bold.ttf",
  "KaTeX_Script-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/NH6oSrgkGvMAAAAAQQAAAAgADlJoAQFr/KaTeX_Script-Regular.ttf",
  "KaTeX_Typewriter-Regular.ttf": "https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/qoBkQ6SH5IIAAAAAQbAAAAgADlJoAQFr/KaTeX_Typewriter-Regular.ttf"
};
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
function debugKatexFonts() {
  return typeof my !== "undefined" && !!my.__xmdKatexProbe;
}
function sourceKind(source) {
  if (source.indexOf("mdn.alipayobjects.com") > -1) return "cdn";
  if (source.indexOf("/miniprogram_npm/") > -1) return "miniprogram_npm";
  if (source.indexOf("/katex-fonts/") > -1) return "root";
  return "unknown";
}
function sourcesForFace(f, isAlipay) {
  const sources = [];
  const cdn = KATEX_FONT_CDN[f.alipayFile];
  if (isAlipay) {
    if (cdn) sources.push('url("' + cdn + '")');
    return sources;
  }
  for (let i = 0; i < WECHAT_LOCAL_BASES.length; i++) {
    sources.push('url("' + WECHAT_LOCAL_BASES[i] + "/" + f.alipayFile + '")');
  }
  if (cdn) sources.push('url("' + cdn + '")');
  return sources;
}
function loadFace(api, opts, done) {
  let index = 0;
  const tryNext = () => {
    const source = opts.sources[index++];
    if (!source) {
      if (debugKatexFonts()) {
        console.log("[xmd:katex-font]", opts.family, "failed-all");
      }
      done();
      return;
    }
    if (debugKatexFonts()) {
      console.log("[xmd:katex-font]", opts.family, "try", sourceKind(source));
    }
    api.loadFontFace({
      global: true,
      family: opts.family,
      source,
      desc: opts.desc,
      success: () => {
        if (debugKatexFonts()) {
          console.log("[xmd:katex-font]", opts.family, "ok", sourceKind(source));
        }
        done();
      },
      fail: (err) => {
        if (debugKatexFonts()) {
          console.log("[xmd:katex-font]", opts.family, "fail", sourceKind(source), err);
        }
        tryNext();
      }
    });
  };
  tryNext();
}
function resolveApi() {
  if (typeof my !== "undefined" && typeof my.loadFontFace === "function") {
    return { api: my, isAlipay: true };
  }
  if (typeof wx !== "undefined" && typeof wx.loadFontFace === "function") {
    return { api: wx, isAlipay: false };
  }
  return null;
}
function flushReadyCallbacks() {
  const callbacks = readyCallbacks;
  readyCallbacks = [];
  for (let i = 0; i < callbacks.length; i++) callSafe(callbacks[i]);
}
function startLoading(api, isAlipay) {
  let done = 0;
  const total = FACES.length;
  const tick = () => {
    done++;
    if (done >= total && !ready) {
      ready = true;
      flushReadyCallbacks();
    }
  };
  for (let i = 0; i < FACES.length; i++) {
    const f = FACES[i];
    loadFace(api, {
      // 支付宝：唯一 family + 统一 normal/normal（CSS 的 .kxf-* 也请求 normal/normal，确定性命中，
      // 斜/粗由字体文件本身提供）；微信：原始 family + 真实 style/weight（rich-text 内部按此选字面）。
      family: isAlipay ? f.alipayFamily : f.family,
      sources: sourcesForFace(f, isAlipay),
      desc: isAlipay ? { style: "normal", weight: "normal" } : { style: f.style, weight: f.weight }
    }, tick);
  }
}
function areKatexFontsReady() {
  return ready;
}
function ensureKatexFonts() {
  if (ready || started) return;
  const resolved = resolveApi();
  if (!resolved) {
    ready = true;
    flushReadyCallbacks();
    return;
  }
  started = true;
  startLoading(resolved.api, resolved.isAlipay);
}
function onKatexFontsReady(cb) {
  ensureKatexFonts();
  if (ready) return;
  readyCallbacks.push(cb);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KATEX_FONT_CDN,
  areKatexFontsReady,
  ensureKatexFonts,
  onKatexFontsReady
});
