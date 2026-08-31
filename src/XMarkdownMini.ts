import { Marked, type MarkedExtension, type MarkedOptions, type Token, type Tokens } from 'marked';
import { detailsExtension } from './extensions/details.js';
import { getPlatformRenderer, resolvePlatform } from './platforms/index.js';
import { StreamingProcessor } from './streaming/StreamingProcessor.js';
import {
  normalizeStreamingConfig,
  resolveStreamingFixup,
  type StreamingFixup,
} from './streaming/config.js';
import type {
  MiniNode,
  RenderContext,
  CodeHeaderRenderer,
  TableHeaderRenderer,
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
  /** GFM 表格、删除线、自动换行（默认 true） */
  gfm?: boolean;
  /** 软换行 \n 解析为 <br>（默认 false） */
  breaks?: boolean;
  /**
   * Per-instance extensions. Accepts either the colocated
   * `XMarkdownExtension` shape (tokenizer + `miniRenderer` / `renderer` on the
   * same object — preferred) or a plain `MarkedExtension` (for community
   * marked plugins that only emit HTML). All entries are forwarded to
   * `new Marked(...)`; the new fields (`miniRenderer`) are ignored by marked.
   * Can be overridden per render call via `renderNodes({ extensions })` /
   * `renderTokens({ extensions })`.
   */
  extensions?: (XMarkdownExtension | MarkedExtension)[];
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
  /** 代码块 header。true=默认（语言名+复制按钮）；false=无；函数=自定义。默认 true。 */
  codeBlock?: { header?: boolean | CodeHeaderRenderer };
  /** 表格 header。true=默认（“表格”+复制按钮）；false=无；函数=自定义。默认 true。 */
  table?: { header?: boolean | TableHeaderRenderer };
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
        const node: MiniNode = { name: t.tag, tag: t.tag };
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
  private readonly gfm: boolean | undefined;
  private readonly breaks: boolean | undefined;
  private readonly codeHeader: boolean | CodeHeaderRenderer | undefined;
  private readonly tableHeader: boolean | TableHeaderRenderer | undefined;
  private readonly marked: Marked;
  private activeTokenStreamDefaults: MarkedOptions | null = null;
  private activeNodeStreamDefaults: MarkedOptions | null = null;
  /** Instance-level user extensions (from constructor options). */
  private readonly extensions: readonly XMarkdownExtension[];
  /** Components extension synthesized from `opts.components`, kept separate so
   *  per-call extensions can override user extensions but keep components. */
  private readonly componentsExtension: XMarkdownExtension | undefined;

  constructor(opts: XMarkdownMiniOptions = {}) {
    this.escapeText = opts.escapeText ?? true;
    this.fixup = resolveStreamingFixup(opts.streamingFixup ?? 'remend');
    this.gfm = opts.gfm;
    this.breaks = opts.breaks;
    this.codeHeader = opts.codeBlock?.header;
    this.tableHeader = opts.table?.header;

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
    this.componentsExtension =
      opts.components && opts.components.length > 0
        ? synthesizeComponentsExtension(opts.components)
        : undefined;
    // Built-in <details> block tokenizer registered FIRST: marked unshifts
    // block tokenizers per use() call, so later (user) registrations still
    // run before it and can take over the token.
    const allMarkedExtensions: MarkedExtension[] = [
      detailsExtension as MarkedExtension,
      ...(directExtensions as MarkedExtension[]),
      ...(this.componentsExtension ? [this.componentsExtension as MarkedExtension] : []),
    ];

    // Both XMarkdownExtension and MarkedExtension share the same outer
    // `extensions: [...]` field, so `renderCustomToken` can walk all of
    // them uniformly. The custom-token resolver inspects each inner
    // tokenizer entry for `miniRenderer` / `renderer` (functions); plain
    // MarkedExtension entries simply lack `miniRenderer`, and their
    // `renderer` shape is an object (not a function) so the typeof check
    // correctly skips them.
    this.extensions = directExtensions as XMarkdownExtension[];

    this.marked = new Marked(...allMarkedExtensions);
  }

  /**
   * Build the full RenderContext.extensions list for a render call.
   * Per-call extensions replace instance-level user extensions; the
   * components extension is always appended so that `<custom-tag>` sugar
   * continues to work regardless of per-call overrides.
   */
  private resolveExtensions(
    perCall?: (XMarkdownExtension | MarkedExtension)[],
  ): readonly XMarkdownExtension[] {
    if (!perCall || perCall.length === 0) {
      return [
        ...this.extensions,
        ...(this.componentsExtension ? [this.componentsExtension] : []),
      ];
    }
    return [
      ...(perCall as XMarkdownExtension[]),
      ...(this.componentsExtension ? [this.componentsExtension] : []),
    ];
  }

  /**
   * Register per-call extensions with the Marked instance and return a
   * snapshot of the previous defaults so they can be restored after the call.
   * Returns `null` if nothing to apply (no per-call extensions).
   */
  private applyPerCallExtensions(
    perCall?: (XMarkdownExtension | MarkedExtension)[],
  ): MarkedOptions | null {
    if (!perCall || perCall.length === 0) return null;
    const saved = { ...this.marked.defaults };
    // marked's use() mutates an existing defaults.extensions container in
    // place (tokenizers are unshifted into its arrays). Since the built-in
    // details extension guarantees the container exists, a shallow defaults
    // spread would alias the mutated container and restore nothing — clone
    // its arrays/maps into the snapshot so restoreDefaults really reverts.
    const ext = this.marked.defaults.extensions;
    if (ext) {
      saved.extensions = {
        ...ext,
        ...(ext.block ? { block: [...ext.block] } : {}),
        ...(ext.inline ? { inline: [...ext.inline] } : {}),
        ...(ext.startBlock ? { startBlock: [...ext.startBlock] } : {}),
        ...(ext.startInline ? { startInline: [...ext.startInline] } : {}),
        renderers: { ...ext.renderers },
        childTokens: { ...ext.childTokens },
      };
    }
    // use() likewise mutates existing defaults.renderer / defaults.tokenizer
    // class instances in place (override slots are written onto the instance).
    // Clone them preserving the prototype — a plain object spread would drop
    // the prototype methods and break rendering after restore.
    const cloneInstance = <T extends object>(o: T): T =>
      Object.assign(Object.create(Object.getPrototypeOf(o)), o);
    if (this.marked.defaults.renderer) {
      saved.renderer = cloneInstance(this.marked.defaults.renderer);
    }
    if (this.marked.defaults.tokenizer) {
      saved.tokenizer = cloneInstance(this.marked.defaults.tokenizer);
    }
    this.marked.use(...(perCall as MarkedExtension[]));
    return saved;
  }

  private restoreDefaults(saved: MarkedOptions | null): void {
    if (saved) this.marked.defaults = saved;
  }

  private buildMarkedOptions(perCall?: { gfm?: boolean; breaks?: boolean }): MarkedOptions {
    // Per-call values override instance defaults; instance defaults override
    // nothing (undefined means "use marked's built-in default").
    const gfm = perCall?.gfm ?? this.gfm;
    const breaks = perCall?.breaks ?? this.breaks;
    // Marked#lexer replaces defaults when an options object is passed, so merge
    // instance defaults explicitly to preserve extensions/walkTokens/hooks.
    return {
      ...this.marked.defaults,
      ...(gfm !== undefined ? { gfm: gfm !== false } : {}),
      ...(breaks !== undefined ? { breaks: !!breaks } : {}),
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
    const { content, gfm, breaks, extensions: perCallExts } = props;
    const stream = normalizeStreamingConfig(props.streaming);

    if (!stream) {
      this.tokenStreamProcessor = null;
      this.restoreDefaults(this.activeTokenStreamDefaults);
      this.activeTokenStreamDefaults = null;
      const saved = this.applyPerCallExtensions(perCallExts);
      try {
        const markedOpts = this.buildMarkedOptions({ gfm, breaks });
        props.onRenderStart?.();
        const tokens = this.lex(content, markedOpts);
        props.onPatch?.(tokens);
        props.onRenderComplete?.();
        return tokens;
      } finally {
        this.restoreDefaults(saved);
      }
    }

    if (!this.tokenStreamProcessor) {
      this.activeTokenStreamDefaults = this.applyPerCallExtensions(perCallExts);
      const markedOpts = this.buildMarkedOptions({ gfm, breaks });
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
          this.restoreDefaults(this.activeTokenStreamDefaults);
          this.activeTokenStreamDefaults = null;
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
    const { content, platform = 'auto', selectable = true, gfm, breaks, extensions: perCallExts } = props;
    const target = resolvePlatform(platform);
    const renderer = getPlatformRenderer(target);
    const stream = normalizeStreamingConfig(props.streaming);
    const ctxExtensions = this.resolveExtensions(perCallExts);

    if (!stream) {
      this.nodeStreamProcessor = null;
      this.restoreDefaults(this.activeNodeStreamDefaults);
      this.activeNodeStreamDefaults = null;
      const saved = this.applyPerCallExtensions(perCallExts);
      try {
        const markedOpts = this.buildMarkedOptions({ gfm, breaks });
        props.onRenderStart?.();
        const ctx: RenderContext = {
          animation: false,
          selectable,
          escapeText: this.escapeText,
          extensions: ctxExtensions,
          codeHeader: this.codeHeader,
          tableHeader: this.tableHeader,
        };
        const tokens = this.lex(content, markedOpts);
        const nodes = renderer.renderTokens(tokens, ctx);
        props.onPatch?.(nodes);
        props.onRenderComplete?.();
        return nodes;
      } finally {
        this.restoreDefaults(saved);
      }
    }

    if (!this.nodeStreamProcessor) {
      this.activeNodeStreamDefaults = this.applyPerCallExtensions(perCallExts);
      const markedOpts = this.buildMarkedOptions({ gfm, breaks });
      const ctx: RenderContext = {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
        extensions: ctxExtensions,
        codeHeader: this.codeHeader,
        tableHeader: this.tableHeader,
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
          this.restoreDefaults(this.activeNodeStreamDefaults);
          this.activeNodeStreamDefaults = null;
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
    this.restoreDefaults(this.activeTokenStreamDefaults);
    this.restoreDefaults(this.activeNodeStreamDefaults);
    this.activeTokenStreamDefaults = null;
    this.activeNodeStreamDefaults = null;
  }
}
