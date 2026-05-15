import { runPipeline, StreamingProcessor } from '../../../index.js';
import type { UnifiedNode, StreamingConfig, SemanticStreamingConfig } from '../../../index.js';
import { flattenInlineNodes } from '../../shared/flattenInline.js';

declare const Component: (opts: Record<string, unknown>) => void;

interface MarkdownProps {
  content: string;
  streaming: false | true | StreamingConfig;
  selectable: boolean;
  options: Record<string, unknown> | null;
  className: string;
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
  options: null,
  className: '',
};

function normalizeStreaming(streaming: MarkdownProps['streaming']) {
  if (!streaming) return null;
  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true as boolean,
      semanticConfig: {} as SemanticStreamingConfig,
      enableAnimation: true,
    };
  }
  const semantic = streaming.semantic ?? true;
  return {
    hasNextChunk: streaming.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: typeof semantic === 'object' ? semantic : ({} as SemanticStreamingConfig),
    enableAnimation: streaming.enableAnimation ?? true,
  };
}

Component({
  props: defaultProps,
  data: {
    nodes: [] as UnifiedNode[],
  },
  streamProcessor: null as StreamingProcessor | null,

  didMount(this: any) {
    this._render(this.props);
  },

  didUpdate(this: any, prevProps: MarkdownProps) {
    const p = this.props as MarkdownProps;
    if (
      prevProps.content !== p.content ||
      prevProps.streaming !== p.streaming ||
      prevProps.selectable !== p.selectable
    ) {
      this._render(p);
    }
  },

  didUnmount(this: any) {
    this.streamProcessor?.reset?.();
    this.streamProcessor = null;
  },

  methods: {
    _render(this: any, props: MarkdownProps) {
      const stream = normalizeStreaming(props.streaming);
      if (!stream) {
        this.streamProcessor?.reset?.();
        this.streamProcessor = null;
        props.onRenderStart?.();
        const nodes = runPipeline(props.content, {
          animation: false,
          selectable: props.selectable,
          lexerOptions: props.options ?? undefined,
          escapeText: false,
        });
        this.setData({ nodes: flattenInlineNodes(nodes) });
        props.onRenderComplete?.();
        return;
      }

      if (!this.streamProcessor) {
        this.streamProcessor = new StreamingProcessor({
          semanticEnabled: stream.semanticEnabled,
          ...stream.semanticConfig,
          animation: stream.enableAnimation,
          selectable: props.selectable,
          lexerOptions: props.options ?? undefined,
          escapeText: false,
          onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
          onPatch: (nodes) => this.setData({ nodes: flattenInlineNodes(nodes) }),
          onComplete: () => {
            props.onRenderComplete?.();
            this.streamProcessor = null;
          },
        });
        props.onRenderStart?.();
      }

      this.streamProcessor.handleContentUpdate(props.content);
      this.streamProcessor.runRenderLoop(stream.hasNextChunk);
    },

    onTap(this: any, e: unknown) {
      this.props.onTap?.(e);
    },

    onAppear(this: any, e: unknown) {
      this.props.onAppear?.(e);
    },
  },
});
