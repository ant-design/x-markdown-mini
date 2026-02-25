import type { UnifiedNode } from '../types.js';

/**
 * 支付宝小程序 rich-text 使用 array 结构，部分标签/属性命名有差异（如 Pascal、line-space 等）。
 * 将统一节点转为支付宝可用的节点数组。
 */
export function toAlipayNodes(nodes: UnifiedNode[]): UnifiedNode[] {
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
