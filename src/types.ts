import type { PlatformInput } from './platforms/types.js';
import type { Token, Tokens, MarkedExtension } from 'marked';

export type { Platform, PlatformInput } from './platforms/types.js';

// Re-export marked Token shape so consumers can type their own renderers
// against the tokens exposed by XMarkdownMini.parse(). MarkedExtension is re-exported
// in preparation for Stage 3's extensions support.
export type { Token, Tokens, MarkedExtension } from 'marked';

/**
 * 语义流式渲染配置
 */
export interface SemanticStreamingConfig {
  /** 语义分隔符正则，默认按句/标点切块 */
  delimiters?: RegExp;
  /** 单块最大字符数，超长句强制按长度切 */
  maxChunkSize?: number;
  /**
   * 语义块之间的延迟（ms）。
   * - number: 恒定延迟
   * - number[]: 按已渲染块序号变速（如 [300,200,100,0] 随块加速），超出长度取最后一项
   */
  chunkDelay?: number | number[];
  /**
   * 块内字符延迟（ms），打字机逐字节奏。
   * - number: 恒定延迟
   * - number[]: 按已渲染块序号变速（如 [50,30,20,10,50]），超出长度取最后一项
   */
  charDelay?: number | number[];
}

/**
 * 流式渲染配置
 */
export interface StreamingConfig {
  /**
   * 是否还有后续输入。
   * - true: 还有后续输入，保留未完成片段
   * - false: 本轮输入后 flush 剩余内容并结束
   */
  hasNextChunk: boolean;
  /**
   * 语义分块开关 / 配置：
   * - true: 启用默认语义分块
   * - false: 关闭语义分块，直接一次性渲染
   * - object: 启用语义分块并覆盖配置（delimiters / maxChunkSize / chunkDelay / charDelay）
   */
  semantic?: boolean | SemanticStreamingConfig;
  /**
   * 流式块动画开关
   * - true: 启用流式块动画
   * - false: 关闭流式块动画
   */
  enableAnimation?: boolean;
}

export interface XMarkdownMiniProps {
  /** Markdown 文本（全量或当前累计流式内容） */
  content: string;

  /** 目标平台，可选，默认 auto 自动识别 */
  platform?: PlatformInput;

  /**
   * 流式渲染：
   * - false: 关闭流式，走一次性渲染
   * - true: 开启默认流式优化（等同 { hasNextChunk: true, semantic: true, enableAnimation: true }）
   * - object: 自定义流式行为，需显式提供 hasNextChunk
   */
  streaming?: false | true | StreamingConfig;

  /** 文本是否可选择（推荐默认 true，各端适配尽量映射） */
  selectable?: boolean;

  /** GFM 表格、删除线、自动换行（默认 true）。Per-call 可覆盖构造时的默认值 */
  gfm?: boolean;

  /** 软换行 \n 解析为 <br>（默认 false）。Per-call 可覆盖构造时的默认值 */
  breaks?: boolean;

  /**
   * Per-call extensions that override instance-level extensions for this render.
   * Accepts XMarkdownExtension (preferred, with miniRenderer) or MarkedExtension.
   * Tokenizers are registered via `marked.use()`; renderers are resolved through
   * the per-call list (instance-level `components` extension is always preserved).
   */
  extensions?: (XMarkdownExtension | MarkedExtension)[];

  /** 渲染生命周期 */
  onRenderStart?: () => void;
  onRenderProgress?: (payload: { markdown: string }) => void;
  onRenderComplete?: () => void;

  /** 流式时每轮解析完成回调，用于 setData(nodes) */
  onPatch?: (nodes: MiniNode[]) => void;
}

export interface XMarkdownMiniTokenProps {
  /** Markdown 文本（全量或累计流式内容） */
  content: string;

  /** GFM 表格、删除线、自动换行（默认 true）。Per-call 可覆盖构造时的默认值 */
  gfm?: boolean;

  /** 软换行 \n 解析为 <br>（默认 false）。Per-call 可覆盖构造时的默认值 */
  breaks?: boolean;

  /**
   * Per-call extensions that override instance-level extensions for this render.
   * Accepts XMarkdownExtension (preferred, with miniRenderer) or MarkedExtension.
   * Tokenizers are registered via `marked.use()`; renderers are resolved through
   * the per-call list (instance-level `components` extension is always preserved).
   */
  extensions?: (XMarkdownExtension | MarkedExtension)[];

    /**
   * 流式解析：
   * - false: 关闭流式，走一次性 lex
   * - true: 开启默认流式优化（等同 { hasNextChunk: true, semantic: true }）
   * - object: 自定义流式行为，需显式提供 hasNextChunk
   */
  streaming?: false | true | StreamingConfig;

  /** 生命周期 */
  onRenderStart?: () => void;
  onRenderProgress?: (payload: { markdown: string }) => void;
  onRenderComplete?: () => void;

  /** 流式时每轮 lex 完成回调，用于拿到 marked Token[] */
  onPatch?: (tokens: Token[]) => void;
}

/**
 * A tokenizer + renderer extension colocated on a single object — the
 * preferred shape for new XMarkdownMini extensions. Structurally mirrors
 * marked's `TokenizerAndRendererExtension` but adds `miniRenderer` so the
 * renderer can return `MiniNode` directly instead of HTML.
 */
export interface XMarkdownTokenizerExtension {
  /** Token.type produced by this tokenizer. */
  name: string;
  /** Tokenizer level: 'block' or 'inline'. */
  level?: 'block' | 'inline';
  /** Marked start hook: returns the index of the next potential match. */
  start?: (src: string) => number | undefined;
  /** Marked tokenizer hook. */
  tokenizer?: (this: any, src: string, tokens: Token[]) => Tokens.Generic | undefined;
  /** Optional child token names (forwarded to marked). */
  childTokens?: string[];
  /** Preferred: return a MiniNode tree directly for this token. */
  miniRenderer?: (token: Token, ctx: RenderContext) => MiniNode | MiniNode[] | null | undefined;
  /**
   * marked-style HTML renderer. When present without `miniRenderer`, the HTML
   * output is run through `htmlToMiniNodes` and the result is used.
   */
  renderer?: (this: any, token: Token) => string;
}

/**
 * Preferred extension shape for `XMarkdownMiniOptions.extensions`. A subset of
 * `MarkedExtension` whose tokenizer entries carry `miniRenderer` / `renderer`
 * alongside the tokenizer. `MarkedExtension`s (e.g. community plugins that
 * only emit HTML) are also accepted in the same array.
 */
export interface XMarkdownExtension {
  /** Tokenizer entries with colocated mini-program renderers. */
  extensions?: XMarkdownTokenizerExtension[];
  /** Marked walkTokens hook (forwarded to marked). */
  walkTokens?: MarkedExtension['walkTokens'];
  /** Marked hooks (forwarded to marked). */
  hooks?: MarkedExtension['hooks'];
  /** Marked tokenizer overrides (forwarded to marked). */
  tokenizer?: MarkedExtension['tokenizer'];
}

// --- 小程序渲染节点（平台 renderer 的统一中间输出）---

/** Context passed to a code-block header renderer. */
export interface CodeHeaderContext {
  /** Resolved language id ('' when the fence has no language). */
  lang: string;
  /** Raw code text — the clipboard payload. */
  text: string;
  token: Tokens.Code;
}

/** Context passed to a table header renderer. */
export interface TableHeaderContext {
  /** Raw markdown source of the table — the clipboard payload. */
  markdown: string;
  token: Tokens.Table;
}

export type CodeHeaderRenderer = (ctx: CodeHeaderContext) => MiniNode | MiniNode[] | null;
export type TableHeaderRenderer = (ctx: TableHeaderContext) => MiniNode | MiniNode[] | null;

/** 渲染上下文：transformer 共用的公共配置。 */
export interface RenderContext {
  /** 是否启用块级动画 */
  animation?: boolean;
  /** 文本是否可选择 */
  selectable?: boolean;
  /**
   * 是否对文本节点的 value 做 HTML 实体转义。
   * - true（默认）：用于会解码实体的平台节点容器
   * - false：用于自渲染组件（<text>{{value}}</text> 不解码实体）
   */
  escapeText?: boolean;
  /**
   * Colocated tokenizer+renderer extensions registered on the instance.
   */
  extensions?: readonly XMarkdownExtension[];
  /**
   * Code-block header config. `true`/undefined = default (language + copy
   * button); `false` = no header; function = custom header nodes.
   */
  codeHeader?: boolean | CodeHeaderRenderer;
  /** Table header config. Same semantics as `codeHeader`. */
  tableHeader?: boolean | TableHeaderRenderer;
  /**
   * Recursively render an inline token array to MiniNode[]. Provided by the
   * platform transformer; used by custom extension miniRenderers that emit
   * tokens with children (e.g. <custom-tag>inner</custom-tag>).
   */
  renderInlineTokens?: (tokens: Token[]) => MiniNode[];
}

export interface MiniNode {
  /** 标签名，小写 */
  name: string;
  /**
   * 自定义组件原始标签名。仅由 `components` 白名单合成的节点携带，等于 `name`，
   * 用于宿主页面在作用域插槽 / dispatcher 里按 `node.tag` 分发（对齐 markdown-x 约定）。
   */
  tag?: string;
  /** 属性，class/style 等小写 */
  attrs?: Record<string, string | number | boolean>;
  /** 子节点 */
  children?: MiniNode[];
  /** 代码块/表格顶部 header 栏（语言/标题 + 复制按钮）。 */
  header?: MiniNode[];
  /** 是否开启动画 */
  animate?: boolean;
  /**
   * 兄弟节点内的稳定下标 key，由 `flattenInlineNodes` 递归赋值。供小程序模板的
   * wx:for / a:for 作 wx:key —— index 变量不能直接当 key，缺了稳定 key 会让流式
   * 每帧整树重建、入场动画全体重播（整段闪）。追加时旧节点 k 不变得以复用。
  */
  k?: number;
  /** 流式文本的时间轴片段；重建节点时通过负 animation-delay 从原进度续播。 */
  animationSegments?: MiniNodeAnimationSegment[];
}

export interface MiniNodeAnimationSegment {
  k: number;
  value: string;
  bornAt: number;
  animate?: true;
  style?: string;
}
