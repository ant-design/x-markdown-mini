var INLINE = { strong: 1, em: 1, del: 1, code: 1, a: 1, span: 1 };
var BLOCK = {
  p: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1,
  div: 1, blockquote: 1, ul: 1, ol: 1, li: 1,
  pre: 1, hr: 1,
  table: 1, thead: 1, tbody: 1, tr: 1, th: 1, td: 1,
};

function isInline(name) { return INLINE[name] === 1; }
function isBlock(name) { return BLOCK[name] === 1; }
function isText(name) { return name === 'text'; }
function isBr(name) { return name === 'br'; }
function isImg(name) { return name === 'img'; }
function isHr(name) { return name === 'hr'; }
function isPre(name) { return name === 'pre'; }
function isTable(name) { return name === 'table'; }
function isCopy(name) { return name === 'copy-button'; }
function copyOf(node) {
  var attrs = node.attrs || {};
  return attrs['data-copy'] || '';
}
// 富内联节点（如 KaTeX 公式容器）含有元素子节点，必须走递归 <view> 路径
// 渲染，保留嵌套结构与 style；普通已扁平化的内联只有 text/br 子节点。
function isRich(node) {
  var ch = node.children;
  if (!ch) return false;
  for (var i = 0; i < ch.length; i++) {
    var nm = ch[i].name;
    if (nm !== 'text' && nm !== 'br') return true;
  }
  return false;
}
function isSlot(name, slotComponents) {
  return !!slotComponents && slotComponents.indexOf(name) > -1;
}
// 列表 marker（"1." / "•"）是结构性原子文本，绝不能逐字拆分：拆成多个 <text> 会在字符间产生
// 换行机会，而 .md-list-marker 是仅 28rpx 宽的 flex 项，容纳不下两个字符盒 → "1" 和 "." 会分行。
// 因此即便处于流式动画态，marker 也整体渲染为单个 <text>（与微信 isListItem 分支的原子渲染一致）。
function isMarker(node) {
  var cls = (node.attrs || {})['class'] || '';
  return cls.indexOf('md-list-marker') > -1;
}
function classOf(node) {
  var attrs = node.attrs || {};
  var cls = attrs['class'] || '';
  if (node.animate) {
    cls = cls ? cls + ' md-animate-block' : 'md-animate-block';
  }
  return cls;
}

// 把文本拆成「按 code point 安全」的字符数组（不劈坏 emoji/组合 surrogate pair），
// 供流式逐字淡入：每个字符渲染成独立 <text>。返回 { k, c } 对象——k 是稳定的下标
// key（a:key 只能取 item 的属性名，不能引用 a:for-index 变量，否则无法 diff、整段重建
// 导致全体重播淡入）。追加文本时旧字符 k 不变被复用、不重播，只有新字符触发淡入。
function charsOf(node) {
  var v = (node.attrs || {}).value || '';
  var out = [];
  var i = 0;
  var n = v.length;
  var k = 0;
  while (i < n) {
    var code = v.charCodeAt(i);
    if (code >= 55296 && code <= 56319 && i + 1 < n) {
      out.push({ k: k, c: v.charAt(i) + v.charAt(i + 1) });
      i += 2;
    } else {
      out.push({ k: k, c: v.charAt(i) });
      i += 1;
    }
    k++;
  }
  return out;
}

// 逐字动画拆出的字符 <text> 用它取类名：把行内代码的「药丸盒」类换成纯字体类，
// 避免每个字符各自画一颗药丸（中间出现空隙）。盒模型只留在外层 md-anim-text 容器上。
function segClassOf(node) {
  var cls = classOf(node);
  if (cls.indexOf('md-inline-code') > -1) {
    cls = cls.replace('md-inline-code', 'md-inline-code-txt');
  }
  return cls;
}

function styleOf(node) {
  var attrs = node.attrs || {};
  return attrs.style || '';
}

function srcOf(node) {
  var attrs = node.attrs || {};
  return attrs.src || '';
}

function langOf(node) {
  var attrs = node.attrs || {};
  return attrs.lang || '';
}

function altOf(node) {
  var attrs = node.attrs || {};
  return attrs.alt || '';
}

function valueOf(node) {
  var attrs = node.attrs || {};
  return attrs.value || '';
}

function shadowState(shadows, prefix, key, defaultRight) {
  var fullKey = prefix + key;
  var state = shadows && shadows[fullKey];
  if (!state && defaultRight) return { left: false, right: true };
  return state;
}
function leftShadowClass(shadows, prefix, key, defaultRight) {
  var state = shadowState(shadows, prefix, key, defaultRight);
  return state && state.left ? 'markdownx-edge-shadow--visible' : '';
}
function rightShadowClass(shadows, prefix, key, defaultRight) {
  var state = shadowState(shadows, prefix, key, defaultRight);
  return state && state.right ? 'markdownx-edge-shadow--visible' : '';
}
function defaultRightShadow(node) {
  var cls = ((node && node.attrs) || {})['class'] || '';
  return cls.indexOf('md-table-multi') > -1;
}
export default {
  isInline: isInline,
  isBlock: isBlock,
  isText: isText,
  isBr: isBr,
  isImg: isImg,
  isHr: isHr,
  isPre: isPre,
  isTable: isTable,
  isCopy: isCopy,
  copyOf: copyOf,
  isRich: isRich,
  isSlot: isSlot,
  isMarker: isMarker,
  classOf: classOf,
  segClassOf: segClassOf,
  charsOf: charsOf,
  styleOf: styleOf,
  srcOf: srcOf,
  langOf: langOf,
  altOf: altOf,
  valueOf: valueOf,
  leftShadowClass: leftShadowClass,
  rightShadowClass: rightShadowClass,
  defaultRightShadow: defaultRightShadow,
};
