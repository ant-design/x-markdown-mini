import type { MiniNode } from '../../index.js';

/**
 * 把 MiniNode[] 中所有 inline 子树 (strong/em/code/span) 折叠为一层 <text> 文本片段，
 * 类名沿祖先链合并。anchor (<a>) 和 image (<img>) 保留为独立节点。
 *
 * 原因：mini-program 的 <text> 不能内嵌自定义组件，所以模板无法递归通过 <text> 渲染
 * 任意深度的 strong/em；提前在 JS 层扁平化，模板只剩一层 inline。
 */
export function flattenInlineNodes(nodes: MiniNode[]): MiniNode[] {
  return nodes.map(walk);
}

const INLINE_TAGS: Record<string, true> = {
  strong: true,
  em: true,
  del: true,
  code: true,
  span: true,
};

const TAG_CLASS: Record<string, string> = {
  strong: 'md-strong',
  em: 'md-em',
  del: 'md-del',
  code: 'md-inline-code',
  // 'span' 不附加额外 class
};

function walk(node: MiniNode): MiniNode {
  if (!node.children || node.children.length === 0) return node;

  // anchor 自身保留，但其内部仍需扁平化
  if (node.name === 'a') {
    return { ...node, children: flattenChildren(node.children) };
  }

  // 已经是 inline 容器（strong/em/code/span）—— 不会出现在顶层 nodes 中（顶层都是 block），
  // 所以这里不专门处理；递归 walk 即可。
  return { ...node, children: flattenChildren(node.children) };
}

function flattenChildren(children: MiniNode[]): MiniNode[] {
  const out: MiniNode[] = [];
  for (const c of children) {
    flattenOne(c, '', out);
  }
  return out;
}

function flattenOne(n: MiniNode, classChain: string, out: MiniNode[]): void {
  // 叶子文本：合并 class 后产出 <text>
  if (n.name === 'text') {
    const value = (n.attrs?.value as string) ?? '';
    if (!value) return;
    const merged = mergeClass(classChain, n.attrs?.class as string | undefined);
    out.push({ name: 'text', attrs: merged ? { value, class: merged } : { value } });
    return;
  }
  if (n.name === 'br') {
    out.push({ name: 'br', attrs: {} });
    return;
  }

  // 保留型 inline：anchor、image —— 不折叠，但 anchor 的 children 仍需进一步展平
  if (n.name === 'a') {
    out.push({ ...n, children: flattenChildren(n.children ?? []) });
    return;
  }
  if (n.name === 'img') {
    out.push(n);
    return;
  }

  // 折叠型 inline：strong / em / code / span / 其它未知 —— 进入 children，沿用合并 class
  if (INLINE_TAGS[n.name]) {
    const next = mergeClass(
      classChain,
      n.attrs?.class as string | undefined,
      TAG_CLASS[n.name] ?? ''
    );
    for (const c of n.children ?? []) flattenOne(c, next, out);
    return;
  }

  // block 节点（理论上 inline 上下文不会出现，但保险起见 walk 后压入）
  out.push(walk(n));
}

function mergeClass(...parts: Array<string | undefined>): string {
  const seen = new Set<string>();
  for (const p of parts) {
    if (!p) continue;
    for (const tok of p.split(/\s+/)) {
      if (tok) seen.add(tok);
    }
  }
  return Array.from(seen).join(' ');
}
