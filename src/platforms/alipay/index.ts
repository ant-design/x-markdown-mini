import type { PlatformRenderer } from '../types.js';
import { tokensToAlipayNodes } from './tokensToAlipay.js';

export const alipayRenderer: PlatformRenderer = {
  name: 'alipay',
  capabilities: {
    supportsOlStart: false,
    requiresHttpsImage: true,
    anchorHrefMode: 'href',
    supportsTable: true,
    supportsPre: true,
    supportsBlockquote: true,
  },
  renderTokens: tokensToAlipayNodes,
};
