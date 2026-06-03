"use strict";

// src/components/wechat/Markdown/index.ts
var import__ = require("../../index.js");
var import_flattenInline = require("../../shared/flattenInline.js");
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
    footnote: { type: Boolean, value: false }
  },
  data: {
    nodes: [],
    slotComponents: []
  },
  md: null,
  lifetimes: {
    attached() {
      this._build();
      this._render();
    },
    detached() {
      var _a;
      (_a = this.md) == null ? void 0 : _a.reset();
      this.md = null;
    }
  },
  observers: {
    // `components` / `footnote` are baked into the marked instance, rebuild on change.
    "components, footnote"() {
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
      const extensions = footnote ? [(0, import__.Footnote)()] : [];
      (_b = this.md) == null ? void 0 : _b.reset();
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
        onPatch: (nodes) => this.setData({ nodes: (0, import_flattenInline.flattenInlineNodes)(nodes) })
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
