import type {
  XMarkdownMiniProps,
  UnifiedNode,
  LexerOptions,
  RenderContext,
  SemanticStreamingConfig,
  StreamingConfig,
} from './types.js';
import { resolvePlatform, type Platform } from './platform.js';
import { tokensToWechatNodes } from './core/tokensToWechat.js';
import { tokensToAlipayNodes } from './core/tokensToAlipay.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';
import { Marked, type Token, type MarkedExtension, type MarkedOptions } from 'marked';
import remend from 'remend';

/**
 * 流式 tail 预处理：
 * - 'remend'（默认）：用 vercel/remend 自动补全未闭合的 markdown 格式
 *   （**bold / `code` / [link]( / *italic / ~~del / $$math 等）
 * - false：关闭，未闭合格式按字面量渲染（v1 行为）
 * - 函数：自定义 tail 字符串预处理，签名 (tail: string) => string
 */
export type StreamingFixup = 'remend' | false | ((text: string) => string);

function resolveStreamingFixup(
  fixup: StreamingFixup,
): ((text: string) => string) | undefined {
  if (fixup === false) return undefined;
  if (fixup === 'remend') return (s: string) => remend(s);
  return fixup;
}

interface NormalizedStreamingConfig {
  hasNextChunk: boolean;
  semanticEnabled: boolean;
  semanticConfig: SemanticStreamingConfig;
  enableAnimation: boolean;
}

function normalizeStreamingConfig(
  streaming: XMarkdownMiniProps['streaming'],
): NormalizedStreamingConfig | null {
  if (!streaming) return null;

  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true,
      semanticConfig: {},
      enableAnimation: true,
    };
  }

  const cfg = streaming as StreamingConfig;
  const semantic = cfg.semantic ?? true;
  return {
    hasNextChunk: cfg.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: typeof semantic === 'object' ? semantic : {},
    enableAnimation: cfg.enableAnimation ?? true,
  };
}

export interface XMarkdownMiniOptions {
  /**
   * 是否对文本节点做 HTML 转义。默认 true（用于原生 rich-text）。
   * 自渲染组件路径应传 false（<text>{{value}}</text> 不解码实体）。
   */
  escapeText?: boolean;
  /**
   * 流式渲染时对未稳定 tail 的预处理策略。默认 'remend'（自动补全未闭合格式）。
   * 仅影响 streaming 路径，一次性 render 不受此影响。
   */
  streamingFixup?: StreamingFixup;
  /**
   * marked 词法器选项（gfm / breaks）。透传给 `parse()` 和内部 streaming 流程。
   */
  lexerOptions?: LexerOptions;
  /**
   * marked 扩展数组，等价于 `marked.use(ext1, ext2, ...)`。
   * 每个实例独立构造 `new Marked(...extensions)`，不污染全局。
   * 支持 tokenizer extensions / walkTokens / hooks 等所有 marked.use 字段。
   *
   * 自定义 tokenizer 产生的 token 会出现在 `parse(content)` 返回的 Token[] 中。
   * 在 streaming / render 路径下，未被 tokensTo{Wechat,Alipay}Nodes 识别的 token
   * 类型会被静默丢弃（v2.x 计划在组件层支持自定义 token 渲染）。
   */
  extensions?: MarkedExtension[];
}

function pickTokensToNodes(target: Platform): (tokens: Token[], ctx: RenderContext) => UnifiedNode[] {
  if (target === 'wechat') return tokensToWechatNodes;
  return tokensToAlipayNodes;
}

/**
 * 独立的渲染实例，持有自己的 streaming 状态。多个实例之间互不干扰，
 * 适合页面里同时挂多个 Markdown 组件 / 同时跑多路流式输出的场景。
 *
 * @example
 *   const md = new XMarkdownMini();
 *   md.render({ content: '##', streaming: true, onPatch });
 *   md.render({ content: '## Heading', streaming: { hasNextChunk: false }, onPatch });
 *
 * 顶层导出的 `render` 内部使用一个 default 实例——多路并发流式请改用 `new XMarkdownMini()`。
 */
export class XMarkdownMini {
  private streamProcessor: StreamingProcessor | null = null;
  private readonly escapeText: boolean;
  private readonly fixup: ((text: string) => string) | undefined;
  private readonly lexerOptions: LexerOptions;
  private readonly marked: Marked;

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.escapeText = opts.escapeText ?? true;
    this.fixup = resolveStreamingFixup(opts.streamingFixup ?? 'remend');
    this.lexerOptions = opts.lexerOptions ?? {};
    // Per-instance Marked isolates extensions from the global marked singleton.
    this.marked = new Marked(...(opts.extensions ?? []));
  }

  private buildMarkedOptions(perCall?: LexerOptions): MarkedOptions {
    const merged: LexerOptions = { ...this.lexerOptions, ...(perCall ?? {}) };
    // Spread this.marked.defaults so extensions/walkTokens/hooks registered via
    // constructor make it into the options that Marked#lexer forwards to Lexer.lex.
    // Without this spread, passing any options object replaces (not merges) defaults.
    return {
      ...this.marked.defaults,
      gfm: merged.gfm !== false,
      breaks: !!merged.breaks,
    };
  }

  /**
   * 解析 markdown 为 marked 原生 Token[]。
   *
   * 让用户拿到上游 IR：
   * - 给未原生支持的平台（抖音 / 百度等）写自己的渲染层时使用
   * - 接入 marked 生态的 walkTokens / 自定义 tokenizer 后看到自定义 token
   * - 调试 / 离线分析
   *
   * 不走流式补全（streamingFixup 仅作用于 streaming 路径）。
   */
  parse(content: string): Token[] {
    const tokens = this.marked.lexer(content, this.buildMarkedOptions());
    // marked.lexer 不像 marked.parse 那样自动跑 walkTokens 钩子；
    // 这里复刻 parseMarkdown 的行为，让 use({ walkTokens }) 在 parse() 路径下也生效。
    const walkFn = this.marked.defaults.walkTokens;
    if (typeof walkFn === 'function') {
      this.marked.walkTokens(tokens, walkFn);
    }
    return tokens;
  }

  /**
   * 主入口：根据 props 走一次性或流式渲染。
   * - 一次性：返回节点，并（若提供）调用一次 onPatch
   * - 流式：通过 onPatch 增量推送节点；返回空数组
   *
   * 内部用本实例的 Marked 词法器，extensions 自动透传到 lex 阶段。
   */
  render(props: XMarkdownMiniProps): UnifiedNode[] {
    const { content, platform = 'auto', selectable = true, options } = props;
    const target = resolvePlatform(platform);
    const stream = normalizeStreamingConfig(props.streaming);
    const perCallLexer = options as LexerOptions | undefined;
    const markedOpts = this.buildMarkedOptions(perCallLexer);
    const tokensToNodes = pickTokensToNodes(target);

    if (!stream) {
      // 切到一次性：清掉可能还在的流式 processor
      this.streamProcessor = null;
      props.onRenderStart?.();
      const ctx: RenderContext = {
        animation: false,
        selectable,
        escapeText: this.escapeText,
      };
      const tokens = this.marked.lexer(content, markedOpts);
      const nodes = tokensToNodes(tokens, ctx);
      props.onPatch?.(nodes);
      props.onRenderComplete?.();
      return nodes;
    }

    if (!this.streamProcessor) {
      const ctx: RenderContext = {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
      };
      const transform = (md: string): UnifiedNode[] =>
        tokensToNodes(this.marked.lexer(md, markedOpts), ctx);
      this.streamProcessor = new StreamingProcessor({
        transform,
        fixup: this.fixup,
        semanticEnabled: stream.semanticEnabled,
        ...stream.semanticConfig,
        onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
        onPatch: (nodes) => props.onPatch?.(nodes),
        onComplete: () => {
          props.onRenderComplete?.();
          this.streamProcessor = null;
        },
      });
      props.onRenderStart?.();
    }

    this.streamProcessor.handleContentUpdate(content);
    this.streamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }

  /** 主动重置流式状态（detached / unmount 时调用）。 */
  reset(): void {
    this.streamProcessor?.reset();
    this.streamProcessor = null;
  }
}

const defaultInstance = new XMarkdownMini();

/**
 * 全局便捷入口。内部使用一个 default `XMarkdownMini` 实例——
 * 多个调用方共享同一份流式状态。如需多路并发流式，请改用 `new XMarkdownMini()`。
 */
export function render(props: XMarkdownMiniProps): UnifiedNode[] {
  return defaultInstance.render(props);
}

export { resolvePlatform } from './platform.js';
export type { Platform, PlatformInput } from './platform.js';
export {
  tokensToWechat,
  tokensToWechatNodes,
  tokensToAlipay,
  tokensToAlipayNodes,
} from './core/index.js';
export type { LexerOptions } from './core/index.js';
export { StreamingProcessor } from './streaming/index.js';
export {
  flattenInlineTokens,
  type InlineRun,
  type InlineRunKind,
  type FlattenInlineTokensOptions,
} from './components/shared/flattenInlineTokens.js';
export type {
  XMarkdownMiniProps,
  UnifiedNode,
  RenderContext,
  SemanticStreamingConfig,
  StreamingConfig,
  Token,
  Tokens,
  MarkedExtension,
} from './types.js';
