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

interface MarkdownProps {
  content: string;
  streaming: false | true | StreamingConfig;
  selectable: boolean;
  gfm?: boolean;
  breaks?: boolean;
  className: string;
  extensions: ExtensionsProp | null;
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
};

function buildInstance(props: MarkdownProps): XMarkdownMini {
  return new XMarkdownMini({
    escapeText: false,
    extensions: props.extensions ?? undefined,
  });
}

Component({
  props: defaultProps,
  data: {
    nodes: [] as MiniNode[],
  },
  md: null as XMarkdownMini | null,

  didMount(this: any) {
    this.md = buildInstance(this.props);
    this._render(this.props);
  },

  didUpdate(this: any, prevProps: MarkdownProps) {
    const p = this.props as MarkdownProps;
    // Re-create XMarkdownMini when extensions change (the marked instance bakes them in at construction).
    if (prevProps.extensions !== p.extensions) {
      this.md?.reset();
      this.md = buildInstance(p);
    }
    if (
      prevProps.content !== p.content ||
      prevProps.streaming !== p.streaming ||
      prevProps.selectable !== p.selectable ||
      prevProps.extensions !== p.extensions
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
      this.md.renderNodes({
        content: props.content,
        platform: 'alipay',
        streaming: props.streaming,
        selectable: props.selectable,
        gfm: props.gfm,
        breaks: props.breaks,
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