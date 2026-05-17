export {};

declare const Component: (opts: Record<string, unknown>) => void;

interface RichTextProps {
  nodes: unknown[];
  selectable: boolean;
  animation: boolean;
  onTap?: (e?: unknown) => void;
  onAppear?: (e?: unknown) => void;
}

const defaultProps: RichTextProps = {
  nodes: [],
  selectable: true,
  animation: false,
};

Component({
  props: defaultProps,
  methods: {
    _tap(this: any, e: unknown) {
      this.props.onTap?.(e);
    },
    _appear(this: any, e: unknown) {
      this.props.onAppear?.(e);
    },
  },
});
