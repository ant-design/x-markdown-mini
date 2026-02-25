import type { UnifiedNode } from '../types.js';
import type { Platform } from '../types.js';
import { toWechatNodes } from './wechat.js';
import { toAlipayNodes } from './alipay.js';
import { toDouyinNodes } from './douyin.js';
import { toOtherNodes } from './other.js';

export function adaptToPlatform(nodes: UnifiedNode[], platform: Platform): UnifiedNode[] {
  switch (platform) {
    case 'wechat':
      return toWechatNodes(nodes);
    case 'alipay':
      return toAlipayNodes(nodes);
    case 'douyin':
      return toDouyinNodes(nodes);
    default:
      return toOtherNodes(nodes);
  }
}

export { toWechatNodes } from './wechat.js';
export { toAlipayNodes } from './alipay.js';
export { toDouyinNodes } from './douyin.js';
export { toOtherNodes } from './other.js';
