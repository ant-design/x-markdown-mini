import type { UnifiedNode } from '../types.js';
import { adaptNodes } from './adapt.js';
import { PLATFORM_ADAPTER_CONFIG } from './capabilities.js';

/**
 * 微信小程序 rich-text 适配器：
 * - 移除 selectable 与内部 class（rich-text 忽略内部 class，保留 <a> 的 md-link）
 * - <a href="..."> → <a data-href="..." class="md-link">（消费方需绑定 tap 跳转）
 * - 保留 <pre>、<table>、<blockquote>、<ol start>
 */
export function toWechatNodes(nodes: UnifiedNode[]): UnifiedNode[] {
  return adaptNodes(nodes, PLATFORM_ADAPTER_CONFIG.wechat);
}
