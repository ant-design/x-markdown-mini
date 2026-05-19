import { Lexer, type MarkedOptions, type Token, type Tokens } from 'marked';
import type { IRNode } from '../types.js';

export interface LexerOptions {
  /** GFM 表格、删除线、自动换行（默认 true） */
  gfm?: boolean;
  /** 软换行 \n 解析为 <br>（默认 false） */
  breaks?: boolean;
}

function buildMarkedOptions(opts: LexerOptions): MarkedOptions {
  return {
    gfm: opts.gfm !== false,
    breaks: !!opts.breaks,
  };
}

/** 解析 Markdown 文本为 IR 节点数组（块级）。底层走 marked.lexer。 */
export function parse(markdown: string, options: LexerOptions = {}): IRNode[] {
  const tokens = Lexer.lex(markdown, buildMarkedOptions(options));
  return blockTokensToIR(tokens);
}

/** 解析行内 Markdown 文本为 IR 行内节点数组。 */
export function parseInline(src: string, options: LexerOptions = {}): IRNode[] {
  const tokens = Lexer.lexInline(src, buildMarkedOptions(options));
  return inlineTokensToIR(tokens);
}

// --- block ---

function blockTokensToIR(tokens: Token[]): IRNode[] {
  const out: IRNode[] = [];
  for (const tok of tokens) {
    const node = blockTokenToIR(tok);
    if (node) out.push(node);
  }
  return out;
}

function blockTokenToIR(tok: Token): IRNode | null {
  switch (tok.type) {
    case 'space':
      // 块间空白不携带语义，下游也会过滤；这里直接丢掉，保持 IR 数组紧凑
      return null;
    case 'heading': {
      const t = tok as Tokens.Heading;
      return {
        t: 'heading',
        a: { depth: t.depth },
        c: inlineTokensToIR(t.tokens ?? []),
      };
    }
    case 'paragraph': {
      const t = tok as Tokens.Paragraph;
      return { t: 'paragraph', c: inlineTokensToIR(t.tokens ?? []) };
    }
    case 'code': {
      const t = tok as Tokens.Code;
      const lang = (t.lang ?? '').trim();
      return {
        t: 'code',
        a: lang ? { lang } : undefined,
        raw: t.text,
      };
    }
    case 'hr':
      return { t: 'hr' };
    case 'blockquote': {
      const t = tok as Tokens.Blockquote;
      return { t: 'blockquote', c: blockTokensToIR(t.tokens ?? []) };
    }
    case 'list': {
      const t = tok as Tokens.List;
      const ordered = !!t.ordered;
      const start = typeof t.start === 'number' ? t.start : 1;
      const items: IRNode[] = t.items.map((it) => listItemToIR(it));
      return { t: 'list', a: { ordered, start }, c: items };
    }
    case 'html': {
      const t = tok as Tokens.HTML;
      const raw = (t.text ?? t.raw ?? '').replace(/\s+$/, '');
      return { t: 'html', raw };
    }
    case 'table': {
      const t = tok as Tokens.Table;
      const headCells: IRNode[] = (t.header ?? []).map((cell) => ({
        t: 'th',
        c: inlineTokensToIR(cell.tokens ?? []),
      }));
      const rows: IRNode[] = (t.rows ?? []).map((row) => ({
        t: 'tr',
        c: row.map((cell) => ({
          t: 'td',
          c: inlineTokensToIR(cell.tokens ?? []),
        })),
      }));
      return {
        t: 'table',
        c: [
          { t: 'thead', c: headCells },
          { t: 'tbody', c: rows },
        ],
      };
    }
    case 'text': {
      // block 级 text（出现在松散列表项里）：当作 paragraph 处理
      const t = tok as Tokens.Text;
      const inline = t.tokens ? inlineTokensToIR(t.tokens) : [{ t: 'text', raw: t.text } as IRNode];
      return { t: 'paragraph', c: inline };
    }
    case 'def':
      // 引用式链接定义：当前 IR 不渲染，吞掉
      return null;
    default:
      return null;
  }
}

function listItemToIR(item: Tokens.ListItem): IRNode {
  const blocks = blockTokensToIR(item.tokens ?? []);
  return { t: 'list_item', c: unwrapTightItem(blocks) };
}

/** Tight list: 单 paragraph 子节点时直接拍平为行内序列（与下游 irToUnifiedNodes 约定一致）。 */
function unwrapTightItem(blocks: IRNode[]): IRNode[] {
  if (blocks.length === 1 && blocks[0].t === 'paragraph') {
    return blocks[0].c ?? [];
  }
  return blocks;
}

// --- inline ---

function inlineTokensToIR(tokens: Token[]): IRNode[] {
  const out: IRNode[] = [];
  for (const tok of tokens) {
    const mapped = inlineTokenToIR(tok);
    if (!mapped) continue;
    if (Array.isArray(mapped)) out.push(...mapped);
    else out.push(mapped);
  }
  return out;
}

function inlineTokenToIR(tok: Token): IRNode | IRNode[] | null {
  switch (tok.type) {
    case 'text': {
      const t = tok as Tokens.Text;
      if (t.tokens && t.tokens.length) return inlineTokensToIR(t.tokens);
      return { t: 'text', raw: t.text };
    }
    case 'escape': {
      const t = tok as Tokens.Escape;
      return { t: 'text', raw: t.text };
    }
    case 'strong': {
      const t = tok as Tokens.Strong;
      return { t: 'strong', c: inlineTokensToIR(t.tokens ?? []) };
    }
    case 'em': {
      const t = tok as Tokens.Em;
      return { t: 'em', c: inlineTokensToIR(t.tokens ?? []) };
    }
    case 'codespan': {
      const t = tok as Tokens.Codespan;
      return { t: 'codespan', raw: t.text };
    }
    case 'br':
      return { t: 'br' };
    case 'link': {
      const t = tok as Tokens.Link;
      const a: Record<string, string | number | boolean> = { href: t.href };
      if (t.title) a.title = t.title;
      return { t: 'link', a, c: inlineTokensToIR(t.tokens ?? []) };
    }
    case 'image': {
      const t = tok as Tokens.Image;
      const a: Record<string, string | number | boolean> = {
        href: t.href,
        alt: t.text,
      };
      if (t.title) a.title = t.title;
      return { t: 'image', a };
    }
    case 'del': {
      const t = tok as Tokens.Del;
      return { t: 'del', c: inlineTokensToIR(t.tokens ?? []) };
    }
    case 'html': {
      // 行内 html / 标签：作为纯文本透传
      const t = tok as Tokens.HTML | Tokens.Tag;
      return { t: 'text', raw: t.text };
    }
    default:
      return null;
  }
}
