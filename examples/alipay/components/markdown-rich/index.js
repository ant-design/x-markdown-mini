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
const TYPEWRITER = { charDelay: [95, 78, 62, 52, 45], chunkDelay: [420, 320, 240, 170] };

// 把页面传来的简单 streaming 标记（{ hasNextChunk } / true / false）补全为
// 带语义分块 + 逐字节奏 + 动画的完整流式配置。
function buildStreaming(streaming) {
  if (!streaming) return false;
  const hasNextChunk = streaming === true ? true : !!streaming.hasNextChunk;
  return { hasNextChunk, enableAnimation: true, semantic: TYPEWRITER };
}

Component({
  props: {
    content: '',
    streaming: false,
    selectable: true,
    className: '',
    footnote: false,
    onTap: () => {},
    onAppear: () => {},
  },
  data: {
    nodes: [],
    slotComponents: [],
  },
  md: null,
  didMount() {
    this._build(this.props);
    this._render(this.props);
  },
  didUpdate(prevProps) {
    const p = this.props;
    if (prevProps.footnote !== p.footnote) {
      this._build(p);
      this._render(p);
      return;
    }
    if (
      prevProps.content !== p.content ||
      prevProps.streaming !== p.streaming ||
      prevProps.selectable !== p.selectable
    ) {
      this._render(p);
    }
  },
  didUnmount() {
    if (this.md) this.md.reset();
    this.md = null;
  },
  methods: {
    _build(props) {
      const footnote = !!props.footnote;
      const extensions = [CodeHighlight(), Latex({ katexOptions: { throwOnError: false } })];
      if (footnote) extensions.unshift(Footnote());
      if (this.md) this.md.reset();
      this.md = new XMarkdownMini({ escapeText: false, extensions });
      this.setData({ slotComponents: footnote ? ['footnote'] : [] });
    },
    _render(props) {
      this.md.renderNodes({
        content: props.content,
        platform: 'alipay',
        streaming: buildStreaming(props.streaming),
        selectable: props.selectable,
        onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
      });
    },
    onTap(e) {
      if (this.props.onTap) this.props.onTap(e);
    },
    onAppear(e) {
      if (this.props.onAppear) this.props.onAppear(e);
    },
  },
});
