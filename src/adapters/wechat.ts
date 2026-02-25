import type { UnifiedNode } from '../types.js';

/**
 * 微信小程序 rich-text 的 nodes 与统一节点结构基本一致（小写 name/attrs）。
 * 仅做标签白名单与属性兼容，直接返回副本。
 * 微信支持：div, span, p, a, img, b, i, strong, em, code, pre, blockquote, ul, ol, li, h1-h6, hr, table, thead, tbody, tr, th, td 等
 */
export function toWechatNodes(nodes: UnifiedNode[]): UnifiedNode[] {
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
