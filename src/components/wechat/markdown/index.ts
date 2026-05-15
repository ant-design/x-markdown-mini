import { runPipeline, StreamingProcessor } from '../../../index.js';
import type { UnifiedNode, StreamingConfig, SemanticStreamingConfig } from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';

declare const Component: (opts: Record<string, unknown>) => void;

interface StreamPlan {
  hasNextChunk: boolean;
  semanticEnabled: boolean;
  semanticConfig: SemanticStreamingConfig;
  enableAnimation: boolean;
}

function normalizeStreaming(streaming: false | true | StreamingConfig): StreamPlan | null {
  if (!streaming) return null;
  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true,
      semanticConfig: {},
      enableAnimation: true,
    };
  }
  const semantic = streaming.semantic ?? true;
  return {
    hasNextChunk: streaming.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: typeof semantic === 'object' ? semantic : {},
    enableAnimation: streaming.enableAnimation ?? true,
  };
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
    options: { type: null, value: null },
    className: { type: String, value: '' },
  },
  data: {
    nodes: [] as UnifiedNode[],
  },
  streamProcessor: null as StreamingProcessor | null,
  lifetimes: {
    attached(this: any) {
      this._render();
    },
    detached(this: any) {
      this.streamProcessor?.reset?.();
      this.streamProcessor = null;
    },
  },
  observers: {
    'content, streaming, selectable'(this: any) {
      this._render();
    },
  },
  methods: {
    _render(this: any) {
      const data = this.data;
      const stream = normalizeStreaming(data.streaming);
      if (!stream) {
        this.streamProcessor?.reset?.();
        this.streamProcessor = null;
        this.triggerEvent('renderstart');
        const nodes = runPipeline(data.content, {
          animation: false,
          selectable: data.selectable,
          lexerOptions: data.options ?? undefined,
          escapeText: false,
        });
        this.setData({ nodes: flattenInlineNodes(nodes) });
        this.triggerEvent('rendercomplete');
        return;
      }

      if (!this.streamProcessor) {
        this.streamProcessor = new StreamingProcessor({
          semanticEnabled: stream.semanticEnabled,
          ...stream.semanticConfig,
          animation: stream.enableAnimation,
          selectable: data.selectable,
          lexerOptions: data.options ?? undefined,
          escapeText: false,
          onUpdate: (markdown) => this.triggerEvent('renderprogress', { markdown }),
          onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
          onComplete: () => {
            this.triggerEvent('rendercomplete');
            this.streamProcessor = null;
          },
        });
        this.triggerEvent('renderstart');
      }

      this.streamProcessor.handleContentUpdate(data.content);
      this.streamProcessor.runRenderLoop(stream.hasNextChunk);
    },
    _tap(this: any, e: unknown) {
      this.triggerEvent('tap', e);
    },
    _appear(this: any, e: unknown) {
      this.triggerEvent('appear', e);
    },
  },
});
