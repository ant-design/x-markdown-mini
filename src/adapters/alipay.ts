import type { UnifiedNode } from '../types.js';
import { adaptNodes } from './adapt.js';
import { PLATFORM_ADAPTER_CONFIG } from './capabilities.js';

/**
 * 支付宝小程序 rich-text 适配器：
 * - 移除 selectable 与 class
 * - <ol start="N"> 移除 start（支付宝不支持）
 * - 图片 src 强制 https
 */
export function toAlipayNodes(nodes: UnifiedNode[]): UnifiedNode[] {
  return adaptNodes(nodes, PLATFORM_ADAPTER_CONFIG.alipay);
}
