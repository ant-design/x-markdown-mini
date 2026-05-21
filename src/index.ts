import type { Token } from 'marked';
import { XMarkdownMini } from './XMarkdownMini.js';
import type {
  MiniNode,
  XMarkdownMiniProps,
  XMarkdownMiniTokenProps,
} from './types.js';

const defaultInstance = new XMarkdownMini();

/**
 * Parses markdown into marked Token[] without platform rendering.
 */
export function parse(content: string): Token[] {
  return defaultInstance.parse(content);
}

/**
 * Pure JS entry. `render(markdown)` returns marked Token[].
 * Component/node rendering belongs to `renderNodes(props)`.
 */
export function render(content: string): Token[];
export function render(props: XMarkdownMiniTokenProps): Token[];
export function render(input: string | XMarkdownMiniTokenProps): Token[] {
  return typeof input === 'string'
    ? defaultInstance.render(input)
    : defaultInstance.render(input);
}

/**
 * Node rendering entry for mini-program components.
 * Use `new XMarkdownMini()` for concurrent streaming sources.
 */
export function renderNodes(props: XMarkdownMiniProps): MiniNode[] {
  return defaultInstance.renderNodes(props);
}

export { XMarkdownMini } from './XMarkdownMini.js';
export type { XMarkdownMiniOptions } from './XMarkdownMini.js';
export type { StreamingFixup } from './streaming/config.js';
export {
  alipayRenderer,
  getPlatformRenderer,
  resolvePlatform,
  tokensToAlipay,
  tokensToAlipayNodes,
  tokensToWechat,
  tokensToWechatNodes,
  wechatRenderer,
} from './platforms/index.js';
export type {
  Platform,
  PlatformCapabilities,
  PlatformInput,
  PlatformRenderer,
} from './platforms/index.js';
export type { LexerOptions } from './types.js';
export { StreamingProcessor } from './streaming/index.js';
export {
  flattenInlineTokens,
  type FlattenInlineTokensOptions,
  type InlineRun,
  type InlineRunKind,
} from './components/shared/flattenInlineTokens.js';
export type {
  MarkedExtension,
  MiniNode,
  RenderContext,
  SemanticStreamingConfig,
  StreamingConfig,
  Token,
  TokenRenderer,
  Tokens,
  XMarkdownMiniProps,
  XMarkdownMiniTokenProps,
} from './types.js';
