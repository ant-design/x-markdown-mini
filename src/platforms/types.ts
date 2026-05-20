import type { Token } from 'marked';
import type { Platform } from '../platform.js';
import type { RenderContext, MiniNode } from '../types.js';

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
