// KaTeX 字体的「真机」注册（2026-07 修订，经支付宝真机字体自检探针 + Minifish 消费侧实证）。
//
// 真机硬结论（最新）：
//  1. 支付宝真机 `my.loadFontFace` 只认「已加白名单的 https 网络字体（需 CORS）」——包内本地
//     路径（`/katex-fonts/*.ttf`）与 `data:` base64 URI 都只在模拟器 webview 生效，真机一律失败。
//     早期 beta 观察到「本地 ttf 真机可用」，实为 x-markdown-mini 自带 examples 把 dist/katex-fonts
//     同步到工程根、`/katex-fonts` 恰好可解析；真实消费方（如 Minifish 2.0）的打包产物不暴露该
//     路径，本地 source 全失败 → 字形回退系统字（PingFang SC）。因此支付宝改走「可靠 CDN ttf 优先」。
//  2. 字体 CDN 必须开启 CORS（`Access-Control-Allow-Origin: *` 或 `${appId}.hybrid.alipay-eco.com`），
//     且消费方要把 CDN 域名加进小程序「下载合法域名白名单」。这里用 mdn.alipayobjects.com 托管的
//     20 个 KaTeX ttf（逐字节校验、200 + CORS `*`），afts 每文件独立 ID、无公共 base，故用映射表。
//  3. 支付宝 `loadFontFace` 同名 family 只认首个字面，故每字面注册成「唯一 family」（alipayFamily），
//     CSS 端（plugins/Latex/style.acss 的 .kxf-* 单类规则 + plugins/Latex/index.ts 把 kxf-* 类下沉到
//     字形 <text>）据此赋字体——绕开「同名多字面」「跨组件后代选择器」「view→text 继承」三个真机坑。
//
// 微信与支付宝不同：KaTeX 经单个 <rich-text> 渲染（webview），字体由 loadFontFace 全局注册后内部
// 解析。微信的本地 ttf 位于 `/miniprogram_npm/@ant-design/x-markdown-mini/katex-fonts`——这是 构建npm
// 真实产出的可解析运行时路径（不受支付宝那类打包限制），故微信保留「本地 ttf 优先 + 共享 CDN 兜底」。
//
// onKatexFontsReady 至多回调一次、且仅当注册时字体尚未就绪：这样流式每个 chunk 不再触发「卸载-重挂」
// 强制重排，消除整页反复闪；字体已缓存（二次渲染）时直接跳过，零重绘。
//
// 检测沿用 `typeof my` / `typeof wx`（而非 globalThis），与 src/platforms/index.ts 一致：旧版支付宝
// 基础库没有 globalThis，而 typeof 对未声明标识符不抛错。
declare const my: any;
declare const wx: any;

const PACKAGE_NAME = '@ant-design/x-markdown-mini';

// 微信本地 ttf 兜底路径（构建npm 会把包内 katex-fonts 落到 miniprogram_npm 下，真机可解析）。
const WECHAT_LOCAL_BASES = [
  '/miniprogram_npm/' + PACKAGE_NAME + '/dist/miniprogram_dist/katex-fonts',
  '/miniprogram_npm/' + PACKAGE_NAME + '/katex-fonts',
  '/katex-fonts',
];

// 公式字体 CDN（20 个 KaTeX ttf，mdn.alipayobjects.com 托管：已验证 200 + CORS `*` + 与源逐字节一致）。
// key = FACES 里的 alipayFile（ttf 文件名）。afts 每文件独立 ID，无公共 base，不能拼 base + '/' + file。
// ⚠️ 升级 KaTeX 字体版本时需重新上传并刷新整张表；建议 CI 对每个 URL 做 HEAD 断言 200 + CORS。
export const KATEX_FONT_CDN: Record<string, string> = {
  'KaTeX_Main-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/L-a2RqXz_KQAAAAAQ0AAAAgADlJoAQFr/KaTeX_Main-Regular.ttf',
  'KaTeX_Math-Italic.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/vG_gSZcjJTcAAAAAQfAAAAgADlJoAQFr/KaTeX_Math-Italic.ttf',
  'KaTeX_Main-Bold.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/yYAFSbELpiIAAAAAQyAAAAgADlJoAQFr/KaTeX_Main-Bold.ttf',
  'KaTeX_Main-Italic.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/6vKqS7mpABUAAAAAQhAAAAgADlJoAQFr/KaTeX_Main-Italic.ttf',
  'KaTeX_Math-BoldItalic.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/fugLS4TQ_TIAAAAAQeAAAAgADlJoAQFr/KaTeX_Math-BoldItalic.ttf',
  'KaTeX_Main-BoldItalic.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/XgjrS7wWTbAAAAAAQgAAAAgADlJoAQFr/KaTeX_Main-BoldItalic.ttf',
  'KaTeX_Size1-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/8TDlSpILzAkAAAAAQMAAAAgADlJoAQFr/KaTeX_Size1-Regular.ttf',
  'KaTeX_Size2-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/Z4PkT68y0dUAAAAAQLAAAAgADlJoAQFr/KaTeX_Size2-Regular.ttf',
  'KaTeX_Size3-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/7gtaRYkVdFQAAAAAQHAAAAgADlJoAQFr/KaTeX_Size3-Regular.ttf',
  'KaTeX_Size4-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/aW8uRJzwokwAAAAAQKAAAAgADlJoAQFr/KaTeX_Size4-Regular.ttf',
  'KaTeX_AMS-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/Wt0vQKdiQoIAAAAAQ-AAAAgADlJoAQFr/KaTeX_AMS-Regular.ttf',
  'KaTeX_SansSerif-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/ZLV_TIlyACIAAAAAQTAAAAgADlJoAQFr/KaTeX_SansSerif-Regular.ttf',
  'KaTeX_SansSerif-Bold.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/ra9YQp9FKE8AAAAAQYAAAAgADlJoAQFr/KaTeX_SansSerif-Bold.ttf',
  'KaTeX_SansSerif-Italic.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/CpvzTqKXKZ8AAAAAQWAAAAgADlJoAQFr/KaTeX_SansSerif-Italic.ttf',
  'KaTeX_Caligraphic-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/tZ8fTYt9JKsAAAAAQMAAAAgADlJoAQFr/KaTeX_Caligraphic-Regular.ttf',
  'KaTeX_Caligraphic-Bold.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/k9MMRZaHkWUAAAAAQMAAAAgADlJoAQFr/KaTeX_Caligraphic-Bold.ttf',
  'KaTeX_Fraktur-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/4htAQpf8VrQAAAAAQTAAAAgADlJoAQFr/KaTeX_Fraktur-Regular.ttf',
  'KaTeX_Fraktur-Bold.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/fCFXTrrddScAAAAAQTAAAAgADlJoAQFr/KaTeX_Fraktur-Bold.ttf',
  'KaTeX_Script-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/NH6oSrgkGvMAAAAAQQAAAAgADlJoAQFr/KaTeX_Script-Regular.ttf',
  'KaTeX_Typewriter-Regular.ttf': 'https://mdn.alipayobjects.com/huamei_yz9z7c/afts/file/qoBkQ6SH5IIAAAAAQbAAAAgADlJoAQFr/KaTeX_Typewriter-Regular.ttf',
};

interface KatexFace {
  file: string;
  alipayFile: string;
  /** 原始 KaTeX family 名（WeChat 用：rich-text + loadFontFace 按 family+style/weight 选字面）。 */
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
// 字体加载可能由 <Markdown> 在节点渲染前触发，也可能由底层 <MiniNodeRenderer> 在拿到 KaTeX 节点
// 后触发。保留全部等待者；全部字面加载完成后一次性 flush，之后新调用直接跳过（见 onKatexFontsReady）。
let readyCallbacks: (() => void)[] = [];

function callSafe(cb: (() => void) | null | undefined): void {
  if (!cb) return;
  try {
    cb();
  } catch (e) {
    /* 静默 */
  }
}

function debugKatexFonts(): boolean {
  return typeof my !== 'undefined' && !!my.__xmdKatexProbe;
}

function sourceKind(source: string): string {
  if (source.indexOf('mdn.alipayobjects.com') > -1) return 'cdn';
  if (source.indexOf('/miniprogram_npm/') > -1) return 'miniprogram_npm';
  if (source.indexOf('/katex-fonts/') > -1) return 'root';
  return 'unknown';
}

function sourcesForFace(f: KatexFace, isAlipay: boolean): string[] {
  const sources: string[] = [];
  const cdn = KATEX_FONT_CDN[f.alipayFile];
  if (isAlipay) {
    // 支付宝真机唯一可用：白名单 https CDN ttf。本地/base64 只在模拟器生效，已移除。
    if (cdn) sources.push('url("' + cdn + '")');
    return sources;
  }
  // 微信：本地 miniprogram_npm ttf 优先（真机可解析、无需域名白名单），共享 CDN 作兜底。
  for (let i = 0; i < WECHAT_LOCAL_BASES.length; i++) {
    sources.push('url("' + WECHAT_LOCAL_BASES[i] + '/' + f.alipayFile + '")');
  }
  if (cdn) sources.push('url("' + cdn + '")');
  return sources;
}

function loadFace(api: any, opts: { family: string; desc: { style: string; weight: string }; sources: string[] }, done: () => void): void {
  let index = 0;
  const tryNext = (): void => {
    const source = opts.sources[index++];
    if (!source) {
      if (debugKatexFonts()) {
        console.log('[xmd:katex-font]', opts.family, 'failed-all');
      }
      done();
      return;
    }
    if (debugKatexFonts()) {
      console.log('[xmd:katex-font]', opts.family, 'try', sourceKind(source));
    }
    api.loadFontFace({
      global: true,
      family: opts.family,
      source,
      desc: opts.desc,
      success: () => {
        if (debugKatexFonts()) {
          console.log('[xmd:katex-font]', opts.family, 'ok', sourceKind(source));
        }
        done();
      },
      fail: (err: unknown) => {
        if (debugKatexFonts()) {
          console.log('[xmd:katex-font]', opts.family, 'fail', sourceKind(source), err);
        }
        tryNext();
      },
    });
  };
  tryNext();
}

function resolveApi(): { api: any; isAlipay: boolean } | null {
  // 支付宝真机缺 globalThis，故用 typeof 直接探测 my / wx。
  if (typeof my !== 'undefined' && typeof my.loadFontFace === 'function') {
    return { api: my, isAlipay: true };
  }
  if (typeof wx !== 'undefined' && typeof wx.loadFontFace === 'function') {
    return { api: wx, isAlipay: false };
  }
  return null;
}

function flushReadyCallbacks(): void {
  const callbacks = readyCallbacks;
  readyCallbacks = [];
  for (let i = 0; i < callbacks.length; i++) callSafe(callbacks[i]);
}

function startLoading(api: any, isAlipay: boolean): void {
  let done = 0;
  const total = FACES.length;
  const tick = (): void => {
    done++;
    if (done >= total && !ready) {
      ready = true;
      flushReadyCallbacks();
    }
  };
  for (let i = 0; i < FACES.length; i++) {
    const f = FACES[i];
    loadFace(api, {
      // 支付宝：唯一 family + 统一 normal/normal（CSS 的 .kxf-* 也请求 normal/normal，确定性命中，
      // 斜/粗由字体文件本身提供）；微信：原始 family + 真实 style/weight（rich-text 内部按此选字面）。
      family: isAlipay ? f.alipayFamily : f.family,
      sources: sourcesForFace(f, isAlipay),
      desc: isAlipay ? { style: 'normal', weight: 'normal' } : { style: f.style, weight: f.weight },
    }, tick);
  }
}

/** 字体是否已全部就绪。组件用它判断首屏是否已正确、是否需要重排。 */
export function areKatexFontsReady(): boolean {
  return ready;
}

/**
 * 确保 KaTeX 字体以 global 作用域注册（幂等，进程内只发起一次）。仅在开启 latex / 出现 katex 时调用。
 * 失败静默降级——.kxf-* 的 font-family 链里有 "PingFang SC" 等系统兜底字体。
 * 无 loadFontFace 的环境（浏览器/docs）直接置就绪，字体由 CSS 处理。
 */
export function ensureKatexFonts(): void {
  if (ready || started) return;
  const resolved = resolveApi();
  if (!resolved) {
    // 浏览器/无 loadFontFace：字体由 CSS 处理，直接置就绪并回调既有等待者。
    ready = true;
    flushReadyCallbacks();
    return;
  }
  started = true;
  startLoading(resolved.api, resolved.isAlipay);
}

/**
 * 注册「字体就绪」回调：至多回调一次，且仅当注册时字体尚未就绪（确有重绘必要）。已就绪则直接返回、
 * 不回调、不重绘——这样流式每个 chunk 不再触发强制重排，字体已缓存的二次渲染也零重绘。
 */
export function onKatexFontsReady(cb: () => void): void {
  ensureKatexFonts();
  if (ready) return;
  readyCallbacks.push(cb);
}
