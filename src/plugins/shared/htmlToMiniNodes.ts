import type { MiniNode } from '../../types.js';

// Sticky (`y`) regexes match at `lastIndex` without slicing the input — avoids
// allocating a fresh substring at every `<` while walking large KaTeX/hljs HTML.
// Stateful, but every use sets `lastIndex` immediately before `.exec` and the
// parser runs synchronously and non-reentrantly, so module scope is safe.
const CLOSE_TAG_RE = /<\/(\w+)\s*>/y;
const OPEN_TAG_RE = /<(\w+)((?:\s+[^>]*?)?)(\/?)>/y;
const KATEX_CLOSE_SPAN_RE = /<\/span\s*>/iy;
const KATEX_OPEN_SPAN_RE = /<span[\s>]/iy;

/**
 * Lightweight HTML → MiniNode parser.
 *
 * Handles the subset of HTML that KaTeX and highlight.js output:
 * - Nested `<span class="…">` / `<div class="…">`
 * - `<br>`, `<br/>`
 * - Text nodes (with HTML entity decoding)
 *
 * Tags outside this set are treated as `<span>` (fallback).
 */
export function htmlToMiniNodes(html: string, escapeText: boolean): MiniNode[] {
  const root: MiniNode = { name: 'root', children: [] };
  const stack: MiniNode[] = [root];
  let i = 0;

  // Minimal HTML entity decode for text content
  function decode(s: string): string {
    if (!escapeText) return s;
    return s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  // Map common HTML tags to mini-program–friendly names.
  // KaTeX/hljs use <span> and <div> heavily; <br> becomes a text newline.
  function mapTag(tag: string): string {
    switch (tag) {
      case 'div':
      case 'p':
        return 'div';
      case 'span':
      case 'code':
        return 'span';
      case 'br':
        return 'br';
      case 'img':
        return 'img';
      case 'em':
      case 'i':
        return 'em';
      case 'strong':
      case 'b':
        return 'strong';
      case 'sup':
        return 'sup';
      case 'sub':
        return 'sub';
      default:
        return 'span';
    }
  }

  while (i < html.length) {
    if (html[i] === '<') {
      // Closing tag
      CLOSE_TAG_RE.lastIndex = i;
      const closeMatch = CLOSE_TAG_RE.exec(html);
      if (closeMatch) {
        // Pop stack until we find the matching open tag (tolerant of mismatches)
        const closeTag = closeMatch[1].toLowerCase();
        for (let j = stack.length - 1; j > 0; j--) {
          if (stack[j].name === mapTag(closeTag)) {
            stack.length = j;
            break;
          }
        }
        i += closeMatch[0].length;
        continue;
      }

      // Self-closing or opening tag
      OPEN_TAG_RE.lastIndex = i;
      const tagMatch = OPEN_TAG_RE.exec(html);
      if (tagMatch) {
        const rawTag = tagMatch[1].toLowerCase();
        const attrStr = tagMatch[2];
        const selfClose = tagMatch[3] === '/';

        // Skip KaTeX's mathml output — mini-programs can't render it
        if (rawTag === 'span' && /\bkatex-mathml\b/.test(attrStr)) {
          // Find the closing </span> for this element (simple depth tracking)
          let depth = 1;
          let si = i + tagMatch[0].length;
          while (si < html.length && depth > 0) {
            const next = html.indexOf('<', si);
            if (next === -1) break;
            KATEX_CLOSE_SPAN_RE.lastIndex = next;
            const csm = KATEX_CLOSE_SPAN_RE.exec(html);
            KATEX_OPEN_SPAN_RE.lastIndex = next;
            const osm = KATEX_OPEN_SPAN_RE.exec(html);
            if (csm) { depth--; si = next + csm[0].length; }
            else if (osm) { depth++; si = next + osm[0].length; }
            else { si = next + 1; }
          }
          i = si;
          continue;
        }

        // Also skip <span class="katex-html"> wrapper — its children are what we want,
        // but we keep the wrapper for structure.
        const name = mapTag(rawTag);
        const attrs: MiniNode['attrs'] = {};

        // Parse attributes: class, style, and data-* are the ones we care about
        const classMatch = /\bclass\s*=\s*"([^"]*)"/.exec(attrStr);
        if (classMatch) attrs.class = classMatch[1];

        const styleMatch = /\bstyle\s*=\s*"([^"]*)"/.exec(attrStr);
        if (styleMatch) attrs.style = styleMatch[1];

        const srcMatch = /\bsrc\s*=\s*"([^"]*)"/.exec(attrStr);
        if (srcMatch) attrs.src = srcMatch[1];

        const altMatch = /\balt\s*=\s*"([^"]*)"/.exec(attrStr);
        if (altMatch) attrs.alt = altMatch[1];

        const node: MiniNode = { name, attrs: Object.keys(attrs).length ? attrs : undefined, children: [] };

        if (selfClose || rawTag === 'br') {
          if (rawTag === 'br') {
            // <br> → newline text node
            const parent = stack[stack.length - 1];
            parent.children!.push({ name: 'text', attrs: { value: '\n' } });
          } else {
            stack[stack.length - 1].children!.push(node);
          }
        } else {
          stack[stack.length - 1].children!.push(node);
          stack.push(node);
        }

        i += tagMatch[0].length;
        continue;
      }

      // Malformed tag — skip the '<' and move on
      i++;
    } else {
      // Text node — collect until next '<'
      const nextLt = html.indexOf('<', i);
      const text = nextLt === -1 ? html.slice(i) : html.slice(i, nextLt);
      if (text) {
        const parent = stack[stack.length - 1];
        // Merge consecutive text nodes
        const last = parent.children![parent.children!.length - 1];
        if (last && last.name === 'text') {
          last.attrs!.value += decode(text);
        } else {
          parent.children!.push({ name: 'text', attrs: { value: decode(text) } });
        }
      }
      i = nextLt === -1 ? html.length : nextLt;
    }
  }

  return root.children ?? [];
}