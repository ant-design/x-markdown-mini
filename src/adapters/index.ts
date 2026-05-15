import type { UnifiedNode, Platform } from '../types.js';
import { adaptNodes } from './adapt.js';
import { PLATFORM_ADAPTER_CONFIG } from './capabilities.js';

/**
 * 入口：按 platform 选择适配配置并应用。
 */
export function adaptToPlatform(nodes: UnifiedNode[], platform: Platform): UnifiedNode[] {
  return adaptNodes(nodes, PLATFORM_ADAPTER_CONFIG[platform]);
}

export { adaptNodes } from './adapt.js';
export { toWechatNodes } from './wechat.js';
export { toAlipayNodes } from './alipay.js';
export { toDouyinNodes } from './douyin.js';
export { toOtherNodes } from './other.js';
export {
  PLATFORM_CAPABILITIES,
  PLATFORM_ADAPTER_CONFIG,
} from './capabilities.js';
export type { PlatformCapabilities, PlatformAdapterConfig } from './capabilities.js';
