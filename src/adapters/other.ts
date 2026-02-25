import type { UnifiedNode } from '../types.js';

/**
 * 百度/QQ/快手/钉钉等：与微信类似，白名单微调。
 * 无 rich-text 的端可由此拿到统一节点后走通用递归组件（view/text）渲染。
 */
export function toOtherNodes(nodes: UnifiedNode[]): UnifiedNode[] {
  return nodes.map((n) => mapOne(n));
}

function mapOne(node: UnifiedNode): UnifiedNode {
  const { name, attrs = {}, children } = node;
  const mapped: UnifiedNode = {
    name: name.toLowerCase(),
    attrs: { ...attrs },
  };
  if (node.animate) mapped.animate = node.animate;
  if (children?.length) {
    mapped.children = children.map(mapOne);
  }
  return mapped;
}
