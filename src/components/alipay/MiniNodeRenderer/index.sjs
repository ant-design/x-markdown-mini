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
// KaTeX 公式子树（class 含 'katex'）很深（实测 inline 14 层 / block 15 层）。若沿用
// 每层一个 <mini-node-renderer> 自定义组件的递归，单个公式就会实例化 13~33 个组件，
// 支付宝渲染层撑不住而白屏。KaTeX 子树无交互（无 tap/slot），改用「递归 AXML 模板」
// 渲染——产出完全相同的 view/text + class/style，但没有组件实例。微信侧不受影响。
function isKatex(node) {
  var attrs = node.attrs || {};
  var cls = attrs['class'] || '';
  return cls.indexOf('katex') > -1;
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

function tableShadowClass(shadows, key) {
  var state = shadows && shadows[key];
  if (!state) return '';
  var cls = '';
  if (state.left) cls += ' markdownx-table-content--left-shadow';
  if (state.right) cls += ' markdownx-table-content--right-shadow';
  return cls;
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
  isKatex: isKatex,
  isSlot: isSlot,
  classOf: classOf,
  charsOf: charsOf,
  styleOf: styleOf,
  srcOf: srcOf,
  langOf: langOf,
  altOf: altOf,
  valueOf: valueOf,
  tableShadowClass: tableShadowClass,
};
