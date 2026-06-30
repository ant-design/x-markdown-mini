import type { PlatformRenderer } from '../types.js';
import { alipayCapabilities, tokensToAlipayNodes } from './tokensToAlipay.js';

export const alipayRenderer: PlatformRenderer = {
  name: 'alipay',
  capabilities: alipayCapabilities,
  renderTokens: tokensToAlipayNodes,
};
