import { XMarkdownMini } from '../../../index.js';
import type {
  MiniNode,
  StreamingConfig,
  XMarkdownExtension,
  MarkedExtension,
} from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';
import {
  areKatexFontsReady,
  ensureKatexFonts,
  onKatexFontsReady,
} from '../../shared/loadKatexFonts.js';

declare const Component: (opts: Record<string, unknown>) => void;
// 运行时按需加载插件：插件扩展带 tokenizer/miniRenderer 等函数，无法通过属性绑定/
// setData 跨组件边界传入，所以在组件内部 require 并 bake（tsup 把这些 require 标为
// external，KaTeX/highlight.js 留在各自的 plugin bundle，不会打进组件 wrapper）。
declare const require: (id: string) => any;

// 仅在命中 latex/highlight 时才 require 对应插件——未开启的页面不为 KaTeX(~487KB) 付费。
function bakeExtensions(
  latex: boolean,
  highlight: boolean,
): (XMarkdownExtension | MarkedExtension)[] {
  const exts: (XMarkdownExtension | MarkedExtension)[] = [];
  if (highlight) exts.push(require('../../../plugins/CodeHighlight/index.js').default());
  if (latex)
    exts.push(
      require('../../../plugins/Latex/index.js').default({
        katexOptions: { throwOnError: false },
      }),
    );
  return exts;
}

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
  /** 开启内置 KaTeX 公式插件（组件内部 require + bake）。 */
  latex: boolean;
  /** 开启内置代码高亮插件（组件内部 require + bake）。 */
  highlight: boolean;
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
  latex: false,
  highlight: false,
};

function sameList(a: string[] | null, b: string[] | null): boolean {
  const x = a ?? [];
  const y = b ?? [];
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}

// 节点树里是否含 KaTeX（class 带 "katex"）——无公式则不折腾字体重排。
function hasKatexNodes(nodes: any[] | undefined): boolean {
  return !!nodes && nodes.some((node: any) =>
    !!node && (String((node.attrs || {}).class || '').indexOf('katex') > -1 ||
    hasKatexNodes(node.children)));
}

Component({
  props: defaultProps,
  data: {
    nodes: [] as MiniNode[],
    slotComponents: [] as string[],
    animation: false,
    // KaTeX 字体就绪后用它做一次「卸载-重挂」强制重排：字体经 loadFontFace 异步注册，已渲染的
    // 公式 <text> 不会自动重绘，toggle 一下 a:if 让渲染子树重挂、用已就绪的字体重画。
    katexReflow: true,
  },
  md: null as XMarkdownMini | null,
  mounted: false,
  // 每实例最多重排一次；_katexReflowArmed 防止流式空闲期重复注册回调；_isStreaming 用于 C1：
  // 流式进行中不做显式重排（下一个 chunk 会自然用已就绪字体重绘），只在空闲/完成态补一次。
  _katexReflowed: false,
  _katexReflowArmed: false,
  _isStreaming: false,

  didMount(this: any) {
    this.mounted = true;
    this._build(this.props);
    this._render(this.props);
  },

  didUpdate(this: any, prevProps: MarkdownProps) {
    const p = this.props as MarkdownProps;
    // `components` / `latex` / `highlight` 都 bake 进 marked 实例（构造时），
    // 任一变化都需要重建 XMarkdownMini 实例。
    if (
      !sameList(prevProps.components, p.components) ||
      prevProps.latex !== p.latex ||
      prevProps.highlight !== p.highlight
    ) {
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
    this.mounted = false;
    this.md?.reset();
    this.md = null;
  },

  methods: {
    _build(this: any, props: MarkdownProps) {
      const components = props.components ?? [];
      // 仅在开启 latex 时注册 KaTeX 字体（支付宝走白名单 CDN ttf）。重排交给 _maybeKatexReflow：
      // 每实例至多一次、且仅当字体尚未就绪 + 非流式进行中，避免每个 chunk 全页闪。
      if (props.latex) {
        this._katexReflowed = false;
        this._katexReflowArmed = false;
        ensureKatexFonts();
      }
      const extensions = bakeExtensions(!!props.latex, !!props.highlight);
      this.md?.reset();
      this.md = new XMarkdownMini({ escapeText: false, components, extensions });
      this.setData({ slotComponents: components });
    },

    _render(this: any, props: MarkdownProps) {
      const streamConfig = props.streaming;
      const animation = streamConfig === true || (
        !!streamConfig && typeof streamConfig === 'object' &&
        streamConfig.enableAnimation !== false
      );
      // 流式进行中（还有后续 chunk）时不做显式重排；空闲/完成态（hasNextChunk===false 或
      // streaming===false）再补一次，配合 _maybeKatexReflow 的 C1 守卫消除那一次闪。
      this._isStreaming = streamConfig === true || (
        !!streamConfig && typeof streamConfig === 'object' &&
        streamConfig.hasNextChunk !== false
      );
      this.setData({ animation });
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
        onPatch: (nodes: MiniNode[]) => {
          if (this.mounted) {
            this.setData({ nodes: flattenInlineNodes(nodes) });
            this._maybeKatexReflow();
          }
        },
      });
    },

    // 每实例至多重排一次：无公式 / 字体已就绪（首屏即正确）/ 流式进行中，均直接跳过——这是消除
    // 「每个 chunk 全页闪」的核心。仅当「有公式 + 字体尚未就绪 + 已进入空闲态」时注册一次就绪回调。
    _maybeKatexReflow(this: any) {
      if (this._katexReflowed || this._katexReflowArmed) return;
      if (!hasKatexNodes(this.data.nodes)) return;
      if (areKatexFontsReady()) { this._katexReflowed = true; return; }
      if (this._isStreaming) return;
      this._katexReflowArmed = true;
      onKatexFontsReady(() => {
        this._katexReflowArmed = false;
        if (!this.mounted || this._katexReflowed || this._isStreaming) return;
        this._katexReflowed = true;
        this._katexFontReflow();
      });
    },

    // KaTeX 字体就绪后强制重排：卸载再重挂渲染子树，让公式 <text> 用已注册的字体重绘。
    _katexFontReflow(this: any) {
      if (!this.mounted) return;
      if (!this.data.nodes || this.data.nodes.length === 0) return;
      this.setData({ katexReflow: false }, () => {
        if (this.mounted) this.setData({ katexReflow: true });
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
