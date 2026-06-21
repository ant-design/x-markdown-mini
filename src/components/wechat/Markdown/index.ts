import { XMarkdownMini } from '../../../index.js';
import type {
  MiniNode,
  StreamingConfig,
  XMarkdownExtension,
  MarkedExtension,
} from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';
import {
  createTextAnimationState,
  reconcileTextAnimation,
  resetTextAnimation,
} from '../../shared/textAnimation.js';

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

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  properties: {
    content: { type: String, value: '' },
    streaming: { type: null, value: false },
    selectable: { type: Boolean, value: true },
    gfm: { type: null, value: null },
    breaks: { type: null, value: null },
    className: { type: String, value: '' },
    extensions: { type: null, value: null },
    components: { type: null, value: null },
    // 开启内置插件（组件内部 require + bake），无需页面传入函数型扩展。
    latex: { type: Boolean, value: false },
    highlight: { type: Boolean, value: false },
  },
  data: {
    nodes: [] as MiniNode[],
    slotComponents: [] as string[],
    animation: false,
  },
  md: null as XMarkdownMini | null,
  textAnimation: createTextAnimationState(),
  lifetimes: {
    attached(this: any) {
      this.textAnimation = createTextAnimationState();
      this._build();
      this._render();
    },
    detached(this: any) {
      this.md?.reset();
      resetTextAnimation(this.textAnimation);
      this.md = null;
    },
  },
  observers: {
    // `components` / `latex` / `highlight` 都 bake 进 marked 实例，变更需重建。
    'components, latex, highlight'(this: any) {
      if (this.md) {
        this._build();
        this._render();
      }
    },
    'content, streaming, selectable, extensions, gfm, breaks'(this: any) {
      if (this.md) this._render();
    },
  },
  methods: {
    _build(this: any) {
      const components = (this.data.components as string[] | null) ?? [];
      const extensions = bakeExtensions(!!this.data.latex, !!this.data.highlight);
      this.md?.reset();
      resetTextAnimation(this.textAnimation);
      this.md = new XMarkdownMini({ escapeText: false, components, extensions });
      this.setData({ slotComponents: components });
    },
    _render(this: any) {
      const data = this.data;
      this.setData({ animation: !!data.streaming });
      this.md.renderNodes({
        content: data.content,
        platform: 'wechat',
        streaming: data.streaming as false | true | StreamingConfig,
        selectable: data.selectable,
        gfm: data.gfm ?? undefined,
        breaks: data.breaks ?? undefined,
        extensions: (data.extensions as (XMarkdownExtension | MarkedExtension)[] | null) ?? undefined,
        onRenderStart: () => this.triggerEvent('renderstart'),
        onRenderProgress: (payload: { markdown: string }) =>
          this.triggerEvent('renderprogress', payload),
        onRenderComplete: () => this.triggerEvent('rendercomplete'),
        onPatch: (nodes: MiniNode[]) => {
          const flat = flattenInlineNodes(nodes);
          if (!data.streaming) resetTextAnimation(this.textAnimation);
          this.setData({
            nodes: data.streaming
              ? reconcileTextAnimation(flat, this.textAnimation)
              : flat,
          });
        },
      });
    },
    _tap(this: any, e: unknown) {
      this.triggerEvent('tap', e);
    },
    _appear(this: any, e: unknown) {
      this.triggerEvent('appear', e);
    },
  },
});
