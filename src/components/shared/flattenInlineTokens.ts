import type { Token, Tokens } from 'marked';

/**
 * 把 marked inline Token[] 扁平成一层 InlineRun[]，配合小程序 `<text>` 模板使用。
 *
 * 背景：mini-program 的 `<text>` 不能嵌套自定义组件，所以模板无法递归通过 `<text>`
 * 渲染任意深度的 strong/em/del/code 嵌套——必须在 JS 层把嵌套结构拍平为单层
 * 文本片段序列，每个片段携带「class 链」让模板按类拼样式。
 *
 * 与旧 flattenInline 的差别：输入是 marked 原生 Token[]，不再经过 MiniNode 中转。
 * 这样组件可以直接消费 XMarkdownMini.parse() 的输出，无需 transformer 层。
 *
 * Link / Image 由模板单独渲染（小程序 `<text>` 之外的 `<image>` / 可点击 `<text>`），
 * 不并入文本 run。Hard break 用独立 `kind:'br'` 占位。
 */

export type InlineRunKind = 'text' | 'br' | 'link' | 'image';

export interface InlineRun {
  kind: InlineRunKind;
  /** 用作文本节点或链接文本；image 的话是 alt */
  value: string;
  /** 空格分隔的样式类链，e.g. "md-strong md-em" */
  classes: string;
  /** link / image 的属性。其他 kind 不带 attrs。 */
  attrs?: { href?: string; src?: string; alt?: string; title?: string };
}

export interface FlattenInlineTokensOptions {
  /**
   * 是否对文本值做 HTML 转义。
   * - true：用于原生 `<rich-text>`（它会解码实体）
   * - false：用于自渲染 `<text>{{value}}</text>` 模板（不解码实体）
   */
  escapeText: boolean;
}

const TAG_CLASS: Record<string, string> = {
  strong: 'md-strong',
  em: 'md-em',
  del: 'md-del',
  codespan: 'md-inline-code',
};

function escapeHtml(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (ch === 38) out += '&amp;';
    else if (ch === 60) out += '&lt;';
    else if (ch === 62) out += '&gt;';
    else if (ch === 34) out += '&quot;';
    else out += text[i];
  }
  return out;
}

function mergeClass(...parts: Array<string | undefined>): string {
  const seen = new Set<string>();
  for (const p of parts) {
    if (!p) continue;
    for (const tok of p.split(/\s+/)) if (tok) seen.add(tok);
  }
  return Array.from(seen).join(' ');
}

/** Concatenate text leaves from a token subtree, used for link / image label. */
function tokensToText(tokens: Token[] | undefined): string {
  if (!tokens) return '';
  let out = '';
  for (const t of tokens) {
    const u = t as Tokens.Generic;
    if (u.type === 'text' || u.type === 'escape') {
      out += (u as Tokens.Text | Tokens.Escape).text ?? '';
    } else if (u.tokens) {
      out += tokensToText(u.tokens as Token[]);
    } else if (typeof u.text === 'string') {
      out += u.text;
    }
  }
  return out;
}

export function flattenInlineTokens(
  tokens: Token[],
  opts: FlattenInlineTokensOptions,
): InlineRun[] {
  const out: InlineRun[] = [];
  const enc = opts.escapeText ? escapeHtml : (s: string) => s;
  walk(tokens, '', out, enc);
  return out;
}

function walk(
  tokens: Token[],
  classChain: string,
  out: InlineRun[],
  enc: (s: string) => string,
): void {
  for (const tok of tokens) {
    const t = tok as Tokens.Generic;
    switch (t.type) {
      case 'text':
      case 'escape': {
        const node = t as Tokens.Text | Tokens.Escape;
        // marked 的 'text' inline token 可能再含 child tokens（带格式的文本会嵌套）。
        if ((node as Tokens.Text).tokens && (node as Tokens.Text).tokens!.length) {
          walk((node as Tokens.Text).tokens as Token[], classChain, out, enc);
        } else {
          const v = enc(node.text ?? '');
          if (v) out.push({ kind: 'text', value: v, classes: classChain });
        }
        break;
      }
      case 'strong':
      case 'em':
      case 'del':
        walk(
          (t.tokens as Token[]) ?? [],
          mergeClass(classChain, TAG_CLASS[t.type]),
          out,
          enc,
        );
        break;
      case 'codespan': {
        const node = t as Tokens.Codespan;
        const v = enc(node.text ?? '');
        if (v)
          out.push({
            kind: 'text',
            value: v,
            classes: mergeClass(classChain, TAG_CLASS.codespan),
          });
        break;
      }
      case 'br':
        out.push({ kind: 'br', value: '', classes: classChain });
        break;
      case 'link': {
        const node = t as Tokens.Link;
        const label = tokensToText(node.tokens as Token[] | undefined) || node.text || '';
        const run: InlineRun = {
          kind: 'link',
          value: enc(label),
          classes: classChain,
          attrs: { href: node.href ?? '' },
        };
        if (node.title) run.attrs!.title = node.title;
        out.push(run);
        break;
      }
      case 'image': {
        const node = t as Tokens.Image;
        const run: InlineRun = {
          kind: 'image',
          value: enc(node.text ?? ''),
          classes: classChain,
          attrs: { src: node.href ?? '', alt: node.text ?? '' },
        };
        if (node.title) run.attrs!.title = node.title;
        out.push(run);
        break;
      }
      case 'html': {
        // marked 把行内原始 HTML 透传给消费方；这里按文本对待，由 escapeText 决定是否转义。
        const node = t as Tokens.HTML | Tokens.Tag;
        const v = enc(node.text ?? '');
        if (v) out.push({ kind: 'text', value: v, classes: classChain });
        break;
      }
      default: {
        // Unknown / extension-introduced inline tokens — fall back to text value if present.
        if (typeof t.text === 'string') {
          const v = enc(t.text);
          if (v) out.push({ kind: 'text', value: v, classes: classChain });
        }
      }
    }
  }
}
