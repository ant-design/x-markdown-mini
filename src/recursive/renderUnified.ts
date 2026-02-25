import type { UnifiedNode } from '../types.js';

/**
 * 无 rich-text 的端：用统一节点驱动「view / text」递归渲染的伪代码说明。
 * 实际各端需在对应 DSL（如 .axml/.wxml）里实现递归组件，此处仅做结构描述。
 *
 * 递归规则：
 * - name === 'text' 或仅有 value → 渲染为 <text>{{value}}</text>
 * - 其他 name → 渲染为 <view class="md-{{name}}"> + children 递归
 * - animate === 'block' → 根 view 加 class md-animate-block（由使用方 CSS 做淡入）
 */
export function describeRecursiveRender(node: UnifiedNode): string {
  if (node.name === 'text') {
    const value = (node.attrs?.value as string) ?? '';
    return `text: ${value}`;
  }
  const children = node.children?.map(describeRecursiveRender).join(', ') ?? '';
  return `${node.name}( ${children} )`;
}
