import type { Token } from 'marked';
import type { IRNode } from '../types.js';

function inlineTokensToIR(tokens: Token[] | undefined): IRNode[] {
  if (!tokens || tokens.length === 0) return [];
  const out: IRNode[] = [];
  for (const tok of tokens) {
    const n = oneTokenToIR(tok);
    if (n) out.push(n);
  }
  return out;
}

function oneTokenToIR(tok: Token): IRNode | null {
  const t = tok as Token & { type: string; raw: string; tokens?: Token[]; text?: string };
  switch (t.type) {
    case 'strong':
      return { t: 'strong', c: inlineTokensToIR(t.tokens) };
    case 'em':
      return { t: 'em', c: inlineTokensToIR(t.tokens) };
    case 'codespan':
      return { t: 'codespan', raw: (t as Token & { text: string }).text };
    case 'br':
      return { t: 'br' };
    case 'link': {
      const link = t as unknown as { href: string; title?: string | null; text: string; tokens?: Token[] };
      return {
        t: 'link',
        a: { href: link.href, title: link.title ?? '' },
        c: inlineTokensToIR(link.tokens),
      };
    }
    case 'image': {
      const img = t as Token & { href: string; title: string | null; text: string };
      return {
        t: 'image',
        a: { href: img.href, title: img.title ?? '', alt: img.text },
      };
    }
    case 'text':
    case 'escape':
      return { t: 'text', raw: (t as Token & { text: string }).text ?? t.raw };
    default:
      if (t.raw) return { t: 'text', raw: t.raw };
      return null;
  }
}

function blockTokenToIR(tok: Token): IRNode | null {
  const t = tok as Token & { type: string; raw: string; tokens?: Token[]; text?: string };
  switch (t.type) {
    case 'heading': {
      const h = t as Token & { depth: number; text: string; tokens: Token[] };
      return {
        t: 'heading',
        a: { depth: h.depth },
        c: inlineTokensToIR(h.tokens),
      };
    }
    case 'paragraph': {
      const p = t as Token & { text: string; tokens: Token[] };
      return {
        t: 'paragraph',
        c: inlineTokensToIR(p.tokens),
      };
    }
    case 'code': {
      const c = t as Token & { text: string; lang?: string };
      return {
        t: 'code',
        a: c.lang ? { lang: c.lang } : undefined,
        raw: c.text,
      };
    }
    case 'blockquote': {
      const b = t as Token & { text: string; tokens: Token[] };
      const children = (b.tokens || []).map(blockTokenToIR).filter((n): n is IRNode => n != null);
      return { t: 'blockquote', c: children };
    }
    case 'list': {
      const list = t as Token & { ordered: boolean; start: number | ''; items: Token[] };
      const items: IRNode[] = [];
      for (const item of list.items) {
        const itemNode = blockTokenToIR(item);
        if (itemNode) items.push(itemNode);
      }
      return {
        t: 'list',
        a: { ordered: list.ordered, start: list.start === '' ? 1 : list.start },
        c: items,
      };
    }
    case 'list_item': {
      const li = t as Token & { text: string; tokens: Token[] };
      const children = (li.tokens || []).map(blockTokenToIR).filter((n): n is IRNode => n != null);
      return { t: 'list_item', c: children };
    }
    case 'hr':
      return { t: 'hr' };
    case 'space':
      return { t: 'space', raw: t.raw };
    case 'html': {
      const html = t as Token & { text: string; block: boolean };
      return { t: 'html', raw: html.text };
    }
    case 'table': {
      const table = t as Token & {
        header: Array<{ text: string; tokens: Token[] }>;
        rows: Array<Array<{ text: string; tokens: Token[] }>>;
      };
      const thead: IRNode[] = (table.header || []).map((cell) => ({
        t: 'th' as const,
        c: inlineTokensToIR(cell.tokens),
      }));
      const rows: IRNode[] = (table.rows || []).map((row) => ({
        t: 'tr' as const,
        c: row.map((cell) => ({ t: 'td' as const, c: inlineTokensToIR(cell.tokens) })),
      }));
      return {
        t: 'table',
        c: [{ t: 'thead', c: thead }, { t: 'tbody', c: rows }],
      };
    }
    default:
      if (t.raw?.trim()) return { t: 'text', raw: t.raw };
      return null;
  }
}

/**
 * 将 marked Lexer 产出的 Token 树转为统一 IR 树。
 */
export function tokensToIR(tokens: Token[]): IRNode[] {
  const out: IRNode[] = [];
  for (const tok of tokens) {
    const n = blockTokenToIR(tok);
    if (n) out.push(n);
  }
  return out;
}
