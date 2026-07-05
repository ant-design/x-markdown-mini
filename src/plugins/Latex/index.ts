import katex from 'katex';
import type { MiniNode, Tokens, XMarkdownExtension } from '../../index.js';
import { htmlToMiniNodes } from '../shared/htmlToMiniNodes.js';

export interface LatexOptions {
  /** Options forwarded to katex.renderToString(). */
  katexOptions?: katex.KatexOptions;
  /** Callback invoked when KaTeX rendering fails for a formula. */
  onError?: (tex: string, err: Error) => MiniNode[];
}

// KaTeX doesn't support {align*}; replace with {aligned} (same visual result).
function replaceAlign(text: string): string {
  return text.replace(/\{align\*\}/g, '{aligned}');
}

// --- 字体「下沉到叶子」---------------------------------------------------------
// 背景：KaTeX 把字体类（mathnormal/mathbf/…）挂在 wrapper <span>（渲染为 <view>），真正字形
// 是无类名的后代 <text>。支付宝真机 (a) 不把 font-family 从 <view> 继承进叶子 <text>，(b) 跨
// 嵌套 <mini-node-renderer> 组件边界的「后代选择器」（.katex .mathnormal text）也不命中。所以
// 唯一可靠的办法是把字体意图「下沉」成一个类、直接盖到每个字形 <text> 上，再用「单类选择器」
// （.kxf-*，命中 text 自身、不跨边界）赋字体——与 element 样式必须放在 MiniNodeRenderer 的既有
// 结论一致。kxf-* → 唯一 family 的映射见 plugins/Latex/style.acss 与 shared/loadKatexFonts.ts。
function fontClassFor(cls: string): string | null {
  const c = ' ' + cls + ' ';
  if (c.indexOf(' mathnormal ') > -1) return 'kxf-mathitalic';
  if (c.indexOf(' boldsymbol ') > -1) return 'kxf-mathbolditalic';
  if (c.indexOf(' mathbf ') > -1 || c.indexOf(' textbf ') > -1) return 'kxf-mainbold';
  if (c.indexOf(' mathit ') > -1 || c.indexOf(' textit ') > -1) return 'kxf-mainitalic';
  if (c.indexOf(' mathboldfrak ') > -1 || c.indexOf(' textboldfrak ') > -1) return 'kxf-frakbold';
  if (c.indexOf(' mathfrak ') > -1 || c.indexOf(' textfrak ') > -1) return 'kxf-frak';
  if (c.indexOf(' amsrm ') > -1 || c.indexOf(' mathbb ') > -1 || c.indexOf(' textbb ') > -1) return 'kxf-ams';
  if (c.indexOf(' mathcal ') > -1) return 'kxf-cal';
  if (c.indexOf(' mathscr ') > -1 || c.indexOf(' textscr ') > -1) return 'kxf-script';
  if (c.indexOf(' mathboldsf ') > -1 || c.indexOf(' textboldsf ') > -1) return 'kxf-sfbold';
  if (c.indexOf(' mathsfit ') > -1 || c.indexOf(' mathitsf ') > -1 || c.indexOf(' textitsf ') > -1) return 'kxf-sfitalic';
  if (c.indexOf(' mathsf ') > -1 || c.indexOf(' textsf ') > -1) return 'kxf-sf';
  if (c.indexOf(' mathtt ') > -1 || c.indexOf(' texttt ') > -1) return 'kxf-tt';
  if (c.indexOf(' mathrm ') > -1 || c.indexOf(' textrm ') > -1 || c.indexOf(' mainrm ') > -1) return 'kxf-main';
  if (c.indexOf(' delimsizing ') > -1 || c.indexOf(' delim-size1 ') > -1 || c.indexOf(' delim-size4 ') > -1) {
    if (c.indexOf(' size4 ') > -1 || c.indexOf(' delim-size4 ') > -1) return 'kxf-size4';
    if (c.indexOf(' size3 ') > -1) return 'kxf-size3';
    if (c.indexOf(' size2 ') > -1) return 'kxf-size2';
    if (c.indexOf(' size1 ') > -1 || c.indexOf(' delim-size1 ') > -1) return 'kxf-size1';
  }
  if (c.indexOf(' small-op ') > -1) return 'kxf-size1';
  if (c.indexOf(' large-op ') > -1) return 'kxf-size2';
  return null;
}

function fontStyleFor(kxf: string): string {
  switch (kxf) {
    case 'kxf-main': return 'font-family:"KaTeX_Main","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-mainbold': return 'font-family:"KaTeX_MainBold","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-mainitalic': return 'font-family:"KaTeX_MainItalic","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-mathitalic': return 'font-family:"KaTeX_MathItalic","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-mathbolditalic': return 'font-family:"KaTeX_MathBoldItalic","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-ams': return 'font-family:"KaTeX_AMS","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-cal': return 'font-family:"KaTeX_Caligraphic","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-frak': return 'font-family:"KaTeX_Fraktur","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-frakbold': return 'font-family:"KaTeX_FrakturBold","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-script': return 'font-family:"KaTeX_Script","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-sf': return 'font-family:"KaTeX_SansSerif","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-sfbold': return 'font-family:"KaTeX_SansSerifBold","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-sfitalic': return 'font-family:"KaTeX_SansSerifItalic","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-tt': return 'font-family:"KaTeX_Typewriter","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-size1': return 'font-family:"KaTeX_Size1","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-size2': return 'font-family:"KaTeX_Size2","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-size3': return 'font-family:"KaTeX_Size3","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    case 'kxf-size4': return 'font-family:"KaTeX_Size4","PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif;font-style:normal;font-weight:normal;';
    default: return '';
  }
}

// 把字体意图下沉到每个字形 <text>：沿途记住最近祖先的字体类，盖到叶子 text 的 class 上。
function stampFontClasses(list: MiniNode[], inherited: string): void {
  for (const node of list) {
    if (node.name === 'text') {
      const prev = node.attrs && node.attrs.class ? String(node.attrs.class) + ' ' : '';
      const prevStyle = node.attrs && node.attrs.style ? String(node.attrs.style) : '';
      node.attrs = {
        ...node.attrs,
        class: prev + inherited,
        style: fontStyleFor(inherited) + prevStyle,
      };
      continue;
    }
    if (node.name === 'br') continue;
    const cls = node.attrs && node.attrs.class ? String(node.attrs.class) : '';
    const next = fontClassFor(cls) || inherited;
    if (node.children) stampFontClasses(node.children, next);
  }
}

// --- Tokenizers ---

const inlineRule = /^(?:\${1,2}([^\$\n]+?)\${1,2}|\\\((.+?)\\\))/;
const blockRule = /^(\${1,2})\n([\s\S]+?)\n\1(?:\n|$)|^\\\[((?:\\.|[^\\])+?)\\\]/;

function inlineKatexTokenizer(this: any, src: string): Tokens.Generic | undefined {
  const match = src.match(inlineRule);
  if (!match) return undefined;
  const text = replaceAlign((match[1] || match[2]).trim());
  return {
    type: 'inlineKatex',
    raw: match[0],
    text,
    displayMode: false,
  } as unknown as Tokens.Generic;
}

function blockKatexTokenizer(this: any, src: string): Tokens.Generic | undefined {
  const match = src.match(blockRule);
  if (!match) return undefined;
  const text = replaceAlign((match[2] || match[3]).trim());
  return {
    type: 'blockKatex',
    raw: match[0],
    text,
    displayMode: true,
  } as unknown as Tokens.Generic;
}

// Block-level `start`: point marked at the next block-math opener so it breaks a
// paragraph there. Without this, a `\[…\]` (or `$$\n…`) line that immediately
// follows text is absorbed into the paragraph and its `\[`/`\]` degrade to
// escape tokens instead of display math.
//
// Like `inlineStart`, this VERIFIES `blockRule` actually matches at the
// candidate before returning its index — otherwise a stray `$` at a line end
// (e.g. a price, or an inline `$x$` closing a line) could ask marked to cut a
// paragraph where no block formula follows. Candidate openers are `$` (the
// `${1,2}\n` block form) and `\[`; scan forward until one that matches.
function blockStart(src: string): number | undefined {
  let from = 0;
  while (from <= src.length) {
    const dollar = src.indexOf('$', from);
    const bracket = src.indexOf('\\[', from);
    if (dollar === -1 && bracket === -1) return undefined;
    const index = Math.min(dollar === -1 ? Infinity : dollar, bracket === -1 ? Infinity : bracket);
    if (blockRule.test(src.slice(index))) return index;
    from = index + 1;
  }
  return undefined;
}

function inlineStart(src: string): number | undefined {
  const dollarIndex = src.indexOf('$');
  const parenIndex = src.indexOf('\\(');
  if (dollarIndex === -1 && parenIndex === -1) return undefined;
  const index = Math.min(
    dollarIndex === -1 ? Infinity : dollarIndex,
    parenIndex === -1 ? Infinity : parenIndex,
  );
  // Verify the match is actually valid at this position
  const possible = src.slice(index);
  if (possible.match(inlineRule)) return index;
  // If not valid at first '$', skip past it and try from next occurrence
  return undefined;
}

// --- Renderers ---

function renderKatex(tex: string, displayMode: boolean, options: LatexOptions): MiniNode[] {
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode,
      output: 'html',
      ...options.katexOptions,
      // The plugin owns error handling: force KaTeX to throw on invalid input
      // so we never emit its red `.katex-error` markup. This is intentionally
      // set after the spread so a caller's `throwOnError: false` cannot re-enable
      // the broken-formula output (common during streaming of partial formulas).
      throwOnError: true,
    });
  } catch (err) {
    // On a parse error don't render anything by default; `onError` can supply a
    // custom fallback (e.g. show the raw source) if a caller wants one.
    return options.onError ? options.onError(tex, err as Error) : [];
  }
  const nodes = htmlToMiniNodes(html, false);
  const markNodes = (list: MiniNode[], parentIsVlist = false): void => {
    for (const node of list) {
      if (node.name !== 'text' && node.name !== 'br') {
        const current = String(node.attrs?.class ?? '');
        let marker = node.name === 'img' ? 'katex-node katex-img' : 'katex-node';
        if (parentIsVlist) marker += ' katex-vlist-child';
        node.attrs = { ...node.attrs, class: current ? `${current} ${marker}` : marker };
        const isVlist = current.split(/\s+/).includes('vlist');
        if (node.children) markNodes(node.children, isVlist);
        continue;
      }
      if (node.children) markNodes(node.children, false);
    }
  };
  markNodes(nodes);
  // 字体下沉：默认 kxf-main（正体数字/算符/标点），遇字体类则切换。真机靠这些单类选择器赋字体。
  stampFontClasses(nodes, 'kxf-main');
  const wrapper = displayMode ? 'div' : 'span';
  const className = displayMode ? 'katex-display' : 'katex-inline';
  return [{ name: wrapper, attrs: { class: className }, children: nodes }];
}

export default function Latex(options: LatexOptions = {}): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'inlineKatex',
        level: 'inline',
        start: inlineStart,
        tokenizer: inlineKatexTokenizer,
        miniRenderer: (token) =>
          renderKatex((token as unknown as { text: string }).text, false, options),
      },
      {
        name: 'blockKatex',
        level: 'block',
        start: blockStart,
        tokenizer: blockKatexTokenizer,
        miniRenderer: (token) =>
          renderKatex((token as unknown as { text: string }).text, true, options),
      },
    ],
  };
}
