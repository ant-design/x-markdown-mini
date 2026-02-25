import type { UnifiedNode } from '../types.js';

/**
 * 抖音小程序 rich-text 与微信结构一致，可扩展 video 等标签。
 * 直接复用统一节点，做浅拷贝与扩展预留。
 */
export function toDouyinNodes(nodes: UnifiedNode[]): UnifiedNode[] {
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
