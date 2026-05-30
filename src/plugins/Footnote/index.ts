import type { MiniNode, RenderContext, Tokens, XMarkdownExtension } from '../../index.js';

/**
 * 自包含行内脚注扩展。
 *
 * 语法：`[^标签:内容]`，例如 `Markdown[^1:一种轻量标记语言]`。
 * - `标签`（可选，到第一个 `:` 为止）：marker 显示文本，默认 `注`。
 * - `内容`：popover 文本，**自包含**在节点里，宿主组件本地即可弹层，
 *   不依赖跨组件边界的事件/数据传递（微信尤其需要）。
 *
 * 产出一个 `name: 'footnote'` 的 MiniNode（带 `tag` 以便宿主按 tag 分发），
 * 经 `Markdown` 组件的 slot（支付宝）/ 抽象节点（微信）交给宿主渲染 marker + popover。
 */
export interface FootnoteOptions {
  /** 缺省 marker 文本（无显式标签时），默认 `注`。 */
  defaultLabel?: string;
}

// [^label:content] —— label 到第一个冒号为止（可选），content 到匹配的 ] 为止。
const RULE = /^\[\^(?:([^\]:]+):)?([\s\S]+?)\]/;

export default function Footnote(options: FootnoteOptions = {}): XMarkdownExtension {
  const defaultLabel = options.defaultLabel ?? '注';
  return {
    extensions: [
      {
        name: 'footnote',
        level: 'inline',
        start(src: string): number | undefined {
          const i = src.indexOf('[^');
          return i < 0 ? undefined : i;
        },
        tokenizer(src: string): Tokens.Generic | undefined {
          const m = RULE.exec(src);
          if (!m) return undefined;
          return {
            type: 'footnote',
            raw: m[0],
            label: (m[1] ?? defaultLabel).trim(),
            content: m[2].trim(),
          } as unknown as Tokens.Generic;
        },
        miniRenderer(token: import('../../index.js').Token, _ctx: RenderContext): MiniNode {
          const t = token as unknown as { label: string; content: string };
          return {
            name: 'footnote',
            tag: 'footnote',
            attrs: { label: t.label, content: t.content, class: 'md-footnote' },
          };
        },
      },
    ],
  };
}
