import type { PlatformInput } from './platform.js';
import type { Token } from 'marked';

export type { Platform, PlatformInput } from './platform.js';

// Re-export marked Token shape so consumers can type their own renderers
// against the tokens exposed by XMarkdownMini.parse(). MarkedExtension is re-exported
// in preparation for Stage 3's extensions support.
export type { Token, Tokens, MarkedExtension } from 'marked';

/** Marked 词法器选项。各 transformer 共用，不算"共享 helper"——仅类型契约。 */
export interface LexerOptions {
  /** GFM 表格、删除线、自动换行（默认 true） */
  gfm?: boolean;
  /** 软换行 \n 解析为 <br>（默认 false） */
  breaks?: boolean;
}

/**
 * 语义流式渲染配置
 */
export interface SemanticStreamingConfig {
  /** 语义分隔符正则，默认按句/标点切块 */
  delimiters?: RegExp;
  /** 单块最大字符数，超长句强制按长度切 */
  maxChunkSize?: number;
  /** 语义块之间的延迟（ms） */
  chunkDelay?: number;
  /** 块内字符延迟（ms） */
  charDelay?: number;
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
   * - false: 关闭语义分块，按长度增量切块
   * - object: 启用语义分块并覆盖配置
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

  /** Markdown 解析选项（例如 gfm、breaks 等） */
  options?: Record<string, unknown>;

  /** 渲染生命周期 */
  onRenderStart?: () => void;
  onRenderProgress?: (payload: { markdown: string }) => void;
  onRenderComplete?: () => void;

  /** 流式时每轮解析完成回调，用于 setData(nodes) */
  onPatch?: (nodes: MiniNode[]) => void;
}

export interface XMarkdownMiniTokenProps {
  /** Markdown 文本（全量或当前累计流式内容） */
  content: string;

  /**
   * 流式解析：
   * - false: 关闭流式，走一次性 lex
   * - true: 开启默认流式优化（等同 { hasNextChunk: true, semantic: true }）
   * - object: 自定义流式行为，需显式提供 hasNextChunk
   */
  streaming?: false | true | StreamingConfig;

  /** Markdown 解析选项（例如 gfm、breaks 等） */
  options?: Record<string, unknown>;

  /** 生命周期 */
  onRenderStart?: () => void;
  onRenderProgress?: (payload: { markdown: string }) => void;
  onRenderComplete?: () => void;

  /** 流式时每轮 lex 完成回调，用于拿到 marked Token[] */
  onPatch?: (tokens: Token[]) => void;
}

export interface TokenRenderer {
  /** marked token.type handled by this renderer. */
  token: string;
  /** Convert a marked token into one or more mini-program nodes. */
  render: (token: Token, ctx: RenderContext) => MiniNode | MiniNode[] | null | undefined;
}

// --- 小程序渲染节点（与 rich-text nodes 形状对齐）---

/** 渲染上下文：transformer 共用的公共配置。 */
export interface RenderContext {
  /** 是否启用块级动画 */
  animation?: boolean;
  /** 文本是否可选择 */
  selectable?: boolean;
  /**
   * 是否对文本节点的 value 做 HTML 实体转义。
   * - true（默认）：用于原生 rich-text
   * - false：用于自渲染组件（<text>{{value}}</text> 不解码实体）
   */
  escapeText?: boolean;
  /** Custom renderers for marked extension tokens. */
  tokenRenderers?: readonly TokenRenderer[];
}

export interface MiniNode {
  /** 标签名，小写 */
  name: string;
  /** 属性，class/style 等小写 */
  attrs?: Record<string, string | number | boolean>;
  /** 子节点 */
  children?: MiniNode[];
  /** 动画：块级 / 文本级 / 关闭 */
  animate?: 'block' | 'text' | false;
}
