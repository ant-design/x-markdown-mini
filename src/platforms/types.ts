import type { Token } from 'marked';
import type { RenderContext, MiniNode } from '../types.js';

export type BuiltinPlatform = 'wechat' | 'alipay';

export type Platform = BuiltinPlatform | (string & {});

export type PlatformInput = Platform | 'auto';

export interface PlatformCapabilities {
  supportsOlStart: boolean;
  requiresHttpsImage: boolean;
  anchorHrefMode: 'href' | 'data-href';
  supportsTable: boolean;
  supportsPre: boolean;
  supportsBlockquote: boolean;
}

export interface PlatformRenderer {
  name: Platform;
  capabilities: PlatformCapabilities;
  renderTokens(tokens: Token[], ctx: RenderContext): MiniNode[];
}
