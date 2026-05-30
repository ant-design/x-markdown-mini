import { XMarkdownMini, Footnote } from '../../../index.js';
import type {
  MiniNode,
  StreamingConfig,
  XMarkdownExtension,
  MarkedExtension,
} from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';

declare const Component: (opts: Record<string, unknown>) => void;

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
    footnote: { type: Boolean, value: false },
  },
  data: {
    nodes: [] as MiniNode[],
    slotComponents: [] as string[],
  },
  md: null as XMarkdownMini | null,
  lifetimes: {
    attached(this: any) {
      this._build();
      this._render();
    },
    detached(this: any) {
      this.md?.reset();
      this.md = null;
    },
  },
  observers: {
    // `components` / `footnote` are baked into the marked instance, rebuild on change.
    'components, footnote'(this: any) {
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
      const footnote = !!this.data.footnote;
      const extensions = footnote ? [Footnote()] : [];
      this.md?.reset();
      this.md = new XMarkdownMini({ escapeText: false, components, extensions });
      const slotComponents = footnote ? components.concat(['footnote']) : components;
      this.setData({ slotComponents });
    },
    _render(this: any) {
      const data = this.data;
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
        onPatch: (nodes: MiniNode[]) =>
          this.setData({ nodes: flattenInlineNodes(nodes) }),
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