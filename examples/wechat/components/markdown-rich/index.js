// 示例本地包装组件：在组件内部 require 并 bake 插件（代码高亮 + KaTeX）。
// 插件返回的扩展对象带有 tokenizer / miniRenderer 函数，mini-program 的
// 属性绑定 / setData 会剥离函数，所以不能通过 <markdown extensions="{{...}}"> 传入。
const { XMarkdownMini, Footnote } = require('../../dist/index.js');
const CodeHighlight = require('../../dist/plugins/CodeHighlight/index.js').default;
const Latex = require('../../dist/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('../../dist/shared/flattenInline.js');

Component({
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    content: { type: String, value: '' },
    streaming: { type: null, value: false },
    selectable: { type: Boolean, value: true },
    className: { type: String, value: '' },
    footnote: { type: Boolean, value: false },
  },
  data: {
    nodes: [],
    slotComponents: [],
  },
  md: null,
  lifetimes: {
    attached() {
      this._build();
      this._render();
    },
    detached() {
      if (this.md) this.md.reset();
      this.md = null;
    },
  },
  observers: {
    footnote() {
      if (this.md) {
        this._build();
        this._render();
      }
    },
    'content, streaming, selectable'() {
      if (this.md) this._render();
    },
  },
  methods: {
    _build() {
      const footnote = !!this.data.footnote;
      const extensions = [CodeHighlight(), Latex({ katexOptions: { throwOnError: false } })];
      if (footnote) extensions.unshift(Footnote());
      if (this.md) this.md.reset();
      this.md = new XMarkdownMini({ escapeText: false, extensions });
      this.setData({ slotComponents: footnote ? ['footnote'] : [] });
    },
    _render() {
      const data = this.data;
      this.md.renderNodes({
        content: data.content,
        platform: 'wechat',
        streaming: data.streaming,
        selectable: data.selectable,
        onRenderStart: () => this.triggerEvent('renderstart'),
        onRenderProgress: (payload) => this.triggerEvent('renderprogress', payload),
        onRenderComplete: () => this.triggerEvent('rendercomplete'),
        onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
      });
    },
    _tap(e) {
      this.triggerEvent('tap', e);
    },
    _appear(e) {
      this.triggerEvent('appear', e);
    },
  },
});
