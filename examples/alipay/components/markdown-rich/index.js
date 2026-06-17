// 示例本地包装组件：在组件内部 require 并 bake 插件（代码高亮 + KaTeX）。
// 插件返回的扩展对象带有 tokenizer / miniRenderer 函数，mini-program 的
// 属性绑定 / setData 会剥离函数，所以不能通过 <markdown extensions="{{...}}"> 传入。
const { XMarkdownMini, Footnote } = require('@ant-design/x-markdown-mini/dist/index.js');
const CodeHighlight = require('@ant-design/x-markdown-mini/dist/plugins/CodeHighlight/index.js').default;
const Latex = require('@ant-design/x-markdown-mini/dist/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('@ant-design/x-markdown-mini/dist/shared/flattenInline.js');

// 打字机 + 语义分块节奏在组件内组装（在组件里 bake，避免嵌套配置/正则跨 setData 被裁剪）。
// 对齐 markdown-x-mini：
// - delimiters 句读级语义分隔符（不含 \n），按句子成块而非按行；
// - maxChunkSize 限制超长无标点串；
// - charDelay 单字间隔（随块加速），chunkDelay 每个语义块之间的停顿。
// 真正的「逐字淡入」由 MiniNodeRenderer 的 .md-anim-char（CSS）完成，不受 setData 合帧影响。
const TYPEWRITER = {
  delimiters: /[。？！…；：，—]/,
  maxChunkSize: 18,
  charDelay: [60, 46, 36, 30, 26],
  chunkDelay: [340, 260, 180, 120],
};

// 把页面传来的简单 streaming 标记（{ hasNextChunk } / true / false）补全为完整流式配置。
// enableAnimation:false —— 关闭逐块淡入，统一用逐字淡入（animation 属性驱动），避免双重动画。
function buildStreaming(streaming) {
  if (!streaming) return false;
  const hasNextChunk = streaming === true ? true : !!streaming.hasNextChunk;
  return { hasNextChunk, enableAnimation: false, semantic: TYPEWRITER };
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
    animating: false,
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
      const animating = !!props.streaming;
      if (this.data.animating !== animating) this.setData({ animating });
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
