"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp.call(b3, prop))
      __defNormalProp(a, prop, b3[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b3)) {
      if (__propIsEnum.call(b3, prop))
        __defNormalProp(a, prop, b3[prop]);
    }
  return a;
};
var __spreadProps = (a, b3) => __defProps(a, __getOwnPropDescs(b3));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Footnote: () => Footnote,
  StreamingProcessor: () => StreamingProcessor,
  XMarkdownMini: () => XMarkdownMini,
  alipayRenderer: () => alipayRenderer,
  copyButton: () => copyButton,
  flattenInlineTokens: () => flattenInlineTokens,
  getPlatformRenderer: () => getPlatformRenderer,
  parse: () => parse,
  registerPlatformRenderer: () => registerPlatformRenderer,
  render: () => render,
  renderNodes: () => renderNodes,
  resolvePlatform: () => resolvePlatform,
  tokensToAlipay: () => tokensToAlipay,
  tokensToAlipayNodes: () => tokensToAlipayNodes,
  tokensToWechat: () => tokensToWechat,
  tokensToWechatNodes: () => tokensToWechatNodes,
  wechatRenderer: () => wechatRenderer
});
module.exports = __toCommonJS(src_exports);

// node_modules/marked/lib/marked.esm.js
function z() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T = z();
function G(l3) {
  T = l3;
}
var _ = { exec: () => null };
function d(l3, e = "") {
  let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: (s, r) => {
    let i = typeof r == "string" ? r : r.source;
    return i = i.replace(m.caret, "$1"), t = t.replace(s, i), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var Re = ((l3 = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + l3);
  } catch (e) {
    return false;
  }
})();
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}#`), htmlBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}>`) };
var Te = /^(?:[ \t]*(?:\n|$))+/;
var Oe = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var we = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var I = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var ye = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var Q = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var oe = d(ie).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Pe = d(ie).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var Se = /^[^\n]+/;
var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var $e = d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Le = d(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Q).getRegex();
var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var _e = d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var ae = d(j).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var Me = d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex();
var K = { blockquote: Me, code: Oe, def: $e, fences: we, heading: ye, hr: I, html: _e, lheading: oe, list: Le, newline: Te, paragraph: ae, table: _, text: Se };
var re = d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var ze = __spreadProps(__spreadValues({}, K), { lheading: Pe, table: re, paragraph: d(j).replace("hr", I).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() });
var Ee = __spreadProps(__spreadValues({}, K), { html: d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: d(j).replace("hr", I).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() });
var Ae = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ce = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var le = /^( {2,}|\\)\n(?!\s*$)/;
var Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var E = /[\p{P}\p{S}]/u;
var H = /[\s\p{P}\p{S}]/u;
var W = /[^\s\p{P}\p{S}]/u;
var Be = d(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, H).getRegex();
var ue = /(?!~)[\p{P}\p{S}]/u;
var De = /(?!~)[\s\p{P}\p{S}]/u;
var qe = /(?:[^\s\p{P}\p{S}]|~)/u;
var ve = d(/link|precode-code|html/, "g").replace("link", new RegExp("\\[(?:[^\\[\\]`]|(?<a>`+)[^`]+\\k<a>(?!`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)")).replace("precode-", Re ? "(?<!`)()" : "(^^|[^`])").replace("code", new RegExp("(?<b>`+)[^`]+\\k<b>(?!`)")).replace("html", /<(?! )[^<>]*?>/).getRegex();
var pe = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var He = d(pe, "u").replace(/punct/g, E).getRegex();
var Ze = d(pe, "u").replace(/punct/g, ue).getRegex();
var ce = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ge = d(ce, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, E).getRegex();
var Ne = d(ce, "gu").replace(/notPunctSpace/g, qe).replace(/punctSpace/g, De).replace(/punct/g, ue).getRegex();
var Qe = d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, E).getRegex();
var je = d(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, E).getRegex();
var Fe = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)";
var Ue = d(Fe, "gu").replace(/notPunctSpace/g, W).replace(/punctSpace/g, H).replace(/punct/g, E).getRegex();
var Ke = d(/\\(punct)/, "gu").replace(/punct/g, E).getRegex();
var We = d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var Xe = d(U).replace("(?:-->|$)", "-->").getRegex();
var Je = d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Xe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var Ve = d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var he = d(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
var ke = d(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
var Ye = d("reflink|nolink(?!\\()", "g").replace("reflink", he).replace("nolink", ke).getRegex();
var se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X = { _backpedal: _, anyPunctuation: Ke, autolink: We, blockSkip: ve, br: le, code: Ce, del: _, delLDelim: _, delRDelim: _, emStrongLDelim: He, emStrongRDelimAst: Ge, emStrongRDelimUnd: Qe, escape: Ae, link: Ve, nolink: ke, punctuation: Be, reflink: he, reflinkSearch: Ye, tag: Je, text: Ie, url: _ };
var et = __spreadProps(__spreadValues({}, X), { link: d(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() });
var N = __spreadProps(__spreadValues({}, X), { emStrongRDelimAst: Ne, emStrongLDelim: Ze, delLDelim: je, delRDelim: Ue, url: d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: d(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() });
var tt = __spreadProps(__spreadValues({}, N), { br: d(le).replace("{2,}", "*").getRegex(), text: d(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() });
var B = { normal: K, gfm: ze, pedantic: Ee };
var A = { normal: X, gfm: N, breaks: tt, pedantic: et };
var nt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var de = (l3) => nt[l3];
function O(l3, e) {
  if (e) {
    if (m.escapeTest.test(l3)) return l3.replace(m.escapeReplace, de);
  } else if (m.escapeTestNoEncode.test(l3)) return l3.replace(m.escapeReplaceNoEncode, de);
  return l3;
}
function J(l3) {
  try {
    l3 = encodeURI(l3).replace(m.percentDecode, "%");
  } catch (e) {
    return null;
  }
  return l3;
}
function V(l3, e) {
  var _a2;
  let t = l3.replace(m.findPipe, (r, i, o) => {
    let u2 = false, a = i;
    for (; --a >= 0 && o[a] === "\\"; ) u2 = !u2;
    return u2 ? "|" : " |";
  }), n = t.split(m.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((_a2 = n.at(-1)) == null ? void 0 : _a2.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; s < n.length; s++) n[s] = n[s].trim().replace(m.slashPipe, "|");
  return n;
}
function $(l3, e, t) {
  let n = l3.length;
  if (n === 0) return "";
  let s = 0;
  for (; s < n; ) {
    let r = l3.charAt(n - s - 1);
    if (r === e && !t) s++;
    else if (r !== e && t) s++;
    else break;
  }
  return l3.slice(0, n - s);
}
function Y(l3) {
  let e = l3.split(`
`), t = e.length - 1;
  for (; t >= 0 && m.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? l3 : e.slice(0, t + 1).join(`
`);
}
function ge(l3, e) {
  if (l3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
  else if (l3[n] === e[0]) t++;
  else if (l3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function fe(l3, e = 0) {
  let t = e, n = "";
  for (let s of l3) if (s === "	") {
    let r = 4 - t % 4;
    n += " ".repeat(r), t += r;
  } else n += s, t++;
  return n;
}
function me(l3, e, t, n, s) {
  let r = e.href, i = e.title || null, o = l3[1].replace(s.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let u2 = { type: l3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: r, title: i, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = false, u2;
}
function rt(l3, e, t) {
  let n = l3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let s = n[1];
  return e.split(`
`).map((r) => {
    let i = r.match(t.other.beginningSpace);
    if (i === null) return r;
    let [o] = i;
    return o.length >= s.length ? r.slice(s.length) : r;
  }).join(`
`);
}
var w = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "rules");
    __publicField(this, "lexer");
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = this.options.pedantic ? t[0] : Y(t[0]), s = n.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: n, codeBlockStyle: "indented", text: s };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], s = rt(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: s };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = $(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: $(t[0], `
`), depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: $(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = $(t[0], `
`).split(`
`), s = "", r = "", i = [];
      for (; n.length > 0; ) {
        let o = false, u2 = [], a;
        for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) u2.push(n[a]), o = true;
        else if (!o) u2.push(n[a]);
        else break;
        n = n.slice(a);
        let c2 = u2.join(`
`), p2 = c2.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${c2}` : c2, r = r ? `${r}
${p2}` : p2;
        let k2 = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p2, i, true), this.lexer.state.top = k2, n.length === 0) break;
        let h2 = i.at(-1);
        if ((h2 == null ? void 0 : h2.type) === "code") break;
        if ((h2 == null ? void 0 : h2.type) === "blockquote") {
          let R2 = h2, f2 = R2.raw + `
` + n.join(`
`), S2 = this.blockquote(f2);
          i[i.length - 1] = S2, s = s.substring(0, s.length - R2.raw.length) + S2.raw, r = r.substring(0, r.length - R2.text.length) + S2.text;
          break;
        } else if ((h2 == null ? void 0 : h2.type) === "list") {
          let R2 = h2, f2 = R2.raw + `
` + n.join(`
`), S2 = this.list(f2);
          i[i.length - 1] = S2, s = s.substring(0, s.length - h2.raw.length) + S2.raw, r = r.substring(0, r.length - R2.raw.length) + S2.raw, n = f2.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: i, text: r };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), o = false;
      for (; e; ) {
        let a = false, c2 = "", p2 = "";
        if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
        c2 = t[0], e = e.substring(c2.length);
        let k2 = fe(t[2].split(`
`, 1)[0], t[1].length), h2 = e.split(`
`, 1)[0], R2 = !k2.trim(), f2 = 0;
        if (this.options.pedantic ? (f2 = 2, p2 = k2.trimStart()) : R2 ? f2 = t[1].length + 1 : (f2 = k2.search(this.rules.other.nonSpaceChar), f2 = f2 > 4 ? 1 : f2, p2 = k2.slice(f2), f2 += t[1].length), R2 && this.rules.other.blankLine.test(h2) && (c2 += h2 + `
`, e = e.substring(h2.length + 1), a = true), !a) {
          let S2 = this.rules.other.nextBulletRegex(f2), ee = this.rules.other.hrRegex(f2), te = this.rules.other.fencesBeginRegex(f2), ne = this.rules.other.headingBeginRegex(f2), xe = this.rules.other.htmlBeginRegex(f2), be = this.rules.other.blockquoteBeginRegex(f2);
          for (; e; ) {
            let Z2 = e.split(`
`, 1)[0], C2;
            if (h2 = Z2, this.options.pedantic ? (h2 = h2.replace(this.rules.other.listReplaceNesting, "  "), C2 = h2) : C2 = h2.replace(this.rules.other.tabCharGlobal, "    "), te.test(h2) || ne.test(h2) || xe.test(h2) || be.test(h2) || S2.test(h2) || ee.test(h2)) break;
            if (C2.search(this.rules.other.nonSpaceChar) >= f2 || !h2.trim()) p2 += `
` + C2.slice(f2);
            else {
              if (R2 || k2.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(k2) || ne.test(k2) || ee.test(k2)) break;
              p2 += `
` + h2;
            }
            R2 = !h2.trim(), c2 += Z2 + `
`, e = e.substring(Z2.length + 1), k2 = C2.slice(f2);
          }
        }
        r.loose || (o ? r.loose = true : this.rules.other.doubleBlankLine.test(c2) && (o = true)), r.items.push({ type: "list_item", raw: c2, task: !!this.options.gfm && this.rules.other.listIsTask.test(p2), loose: false, text: p2, tokens: [] }), r.raw += c2;
      }
      let u2 = r.items.at(-1);
      if (u2) u2.raw = u2.raw.trimEnd(), u2.text = u2.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let a of r.items) {
        this.lexer.state.top = false, a.tokens = this.lexer.blockTokens(a.text, []);
        let c2 = a.tokens[0];
        if (a.task && ((c2 == null ? void 0 : c2.type) === "text" || (c2 == null ? void 0 : c2.type) === "paragraph")) {
          a.text = a.text.replace(this.rules.other.listReplaceTask, ""), c2.raw = c2.raw.replace(this.rules.other.listReplaceTask, ""), c2.text = c2.text.replace(this.rules.other.listReplaceTask, "");
          for (let k2 = this.lexer.inlineQueue.length - 1; k2 >= 0; k2--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[k2].src)) {
            this.lexer.inlineQueue[k2].src = this.lexer.inlineQueue[k2].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let p2 = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (p2) {
            let k2 = { type: "checkbox", raw: p2[0] + " ", checked: p2[0] !== "[ ]" };
            a.checked = k2.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = k2.raw + a.tokens[0].raw, a.tokens[0].text = k2.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(k2)) : a.tokens.unshift({ type: "paragraph", raw: k2.raw, text: k2.raw, tokens: [k2] }) : a.tokens.unshift(k2);
          }
        } else a.task && (a.task = false);
        if (!r.loose) {
          let p2 = a.tokens.filter((h2) => h2.type === "space"), k2 = p2.length > 0 && p2.some((h2) => this.rules.other.anyLine.test(h2.raw));
          r.loose = k2;
        }
      }
      if (r.loose) for (let a of r.items) {
        a.loose = true;
        for (let c2 of a.tokens) c2.type === "text" && (c2.type = "paragraph");
      }
      return r;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let n = Y(t[0]);
      return { type: "html", block: true, raw: n, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: n };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: $(t[0], `
`), href: s, title: r };
    }
  }
  table(e) {
    var _a2;
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = V(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = ((_a2 = t[3]) == null ? void 0 : _a2.trim()) ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: $(t[0], `
`), header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let o of s) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0; o < n.length; o++) i.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: i.align[o] });
      for (let o of r) i.rows.push(V(o, i.header.length).map((u2, a) => ({ text: u2, tokens: this.lexer.inline(u2), header: false, align: i.align[a] })));
      return i;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let n = t[1].trim();
      return { type: "heading", raw: $(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: n, tokens: this.lexer.inline(n) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = $(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = ge(t[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let u2 = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
          t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, u2).trim(), t[3] = "";
        }
      }
      let s = t[2], r = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], r = i[3]);
      } else r = t[3] ? t[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), me(t, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[s.toLowerCase()];
      if (!r) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return me(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(e);
    if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u2, a = i, c2 = 0, p2 = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p2.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = p2.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
        if (u2 = [...o].length, s[3] || s[4]) {
          a += u2;
          continue;
        } else if ((s[5] || s[6]) && i % 3 && !((i + u2) % 3)) {
          c2 += u2;
          continue;
        }
        if (a -= u2, a > 0) continue;
        u2 = Math.min(u2, u2 + a + c2);
        let k2 = [...s[0]][0].length, h2 = e.slice(0, i + s.index + k2 + u2);
        if (Math.min(i, u2) % 2) {
          let f2 = h2.slice(1, -1);
          return { type: "em", raw: h2, text: f2, tokens: this.lexer.inlineTokens(f2) };
        }
        let R2 = h2.slice(2, -2);
        return { type: "strong", raw: h2, text: R2, tokens: this.lexer.inlineTokens(R2) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, n = "") {
    let s = this.rules.inline.delLDelim.exec(e);
    if (!s) return;
    if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let i = [...s[0]].length - 1, o, u2, a = i, c2 = this.rules.inline.delRDelim;
      for (c2.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = c2.exec(t)) !== null; ) {
        if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o || (u2 = [...o].length, u2 !== i)) continue;
        if (s[3] || s[4]) {
          a += u2;
          continue;
        }
        if (a -= u2, a > 0) continue;
        u2 = Math.min(u2, u2 + a);
        let p2 = [...s[0]][0].length, k2 = e.slice(0, i + s.index + p2 + u2), h2 = k2.slice(i, -i);
        return { type: "del", raw: k2, text: h2, tokens: this.lexer.inlineTokens(h2) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, s;
      return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    var _a2, _b;
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, s;
      if (t[2] === "@") n = t[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = t[0], t[0] = (_b = (_a2 = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : _a2[0]) != null ? _b : "";
        while (r !== t[0]);
        n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class l {
  constructor(e) {
    __publicField(this, "tokens");
    __publicField(this, "options");
    __publicField(this, "state");
    __publicField(this, "inlineQueue");
    __publicField(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new w(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: B.normal, inline: A.normal };
    this.options.pedantic ? (t.block = B.pedantic, t.inline = A.pedantic) : this.options.gfm && (t.block = B.gfm, this.options.breaks ? t.inline = A.breaks : t.inline = A.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: B, inline: A };
  }
  static lex(e, t) {
    return new l(t).lex(e);
  }
  static lexInline(e, t) {
    return new l(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    var _a2, _b, _c;
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
    let s = 1 / 0;
    for (; e; ) {
      if (e.length < s) s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let r;
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.block) == null ? void 0 : _b.some((o) => (r = o.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        r.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "paragraph" || (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if ((_c = this.options.extensions) == null ? void 0 : _c.startBlock) {
        let o = 1 / 0, u2 = e.slice(1), a;
        this.options.extensions.startBlock.forEach((c2) => {
          a = c2.call({ lexer: this }, u2), typeof a == "number" && a >= 0 && (o = Math.min(o, a));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let o = t.at(-1);
        n && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let o = t.at(-1);
        (o == null ? void 0 : o.type) === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    var _a2, _b, _c, _d, _e2, _f;
    this.tokenizer.lexer = this;
    let n = e, s = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(n)) !== null; ) a.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(n)) !== null; ) n = n.slice(0, s.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let r;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(n)) !== null; ) r = s[2] ? s[2].length : 0, n = n.slice(0, s.index + r) + "[" + "a".repeat(s[0].length - r - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = (_c = (_b = (_a2 = this.options.hooks) == null ? void 0 : _a2.emStrongMask) == null ? void 0 : _b.call({ lexer: this }, n)) != null ? _c : n;
    let i = false, o = "", u2 = 1 / 0;
    for (; e; ) {
      if (e.length < u2) u2 = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      i || (o = ""), i = false;
      let a;
      if ((_e2 = (_d = this.options.extensions) == null ? void 0 : _d.inline) == null ? void 0 : _e2.some((p2) => (a = p2.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), true) : false)) continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        let p2 = t.at(-1);
        a.type === "text" && (p2 == null ? void 0 : p2.type) === "text" ? (p2.raw += a.raw, p2.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, o)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e, n, o)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c2 = e;
      if ((_f = this.options.extensions) == null ? void 0 : _f.startInline) {
        let p2 = 1 / 0, k2 = e.slice(1), h2;
        this.options.extensions.startInline.forEach((R2) => {
          h2 = R2.call({ lexer: this }, k2), typeof h2 == "number" && h2 >= 0 && (p2 = Math.min(p2, h2));
        }), p2 < 1 / 0 && p2 >= 0 && (c2 = e.substring(0, p2 + 1));
      }
      if (a = this.tokenizer.inlineText(c2)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), i = true;
        let p2 = t.at(-1);
        (p2 == null ? void 0 : p2.type) === "text" ? (p2.raw += a.raw, p2.text += a.text) : t.push(a);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(t);
    else throw new Error(t);
  }
};
var y = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "parser");
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    var _a2;
    let s = (_a2 = (t || "").match(m.notSpaceStart)) == null ? void 0 : _a2[0], r = e.replace(m.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + O(s) + '">' + (n ? r : O(r, true)) + `</code></pre>
` : "<pre><code>" + (n ? r : O(r, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, s = "";
    for (let o = 0; o < e.items.length; o++) {
      let u2 = e.items[o];
      s += this.listitem(u2);
    }
    let r = t ? "ol" : "ul", i = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + i + `>
` + s + "</" + r + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
    t += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < e.rows.length; r++) {
      let i = e.rows[r];
      n = "";
      for (let o = 0; o < i.length; o++) n += this.tablecell(i[o]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${O(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let s = this.parser.parseInline(n), r = J(e);
    if (r === null) return s;
    e = r;
    let i = '<a href="' + e + '"';
    return t && (i += ' title="' + O(t) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: e, title: t, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = J(e);
    if (r === null) return O(n);
    e = r;
    let i = `<img src="${e}" alt="${O(n)}"`;
    return t && (i += ` title="${O(t)}"`), i += ">", i;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
  }
};
var L = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
  checkbox({ raw: e }) {
    return e;
  }
};
var b = class l2 {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "renderer");
    __publicField(this, "textRenderer");
    this.options = e || T, this.options.renderer = this.options.renderer || new y(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
  }
  static parse(e, t) {
    return new l2(t).parse(e);
  }
  static parseInline(e, t) {
    return new l2(t).parseInline(e);
  }
  parse(e) {
    var _a2, _b;
    this.renderer.parser = this;
    let t = "";
    for (let n = 0; n < e.length; n++) {
      let s = e[n];
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[s.type]) {
        let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          t += o || "";
          continue;
        }
      }
      let r = s;
      switch (r.type) {
        case "space": {
          t += this.renderer.space(r);
          break;
        }
        case "hr": {
          t += this.renderer.hr(r);
          break;
        }
        case "heading": {
          t += this.renderer.heading(r);
          break;
        }
        case "code": {
          t += this.renderer.code(r);
          break;
        }
        case "table": {
          t += this.renderer.table(r);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(r);
          break;
        }
        case "list": {
          t += this.renderer.list(r);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(r);
          break;
        }
        case "html": {
          t += this.renderer.html(r);
          break;
        }
        case "def": {
          t += this.renderer.def(r);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(r);
          break;
        }
        case "text": {
          t += this.renderer.text(r);
          break;
        }
        default: {
          let i = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    var _a2, _b;
    this.renderer.parser = this;
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[r.type]) {
        let o = this.options.extensions.renderers[r.type].call({ parser: this }, r);
        if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(r.type)) {
          n += o || "";
          continue;
        }
      }
      let i = r;
      switch (i.type) {
        case "escape": {
          n += t.text(i);
          break;
        }
        case "html": {
          n += t.html(i);
          break;
        }
        case "link": {
          n += t.link(i);
          break;
        }
        case "image": {
          n += t.image(i);
          break;
        }
        case "checkbox": {
          n += t.checkbox(i);
          break;
        }
        case "strong": {
          n += t.strong(i);
          break;
        }
        case "em": {
          n += t.em(i);
          break;
        }
        case "codespan": {
          n += t.codespan(i);
          break;
        }
        case "br": {
          n += t.br(i);
          break;
        }
        case "del": {
          n += t.del(i);
          break;
        }
        case "text": {
          n += t.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var _a;
var P = (_a = class {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "block");
    this.options = e || T;
  }
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? x.lex : x.lexInline;
  }
  provideParser(e = this.block) {
    return e ? b.parse : b.parseInline;
  }
}, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_a, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a);
var D = class {
  constructor(...e) {
    __publicField(this, "defaults", z());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", b);
    __publicField(this, "Renderer", y);
    __publicField(this, "TextRenderer", L);
    __publicField(this, "Lexer", x);
    __publicField(this, "Tokenizer", w);
    __publicField(this, "Hooks", P);
    this.use(...e);
  }
  walkTokens(e, t) {
    var _a2, _b;
    let n = [];
    for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let i of r.header) n = n.concat(this.walkTokens(i.tokens, t));
        for (let i of r.rows) for (let o of i) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let r = s;
        n = n.concat(this.walkTokens(r.items, t));
        break;
      }
      default: {
        let r = s;
        ((_b = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b[r.type]) ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
          let o = r[i].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let s = __spreadValues({}, n);
      if (s.async = this.defaults.async || s.async || false, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let i = t.renderers[r.name];
          i ? t.renderers[r.name] = function(...o) {
            let u2 = r.renderer.apply(this, o);
            return u2 === false && (u2 = i.apply(this, o)), u2;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = t[r.level];
          i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), s.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new y(this.defaults);
        for (let i in n.renderer) {
          if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let o = i, u2 = n.renderer[o], a = r[o];
          r[o] = (...c2) => {
            let p2 = u2.apply(r, c2);
            return p2 === false && (p2 = a.apply(r, c2)), p2 || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new w(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let o = i, u2 = n.tokenizer[o], a = r[o];
          r[o] = (...c2) => {
            let p2 = u2.apply(r, c2);
            return p2 === false && (p2 = a.apply(r, c2)), p2;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new P();
        for (let i in n.hooks) {
          if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let o = i, u2 = n.hooks[o], a = r[o];
          P.passThroughHooks.has(i) ? r[o] = (c2) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(i)) return (async () => {
              let k2 = await u2.call(r, c2);
              return a.call(r, k2);
            })();
            let p2 = u2.call(r, c2);
            return a.call(r, p2);
          } : r[o] = (...c2) => {
            if (this.defaults.async) return (async () => {
              let k2 = await u2.apply(r, c2);
              return k2 === false && (k2 = await a.apply(r, c2)), k2;
            })();
            let p2 = u2.apply(r, c2);
            return p2 === false && (p2 = a.apply(r, c2)), p2;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, i = n.walkTokens;
        s.walkTokens = function(o) {
          let u2 = [];
          return u2.push(i.call(this, o)), r && (u2 = u2.concat(r.call(this, o))), u2;
        };
      }
      this.defaults = __spreadValues(__spreadValues({}, this.defaults), s);
    }), this;
  }
  setOptions(e) {
    return this.defaults = __spreadValues(__spreadValues({}, this.defaults), e), this;
  }
  lexer(e, t) {
    return x.lex(e, t != null ? t : this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t != null ? t : this.defaults);
  }
  parseMarkdown(e) {
    return (n, s) => {
      let r = __spreadValues({}, s), i = __spreadValues(__spreadValues({}, this.defaults), r), o = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === true && r.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
        let u2 = i.hooks ? await i.hooks.preprocess(n) : n, c2 = await (i.hooks ? await i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(u2, i), p2 = i.hooks ? await i.hooks.processAllTokens(c2) : c2;
        i.walkTokens && await Promise.all(this.walkTokens(p2, i.walkTokens));
        let h2 = await (i.hooks ? await i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(p2, i);
        return i.hooks ? await i.hooks.postprocess(h2) : h2;
      })().catch(o);
      try {
        i.hooks && (n = i.hooks.preprocess(n));
        let a = (i.hooks ? i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, i);
        i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
        let p2 = (i.hooks ? i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, i);
        return i.hooks && (p2 = i.hooks.postprocess(p2)), p2;
      } catch (u2) {
        return o(u2);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let s = "<p>An error occurred:</p><pre>" + O(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(s) : s;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var M = new D();
function g(l3, e) {
  return M.parse(l3, e);
}
g.options = g.setOptions = function(l3) {
  return M.setOptions(l3), g.defaults = M.defaults, G(g.defaults), g;
};
g.getDefaults = z;
g.defaults = T;
g.use = function(...l3) {
  return M.use(...l3), g.defaults = M.defaults, G(g.defaults), g;
};
g.walkTokens = function(l3, e) {
  return M.walkTokens(l3, e);
};
g.parseInline = M.parseInline;
g.Parser = b;
g.parser = b.parse;
g.Renderer = y;
g.TextRenderer = L;
g.Lexer = x;
g.lexer = x.lex;
g.Tokenizer = w;
g.Hooks = P;
g.parse = g;
var jt = g.options;
var Ft = g.setOptions;
var Ut = g.use;
var Kt = g.walkTokens;
var Wt = g.parseInline;
var Jt = b.parse;
var Vt = x.lex;

// src/plugins/shared/htmlToMiniNodes.ts
var CLOSE_TAG_RE = /<\/(\w+)\s*>/y;
var OPEN_TAG_RE = /<(\w+)((?:\s+[^>]*?)?)(\/?)>/y;
var KATEX_CLOSE_SPAN_RE = /<\/span\s*>/iy;
var KATEX_OPEN_SPAN_RE = /<span[\s>]/iy;
function htmlToMiniNodes(html, escapeText) {
  var _a2;
  const root = { name: "root", children: [] };
  const stack = [root];
  let i = 0;
  function decode(s) {
    if (!escapeText) return s;
    return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_match, value) => String.fromCodePoint(Number(value))).replace(
      /&#x([\da-f]+);/gi,
      (_match, value) => String.fromCodePoint(parseInt(value, 16))
    );
  }
  function mapTag(tag) {
    switch (tag) {
      case "div":
      case "p":
        return "div";
      case "span":
      case "code":
        return "span";
      case "br":
        return "br";
      case "img":
        return "img";
      case "em":
      case "i":
        return "em";
      case "strong":
      case "b":
        return "strong";
      case "sup":
        return "sup";
      case "sub":
        return "sub";
      default:
        return "span";
    }
  }
  while (i < html.length) {
    if (html[i] === "<") {
      CLOSE_TAG_RE.lastIndex = i;
      const closeMatch = CLOSE_TAG_RE.exec(html);
      if (closeMatch) {
        const closeTag = closeMatch[1].toLowerCase();
        for (let j3 = stack.length - 1; j3 > 0; j3--) {
          if (stack[j3].name === mapTag(closeTag)) {
            stack.length = j3;
            break;
          }
        }
        i += closeMatch[0].length;
        continue;
      }
      OPEN_TAG_RE.lastIndex = i;
      const tagMatch = OPEN_TAG_RE.exec(html);
      if (tagMatch) {
        const rawTag = tagMatch[1].toLowerCase();
        const attrStr = tagMatch[2];
        const selfClose = tagMatch[3] === "/";
        if (rawTag === "span" && /\bkatex-mathml\b/.test(attrStr)) {
          let depth = 1;
          let si = i + tagMatch[0].length;
          while (si < html.length && depth > 0) {
            const next = html.indexOf("<", si);
            if (next === -1) break;
            KATEX_CLOSE_SPAN_RE.lastIndex = next;
            const csm = KATEX_CLOSE_SPAN_RE.exec(html);
            KATEX_OPEN_SPAN_RE.lastIndex = next;
            const osm = KATEX_OPEN_SPAN_RE.exec(html);
            if (csm) {
              depth--;
              si = next + csm[0].length;
            } else if (osm) {
              depth++;
              si = next + osm[0].length;
            } else {
              si = next + 1;
            }
          }
          i = si;
          continue;
        }
        const name = mapTag(rawTag);
        const attrs = {};
        const classMatch = /\bclass\s*=\s*"([^"]*)"/.exec(attrStr);
        if (classMatch) attrs.class = classMatch[1];
        const styleMatch = /\bstyle\s*=\s*"([^"]*)"/.exec(attrStr);
        if (styleMatch) attrs.style = styleMatch[1];
        const srcMatch = /\bsrc\s*=\s*"([^"]*)"/.exec(attrStr);
        if (srcMatch) attrs.src = srcMatch[1];
        const altMatch = /\balt\s*=\s*"([^"]*)"/.exec(attrStr);
        if (altMatch) attrs.alt = altMatch[1];
        const node = { name, attrs: Object.keys(attrs).length ? attrs : void 0, children: [] };
        if (selfClose || rawTag === "br") {
          if (rawTag === "br") {
            const parent = stack[stack.length - 1];
            parent.children.push({ name: "text", attrs: { value: "\n" } });
          } else {
            stack[stack.length - 1].children.push(node);
          }
        } else {
          stack[stack.length - 1].children.push(node);
          stack.push(node);
        }
        i += tagMatch[0].length;
        continue;
      }
      i++;
    } else {
      const nextLt = html.indexOf("<", i);
      const text = nextLt === -1 ? html.slice(i) : html.slice(i, nextLt);
      if (text) {
        const parent = stack[stack.length - 1];
        const last = parent.children[parent.children.length - 1];
        if (last && last.name === "text") {
          last.attrs.value += decode(text);
        } else {
          parent.children.push({ name: "text", attrs: { value: decode(text) } });
        }
      }
      i = nextLt === -1 ? html.length : nextLt;
    }
  }
  return (_a2 = root.children) != null ? _a2 : [];
}

// src/platforms/shared/customTokenRenderer.ts
function makeRendererThis(_ctx) {
  return { parser: { parseInline: () => "" } };
}
function renderCustomToken(token, ctx) {
  var _a2;
  const exts = ctx.extensions;
  if (exts && exts.length > 0) {
    for (let i = 0; i < exts.length; i++) {
      const inner = (_a2 = exts[i]) == null ? void 0 : _a2.extensions;
      if (!inner || inner.length === 0) continue;
      for (let j3 = 0; j3 < inner.length; j3++) {
        const tok = inner[j3];
        if (!tok || tok.name !== token.type) continue;
        if (typeof tok.miniRenderer === "function") {
          const rendered = tok.miniRenderer(token, ctx);
          if (!rendered) return [];
          return Array.isArray(rendered) ? rendered : [rendered];
        }
        if (typeof tok.renderer === "function") {
          const html = tok.renderer.call(makeRendererThis(ctx), token);
          if (typeof html !== "string" || html.length === 0) return [];
          return htmlToMiniNodes(html, ctx.escapeText !== false);
        }
        break;
      }
    }
  }
  return [];
}

// src/platforms/shared/miniNodeRenderer.ts
function escapeHtml(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (ch === 38) out += "&amp;";
    else if (ch === 60) out += "&lt;";
    else if (ch === 62) out += "&gt;";
    else if (ch === 34) out += "&quot;";
    else out += text[i];
  }
  return out;
}
function block(name, children, animate, adapter, token, extra) {
  var _a2;
  const node = { name };
  if (extra && Object.keys(extra).length > 0) node.attrs = extra;
  if (children.length) node.children = children;
  if (animate) node.animate = true;
  return (_a2 = adaptNode(adapter, node, { role: "block", token })) != null ? _a2 : node;
}
function inlineNode(adapter, node, token) {
  return adaptNode(adapter, compactNode(node), { role: "inline", token });
}
function compactNode(node) {
  if (node.attrs && Object.keys(node.attrs).length === 0) {
    const _a2 = node, { attrs: _attrs } = _a2, rest = __objRest(_a2, ["attrs"]);
    return rest;
  }
  return node;
}
function adaptNode(adapter, node, meta) {
  var _a2;
  const adapted = (_a2 = adapter.node) == null ? void 0 : _a2.call(adapter, node, meta);
  if (adapted === null) return null;
  return compactNode(adapted != null ? adapted : node);
}
function supports(adapter, capability) {
  var _a2;
  return ((_a2 = adapter.capabilities) == null ? void 0 : _a2[capability]) !== false;
}
function textBlock(value, animate, adapter, token) {
  return block("p", value ? [{ name: "text", attrs: { value } }] : [], animate, adapter, token);
}
function collectText(nodes) {
  var _a2, _b;
  let out = "";
  for (const node of nodes) {
    if (node.name === "text") out += String((_b = (_a2 = node.attrs) == null ? void 0 : _a2.value) != null ? _b : "");
    if (node.children) out += collectText(node.children);
  }
  return out;
}
function copyButton(text) {
  return { name: "copy-button", attrs: { "data-copy": text, class: "md-copy-icon" } };
}
function asNodeArray(x3) {
  if (!x3) return [];
  return Array.isArray(x3) ? x3 : [x3];
}
function buildCodeHeader(ctx, lang, text, token) {
  const cfg = ctx.codeHeader;
  if (cfg === false) return [];
  if (typeof cfg === "function") return asNodeArray(cfg({ lang, text, token }));
  return [
    { name: "text", attrs: { class: "md-codeblock-lang", value: lang || "code" } },
    copyButton(text)
  ];
}
function buildTableHeader(ctx, token) {
  var _a2;
  const cfg = ctx.tableHeader;
  if (cfg === false) return [];
  const markdown = (_a2 = token.raw) != null ? _a2 : "";
  if (typeof cfg === "function") return asNodeArray(cfg({ markdown, token }));
  return [
    { name: "text", attrs: { class: "md-tableblock-title", value: "\u8868\u683C" } },
    copyButton(markdown)
  ];
}
function withHeader(node, header) {
  if (header.length) node.header = header;
  return node;
}
function renderTokensToMiniNodes(tokens, adapter, ctx = {}) {
  const animate = ctx.animation === true;
  const enc = ctx.escapeText === false ? (s) => s : escapeHtml;
  const localCtx = __spreadValues({}, ctx);
  localCtx.renderInlineTokens = (inner) => inlineTokens(inner, adapter, enc, localCtx);
  return blockTokens(tokens, adapter, animate, enc, localCtx);
}
function blockTokens(tokens, adapter, animate, enc, ctx) {
  const out = [];
  for (const tok of tokens) {
    const node = blockTok(tok, adapter, animate, enc, ctx);
    if (node) out.push(node);
  }
  return out;
}
function blockTok(tok, adapter, animate, enc, ctx) {
  var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p;
  switch (tok.type) {
    case "space":
      return null;
    case "heading": {
      const t = tok;
      const depth = Math.min(6, Math.max(1, (_a2 = t.depth) != null ? _a2 : 1));
      return block(`h${depth}`, inlineTokens((_b = t.tokens) != null ? _b : [], adapter, enc, ctx), animate, adapter, tok);
    }
    case "paragraph": {
      const t = tok;
      return block("p", inlineTokens((_c = t.tokens) != null ? _c : [], adapter, enc, ctx), animate, adapter, tok);
    }
    case "code": {
      const t = tok;
      const lang = (_e2 = ((_d = t.lang) != null ? _d : "").trim().split(/\s+/)[0]) != null ? _e2 : "";
      const preAttrs = lang ? { class: "md-code-block", lang } : { class: "md-code-block" };
      const header = buildCodeHeader(ctx, lang, (_f = t.text) != null ? _f : "", t);
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) return withHeader(block("pre", custom, animate, adapter, tok, preAttrs), header);
      if (!supports(adapter, "supportsPre")) {
        return textBlock(enc((_g = t.text) != null ? _g : ""), animate, adapter, tok);
      }
      const codeChild = {
        name: "code",
        children: [{ name: "text", attrs: { value: enc((_h = t.text) != null ? _h : "") } }]
      };
      return withHeader(block("pre", [codeChild], animate, adapter, tok, preAttrs), header);
    }
    case "hr":
      return block("hr", [], animate, adapter, tok);
    case "blockquote": {
      const t = tok;
      const children = blockTokens((_i = t.tokens) != null ? _i : [], adapter, animate, enc, ctx);
      if (!supports(adapter, "supportsBlockquote")) {
        return textBlock(collectText(children), animate, adapter, tok);
      }
      return block("blockquote", children, animate, adapter, tok);
    }
    case "list": {
      const t = tok;
      const ordered = !!t.ordered;
      const start = typeof t.start === "number" ? t.start : 1;
      const tag = ordered ? "ol" : "ul";
      const children = t.items.map((item) => listItemTok(item, adapter, animate, enc, ctx));
      return block(tag, children, animate, adapter, tok, ordered ? adapter.olAttrs(start, t) : void 0);
    }
    case "html": {
      const t = tok;
      const raw = ((_k = (_j = t.text) != null ? _j : t.raw) != null ? _k : "").replace(/\s+$/, "");
      return block("div", raw ? [{ name: "text", attrs: { value: raw } }] : [], animate, adapter, tok);
    }
    case "table": {
      const t = tok;
      if (!supports(adapter, "supportsTable")) {
        const rows = [
          (_l = t.header) != null ? _l : [],
          ...(_m = t.rows) != null ? _m : []
        ];
        const value = rows.map((row) => row.map((cell) => {
          var _a3;
          return collectText(inlineTokens((_a3 = cell.tokens) != null ? _a3 : [], adapter, enc, ctx));
        }).join("	")).join("\n");
        return textBlock(value, animate, adapter, tok);
      }
      const headCells = ((_n2 = t.header) != null ? _n2 : []).map((cell) => {
        var _a3;
        return {
          name: "th",
          attrs: { class: "md-th" },
          children: inlineTokens((_a3 = cell.tokens) != null ? _a3 : [], adapter, enc, ctx)
        };
      });
      const rowNodes = ((_o = t.rows) != null ? _o : []).map((row) => ({
        name: "tr",
        attrs: { class: "md-tr" },
        children: row.map((cell) => {
          var _a3;
          return {
            name: "td",
            attrs: { class: "md-td" },
            children: inlineTokens((_a3 = cell.tokens) != null ? _a3 : [], adapter, enc, ctx)
          };
        })
      }));
      const headerRow = { name: "tr", attrs: { class: "md-tr" }, children: headCells };
      return withHeader(
        block("table", [headerRow, ...rowNodes], animate, adapter, tok, { class: "md-table" }),
        buildTableHeader(ctx, t)
      );
    }
    case "text": {
      const t = tok;
      const inline = t.tokens ? inlineTokens(t.tokens, adapter, enc, ctx) : [{ name: "text", attrs: { value: enc((_p = t.text) != null ? _p : "") } }];
      return block("p", inline, animate, adapter, tok);
    }
    case "def":
      return null;
    default: {
      const custom = renderCustomToken(tok, ctx);
      return custom.length ? block("div", custom, animate, adapter, tok) : null;
    }
  }
}
function listItemTok(item, adapter, animate, enc, ctx) {
  var _a2, _b, _c, _d;
  const blocks = (_a2 = item.tokens) != null ? _a2 : [];
  const children = [];
  if (blocks.length === 1 && blocks[0].type === "paragraph") {
    const p2 = blocks[0];
    children.push(...inlineTokens((_b = p2.tokens) != null ? _b : [], adapter, enc, ctx));
  } else {
    for (const b3 of blocks) {
      if (b3.type === "paragraph") {
        const p2 = b3;
        children.push(...inlineTokens((_c = p2.tokens) != null ? _c : [], adapter, enc, ctx));
      } else if (b3.type === "text") {
        const t = b3;
        const inline = t.tokens ? inlineTokens(t.tokens, adapter, enc, ctx) : [{ name: "text", attrs: { value: enc((_d = t.text) != null ? _d : "") } }];
        children.push(...inline);
      } else {
        const node = blockTok(b3, adapter, animate, enc, ctx);
        if (node) children.push(node);
      }
    }
  }
  return block("li", children, false, adapter, item);
}
function inlineTokens(tokens, adapter, enc, ctx) {
  const out = [];
  for (const tok of tokens) inlineTok(tok, adapter, enc, out, ctx);
  return out;
}
function inlineTok(tok, adapter, enc, out, ctx) {
  var _a2, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k;
  switch (tok.type) {
    case "text": {
      const t = tok;
      if (t.tokens && t.tokens.length) {
        for (const inner of t.tokens) inlineTok(inner, adapter, enc, out, ctx);
      } else {
        const value = enc((_a2 = t.text) != null ? _a2 : "");
        const node = inlineNode(adapter, { name: "text", attrs: { value } }, tok);
        if (value && node) out.push(node);
      }
      return;
    }
    case "escape": {
      const t = tok;
      const value = enc((_b = t.text) != null ? _b : "");
      const node = inlineNode(adapter, { name: "text", attrs: { value } }, tok);
      if (value && node) out.push(node);
      return;
    }
    case "strong": {
      const t = tok;
      const inner = [];
      for (const c2 of (_c = t.tokens) != null ? _c : []) inlineTok(c2, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: "strong", children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case "em": {
      const t = tok;
      const inner = [];
      for (const c2 of (_d = t.tokens) != null ? _d : []) inlineTok(c2, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: "em", children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case "del": {
      const t = tok;
      const inner = [];
      for (const c2 of (_e2 = t.tokens) != null ? _e2 : []) inlineTok(c2, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, { name: "del", children: inner }, tok);
      if (node) out.push(node);
      return;
    }
    case "codespan": {
      const t = tok;
      const node = inlineNode(adapter, {
        name: "code",
        attrs: { class: "md-inline-code" },
        children: [{ name: "text", attrs: { value: enc((_f = t.text) != null ? _f : "") } }]
      }, tok);
      if (node) out.push(node);
      return;
    }
    case "br":
      {
        const node = inlineNode(adapter, { name: "br" }, tok);
        if (node) out.push(node);
      }
      return;
    case "link": {
      const t = tok;
      const inner = [];
      for (const c2 of (_g = t.tokens) != null ? _g : []) inlineTok(c2, adapter, enc, inner, ctx);
      const node = inlineNode(adapter, {
        name: "a",
        attrs: adapter.linkAttrs((_h = t.href) != null ? _h : "", t),
        children: inner.length ? inner : [{ name: "text", attrs: { value: "" } }]
      }, tok);
      if (node) out.push(node);
      return;
    }
    case "image": {
      const t = tok;
      const node = inlineNode(
        adapter,
        { name: "img", attrs: { src: adapter.imageSrc((_i = t.href) != null ? _i : "", t), alt: (_j = t.text) != null ? _j : "" } },
        tok
      );
      if (node) out.push(node);
      return;
    }
    case "html": {
      const t = tok;
      const node = inlineNode(adapter, { name: "text", attrs: { value: enc((_k = t.text) != null ? _k : "") } }, tok);
      if (node) out.push(node);
      return;
    }
    default: {
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) out.push(...custom);
      return;
    }
  }
}

// src/platforms/alipay/tokensToAlipay.ts
function buildMarkedOptions(opts) {
  return { gfm: opts.gfm !== false, breaks: !!opts.breaks };
}
var alipayCapabilities = {
  supportsOlStart: false,
  requiresHttpsImage: true,
  anchorHrefMode: "href",
  supportsTable: true,
  supportsPre: true,
  supportsBlockquote: true
};
var alipayAdapter = {
  capabilities: alipayCapabilities,
  linkAttrs: (href) => ({ href, class: "md-link" }),
  imageSrc: (src) => src.replace(/^http:\/\//, "https://"),
  olAttrs: () => ({}),
  node: (node, meta) => {
    var _a2, _b;
    if (node.name !== "table") return node;
    const table = meta.token;
    const columnCount = (_b = (_a2 = table.header) == null ? void 0 : _a2.length) != null ? _b : 0;
    return __spreadProps(__spreadValues({}, node), {
      attrs: __spreadProps(__spreadValues({}, node.attrs), {
        class: columnCount > 1 ? "md-table md-table-multi" : "md-table md-table-single"
      })
    });
  }
};
function tokensToAlipay(content, opts = {}) {
  const _a2 = opts, { options } = _a2, ctx = __objRest(_a2, ["options"]);
  const tokens = x.lex(content, buildMarkedOptions(options != null ? options : {}));
  return tokensToAlipayNodes(tokens, ctx);
}
function tokensToAlipayNodes(tokens, ctx = {}) {
  return renderTokensToMiniNodes(tokens, alipayAdapter, ctx);
}

// src/platforms/alipay/index.ts
var alipayRenderer = {
  name: "alipay",
  capabilities: alipayCapabilities,
  renderTokens: tokensToAlipayNodes
};

// src/platforms/wechat/tokensToWechat.ts
function buildMarkedOptions2(opts) {
  return { gfm: opts.gfm !== false, breaks: !!opts.breaks };
}
var wechatCapabilities = {
  supportsOlStart: true,
  requiresHttpsImage: false,
  anchorHrefMode: "data-href",
  supportsTable: true,
  supportsPre: true,
  supportsBlockquote: true
};
var wechatAdapter = {
  capabilities: wechatCapabilities,
  linkAttrs: (href) => ({ "data-href": href, class: "md-link" }),
  imageSrc: (src) => src,
  olAttrs: (start) => {
    const attrs = {};
    if (start !== 1) attrs.start = start;
    return attrs;
  },
  node: (node, meta) => {
    var _a2, _b;
    if (node.name !== "table") return node;
    const table = meta.token;
    const columnCount = (_b = (_a2 = table.header) == null ? void 0 : _a2.length) != null ? _b : 0;
    return __spreadProps(__spreadValues({}, node), {
      attrs: __spreadProps(__spreadValues({}, node.attrs), {
        class: columnCount > 1 ? "md-table md-table-multi" : "md-table md-table-single"
      })
    });
  }
};
function tokensToWechat(content, opts = {}) {
  const _a2 = opts, { options } = _a2, ctx = __objRest(_a2, ["options"]);
  const tokens = x.lex(content, buildMarkedOptions2(options != null ? options : {}));
  return tokensToWechatNodes(tokens, ctx);
}
function tokensToWechatNodes(tokens, ctx = {}) {
  return renderTokensToMiniNodes(tokens, wechatAdapter, ctx);
}

// src/platforms/wechat/index.ts
var wechatRenderer = {
  name: "wechat",
  capabilities: wechatCapabilities,
  renderTokens: tokensToWechatNodes
};

// src/platforms/index.ts
var DETECTORS = [
  {
    name: "my",
    read: () => typeof my !== "undefined" ? my : void 0,
    platform: "alipay"
  },
  {
    name: "wx",
    read: () => typeof wx !== "undefined" ? wx : void 0,
    platform: "wechat"
  }
];
var DEFAULT_PLATFORM = "alipay";
var RENDERERS = {
  alipay: alipayRenderer,
  wechat: wechatRenderer
};
function isRuntimeObject(obj) {
  if (!obj || typeof obj !== "object") return false;
  const target = obj;
  return typeof target.getSystemInfo === "function" || typeof target.getSystemInfoSync === "function";
}
function detectPlatformRuntime() {
  for (const { read, platform } of DETECTORS) {
    let obj;
    try {
      obj = read();
    } catch (e) {
      continue;
    }
    if (isRuntimeObject(obj)) {
      return platform;
    }
  }
  return DEFAULT_PLATFORM;
}
function resolvePlatform(platform) {
  if (!platform || platform === "auto") return detectPlatformRuntime();
  return platform;
}
function getPlatformRenderer(platform) {
  const renderer = RENDERERS[platform];
  if (!renderer) {
    throw new Error(`Unknown platform renderer: ${platform}`);
  }
  return renderer;
}
function registerPlatformRenderer(renderer) {
  RENDERERS[renderer.name] = renderer;
}

// src/streaming/StreamingProcessor.ts
var DEFAULT_DELIMITERS = /[。？！……；：——，、\n]/;
var DEFAULT_MAX_CHUNK_SIZE = 80;
function isZeroDelay(spec) {
  if (Array.isArray(spec)) return spec.length === 0 || spec.every((d3) => d3 === 0);
  return spec === 0;
}
function resolveDelay(spec, index) {
  if (Array.isArray(spec)) {
    if (spec.length === 0) return 0;
    return spec[Math.min(index, spec.length - 1)];
  }
  return spec;
}
var cachedSegmenter = null;
var segmenterResolved = false;
function splitGraphemes(text) {
  if (!segmenterResolved) {
    segmenterResolved = true;
    try {
      const Seg = Intl.Segmenter;
      if (Seg) cachedSegmenter = new Seg();
    } catch (e) {
      cachedSegmenter = null;
    }
  }
  if (cachedSegmenter) {
    const out = [];
    for (const s of cachedSegmenter.segment(text)) out.push(s.segment);
    return out;
  }
  return Array.from(text);
}
var StreamingProcessor = class {
  constructor(cfg) {
    this.buffer = "";
    this.renderedText = "";
    this.previousMarkdown = "";
    this.stableNodes = [];
    this.committedLen = 0;
    /** Whether the character at committedLen is inside a fenced code block (used for incremental scanning). */
    this.committedInFence = false;
    this.committedFenceChar = "";
    this.pendingChunks = [];
    this.chunkIndex = 0;
    /** 已渲染块的累计序号，用于数组变速延迟（charDelay/chunkDelay 为数组时按此取值）。 */
    this.chunkRenderIndex = 0;
    this.activeChunk = "";
    this.activeChunkOffset = 0;
    this.timer = null;
    this.currentHasNextChunk = false;
    var _a2, _b, _c, _d, _e2;
    this.config = {
      transform: cfg.transform,
      fixup: cfg.fixup,
      onUpdate: cfg.onUpdate,
      onPatch: cfg.onPatch,
      onComplete: cfg.onComplete,
      semanticEnabled: (_a2 = cfg.semanticEnabled) != null ? _a2 : true,
      delimiters: (_b = cfg.delimiters) != null ? _b : DEFAULT_DELIMITERS,
      maxChunkSize: (_c = cfg.maxChunkSize) != null ? _c : DEFAULT_MAX_CHUNK_SIZE,
      chunkDelay: (_d = cfg.chunkDelay) != null ? _d : 0,
      charDelay: (_e2 = cfg.charDelay) != null ? _e2 : 0
    };
  }
  /** 内容更新：增量则追加到 buffer，否则 reset 后整段替换。 */
  handleContentUpdate(content) {
    if (content.startsWith(this.previousMarkdown)) {
      this.buffer += content.slice(this.previousMarkdown.length);
    } else {
      this.reset();
      this.buffer = content;
    }
    this.previousMarkdown = content;
  }
  reset() {
    this.buffer = "";
    this.renderedText = "";
    this.previousMarkdown = "";
    this.pendingChunks = [];
    this.chunkIndex = 0;
    this.chunkRenderIndex = 0;
    this.activeChunk = "";
    this.activeChunkOffset = 0;
    this.stableNodes = [];
    this.committedLen = 0;
    this.committedInFence = false;
    this.committedFenceChar = "";
    this.cancelScheduledRender();
  }
  /**
   * 推进渲染。若 chunk/charDelay 都为 0，立即一次性 flush；否则进入打字机循环。
   */
  runRenderLoop(hasNextChunk) {
    this.currentHasNextChunk = hasNextChunk;
    const { chunkDelay, charDelay } = this.config;
    this.cancelScheduledRender();
    if (isZeroDelay(chunkDelay) && isZeroDelay(charDelay)) {
      if (this.buffer.length > 0) {
        this.renderedText += this.buffer;
        this.buffer = "";
      }
      this.flushNodes();
      if (!hasNextChunk) {
        this.config.onComplete();
      }
      return;
    }
    this.splitIntoChunks(hasNextChunk);
    this.chunkIndex = 0;
    this.scheduleNext();
  }
  /** 当前已输出给 UI 的完整 markdown 字符串 */
  getRenderedText() {
    return this.renderedText;
  }
  /** 是否还有待处理 chunks（外部可据此判断是否完成） */
  hasPendingChunks() {
    return this.chunkIndex < this.pendingChunks.length || this.buffer.length > 0;
  }
  // --- 内部 ---
  /** 按 delimiters + maxChunkSize 把 buffer 切成 chunk 序列；hasNext=false 时 flush 末尾。 */
  splitIntoChunks(hasNextChunk) {
    var _a2;
    const { semanticEnabled, delimiters = DEFAULT_DELIMITERS, maxChunkSize = DEFAULT_MAX_CHUNK_SIZE } = this.config;
    const pending = [];
    let remaining = this.buffer;
    while (remaining.length > 0) {
      let chunk = "";
      if (semanticEnabled) {
        const m3 = remaining.match(delimiters);
        const cut = m3 ? ((_a2 = m3.index) != null ? _a2 : 0) + 1 : -1;
        if (cut > 0) {
          chunk = remaining.slice(0, cut);
          remaining = remaining.slice(cut);
        } else if (remaining.length > maxChunkSize && hasNextChunk) {
          chunk = remaining.slice(0, maxChunkSize);
          remaining = remaining.slice(maxChunkSize);
        } else if (!hasNextChunk) {
          chunk = remaining;
          remaining = "";
        } else {
          break;
        }
      } else if (remaining.length > maxChunkSize) {
        chunk = remaining.slice(0, maxChunkSize);
        remaining = remaining.slice(maxChunkSize);
      } else if (!hasNextChunk) {
        chunk = remaining;
        remaining = "";
      } else {
        break;
      }
      if (chunk.length > 0) pending.push(chunk);
    }
    this.pendingChunks = pending;
    this.buffer = remaining;
  }
  scheduleNext() {
    const { chunkDelay, charDelay, onComplete } = this.config;
    const interChunkDelay = this.chunkIndex === 0 ? 0 : resolveDelay(chunkDelay, this.chunkRenderIndex);
    this.timer = setTimeout(() => {
      if (this.chunkIndex >= this.pendingChunks.length) {
        if (this.buffer.length > 0) {
          this.splitIntoChunks(this.currentHasNextChunk);
          this.scheduleNext();
          return;
        }
        this.timer = null;
        this.activeChunk = "";
        this.activeChunkOffset = 0;
        if (!this.currentHasNextChunk) onComplete();
        return;
      }
      const chunk = this.pendingChunks[this.chunkIndex];
      this.activeChunk = chunk;
      this.activeChunkOffset = 0;
      const cd = resolveDelay(charDelay, this.chunkRenderIndex);
      const graphemes = cd > 0 ? splitGraphemes(chunk) : null;
      if (cd > 0 && graphemes && graphemes.length > 1) {
        let gi = 0;
        let offset = 0;
        const step = () => {
          if (gi < graphemes.length) {
            const g3 = graphemes[gi++];
            this.renderedText += g3;
            offset += g3.length;
            this.activeChunkOffset = offset;
            this.flushNodes();
            this.timer = setTimeout(step, cd);
          } else {
            this.activeChunk = "";
            this.activeChunkOffset = 0;
            this.chunkIndex += 1;
            this.chunkRenderIndex += 1;
            this.scheduleNext();
          }
        };
        step();
      } else {
        this.renderedText += chunk;
        this.activeChunk = "";
        this.activeChunkOffset = 0;
        this.chunkIndex += 1;
        this.chunkRenderIndex += 1;
        this.flushNodes();
        this.scheduleNext();
      }
    }, interChunkDelay);
  }
  cancelScheduledRender() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    let remaining = "";
    let startIndex = this.chunkIndex;
    if (this.activeChunk) {
      remaining += this.activeChunk.slice(this.activeChunkOffset);
      startIndex = this.chunkIndex + 1;
    }
    if (startIndex < this.pendingChunks.length) {
      remaining += this.pendingChunks.slice(startIndex).join("");
    }
    if (remaining) this.buffer = remaining + this.buffer;
    this.pendingChunks = [];
    this.chunkIndex = 0;
    this.activeChunk = "";
    this.activeChunkOffset = 0;
  }
  /** 推进 commit 点：从上次 committedLen 开始增量扫描，找 fenced code 之外的最后一段「双换行」位置。 */
  advanceCommit() {
    const text = this.renderedText;
    if (this.committedLen >= text.length) return;
    let inFence = this.committedInFence;
    let fenceChar = this.committedFenceChar;
    let lineStart = this.committedLen;
    if (this.committedLen > 0) {
      let ls = this.committedLen;
      while (ls > 0 && text[ls - 1] !== "\n") ls--;
      lineStart = ls;
    }
    let lastSafe = -1;
    let lastSafeInFence = false;
    let lastSafeFenceChar = "";
    let prevBlank = false;
    for (let i = lineStart; i <= text.length; i++) {
      if (i === text.length || text[i] === "\n") {
        const line = text.slice(lineStart, i);
        const fence = /^ {0,3}(`{3,}|~{3,})/.exec(line);
        if (fence) {
          if (!inFence) {
            inFence = true;
            fenceChar = fence[1][0];
          } else if (fence[1][0] === fenceChar) {
            inFence = false;
            fenceChar = "";
          }
        }
        const isBlank = line.trim() === "";
        if (!inFence && isBlank && prevBlank) {
          lastSafe = i === text.length ? i : i + 1;
          lastSafeInFence = inFence;
          lastSafeFenceChar = fenceChar;
        }
        prevBlank = isBlank && !inFence;
        lineStart = i + 1;
      }
    }
    if (lastSafe > this.committedLen) {
      const segment = text.slice(this.committedLen, lastSafe);
      const nodes = this.config.transform(segment);
      this.stableNodes.push(...nodes);
      this.committedLen = lastSafe;
      this.committedInFence = lastSafeInFence;
      this.committedFenceChar = lastSafeFenceChar;
    }
  }
  /** 重新解析 tail 部分，与 stableNodes 合并后 emit。 */
  flushNodes() {
    const { onUpdate, onPatch, transform, fixup } = this.config;
    onUpdate(this.renderedText);
    this.advanceCommit();
    const tail = this.renderedText.slice(this.committedLen);
    const fixedTail = tail && fixup ? fixup(tail) : tail;
    const tailNodes = fixedTail ? transform(fixedTail) : [];
    onPatch(this.stableNodes.concat(tailNodes));
  }
};

// node_modules/remend/dist/index.js
var cn = Object.defineProperty;
var un = Object.defineProperties;
var fn = Object.getOwnPropertyDescriptors;
var $2 = Object.getOwnPropertySymbols;
var dn = Object.prototype.hasOwnProperty;
var gn = Object.prototype.propertyIsEnumerable;
var O2 = (n, r, e) => r in n ? cn(n, r, { enumerable: true, configurable: true, writable: true, value: e }) : n[r] = e;
var I2 = (n, r) => {
  for (var e in r || (r = {})) dn.call(r, e) && O2(n, e, r[e]);
  if ($2) for (var e of $2(r)) gn.call(r, e) && O2(n, e, r[e]);
  return n;
};
var k = (n, r) => un(n, fn(r));
var c = (n, r) => {
  let e = false, i = false;
  for (let s = 0; s < r; s += 1) {
    if (n[s] === "\\" && s + 1 < n.length && n[s + 1] === "`") {
      s += 1;
      continue;
    }
    if (n.substring(s, s + 3) === "```") {
      i = !i, s += 2;
      continue;
    }
    !i && n[s] === "`" && (e = !e);
  }
  return e || i;
};
var hn = (n, r) => {
  let e = n.substring(r, r + 3) === "```", i = r > 0 && n.substring(r - 1, r + 2) === "```", s = r > 1 && n.substring(r - 2, r + 1) === "```";
  return e || i || s;
};
var L2 = (n) => {
  let r = 0;
  for (let e = 0; e < n.length; e += 1) {
    if (n[e] === "\\" && e + 1 < n.length && n[e + 1] === "`") {
      e += 1;
      continue;
    }
    n[e] === "`" && !hn(n, e) && (r += 1);
  }
  return r;
};
var f = (n, r) => {
  let e = false, i = false, s = -1;
  for (let o = 0; o < n.length; o += 1) {
    if (n[o] === "\\" && o + 1 < n.length && n[o + 1] === "`") {
      o += 1;
      continue;
    }
    if (n.substring(o, o + 3) === "```") {
      i = !i, o += 2;
      continue;
    }
    if (!i && n[o] === "`") if (e) {
      if (s < r && r < o) return true;
      e = false, s = -1;
    } else e = true, s = o;
  }
  return false;
};
var mn = /^(\s*(?:[-*+]|\d+[.)]) +)>(=?\s*[$]?\d)/gm;
var E2 = (n) => !n || typeof n != "string" || !n.includes(">") ? n : n.replace(mn, (r, e, i, s) => c(n, s) ? r : `${e}\\>${i}`);
var M2 = /(\*\*)([^*]*\*?)$/;
var N2 = /(__)([^_]*?)$/;
var y2 = /(\*\*\*)([^*]*?)$/;
var R = /(\*)([^*]*?)$/;
var U2 = /(_)([^_]*?)$/;
var W2 = /(`)([^`]*?)$/;
var K2 = /(~~)([^~]*?)$/;
var d2 = /^[\s_~*`]*$/;
var b2 = /^[\s]*[-*+][\s]+$/;
var H2 = /[\p{L}\p{N}_]/u;
var D2 = /^```[^`\n]*```?$/;
var w2 = /^\*{4,}$/;
var G2 = /(__)([^_]+)_$/;
var F2 = /(~~)([^~]+)~$/;
var T2 = /~~/g;
var g2 = (n) => {
  if (!n) return false;
  let r = n.charCodeAt(0);
  return r >= 48 && r <= 57 || r >= 65 && r <= 90 || r >= 97 && r <= 122 || r === 95 ? true : H2.test(n);
};
var X2 = (n, r) => {
  let e = 1;
  for (let i = r - 1; i >= 0; i -= 1) if (n[i] === "]") e += 1;
  else if (n[i] === "[" && (e -= 1, e === 0)) return i;
  return -1;
};
var C = (n, r) => {
  let e = 1;
  for (let i = r + 1; i < n.length; i += 1) if (n[i] === "[") e += 1;
  else if (n[i] === "]" && (e -= 1, e === 0)) return i;
  return -1;
};
var h = (n, r) => {
  let e = false, i = false;
  for (let s = 0; s < n.length && s < r; s += 1) {
    if (n[s] === "\\" && n[s + 1] === "$") {
      s += 1;
      continue;
    }
    n[s] === "$" && (n[s + 1] === "$" ? (i = !i, s += 1, e = false) : i || (e = !e));
  }
  return e || i;
};
var In = (n, r) => {
  for (let e = r; e < n.length; e += 1) {
    if (n[e] === ")") return true;
    if (n[e] === `
`) return false;
  }
  return false;
};
var m2 = (n, r) => {
  for (let e = r - 1; e >= 0; e -= 1) {
    if (n[e] === ")") return false;
    if (n[e] === "(") return e > 0 && n[e - 1] === "]" ? In(n, r) : false;
    if (n[e] === `
`) return false;
  }
  return false;
};
var z2 = (n, r) => {
  for (let e = r - 1; e >= 0; e -= 1) {
    if (n[e] === ">") return false;
    if (n[e] === "<") {
      let i = e + 1 < n.length ? n[e + 1] : "";
      return i >= "a" && i <= "z" || i >= "A" && i <= "Z" || i === "/";
    }
    if (n[e] === `
`) return false;
  }
  return false;
};
var p = (n, r, e) => {
  let i = 0;
  for (let l3 = r - 1; l3 >= 0; l3 -= 1) if (n[l3] === `
`) {
    i = l3 + 1;
    break;
  }
  let s = n.length;
  for (let l3 = r; l3 < n.length; l3 += 1) if (n[l3] === `
`) {
    s = l3;
    break;
  }
  let o = n.substring(i, s), t = 0, a = false;
  for (let l3 of o) if (l3 === e) t += 1;
  else if (l3 !== " " && l3 !== "	") {
    a = true;
    break;
  }
  return t >= 3 && !a;
};
var kn = (n, r, e, i) => e === "\\" || n.includes("$") && h(n, r) ? true : e !== "*" && i === "*" ? (r < n.length - 2 ? n[r + 2] : "") !== "*" : !!(e === "*" || e && i && g2(e) && g2(i) || (!e || e === " " || e === "	" || e === `
`) && (!i || i === " " || i === "	" || i === `
`));
var Y2 = (n) => {
  let r = 0, e = false, i = n.length;
  for (let s = 0; s < i; s += 1) {
    if (n[s] === "`" && s + 2 < i && n[s + 1] === "`" && n[s + 2] === "`") {
      e = !e, s += 2;
      continue;
    }
    if (e || n[s] !== "*") continue;
    let o = s > 0 ? n[s - 1] : "", t = s < i - 1 ? n[s + 1] : "";
    kn(n, s, o, t) || (r += 1);
  }
  return r;
};
var bn = (n, r, e, i) => !!(e === "\\" || n.includes("$") && h(n, r) || m2(n, r) || z2(n, r) || e === "_" || i === "_" || e && i && g2(e) && g2(i));
var Tn = (n) => {
  let r = 0, e = false, i = n.length;
  for (let s = 0; s < i; s += 1) {
    if (n[s] === "`" && s + 2 < i && n[s + 1] === "`" && n[s + 2] === "`") {
      e = !e, s += 2;
      continue;
    }
    if (e || n[s] !== "_") continue;
    let o = s > 0 ? n[s - 1] : "", t = s < i - 1 ? n[s + 1] : "";
    bn(n, s, o, t) || (r += 1);
  }
  return r;
};
var Cn = (n) => {
  let r = 0, e = 0, i = false;
  for (let s = 0; s < n.length; s += 1) {
    if (n[s] === "`" && s + 2 < n.length && n[s + 1] === "`" && n[s + 2] === "`") {
      e >= 3 && (r += Math.floor(e / 3)), e = 0, i = !i, s += 2;
      continue;
    }
    i || (n[s] === "*" ? e += 1 : (e >= 3 && (r += Math.floor(e / 3)), e = 0));
  }
  return e >= 3 && (r += Math.floor(e / 3)), r;
};
var A2 = (n) => {
  let r = 0, e = false;
  for (let i = 0; i < n.length; i += 1) {
    if (n[i] === "`" && i + 2 < n.length && n[i + 1] === "`" && n[i + 2] === "`") {
      e = !e, i += 2;
      continue;
    }
    e || n[i] === "*" && i + 1 < n.length && n[i + 1] === "*" && (r += 1, i += 1);
  }
  return r;
};
var v2 = (n) => {
  let r = 0, e = false;
  for (let i = 0; i < n.length; i += 1) {
    if (n[i] === "`" && i + 2 < n.length && n[i + 1] === "`" && n[i + 2] === "`") {
      e = !e, i += 2;
      continue;
    }
    e || n[i] === "_" && i + 1 < n.length && n[i + 1] === "_" && (r += 1, i += 1);
  }
  return r;
};
var An = (n, r, e) => {
  if (!r || d2.test(r)) return true;
  let s = n.substring(0, e).lastIndexOf(`
`), o = s === -1 ? 0 : s + 1, t = n.substring(o, e);
  return b2.test(t) && r.includes(`
`) ? true : p(n, e, "*");
};
var j2 = (n) => {
  let r = n.match(M2);
  if (!r) return n;
  let e = r[2], i = n.lastIndexOf(r[1]);
  return c(n, i) || f(n, i) || An(n, e, i) ? n : A2(n) % 2 === 1 ? e.endsWith("*") ? `${n}*` : `${n}**` : n;
};
var Bn = (n, r, e) => {
  if (!r || d2.test(r)) return true;
  let s = n.substring(0, e).lastIndexOf(`
`), o = s === -1 ? 0 : s + 1, t = n.substring(o, e);
  return b2.test(t) && r.includes(`
`) ? true : p(n, e, "_");
};
var Q2 = (n) => {
  let r = n.match(N2);
  if (!r) {
    let o = n.match(G2);
    if (o) {
      let t = n.lastIndexOf(o[1]);
      if (!(c(n, t) || f(n, t)) && v2(n) % 2 === 1) return `${n}_`;
    }
    return n;
  }
  let e = r[2], i = n.lastIndexOf(r[1]);
  return c(n, i) || f(n, i) || Bn(n, e, i) ? n : v2(n) % 2 === 1 ? `${n}__` : n;
};
var Sn = (n) => {
  let r = false;
  for (let e = 0; e < n.length; e += 1) {
    if (n[e] === "`" && e + 2 < n.length && n[e + 1] === "`" && n[e + 2] === "`") {
      r = !r, e += 2;
      continue;
    }
    if (!r && n[e] === "*" && n[e - 1] !== "*" && n[e + 1] !== "*" && n[e - 1] !== "\\" && !h(n, e)) {
      let i = e > 0 ? n[e - 1] : "", s = e < n.length - 1 ? n[e + 1] : "";
      if ((!i || i === " " || i === "	" || i === `
`) && (!s || s === " " || s === "	" || s === `
`) || i && s && g2(i) && g2(s)) continue;
      return e;
    }
  }
  return -1;
};
var Z = (n) => {
  if (!n.match(R)) return n;
  let e = Sn(n);
  if (e === -1 || c(n, e) || f(n, e)) return n;
  let i = n.substring(e + 1);
  return !i || d2.test(i) ? n : Y2(n) % 2 === 1 ? `${n}*` : n;
};
var q2 = (n) => {
  let r = false;
  for (let e = 0; e < n.length; e += 1) {
    if (n[e] === "`" && e + 2 < n.length && n[e + 1] === "`" && n[e + 2] === "`") {
      r = !r, e += 2;
      continue;
    }
    if (!r && n[e] === "_" && n[e - 1] !== "_" && n[e + 1] !== "_" && n[e - 1] !== "\\" && !h(n, e) && !m2(n, e)) {
      let i = e > 0 ? n[e - 1] : "", s = e < n.length - 1 ? n[e + 1] : "";
      if (i && s && g2(i) && g2(s)) continue;
      return e;
    }
  }
  return -1;
};
var _n = (n) => {
  let r = n.length;
  for (; r > 0 && n[r - 1] === `
`; ) r -= 1;
  if (r < n.length) {
    let e = n.slice(0, r), i = n.slice(r);
    return `${e}_${i}`;
  }
  return `${n}_`;
};
var Pn = (n) => {
  if (!n.endsWith("**")) return null;
  let r = n.slice(0, -2);
  if (A2(r) % 2 !== 1) return null;
  let i = r.indexOf("**"), s = q2(r);
  return i !== -1 && s !== -1 && i < s ? `${r}_**` : null;
};
var J2 = (n) => {
  if (!n.match(U2)) return n;
  let e = q2(n);
  if (e === -1) return n;
  let i = n.substring(e + 1);
  if (!i || d2.test(i) || c(n, e) || f(n, e)) return n;
  if (Tn(n) % 2 === 1) {
    let o = Pn(n);
    return o !== null ? o : _n(n);
  }
  return n;
};
var $n = (n) => {
  let r = A2(n), e = Y2(n);
  return r % 2 === 0 && e % 2 === 0;
};
var On = (n, r, e) => !r || d2.test(r) || c(n, e) || f(n, e) ? true : p(n, e, "*");
var V2 = (n) => {
  if (w2.test(n)) return n;
  let r = n.match(y2);
  if (!r) return n;
  let e = r[2], i = n.lastIndexOf(r[1]);
  return On(n, e, i) ? n : Cn(n) % 2 === 1 ? $n(n) ? n : `${n}***` : n;
};
var Ln = /<[a-zA-Z/][^>]*$/;
var x2 = (n) => {
  let r = n.match(Ln);
  return !r || r.index === void 0 || c(n, r.index) ? n : n.substring(0, r.index).trimEnd();
};
var En = (n) => !n.match(D2) || n.includes(`
`) ? null : n.endsWith("``") && !n.endsWith("```") ? `${n}\`` : n;
var Mn = (n) => (n.match(/```/g) || []).length % 2 === 1;
var nn = (n) => {
  let r = En(n);
  if (r !== null) return r;
  let e = n.match(W2);
  if (e && !Mn(n)) {
    let i = e[2];
    if (!i || d2.test(i)) return n;
    if (L2(n) % 2 === 1) return `${n}\``;
  }
  return n;
};
var en = (n, r) => r >= 2 && n.substring(r - 2, r + 1) === "```" || r >= 1 && n.substring(r - 1, r + 2) === "```" || r <= n.length - 3 && n.substring(r, r + 3) === "```";
var Nn = (n) => {
  let r = 0, e = false;
  for (let i = 0; i < n.length - 1; i += 1) n[i] === "`" && !en(n, i) && (e = !e), !e && n[i] === "$" && n[i + 1] === "$" && (r += 1, i += 1);
  return r;
};
var yn = (n) => {
  let r = 0, e = false;
  for (let i = 0; i < n.length; i += 1) {
    if (n[i] === "\\") {
      i += 1;
      continue;
    }
    if (n[i] === "`" && !en(n, i)) {
      e = !e;
      continue;
    }
    !e && n[i] === "$" && (i + 1 < n.length && n[i + 1] === "$" ? i += 1 : r += 1);
  }
  return r;
};
var Rn = (n) => {
  if (n.endsWith("$") && !n.endsWith("$$")) return `${n}$`;
  let r = n.indexOf("$$");
  return r !== -1 && n.indexOf(`
`, r) !== -1 && !n.endsWith(`
`) ? `${n}
$$` : `${n}$$`;
};
var rn = (n) => Nn(n) % 2 === 0 ? n : Rn(n);
var sn = (n) => yn(n) % 2 === 1 ? `${n}$` : n;
var Un = (n, r, e) => {
  if (n.substring(r + 2).includes(")")) return null;
  let s = X2(n, r);
  if (s === -1 || c(n, s)) return null;
  let o = s > 0 && n[s - 1] === "!", t = o ? s - 1 : s, a = n.substring(0, t);
  if (o) return a;
  let l3 = n.substring(s + 1, r);
  return e === "text-only" ? `${a}${l3}` : `${a}[${l3}](streamdown:incomplete-link)`;
};
var on = (n, r) => {
  for (let e = 0; e < r; e++) if (n[e] === "[" && !c(n, e)) {
    if (e > 0 && n[e - 1] === "!") continue;
    let i = C(n, e);
    if (i === -1) return e;
    if (i + 1 < n.length && n[i + 1] === "(") {
      let s = n.indexOf(")", i + 2);
      s !== -1 && (e = s);
    }
  }
  return r;
};
var Wn = (n, r, e) => {
  let i = r > 0 && n[r - 1] === "!", s = i ? r - 1 : r;
  if (!n.substring(r + 1).includes("]")) {
    let a = n.substring(0, s);
    if (i) return a;
    if (e === "text-only") {
      let l3 = on(n, r);
      return n.substring(0, l3) + n.substring(l3 + 1);
    }
    return `${n}](streamdown:incomplete-link)`;
  }
  if (C(n, r) === -1) {
    let a = n.substring(0, s);
    if (i) return a;
    if (e === "text-only") {
      let l3 = on(n, r);
      return n.substring(0, l3) + n.substring(l3 + 1);
    }
    return `${n}](streamdown:incomplete-link)`;
  }
  return null;
};
var B2 = (n, r = "protocol") => {
  let e = n.lastIndexOf("](");
  if (e !== -1 && !c(n, e)) {
    let i = Un(n, e, r);
    if (i !== null) return i;
  }
  for (let i = n.length - 1; i >= 0; i -= 1) if (n[i] === "[" && !c(n, i)) {
    let s = Wn(n, i, r);
    if (s !== null) return s;
  }
  return n;
};
var Kn = /^-{1,2}$/;
var Hn = /^[\s]*-{1,2}[\s]+$/;
var Dn = /^={1,2}$/;
var wn = /^[\s]*={1,2}[\s]+$/;
var ln = (n) => {
  if (!n || typeof n != "string") return n;
  let r = n.lastIndexOf(`
`);
  if (r === -1) return n;
  let e = n.substring(r + 1), i = n.substring(0, r), s = e.trim();
  if (Kn.test(s) && !e.match(Hn)) {
    let t = i.split(`
`).at(-1);
    if (t && t.trim().length > 0) return `${n}\u200B`;
  }
  if (Dn.test(s) && !e.match(wn)) {
    let t = i.split(`
`).at(-1);
    if (t && t.trim().length > 0) return `${n}\u200B`;
  }
  return n;
};
var Gn = new RegExp("(?<=[\\p{L}\\p{N}_])~(?!~)(?=[\\p{L}\\p{N}_])", "gu");
var tn = (n) => !n || typeof n != "string" || !n.includes("~") ? n : n.replace(Gn, (r, e) => c(n, e) ? r : "\\~");
var an = (n) => {
  var e, i;
  let r = n.match(K2);
  if (r) {
    let s = r[2];
    if (!s || d2.test(s)) return n;
    let o = n.lastIndexOf(r[1]);
    if (c(n, o) || f(n, o)) return n;
    if (((e = n.match(T2)) == null ? void 0 : e.length) % 2 === 1) return `${n}~~`;
  } else {
    let s = n.match(F2);
    if (s) {
      let o = n.lastIndexOf(s[0].slice(0, 2));
      if (c(n, o) || f(n, o)) return n;
      if (((i = n.match(T2)) == null ? void 0 : i.length) % 2 === 1) return `${n}~`;
    }
  }
  return n;
};
var S = (n) => n !== false;
var Fn = (n) => n === true;
var u = { SINGLE_TILDE: 0, COMPARISON_OPERATORS: 5, HTML_TAGS: 10, SETEXT_HEADINGS: 15, LINKS: 20, BOLD_ITALIC: 30, BOLD: 35, ITALIC_DOUBLE_UNDERSCORE: 40, ITALIC_SINGLE_ASTERISK: 41, ITALIC_SINGLE_UNDERSCORE: 42, INLINE_CODE: 50, STRIKETHROUGH: 60, KATEX: 70, INLINE_KATEX: 75, DEFAULT: 100 };
var Xn = [{ handler: { name: "singleTilde", handle: tn, priority: u.SINGLE_TILDE }, optionKey: "singleTilde" }, { handler: { name: "comparisonOperators", handle: E2, priority: u.COMPARISON_OPERATORS }, optionKey: "comparisonOperators" }, { handler: { name: "htmlTags", handle: x2, priority: u.HTML_TAGS }, optionKey: "htmlTags" }, { handler: { name: "setextHeadings", handle: ln, priority: u.SETEXT_HEADINGS }, optionKey: "setextHeadings" }, { handler: { name: "links", handle: B2, priority: u.LINKS }, optionKey: "links", earlyReturn: (n) => n.endsWith("](streamdown:incomplete-link)") }, { handler: { name: "boldItalic", handle: V2, priority: u.BOLD_ITALIC }, optionKey: "boldItalic" }, { handler: { name: "bold", handle: j2, priority: u.BOLD }, optionKey: "bold" }, { handler: { name: "italicDoubleUnderscore", handle: Q2, priority: u.ITALIC_DOUBLE_UNDERSCORE }, optionKey: "italic" }, { handler: { name: "italicSingleAsterisk", handle: Z, priority: u.ITALIC_SINGLE_ASTERISK }, optionKey: "italic" }, { handler: { name: "italicSingleUnderscore", handle: J2, priority: u.ITALIC_SINGLE_UNDERSCORE }, optionKey: "italic" }, { handler: { name: "inlineCode", handle: nn, priority: u.INLINE_CODE }, optionKey: "inlineCode" }, { handler: { name: "strikethrough", handle: an, priority: u.STRIKETHROUGH }, optionKey: "strikethrough" }, { handler: { name: "katex", handle: rn, priority: u.KATEX }, optionKey: "katex" }, { handler: { name: "inlineKatex", handle: sn, priority: u.INLINE_KATEX }, optionKey: "inlineKatex" }];
var zn = (n) => {
  var e;
  let r = (e = n == null ? void 0 : n.linkMode) != null ? e : "protocol";
  return Xn.filter(({ handler: i, optionKey: s }) => i.name === "links" ? S(n == null ? void 0 : n.links) || S(n == null ? void 0 : n.images) : i.name === "inlineKatex" ? Fn(n == null ? void 0 : n.inlineKatex) : S(n == null ? void 0 : n[s])).map(({ handler: i, earlyReturn: s }) => i.name === "links" ? { handler: k(I2({}, i), { handle: (o) => B2(o, r) }), earlyReturn: r === "protocol" ? s : void 0 } : { handler: i, earlyReturn: s });
};
var vn = (n, r) => {
  var t;
  if (!n || typeof n != "string") return n;
  let e = n.endsWith(" ") && !n.endsWith("  ") ? n.slice(0, -1) : n, i = zn(r), s = ((t = r == null ? void 0 : r.handlers) != null ? t : []).map((a) => {
    var l3;
    return { handler: k(I2({}, a), { priority: (l3 = a.priority) != null ? l3 : u.DEFAULT }), earlyReturn: void 0 };
  }), o = [...i, ...s].sort((a, l3) => {
    var _2, P2;
    return ((_2 = a.handler.priority) != null ? _2 : 0) - ((P2 = l3.handler.priority) != null ? P2 : 0);
  });
  for (let { handler: a, earlyReturn: l3 } of o) if (e = a.handle(e), l3 != null && l3(e)) return e;
  return e;
};
var $e2 = vn;

// src/streaming/config.ts
function resolveStreamingFixup(fixup) {
  if (fixup === false) return void 0;
  if (fixup === "remend") return (s) => $e2(s);
  return fixup;
}
function normalizeStreamingConfig(streaming) {
  var _a2, _b;
  if (!streaming) return null;
  if (streaming === true) {
    return {
      hasNextChunk: true,
      semanticEnabled: true,
      semanticConfig: {},
      enableAnimation: true
    };
  }
  const semantic = (_a2 = streaming.semantic) != null ? _a2 : true;
  return {
    hasNextChunk: streaming.hasNextChunk,
    semanticEnabled: semantic !== false,
    semanticConfig: typeof semantic === "object" ? semantic : {},
    enableAnimation: (_b = streaming.enableAnimation) != null ? _b : true
  };
}

// src/XMarkdownMini.ts
var ATTR_RE = /([a-zA-Z_][a-zA-Z0-9_:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
function parseAttrs(src) {
  var _a2, _b;
  const out = {};
  if (!src) return out;
  ATTR_RE.lastIndex = 0;
  let m3;
  while ((m3 = ATTR_RE.exec(src)) !== null) {
    const name = m3[1];
    const value = (_b = (_a2 = m3[2]) != null ? _a2 : m3[3]) != null ? _b : m3[4];
    out[name] = value === void 0 ? true : value;
  }
  return out;
}
function synthesizeComponentsExtension(tags) {
  const entries = tags.map((tag) => {
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tagRe = new RegExp(
      `^<${safeTag}(?:\\s+([^>]*?))?\\s*(\\/)?>(?:([\\s\\S]*?)<\\/${safeTag}>)?`
    );
    return {
      name: `customTag:${tag}`,
      level: "inline",
      start(src) {
        const i = src.indexOf(`<${tag}`);
        return i < 0 ? void 0 : i;
      },
      tokenizer(src) {
        var _a2, _b, _c;
        const m3 = tagRe.exec(src);
        if (!m3) return void 0;
        const attrsStr = (_a2 = m3[1]) != null ? _a2 : "";
        const selfClosing = m3[2] === "/";
        const inner = selfClosing ? "" : (_b = m3[3]) != null ? _b : "";
        if (!selfClosing && m3[3] === void 0) return void 0;
        const attrs = parseAttrs(attrsStr);
        const innerTokens = [];
        if (inner.length > 0 && typeof ((_c = this == null ? void 0 : this.lexer) == null ? void 0 : _c.inlineTokens) === "function") {
          this.lexer.inlineTokens(inner, innerTokens);
        }
        return {
          type: `customTag:${tag}`,
          raw: m3[0],
          tag,
          attrs,
          tokens: innerTokens
        };
      },
      miniRenderer(token, ctx) {
        var _a2, _b;
        const t = token;
        const node = { name: t.tag, tag: t.tag };
        if (t.attrs && Object.keys(t.attrs).length > 0) {
          node.attrs = t.attrs;
        }
        const inner = t.tokens && t.tokens.length > 0 ? (_b = (_a2 = ctx.renderInlineTokens) == null ? void 0 : _a2.call(ctx, t.tokens)) != null ? _b : [] : [];
        if (inner.length > 0) node.children = inner;
        return node;
      }
    };
  });
  return { extensions: entries };
}
var XMarkdownMini = class {
  constructor(opts = {}) {
    this.tokenStreamProcessor = null;
    this.nodeStreamProcessor = null;
    this.activeTokenStreamDefaults = null;
    this.activeNodeStreamDefaults = null;
    var _a2, _b, _c, _d, _e2;
    this.escapeText = (_a2 = opts.escapeText) != null ? _a2 : true;
    this.fixup = resolveStreamingFixup((_b = opts.streamingFixup) != null ? _b : "remend");
    this.gfm = opts.gfm;
    this.breaks = opts.breaks;
    this.codeHeader = (_c = opts.codeBlock) == null ? void 0 : _c.header;
    this.tableHeader = (_d = opts.table) == null ? void 0 : _d.header;
    const directExtensions = (_e2 = opts.extensions) != null ? _e2 : [];
    this.componentsExtension = opts.components && opts.components.length > 0 ? synthesizeComponentsExtension(opts.components) : void 0;
    const allMarkedExtensions = [
      ...directExtensions,
      ...this.componentsExtension ? [this.componentsExtension] : []
    ];
    this.extensions = directExtensions;
    this.marked = new D(...allMarkedExtensions);
  }
  /**
   * Build the full RenderContext.extensions list for a render call.
   * Per-call extensions replace instance-level user extensions; the
   * components extension is always appended so that `<custom-tag>` sugar
   * continues to work regardless of per-call overrides.
   */
  resolveExtensions(perCall) {
    if (!perCall || perCall.length === 0) {
      return [
        ...this.extensions,
        ...this.componentsExtension ? [this.componentsExtension] : []
      ];
    }
    return [
      ...perCall,
      ...this.componentsExtension ? [this.componentsExtension] : []
    ];
  }
  /**
   * Register per-call extensions with the Marked instance and return a
   * snapshot of the previous defaults so they can be restored after the call.
   * Returns `null` if nothing to apply (no per-call extensions).
   */
  applyPerCallExtensions(perCall) {
    if (!perCall || perCall.length === 0) return null;
    const saved = __spreadValues({}, this.marked.defaults);
    this.marked.use(...perCall);
    return saved;
  }
  restoreDefaults(saved) {
    if (saved) this.marked.defaults = saved;
  }
  buildMarkedOptions(perCall) {
    var _a2, _b;
    const gfm = (_a2 = perCall == null ? void 0 : perCall.gfm) != null ? _a2 : this.gfm;
    const breaks = (_b = perCall == null ? void 0 : perCall.breaks) != null ? _b : this.breaks;
    return __spreadValues(__spreadValues(__spreadValues({}, this.marked.defaults), gfm !== void 0 ? { gfm: gfm !== false } : {}), breaks !== void 0 ? { breaks: !!breaks } : {});
  }
  lex(content, opts) {
    const tokens = this.marked.lexer(content, opts != null ? opts : this.buildMarkedOptions());
    const walkFn = this.marked.defaults.walkTokens;
    if (typeof walkFn === "function") {
      this.marked.walkTokens(tokens, walkFn);
    }
    return tokens;
  }
  /**
   * Parses markdown into marked's native Token[] without platform rendering.
   */
  parse(content) {
    return this.lex(content, this.buildMarkedOptions());
  }
  render(input) {
    if (typeof input === "string") return this.parse(input);
    return this.renderTokens(input);
  }
  /**
   * Token streaming entry. AI streaming fixup runs on markdown text before lex.
   */
  renderTokens(props) {
    var _a2, _b, _c, _d;
    const { content, gfm, breaks, extensions: perCallExts } = props;
    const stream = normalizeStreamingConfig(props.streaming);
    if (!stream) {
      this.tokenStreamProcessor = null;
      this.restoreDefaults(this.activeTokenStreamDefaults);
      this.activeTokenStreamDefaults = null;
      const saved = this.applyPerCallExtensions(perCallExts);
      try {
        const markedOpts = this.buildMarkedOptions({ gfm, breaks });
        (_a2 = props.onRenderStart) == null ? void 0 : _a2.call(props);
        const tokens = this.lex(content, markedOpts);
        (_b = props.onPatch) == null ? void 0 : _b.call(props, tokens);
        (_c = props.onRenderComplete) == null ? void 0 : _c.call(props);
        return tokens;
      } finally {
        this.restoreDefaults(saved);
      }
    }
    if (!this.tokenStreamProcessor) {
      this.activeTokenStreamDefaults = this.applyPerCallExtensions(perCallExts);
      const markedOpts = this.buildMarkedOptions({ gfm, breaks });
      const transform = (md) => this.lex(md, markedOpts);
      this.tokenStreamProcessor = new StreamingProcessor(__spreadProps(__spreadValues({
        transform,
        fixup: this.fixup,
        semanticEnabled: stream.semanticEnabled
      }, stream.semanticConfig), {
        onUpdate: (markdown) => {
          var _a3;
          return (_a3 = props.onRenderProgress) == null ? void 0 : _a3.call(props, { markdown });
        },
        onPatch: (tokens) => {
          var _a3;
          return (_a3 = props.onPatch) == null ? void 0 : _a3.call(props, tokens);
        },
        onComplete: () => {
          var _a3;
          (_a3 = props.onRenderComplete) == null ? void 0 : _a3.call(props);
          this.tokenStreamProcessor = null;
          this.restoreDefaults(this.activeTokenStreamDefaults);
          this.activeTokenStreamDefaults = null;
        }
      }));
      (_d = props.onRenderStart) == null ? void 0 : _d.call(props);
    }
    this.tokenStreamProcessor.handleContentUpdate(content);
    this.tokenStreamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }
  /**
   * Component/node entry. Tokens are rendered by the selected platform renderer.
   */
  renderNodes(props) {
    var _a2, _b, _c, _d;
    const { content, platform = "auto", selectable = true, gfm, breaks, extensions: perCallExts } = props;
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
        (_a2 = props.onRenderStart) == null ? void 0 : _a2.call(props);
        const ctx = {
          animation: false,
          selectable,
          escapeText: this.escapeText,
          extensions: ctxExtensions,
          codeHeader: this.codeHeader,
          tableHeader: this.tableHeader
        };
        const tokens = this.lex(content, markedOpts);
        const nodes = renderer.renderTokens(tokens, ctx);
        (_b = props.onPatch) == null ? void 0 : _b.call(props, nodes);
        (_c = props.onRenderComplete) == null ? void 0 : _c.call(props);
        return nodes;
      } finally {
        this.restoreDefaults(saved);
      }
    }
    if (!this.nodeStreamProcessor) {
      this.activeNodeStreamDefaults = this.applyPerCallExtensions(perCallExts);
      const markedOpts = this.buildMarkedOptions({ gfm, breaks });
      const ctx = {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
        extensions: ctxExtensions,
        codeHeader: this.codeHeader,
        tableHeader: this.tableHeader
      };
      const transform = (md) => renderer.renderTokens(this.lex(md, markedOpts), ctx);
      this.nodeStreamProcessor = new StreamingProcessor(__spreadProps(__spreadValues({
        transform,
        fixup: this.fixup,
        semanticEnabled: stream.semanticEnabled
      }, stream.semanticConfig), {
        onUpdate: (markdown) => {
          var _a3;
          return (_a3 = props.onRenderProgress) == null ? void 0 : _a3.call(props, { markdown });
        },
        onPatch: (nodes) => {
          var _a3;
          return (_a3 = props.onPatch) == null ? void 0 : _a3.call(props, nodes);
        },
        onComplete: () => {
          var _a3;
          (_a3 = props.onRenderComplete) == null ? void 0 : _a3.call(props);
          this.nodeStreamProcessor = null;
          this.restoreDefaults(this.activeNodeStreamDefaults);
          this.activeNodeStreamDefaults = null;
        }
      }));
      (_d = props.onRenderStart) == null ? void 0 : _d.call(props);
    }
    this.nodeStreamProcessor.handleContentUpdate(content);
    this.nodeStreamProcessor.runRenderLoop(stream.hasNextChunk);
    return [];
  }
  /** Resets streaming state, usually during component detach/unmount. */
  reset() {
    var _a2, _b;
    (_a2 = this.tokenStreamProcessor) == null ? void 0 : _a2.reset();
    (_b = this.nodeStreamProcessor) == null ? void 0 : _b.reset();
    this.tokenStreamProcessor = null;
    this.nodeStreamProcessor = null;
    this.restoreDefaults(this.activeTokenStreamDefaults);
    this.restoreDefaults(this.activeNodeStreamDefaults);
    this.activeTokenStreamDefaults = null;
    this.activeNodeStreamDefaults = null;
  }
};

// src/plugins/Footnote/index.ts
var RULE = /^\[\^(?:([^\]:]+):)?([\s\S]+?)\]/;
function Footnote(options = {}) {
  var _a2;
  const defaultLabel = (_a2 = options.defaultLabel) != null ? _a2 : "\u6CE8";
  return {
    extensions: [
      {
        name: "footnote",
        level: "inline",
        start(src) {
          const i = src.indexOf("[^");
          return i < 0 ? void 0 : i;
        },
        tokenizer(src) {
          var _a3;
          const m3 = RULE.exec(src);
          if (!m3) return void 0;
          return {
            type: "footnote",
            raw: m3[0],
            label: ((_a3 = m3[1]) != null ? _a3 : defaultLabel).trim(),
            content: m3[2].trim()
          };
        },
        miniRenderer(token, _ctx) {
          const t = token;
          return {
            name: "footnote",
            tag: "footnote",
            attrs: { label: t.label, content: t.content, class: "md-footnote" }
          };
        }
      }
    ]
  };
}

// src/components/shared/flattenInlineTokens.ts
var TAG_CLASS = {
  strong: "md-strong",
  em: "md-em",
  del: "md-del",
  codespan: "md-inline-code"
};
function escapeHtml2(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (ch === 38) out += "&amp;";
    else if (ch === 60) out += "&lt;";
    else if (ch === 62) out += "&gt;";
    else if (ch === 34) out += "&quot;";
    else out += text[i];
  }
  return out;
}
function mergeClass(...parts) {
  const seen = /* @__PURE__ */ new Set();
  for (const p2 of parts) {
    if (!p2) continue;
    for (const tok of p2.split(/\s+/)) if (tok) seen.add(tok);
  }
  return Array.from(seen).join(" ");
}
function tokensToText(tokens) {
  var _a2;
  if (!tokens) return "";
  let out = "";
  for (const t of tokens) {
    const u2 = t;
    if (u2.type === "text" || u2.type === "escape") {
      out += (_a2 = u2.text) != null ? _a2 : "";
    } else if (u2.tokens) {
      out += tokensToText(u2.tokens);
    } else if (typeof u2.text === "string") {
      out += u2.text;
    }
  }
  return out;
}
function flattenInlineTokens(tokens, opts) {
  const out = [];
  const enc = opts.escapeText ? escapeHtml2 : (s) => s;
  walk(tokens, "", out, enc);
  return out;
}
function walk(tokens, classChain, out, enc) {
  var _a2, _b, _c, _d, _e2, _f, _g, _h;
  for (const tok of tokens) {
    const t = tok;
    switch (t.type) {
      case "text":
      case "escape": {
        const node = t;
        if (node.tokens && node.tokens.length) {
          walk(node.tokens, classChain, out, enc);
        } else {
          const v3 = enc((_a2 = node.text) != null ? _a2 : "");
          if (v3) out.push({ kind: "text", value: v3, classes: classChain });
        }
        break;
      }
      case "strong":
      case "em":
      case "del":
        walk(
          (_b = t.tokens) != null ? _b : [],
          mergeClass(classChain, TAG_CLASS[t.type]),
          out,
          enc
        );
        break;
      case "codespan": {
        const node = t;
        const v3 = enc((_c = node.text) != null ? _c : "");
        if (v3)
          out.push({
            kind: "text",
            value: v3,
            classes: mergeClass(classChain, TAG_CLASS.codespan)
          });
        break;
      }
      case "br":
        out.push({ kind: "br", value: "", classes: classChain });
        break;
      case "link": {
        const node = t;
        const label = tokensToText(node.tokens) || node.text || "";
        const run = {
          kind: "link",
          value: enc(label),
          classes: classChain,
          attrs: { href: (_d = node.href) != null ? _d : "" }
        };
        if (node.title) run.attrs.title = node.title;
        out.push(run);
        break;
      }
      case "image": {
        const node = t;
        const run = {
          kind: "image",
          value: enc((_e2 = node.text) != null ? _e2 : ""),
          classes: classChain,
          attrs: { src: (_f = node.href) != null ? _f : "", alt: (_g = node.text) != null ? _g : "" }
        };
        if (node.title) run.attrs.title = node.title;
        out.push(run);
        break;
      }
      case "html": {
        const node = t;
        const v3 = enc((_h = node.text) != null ? _h : "");
        if (v3) out.push({ kind: "text", value: v3, classes: classChain });
        break;
      }
      default: {
        if (typeof t.text === "string") {
          const v3 = enc(t.text);
          if (v3) out.push({ kind: "text", value: v3, classes: classChain });
        }
      }
    }
  }
}

// src/index.ts
var defaultInstance = new XMarkdownMini();
function parse(content) {
  return defaultInstance.parse(content);
}
function render(input) {
  return typeof input === "string" ? defaultInstance.render(input) : defaultInstance.render(input);
}
function renderNodes(props) {
  return defaultInstance.renderNodes(props);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Footnote,
  StreamingProcessor,
  XMarkdownMini,
  alipayRenderer,
  copyButton,
  flattenInlineTokens,
  getPlatformRenderer,
  parse,
  registerPlatformRenderer,
  render,
  renderNodes,
  resolvePlatform,
  tokensToAlipay,
  tokensToAlipayNodes,
  tokensToWechat,
  tokensToWechatNodes,
  wechatRenderer
});
