import type { MiniNode } from '../../index.js';

export {
  createTextAnimationState,
  reconcileTextAnimation,
  resetTextAnimation,
} from './textAnimation.js';

/**
 * 把 MiniNode[] 中所有 inline 子树 (strong/em/code/span) 折叠为一层 <text> 文本片段，
 * 类名沿祖先链合并。anchor (<a>) 和 image (<img>) 保留为独立节点。
 *
 * 原因：mini-program 的 <text> 不能内嵌自定义组件，所以模板无法递归通过 <text> 渲染
 * 任意深度的 strong/em；提前在 JS 层扁平化，模板只剩一层 inline。
 */
export function flattenInlineNodes(nodes: MiniNode[]): MiniNode[] {
  const flat = nodes.map(walk);
  assignKeys(flat);
  return flat;
}

/**
 * 递归给每个节点（含 children 与 header 项）打上「兄弟内稳定下标」key。
 * 小程序 wx:for 的 wx:key 只能取 item 的属性名，不能引用 for-index 变量；缺了
 * 稳定唯一 key，流式每帧整树 setData 会让框架无法 diff 复用 → 整树重建 → 入场
 * 动画全体重播（整段闪）。下标对追加式流式是稳定的：已渲染节点 k 不变得以复用、
 * 不重播，只有新追加的节点/字符触发入场动画。
 */
function assignKeys(list: MiniNode[]): void {
  for (let i = 0; i < list.length; i++) {
    const n = list[i];
    n.k = i;
    if (n.children) assignKeys(n.children);
    if (n.header) assignKeys(n.header);
  }
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
  // 'code' 不在此处加类：行内 codespan 由 transformer 直接打 md-inline-code，
  // 而代码块内的 <code>（在 <pre> 中）不应带行内药丸底色。
  // 'span' 不附加额外 class
};

/**
 * 富内联子树（如 KaTeX 公式）依赖深层嵌套的 <span> + 内联 style 定位，
 * 一旦扁平化结构与 style 都会丢失。带 `katex` 类名的节点整棵保留，
 * 交给渲染器以嵌套 <view> 递归渲染。
 */
function isKatex(node: MiniNode): boolean {
  const cls = node.attrs?.class;
  return typeof cls === 'string' && cls.indexOf('katex') > -1;
}

function walk(node: MiniNode): MiniNode {
  if (isKatex(node)) return node;
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
    if (hasClass(merged, 'hljs') && value.indexOf('\n') >= 0) {
      const lines = value.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
          out.push({
            name: 'text',
            attrs: merged ? { value: lines[i], class: merged } : { value: lines[i] },
          });
        }
        if (i < lines.length - 1) out.push({ name: 'br', attrs: {} });
      }
      return;
    }
    out.push({ name: 'text', attrs: merged ? { value, class: merged } : { value } });
    return;
  }
  if (n.name === 'br') {
    out.push({ name: 'br', attrs: {} });
    return;
  }

  // KaTeX 富子树：整棵保留（含嵌套结构与 style），不折叠。
  if (isKatex(n)) {
    out.push(n);
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

function hasClass(className: string, target: string): boolean {
  return (` ${className} `).indexOf(` ${target} `) >= 0;
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
