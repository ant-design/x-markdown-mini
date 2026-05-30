import { XMarkdownMini, Footnote } from '../../../index.js';
import type {
  MiniNode,
  StreamingConfig,
  XMarkdownExtension,
  MarkedExtension,
} from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';

declare const Component: (opts: Record<string, unknown>) => void;

interface MarkdownProps {
  content: string;
  streaming: false | true | StreamingConfig;
  selectable: boolean;
  gfm?: boolean;
  breaks?: boolean;
  className: string;
  extensions: (XMarkdownExtension | MarkedExtension)[] | null;
  /** 自定义组件标签白名单，命中的 <tag> 交给页面作用域插槽渲染。 */
  components: string[] | null;
  /** 开启内置脚注扩展（`[^标签:内容]`）。脚注 marker 走作用域插槽，由页面渲染。 */
  footnote: boolean;
  onTap?: (e?: unknown) => void;
  onAppear?: (e?: unknown) => void;
  onRenderStart?: () => void;
  onRenderProgress?: (payload: { markdown: string }) => void;
  onRenderComplete?: () => void;
}

const defaultProps: MarkdownProps = {
  content: '',
  streaming: false,
  selectable: true,
  className: '',
  extensions: null,
  components: null,
  footnote: false,
};

function sameList(a: string[] | null, b: string[] | null): boolean {
  const x = a ?? [];
  const y = b ?? [];
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}

Component({
  props: defaultProps,
  data: {
    nodes: [] as MiniNode[],
    slotComponents: [] as string[],
  },
  md: null as XMarkdownMini | null,

  didMount(this: any) {
    this._build(this.props);
    this._render(this.props);
  },

  didUpdate(this: any, prevProps: MarkdownProps) {
    const p = this.props as MarkdownProps;
    // `components` / `footnote` are baked into the marked instance at
    // construction, so a change requires rebuilding the XMarkdownMini instance.
    if (!sameList(prevProps.components, p.components) || prevProps.footnote !== p.footnote) {
      this._build(p);
      this._render(p);
      return;
    }
    if (
      prevProps.content !== p.content ||
      prevProps.streaming !== p.streaming ||
      prevProps.selectable !== p.selectable ||
      prevProps.extensions !== p.extensions ||
      prevProps.gfm !== p.gfm ||
      prevProps.breaks !== p.breaks
    ) {
      this._render(p);
    }
  },

  didUnmount(this: any) {
    this.md?.reset();
    this.md = null;
  },

  methods: {
    _build(this: any, props: MarkdownProps) {
      const components = props.components ?? [];
      const extensions = props.footnote ? [Footnote()] : [];
      this.md?.reset();
      this.md = new XMarkdownMini({ escapeText: false, components, extensions });
      // 脚注节点（name: 'footnote'）也走 slot 路由交给页面渲染 marker + popover。
      const slotComponents = props.footnote ? components.concat(['footnote']) : components;
      this.setData({ slotComponents });
    },

    _render(this: any, props: MarkdownProps) {
      this.md.renderNodes({
        content: props.content,
        platform: 'alipay',
        streaming: props.streaming,
        selectable: props.selectable,
        gfm: props.gfm,
        breaks: props.breaks,
        extensions: props.extensions ?? undefined,
        onRenderStart: () => props.onRenderStart?.(),
        onRenderProgress: (payload: { markdown: string }) =>
          props.onRenderProgress?.(payload),
        onRenderComplete: () => props.onRenderComplete?.(),
        onPatch: (nodes: MiniNode[]) =>
          this.setData({ nodes: flattenInlineNodes(nodes) }),
      });
    },

    onTap(this: any, e: unknown) {
      this.props.onTap?.(e);
    },

    onAppear(this: any, e: unknown) {
      this.props.onAppear?.(e);
    },
  },
});