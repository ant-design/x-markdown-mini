// 示例本地包装组件：在组件内部 require 并 bake 插件（代码高亮 + KaTeX）。
// 插件返回的扩展对象带有 tokenizer / miniRenderer 函数，mini-program 的
// 属性绑定 / setData 会剥离函数，所以不能通过 <markdown extensions="{{...}}"> 传入。
const { XMarkdownMini, Footnote } = require('../../dist/index.js');
const CodeHighlight = require('../../dist/plugins/CodeHighlight/index.js').default;
const Latex = require('../../dist/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('../../dist/shared/flattenInline.js');

// 打字机 + 语义分块节奏在组件内组装：charDelay/chunkDelay 为数组时随块加速。
// 在组件里 bake，而不是从页面经属性传入，避免嵌套配置跨 setData 时被裁剪。
//
// charDelay 单字间隔刻意取得比小程序 setData→渲染 的批处理延迟更大（约 ≥20ms），
// 否则一帧会合并很多字，看起来像整块跳出而不是逐字。chunkDelay 在每个语义块
// 之前留出停顿，呈现「先攒出一个语义块、再逐字吐出」的节奏。
const TYPEWRITER = { charDelay: [52, 40, 30, 24, 20], chunkDelay: [200, 150, 100, 60] };

// 把页面传来的简单 streaming 标记（{ hasNextChunk } / true / false）补全为
// 带语义分块 + 逐字节奏 + 动画的完整流式配置。
function buildStreaming(streaming) {
  if (!streaming) return false;
  const hasNextChunk = streaming === true ? true : !!streaming.hasNextChunk;
  return { hasNextChunk, enableAnimation: true, semantic: TYPEWRITER };
}

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
        streaming: buildStreaming(data.streaming),
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
