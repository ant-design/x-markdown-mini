import type { UnifiedNode } from '../types.js';
import { adaptNodes } from './adapt.js';
import type { PlatformCapabilities, PlatformAdapterConfig } from './capabilities.js';

/**
 * 通用适配器：基于 PlatformCapabilities 能力矩阵降级。
 * - !preSupported: <pre> → <div class="md-code-block">
 * - !tableSupported: <table> 扁平化为 div 结构
 * - !blockquoteSupported: <blockquote> → <div class="md-blockquote">
 * - 移除 selectable / class
 * - httpsOnlyImages: 图片 http → https
 */
export function toOtherNodes(
  nodes: UnifiedNode[],
  caps: PlatformCapabilities,
  extra?: Partial<Omit<PlatformAdapterConfig, 'caps'>>
): UnifiedNode[] {
  return adaptNodes(nodes, { caps, classMode: 'strip', ...extra });
}
