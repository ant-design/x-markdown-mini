// 示例本地包装组件：在组件内部 require 并 bake 插件（代码高亮 + KaTeX）。
// 插件返回的扩展对象带有 tokenizer / miniRenderer 函数，mini-program 的
// 属性绑定 / setData 会剥离函数，所以不能通过 <markdown extensions="{{...}}"> 传入。
const { XMarkdownMini, Footnote } = require('../../dist/index.js');
const CodeHighlight = require('../../dist/plugins/CodeHighlight/index.js').default;
const Latex = require('../../dist/plugins/Latex/index.js').default;
const { flattenInlineNodes } = require('../../dist/shared/flattenInline.js');

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
        streaming: props.streaming,
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
