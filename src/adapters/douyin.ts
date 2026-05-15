import type { UnifiedNode } from '../types.js';
import { adaptNodes } from './adapt.js';
import { PLATFORM_ADAPTER_CONFIG } from './capabilities.js';

/**
 * 抖音小程序 rich-text 适配器：
 * - 移除 selectable 与 class
 * - 图片 src 强制 https
 * - 保留 <video>（抖音独有能力）
 */
export function toDouyinNodes(nodes: UnifiedNode[]): UnifiedNode[] {
  return adaptNodes(nodes, PLATFORM_ADAPTER_CONFIG.douyin);
}
