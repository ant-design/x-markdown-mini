import { XMarkdownMini } from '../../../index.js';
import type {
  MarkedExtension,
  MiniNode,
  StreamingConfig,
  XMarkdownExtension,
} from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';

declare const Component: (opts: Record<string, unknown>) => void;

type ExtensionsProp = (XMarkdownExtension | MarkedExtension)[];

function buildInstance(extensions: ExtensionsProp | null): XMarkdownMini {
  return new XMarkdownMini({
    escapeText: false,
    extensions: extensions ?? undefined,
  });
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
  },
  data: {
    nodes: [] as MiniNode[],
  },
  md: null as XMarkdownMini | null,
  lifetimes: {
    attached(this: any) {
      this.md = buildInstance(this.data.extensions ?? null);
      this._render();
    },
    detached(this: any) {
      this.md?.reset();
      this.md = null;
    },
  },
  observers: {
    'content, streaming, selectable'(this: any) {
      if (this.md) this._render();
    },
    'extensions'(this: any) {
      if (this.md) {
        this.md.reset();
        this.md = buildInstance(this.data.extensions ?? null);
        this._render();
      }
    },
  },
  methods: {
    _render(this: any) {
      const data = this.data;
      this.md.renderNodes({
        content: data.content,
        platform: 'wechat',
        streaming: data.streaming as false | true | StreamingConfig,
        selectable: data.selectable,
        gfm: data.gfm ?? undefined,
        breaks: data.breaks ?? undefined,
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