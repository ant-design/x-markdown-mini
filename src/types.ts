import type { PlatformInput } from './platform.js';

export type { Platform, PlatformInput } from './platform.js';

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
  onPatch?: (nodes: UnifiedNode[]) => void;
}

// --- IR 层（内部中间表示）---

/** IR 节点类型标识（块级） */
export type IRBlockType =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'list_item'
  | 'code'
  | 'blockquote'
  | 'hr'
  | 'html'
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tr'
  | 'th'
  | 'td'
  | 'space'
  | 'text';

/** IR 行内节点类型 */
export type IRInlineType =
  | 'strong'
  | 'em'
  | 'codespan'
  | 'link'
  | 'image'
  | 'br'
  | 'text';

export type IRNodeType = IRBlockType | IRInlineType;

export interface IRNode {
  /** 节点类型 */
  t: IRNodeType;
  /** 属性（可选） */
  a?: Record<string, string | number | boolean>;
  /** 子节点（可选） */
  c?: IRNode[];
  /** 原始文本（如 paragraph 的 text、code 的 text） */
  raw?: string;
}

// --- 统一 rich-text 节点（与微信 nodes 对齐）---

export interface UnifiedNode {
  /** 标签名，小写 */
  name: string;
  /** 属性，class/style 等小写 */
  attrs?: Record<string, string | number | boolean>;
  /** 子节点 */
  children?: UnifiedNode[];
  /** 动画：块级 / 文本级 / 关闭 */
  animate?: 'block' | 'text' | false;
}
