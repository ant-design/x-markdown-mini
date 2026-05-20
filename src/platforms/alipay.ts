import { tokensToAlipayNodes } from '../core/tokensToAlipay.js';
import type { PlatformRenderer } from './types.js';

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
