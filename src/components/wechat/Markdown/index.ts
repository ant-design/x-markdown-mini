import { XMarkdownMini } from '../../../index.js';
import type { UnifiedNode, StreamingConfig } from '../../../index.js';
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
    options: { type: null, value: null },
    className: { type: String, value: '' },
  },
  data: {
    nodes: [] as UnifiedNode[],
  },
  md: null as XMarkdownMini | null,
  lifetimes: {
    attached(this: any) {
      this.md = new XMarkdownMini({ escapeText: false });
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
  },
  methods: {
    _render(this: any) {
      const data = this.data;
      this.md.render({
        content: data.content,
        platform: 'wechat',
        streaming: data.streaming as false | true | StreamingConfig,
        selectable: data.selectable,
        options: data.options ?? undefined,
        onRenderStart: () => this.triggerEvent('renderstart'),
        onRenderProgress: (payload: { markdown: string }) =>
          this.triggerEvent('renderprogress', payload),
        onRenderComplete: () => this.triggerEvent('rendercomplete'),
        onPatch: (nodes: UnifiedNode[]) =>
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
