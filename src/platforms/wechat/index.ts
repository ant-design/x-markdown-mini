import type { PlatformRenderer } from '../types.js';
import { tokensToWechatNodes, wechatCapabilities } from './tokensToWechat.js';

export const wechatRenderer: PlatformRenderer = {
  name: 'wechat',
  capabilities: wechatCapabilities,
  renderTokens: tokensToWechatNodes,
};
