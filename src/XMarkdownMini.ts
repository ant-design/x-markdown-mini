import { Marked, type MarkedExtension, type MarkedOptions, type Token } from 'marked';
import { getPlatformRenderer, resolvePlatform } from './platforms/index.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';
import {
  normalizeStreamingConfig,
  resolveStreamingFixup,
  type StreamingFixup,
} from './streaming/config.js';
import type {
  LexerOptions,
  MiniNode,
  Plugin,
  RenderContext,
  TokenRenderer,
  XMarkdownMiniProps,
  XMarkdownMiniTokenProps,
} from './types.js';

export interface XMarkdownMiniOptions {
  /**
   * Whether to escape text nodes. Defaults to true for native mini-program node output.
   * Custom component paths should pass false because <text>{{value}}</text>
   * does not decode HTML entities.
   */
  escapeText?: boolean;
  /**
   * Streaming tail fixup strategy. Defaults to 'remend'.
   * Only affects streaming paths; one-shot parse/render calls are untouched.
   */
  streamingFixup?: StreamingFixup;
  /**
   * Marked lexer options passed to parse() and internal streaming flows.
   */
  lexerOptions?: LexerOptions;
  /**
   * Per-instance marked extensions, equivalent to marked.use(ext1, ext2, ...).
   * This does not mutate the global marked singleton.
   */
  extensions?: MarkedExtension[];
  /**
   * Renderer hooks for custom marked extension tokens in the mini-program node
   * pipeline. This is the small-program equivalent of marked's HTML renderer.
   */
  tokenRenderers?: TokenRenderer[];
  /**
   * Self-contained plugins that bundle extensions with token renderers.
   * Flattened into `extensions` and `tokenRenderers` internally.
   */
  plugins?: Plugin[];
}

/**
 * Independent renderer instance with isolated streaming state.
 * Use one instance per concurrent streaming markdown source.
 */
export class XMarkdownMini {
  private tokenStreamProcessor: StreamingProcessor<Token> | null = null;
  private nodeStreamProcessor: StreamingProcessor<MiniNode> | null = null;
  private readonly escapeText: boolean;
  private readonly fixup: ((text: string) => string) | undefined;
  private readonly lexerOptions: LexerOptions;
  private readonly marked: Marked;
  private readonly tokenRenderers: readonly TokenRenderer[];

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.escapeText = opts.escapeText ?? true;
    this.fixup = resolveStreamingFixup(opts.streamingFixup ?? 'remend');
    this.lexerOptions = opts.lexerOptions ?? {};
    const allExtensions = [
      ...(opts.extensions ?? []),
      ...(opts.plugins?.flatMap((p) => p.extensions ?? []) ?? []),
    ];
    this.tokenRenderers = [
      ...(opts.tokenRenderers ?? []),
      ...(opts.plugins?.flatMap((p) => p.tokenRenderers ?? []) ?? []),
    ];
    this.marked = new Marked(...allExtensions);
  }

  private buildMarkedOptions(perCall?: LexerOptions): MarkedOptions {
    const merged: LexerOptions = { ...this.lexerOptions, ...(perCall ?? {}) };
    // Marked#lexer replaces defaults when an options object is passed, so merge
    // instance defaults explicitly to preserve extensions/walkTokens/hooks.
    return {
      ...this.marked.defaults,
      gfm: merged.gfm !== false,
      breaks: !!merged.breaks,
    };
  }

  private lex(content: string, opts?: MarkedOptions): Token[] {
    const tokens = this.marked.lexer(content, opts ?? this.buildMarkedOptions());
    const walkFn = this.marked.defaults.walkTokens;
    if (typeof walkFn === 'function') {
      this.marked.walkTokens(tokens, walkFn);
    }
    return tokens;
  }

  /**
   * Parses markdown into marked's native Token[] without platform rendering.
   */
  parse(content: string): Token[] {
    return this.lex(content, this.buildMarkedOptions());
  }

  /**
   * Pure JS entry. Returns marked Token[] for callers that render themselves.
   */
  render(content: string): Token[];
  render(props: XMarkdownMiniTokenProps): Token[];
  render(input: string | XMarkdownMiniTokenProps): Token[] {
    if (typeof input === 'string') return this.parse(input);
    return this.renderTokens(input);
  }

  /**
   * Token streaming entry. AI streaming fixup runs on markdown text before lex.
   */
  renderTokens(props: XMarkdownMiniTokenProps): Token[] {
    const { content, options } = props;
    const stream = normalizeStreamingConfig(props.streaming);
    const markedOpts = this.buildMarkedOptions(options as LexerOptions | undefined);

    if (!stream) {
      this.tokenStreamProcessor = null;
      props.onRenderStart?.();
      const tokens = this.lex(content, markedOpts);
      props.onPatch?.(tokens);
      props.onRenderComplete?.();
      return tokens;
    }

    if (!this.tokenStreamProcessor) {
      const transform = (md: string): Token[] => this.lex(md, markedOpts);
      this.tokenStreamProcessor = new StreamingProcessor<Token>({
        transform,
        fixup: this.fixup,
        semanticEnabled: stream.semanticEnabled,
        ...stream.semanticConfig,
        onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
        onPatch: (tokens) => props.onPatch?.(tokens),
        onComplete: () => {
          props.onRenderComplete?.();
          this.tokenStreamProcessor = null;
        },
      });
      props.onRenderStart?.();
    }

    this.tokenStreamProcessor.handleContentUpdate(content);
    this.tokenStreamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }

  /**
   * Component/node entry. Tokens are rendered by the selected platform renderer.
   */
  renderNodes(props: XMarkdownMiniProps): MiniNode[] {
    const { content, platform = 'auto', selectable = true, options } = props;
    const target = resolvePlatform(platform);
    const renderer = getPlatformRenderer(target);
    const stream = normalizeStreamingConfig(props.streaming);
    const markedOpts = this.buildMarkedOptions(options as LexerOptions | undefined);

    if (!stream) {
      this.nodeStreamProcessor = null;
      props.onRenderStart?.();
      const ctx: RenderContext = {
        animation: false,
        selectable,
        escapeText: this.escapeText,
        tokenRenderers: this.tokenRenderers,
      };
      const tokens = this.lex(content, markedOpts);
      const nodes = renderer.renderTokens(tokens, ctx);
      props.onPatch?.(nodes);
      props.onRenderComplete?.();
      return nodes;
    }

    if (!this.nodeStreamProcessor) {
      const ctx: RenderContext = {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
        tokenRenderers: this.tokenRenderers,
      };
      const transform = (md: string): MiniNode[] =>
        renderer.renderTokens(this.lex(md, markedOpts), ctx);
      this.nodeStreamProcessor = new StreamingProcessor<MiniNode>({
        transform,
        fixup: this.fixup,
        semanticEnabled: stream.semanticEnabled,
        ...stream.semanticConfig,
        onUpdate: (markdown) => props.onRenderProgress?.({ markdown }),
        onPatch: (nodes) => props.onPatch?.(nodes),
        onComplete: () => {
          props.onRenderComplete?.();
          this.nodeStreamProcessor = null;
        },
      });
      props.onRenderStart?.();
    }

    this.nodeStreamProcessor.handleContentUpdate(content);
    this.nodeStreamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }

  /** Resets streaming state, usually during component detach/unmount. */
  reset(): void {
    this.tokenStreamProcessor?.reset();
    this.nodeStreamProcessor?.reset();
    this.tokenStreamProcessor = null;
    this.nodeStreamProcessor = null;
  }
}
