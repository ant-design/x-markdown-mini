// KaTeX 字体的「真机」注册（2026-06-29，经支付宝真机字体自检探针多轮实证）。
//
// 真机硬结论：
//  1. CSS `@font-face`（base64 / CDN / 任意作用域）在「未配下载合法域名白名单」的 appId 上一律
//     不生效——CSS 字体的网络下载受 downloadFile/request 合法域名白名单管控；模拟器不校验，故只在
//     模拟器生效。（markdown-x-mini 用 CSS @font-face + CDN 能真机生效，是因为它是已上线应用、配了
//     字体 CDN 的合法域名。）
//  2. JS API `loadFontFace` 在真机预览下会对 woff 返回 loaded，但在当前支付宝真机渲染引擎里
//     不参与 <text> 排版；ttf 才是可实际应用到文本的格式。用包内本地 ttf 可避免网络白名单
//     和 CDN 到达后不自动重排的问题。
//  3. 支付宝真机 `loadFontFace` 同名 family 只认首个字面，故每字面注册成「唯一 family」（alipayFamily），
//     CSS 端（plugins/Latex/style.acss 的 .kxf-* 单类规则 + plugins/Latex/index.ts 把 kxf-* 类下沉到
//     字形 <text>）据此赋字体——绕开「同名多字面」「跨组件后代选择器」「view→text 继承」三个真机坑。
//
// 所以支付宝走「inline ttf data URI + 唯一 family」；HTTPS / 包内本地 ttf 只作兼容兜底。beta.11
// 证明包内 node_modules 字体 URL 不可靠；beta.12 证明公开 CDN 在真机环境仍会受域名/下载策略影响。
// 早前真机探针里真正稳定生效的是 loadFontFace 加载 inline ttf。微信仍优先走包内 ttf，失败时保留
// CDN woff 兜底。`onReady` 在全部字面加载完成后回调一次，供组件强制重排（兜底，即便本地
// 几乎即时，也确保已渲染的公式在字体就绪后重新绘制）。
//
// 检测沿用 `typeof my` / `typeof wx`（而非 globalThis），与 src/platforms/index.ts 一致：旧版支付宝
// 基础库没有 globalThis，而 typeof 对未声明标识符不抛错。
declare const my: any;
declare const wx: any;
declare const require: any;

// 支付宝真机用 CDN ttf 作为首选：woff 会回调 loaded 但不参与 <text> 排版；ttf 才实际生效。
// 微信保留原 CDN woff 兜底，避免改变既有可用路径。
const CDN = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/fonts';
const PACKAGE_NAME = '@ant-design/x-markdown-mini';
const ALIPAY_LOCAL_BASES = [
  '/node_modules/' + PACKAGE_NAME + '/dist/katex-fonts',
  '/node_modules/' + PACKAGE_NAME + '/katex-fonts',
  '/katex-fonts',
];
const WECHAT_LOCAL_BASES = [
  '/miniprogram_npm/' + PACKAGE_NAME + '/dist/miniprogram_dist/katex-fonts',
  '/miniprogram_npm/' + PACKAGE_NAME + '/katex-fonts',
  '/katex-fonts',
];

interface KatexFace {
  file: string;
  alipayFile: string;
  /** 原始 KaTeX family 名（WeChat 用：rich-text + style.wxss 按 family+style/weight 选字面）。 */
  family: string;
  weight: 'normal' | 'bold';
  style: 'normal' | 'italic';
  /** 支付宝用：每字面唯一 family 名。必须与 plugins/Latex/style.acss 的 .kxf-* 规则一致。 */
  alipayFamily: string;
}

// KaTeX 0.16.x 的 20 个字面。顺序：把最常用的（Main 正体、Math 斜体变量、定界符 Size、AMS）排在
// 前面——万一某些真机对 loadFontFace 字体数量有上限，也优先保住常见字形。
const FACES: KatexFace[] = [
  { file: 'KaTeX_Main-Regular.woff', alipayFile: 'KaTeX_Main-Regular.ttf', family: 'KaTeX_Main', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Main' },
  { file: 'KaTeX_Math-Italic.woff', alipayFile: 'KaTeX_Math-Italic.ttf', family: 'KaTeX_Math', weight: 'normal', style: 'italic', alipayFamily: 'KaTeX_MathItalic' },
  { file: 'KaTeX_Main-Bold.woff', alipayFile: 'KaTeX_Main-Bold.ttf', family: 'KaTeX_Main', weight: 'bold', style: 'normal', alipayFamily: 'KaTeX_MainBold' },
  { file: 'KaTeX_Main-Italic.woff', alipayFile: 'KaTeX_Main-Italic.ttf', family: 'KaTeX_Main', weight: 'normal', style: 'italic', alipayFamily: 'KaTeX_MainItalic' },
  { file: 'KaTeX_Math-BoldItalic.woff', alipayFile: 'KaTeX_Math-BoldItalic.ttf', family: 'KaTeX_Math', weight: 'bold', style: 'italic', alipayFamily: 'KaTeX_MathBoldItalic' },
  { file: 'KaTeX_Main-BoldItalic.woff', alipayFile: 'KaTeX_Main-BoldItalic.ttf', family: 'KaTeX_Main', weight: 'bold', style: 'italic', alipayFamily: 'KaTeX_MainBoldItalic' },
  { file: 'KaTeX_Size1-Regular.woff', alipayFile: 'KaTeX_Size1-Regular.ttf', family: 'KaTeX_Size1', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Size1' },
  { file: 'KaTeX_Size2-Regular.woff', alipayFile: 'KaTeX_Size2-Regular.ttf', family: 'KaTeX_Size2', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Size2' },
  { file: 'KaTeX_Size3-Regular.woff', alipayFile: 'KaTeX_Size3-Regular.ttf', family: 'KaTeX_Size3', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Size3' },
  { file: 'KaTeX_Size4-Regular.woff', alipayFile: 'KaTeX_Size4-Regular.ttf', family: 'KaTeX_Size4', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Size4' },
  { file: 'KaTeX_AMS-Regular.woff', alipayFile: 'KaTeX_AMS-Regular.ttf', family: 'KaTeX_AMS', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_AMS' },
  { file: 'KaTeX_SansSerif-Regular.woff', alipayFile: 'KaTeX_SansSerif-Regular.ttf', family: 'KaTeX_SansSerif', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_SansSerif' },
  { file: 'KaTeX_SansSerif-Bold.woff', alipayFile: 'KaTeX_SansSerif-Bold.ttf', family: 'KaTeX_SansSerif', weight: 'bold', style: 'normal', alipayFamily: 'KaTeX_SansSerifBold' },
  { file: 'KaTeX_SansSerif-Italic.woff', alipayFile: 'KaTeX_SansSerif-Italic.ttf', family: 'KaTeX_SansSerif', weight: 'normal', style: 'italic', alipayFamily: 'KaTeX_SansSerifItalic' },
  { file: 'KaTeX_Caligraphic-Regular.woff', alipayFile: 'KaTeX_Caligraphic-Regular.ttf', family: 'KaTeX_Caligraphic', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Caligraphic' },
  { file: 'KaTeX_Caligraphic-Bold.woff', alipayFile: 'KaTeX_Caligraphic-Bold.ttf', family: 'KaTeX_Caligraphic', weight: 'bold', style: 'normal', alipayFamily: 'KaTeX_CaligraphicBold' },
  { file: 'KaTeX_Fraktur-Regular.woff', alipayFile: 'KaTeX_Fraktur-Regular.ttf', family: 'KaTeX_Fraktur', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Fraktur' },
  { file: 'KaTeX_Fraktur-Bold.woff', alipayFile: 'KaTeX_Fraktur-Bold.ttf', family: 'KaTeX_Fraktur', weight: 'bold', style: 'normal', alipayFamily: 'KaTeX_FrakturBold' },
  { file: 'KaTeX_Script-Regular.woff', alipayFile: 'KaTeX_Script-Regular.ttf', family: 'KaTeX_Script', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Script' },
  { file: 'KaTeX_Typewriter-Regular.woff', alipayFile: 'KaTeX_Typewriter-Regular.ttf', family: 'KaTeX_Typewriter', weight: 'normal', style: 'normal', alipayFamily: 'KaTeX_Typewriter' },
];

// 进程内只注册一次：同一页面多个组件实例不重复发起 loadFontFace。
let started = false;
let ready = false;
// 字体加载可能由 <Markdown> 在节点渲染前触发，也可能由底层 <MiniNodeRenderer> 在拿到
// KaTeX 节点后触发。必须保留全部等待者；只记第一个回调会让真机错过重排，停在系统字体。
let readyCallbacks: (() => void)[] = [];
let inlineFontData: Record<string, string> | null | undefined;

function callSafe(cb: (() => void) | null | undefined): void {
  if (!cb) return;
  try {
    cb();
  } catch (e) {
    /* 静默 */
  }
}

function loadInlineFontData(): Record<string, string> | null {
  if (inlineFontData !== undefined) return inlineFontData;
  try {
    // This file is generated into dist/katex-font-data.js and dist/miniprogram_dist/katex-font-data.js.
    // Keep require indirect so the bundler does not try to resolve it from src/.
    const req = require;
    const mod = req('../../katex-font-data.js');
    inlineFontData = (mod && (mod.default || mod)) || null;
  } catch (e) {
    inlineFontData = null;
  }
  return inlineFontData;
}

function sourcesForFace(f: KatexFace, isAlipay: boolean): string[] {
  const localBases = isAlipay ? ALIPAY_LOCAL_BASES : WECHAT_LOCAL_BASES;
  const sources: string[] = [];
  if (isAlipay) {
    const data = loadInlineFontData();
    if (data && data[f.alipayFile]) sources.push('url("' + data[f.alipayFile] + '")');
    sources.push('url("' + CDN + '/' + f.alipayFile + '")');
  }
  for (let i = 0; i < localBases.length; i++) {
    sources.push('url("' + localBases[i] + '/' + f.alipayFile + '")');
  }
  if (!isAlipay) sources.push('url("' + CDN + '/' + f.file + '")');
  return sources;
}

function loadFace(api: any, opts: { family: string; desc: { style: string; weight: string }; sources: string[] }, done: () => void): void {
  let index = 0;
  const tryNext = (): void => {
    const source = opts.sources[index++];
    if (!source) {
      done();
      return;
    }
    api.loadFontFace({
      global: true,
      family: opts.family,
      source,
      desc: opts.desc,
      success: done,
      fail: tryNext,
    });
  };
  tryNext();
}

/**
 * 把 KaTeX 字体以 global 作用域注册到当前小程序运行时。仅在开启 latex / 出现 katex 时调用。
 * 失败静默降级——.kxf-* 的 font-family 链里有 "PingFang SC" 等系统兜底字体。
 *
 * @param onReady 全部字面加载完成后回调一次（已就绪时同步回调）。组件用它强制重排，确保已渲染
 *                的公式在字体到位后重新绘制。无 loadFontFace 的环境（浏览器/docs）立即回调。
 */
export function loadKatexFonts(onReady?: () => void): void {
  // 支付宝真机缺 globalThis，故用 typeof 直接探测 my / wx。
  const isAlipay = typeof my !== 'undefined' && typeof my.loadFontFace === 'function';
  const api: any = isAlipay
    ? my
    : typeof wx !== 'undefined' && typeof wx.loadFontFace === 'function'
      ? wx
      : null;
  // 浏览器/无 loadFontFace：字体由 CSS 处理，直接回调让组件正常渲染。
  if (!api) {
    callSafe(onReady);
    return;
  }
  if (ready) {
    callSafe(onReady);
    return;
  }
  if (onReady) readyCallbacks.push(onReady);
  if (started) return;
  started = true;

  let done = 0;
  const total = FACES.length;
  const tick = (): void => {
    done++;
    if (done >= total && !ready) {
      ready = true;
      const callbacks = readyCallbacks;
      readyCallbacks = [];
      for (let i = 0; i < callbacks.length; i++) callSafe(callbacks[i]);
    }
  };

  for (let i = 0; i < FACES.length; i++) {
    const f = FACES[i];
    loadFace(api, {
      // 支付宝：唯一 family + 统一 normal/normal（CSS 的 .kxf-* 也请求 normal/normal，确定性命中，
      // 斜/粗由字体文件本身提供）；微信：原始 family + 真实 style/weight（rich-text 内部按此选字面）。
      family: isAlipay ? f.alipayFamily : f.family,
      // 包内本地 ttf 零网络、零白名单；微信保留 CDN woff 兜底。
      sources: sourcesForFace(f, isAlipay),
      desc: isAlipay ? { style: 'normal', weight: 'normal' } : { style: f.style, weight: f.weight },
    }, tick);
  }
}
