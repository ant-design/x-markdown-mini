import { Marked, type MarkedExtension, type MarkedOptions, type Token, type Tokens } from 'marked';
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
  XMarkdownExtension,
  XMarkdownMiniProps,
  XMarkdownMiniTokenProps,
  XMarkdownTokenizerExtension,
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
   * Per-instance extensions. Accepts either the colocated
   * `XMarkdownExtension` shape (tokenizer + `miniRenderer` / `renderer` on the
   * same object — preferred) or a plain `MarkedExtension` (for community
   * marked plugins that only emit HTML). All entries are forwarded to
   * `new Marked(...)`; the new fields (`miniRenderer`) are ignored by marked.
   */
  extensions?: (XMarkdownExtension | MarkedExtension)[];
  /**
   * @deprecated Prefer colocating renderers on `XMarkdownExtension.extensions[].miniRenderer`.
   * Kept for backward compatibility. Renderer hooks for custom marked
   * extension tokens in the mini-program node pipeline. This is the
   * small-program equivalent of marked's HTML renderer.
   */
  tokenRenderers?: TokenRenderer[];
  /**
   * @deprecated Prefer returning an `XMarkdownExtension` and passing it via
   * `extensions`. Self-contained plugins that bundle extensions with token
   * renderers — flattened into `extensions` and `tokenRenderers` internally.
   */
  plugins?: Plugin[];
  /**
   * Whitelist of literal custom-component tags allowed in Markdown source.
   * For each entry, an internal inline tokenizer is synthesized that matches
   * `<tag attrs>inner</tag>` (or `<tag attrs />`) and emits a MiniNode whose
   * `name` is the tag and whose `children` are the recursively rendered
   * inner inline tokens.
   *
   * Tags NOT in this list fall through to marked's built-in `html` token
   * handling. Self-closing and empty tags omit `children`.
   *
   * @example
   * ```ts
   * new XMarkdownMini({ components: ['ant-button', 'ant-icon'] });
   * // "<ant-button type=\"primary\">OK</ant-button>" → MiniNode tree
   * ```
   *
   * Limitations: this PoC uses non-greedy matching, so nested same-tag
   * occurrences (e.g. `<x><x>…</x></x>`) match against the innermost
   * `</x>` and will not produce a nested structure.
   */
  components?: string[];
}

// --- Attribute parsing for `components: string[]` sugar ---------------------
//
// Parses an attribute string like ` type="primary" disabled size='lg' foo=bar`
// into `{ type: 'primary', disabled: true, size: 'lg', foo: 'bar' }`.
// Order-independent; supports name="v", name='v', name=v (unquoted), and
// boolean shorthand (`disabled` → true).
const ATTR_RE = /([a-zA-Z_][a-zA-Z0-9_:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

function parseAttrs(src: string): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  if (!src) return out;
  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(src)) !== null) {
    const name = m[1];
    const value = m[2] ?? m[3] ?? m[4];
    out[name] = value === undefined ? true : value;
  }
  return out;
}

/**
 * Build a synthesized XMarkdownExtension that registers one inline tokenizer
 * per whitelisted tag. Used by the `components: string[]` constructor sugar.
 *
 * Each tokenizer matches `<tag( attrs)?( /)?>` (self-closing) or
 * `<tag( attrs)?>…</tag>` (non-greedy — see component limitation note).
 * The miniRenderer emits `{ name: tag, attrs, children: ctx.renderInlineTokens?.(tokens) ?? [] }`.
 */
function synthesizeComponentsExtension(tags: string[]): XMarkdownExtension {
  const entries: XMarkdownTokenizerExtension[] = tags.map((tag) => {
    // Escape tag for safe inclusion in a regex (custom-component tags are
    // typically [a-z0-9-], but be defensive).
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match: <tag( attrs)?( /)?>(...)</tag>
    // - Group 1: attribute string (without leading space), possibly empty
    // - Group 2: '/' when self-closing (no inner content / closer)
    // - Group 3: inner content (only when not self-closing)
    const tagRe = new RegExp(
      `^<${safeTag}(?:\\s+([^>]*?))?\\s*(\\/)?>(?:([\\s\\S]*?)<\\/${safeTag}>)?`,
    );

    return {
      name: `customTag:${tag}`,
      level: 'inline',
      start(src: string) {
        const i = src.indexOf(`<${tag}`);
        return i < 0 ? undefined : i;
      },
      tokenizer(this: any, src: string): Tokens.Generic | undefined {
        const m = tagRe.exec(src);
        if (!m) return undefined;
        const attrsStr = m[1] ?? '';
        const selfClosing = m[2] === '/';
        const inner = selfClosing ? '' : (m[3] ?? '');
        // If neither self-closing nor closer matched (group 3 undefined),
        // bail — marked will fall back to its built-in html tokenizer.
        if (!selfClosing && m[3] === undefined) return undefined;
        const attrs = parseAttrs(attrsStr);
        const innerTokens: Token[] = [];
        if (inner.length > 0 && typeof this?.lexer?.inlineTokens === 'function') {
          this.lexer.inlineTokens(inner, innerTokens);
        }
        return {
          type: `customTag:${tag}`,
          raw: m[0],
          tag,
          attrs,
          tokens: innerTokens,
        } as unknown as Tokens.Generic;
      },
      miniRenderer(token, ctx): MiniNode {
        const t = token as unknown as {
          tag: string;
          attrs: Record<string, string | boolean>;
          tokens?: Token[];
        };
        const node: MiniNode = { name: t.tag };
        if (t.attrs && Object.keys(t.attrs).length > 0) {
          node.attrs = t.attrs as Record<string, string | number | boolean>;
        }
        const inner = t.tokens && t.tokens.length > 0
          ? (ctx.renderInlineTokens?.(t.tokens) ?? [])
          : [];
        if (inner.length > 0) node.children = inner;
        return node;
      },
    };
  });

  return { extensions: entries };
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
  private readonly extensions: readonly XMarkdownExtension[];

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.escapeText = opts.escapeText ?? true;
    this.fixup = resolveStreamingFixup(opts.streamingFixup ?? 'remend');
    this.lexerOptions = opts.lexerOptions ?? {};

    // Extensions can be either XMarkdownExtension (colocated miniRenderer)
    // or plain MarkedExtension. Both shapes share the same `extensions: [...]`
    // outer key so marked accepts them uniformly; the new fields on the
    // inner tokenizer entries are simply unknown to marked and ignored.
    const directExtensions: (XMarkdownExtension | MarkedExtension)[] =
      opts.extensions ?? [];
    // `components: string[]` sugar: synthesize one internal XMarkdownExtension
    // with N tokenizer entries (one per tag). Appended at the END so that
    // user-registered extensions with the same `name` (e.g.
    // `customTag:ant-button`) win — the resolution loop in
    // `customTokenRenderer.ts` is first-match-wins.
    const componentsExtension =
      opts.components && opts.components.length > 0
        ? synthesizeComponentsExtension(opts.components)
        : undefined;
    // Legacy `plugins` array: Plugin.extensions is MarkedExtension[]. But for
    // back-compat with plugin authors who already migrated to return
    // XMarkdownExtension (e.g. Latex), accept their objects through the same
    // path — they still satisfy MarkedExtension structurally (marked ignores
    // unknown fields on tokenizer entries).
    const pluginMarkedExtensions: MarkedExtension[] =
      opts.plugins?.flatMap((p) => p.extensions ?? []) ?? [];
    const allMarkedExtensions: MarkedExtension[] = [
      ...(directExtensions as MarkedExtension[]),
      ...pluginMarkedExtensions,
      ...(componentsExtension ? [componentsExtension as MarkedExtension] : []),
    ];

    // Both XMarkdownExtension and MarkedExtension share the same outer
    // `extensions: [...]` field, so `renderCustomToken` can walk all of
    // them uniformly. The custom-token resolver inspects each inner
    // tokenizer entry for `miniRenderer` / `renderer` (functions); plain
    // MarkedExtension entries simply lack `miniRenderer`, and their
    // `renderer` shape is an object (not a function) so the typeof check
    // correctly skips them. Include plugins[] entries too so plugin authors
    // who migrate to XMarkdownExtension still work via the deprecated path.
    this.extensions = [
      ...(directExtensions as XMarkdownExtension[]),
      ...((opts.plugins?.flatMap((p) => p.extensions ?? []) ?? []) as XMarkdownExtension[]),
      ...(componentsExtension ? [componentsExtension] : []),
    ];

    this.tokenRenderers = [
      ...(opts.tokenRenderers ?? []),
      ...(opts.plugins?.flatMap((p) => p.tokenRenderers ?? []) ?? []),
    ];
    this.marked = new Marked(...allMarkedExtensions);
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
        extensions: this.extensions,
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
        extensions: this.extensions,
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
