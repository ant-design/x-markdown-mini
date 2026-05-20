import { XMarkdownMini } from '../../../index.js';
import type { UnifiedNode, StreamingConfig } from '../../../index.js';
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

Component({
  props: defaultProps,
  data: {
    nodes: [] as UnifiedNode[],
  },
  md: null as XMarkdownMini | null,

  didMount(this: any) {
    this.md = new XMarkdownMini({ escapeText: false });
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
    this.md?.reset();
    this.md = null;
  },

  methods: {
    _render(this: any, props: MarkdownProps) {
      this.md.render({
        content: props.content,
        platform: 'alipay',
        streaming: props.streaming,
        selectable: props.selectable,
        options: props.options ?? undefined,
        onRenderStart: () => props.onRenderStart?.(),
        onRenderProgress: (payload: { markdown: string }) =>
          props.onRenderProgress?.(payload),
        onRenderComplete: () => props.onRenderComplete?.(),
        onPatch: (nodes: UnifiedNode[]) =>
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
