export {};

declare const Component: (opts: Record<string, unknown>) => void;
declare const my: any;

interface AnyNode {
  name?: string;
  attrs?: { value?: string; [k: string]: unknown };
  children?: AnyNode[];
}

/** Concatenate all descendant text (used for code copy). */
function collectText(node: AnyNode | undefined): string {
  if (!node) return '';
  if (node.name === 'text') return (node.attrs && (node.attrs.value as string)) || '';
  if (node.name === 'br') return '\n';
  let out = '';
  const ch = node.children || [];
  for (let i = 0; i < ch.length; i++) out += collectText(ch[i]);
  return out;
}

/** Serialize a table node as TSV (tab-separated cells, newline-separated rows). */
function collectTableText(table: AnyNode | undefined): string {
  const rows = (table && table.children) || [];
  const lines: string[] = [];
  for (let r = 0; r < rows.length; r++) {
    const cells = rows[r].children || [];
    const cols: string[] = [];
    for (let c = 0; c < cells.length; c++) {
      cols.push(collectText(cells[c]).replace(/\s+/g, ' ').trim());
    }
    lines.push(cols.join('\t'));
  }
  return lines.join('\n');
}

function copyToClipboard(text: string): void {
  if (!text) return;
  my.setClipboard({
    text,
    success: () => my.showToast({ content: '已复制', duration: 1200 }),
    fail: () => my.showToast({ content: '复制失败' }),
  });
}

interface MiniNodeRendererProps {
  nodes: unknown[];
  selectable: boolean;
  animation: boolean;
  /** 自定义组件标签白名单：命中的节点交给宿主作用域插槽渲染。 */
  slotComponents: string[];
  onTap?: (e?: unknown) => void;
  onAppear?: (e?: unknown) => void;
}

const defaultProps: MiniNodeRendererProps = {
  nodes: [],
  selectable: true,
  animation: false,
  slotComponents: [],
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
    _copyCode(this: any, e: any) {
      copyToClipboard(collectText(e?.currentTarget?.dataset?.data as AnyNode));
    },
    _copyTable(this: any, e: any) {
      copyToClipboard(collectTableText(e?.currentTarget?.dataset?.data as AnyNode));
    },
  },
});
