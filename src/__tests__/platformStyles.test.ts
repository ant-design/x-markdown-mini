import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

describe('platform presentation consistency', () => {
  it('keeps links in the surrounding inline text flow (shared element styles)', () => {
    // 元素级样式现统一在共享 elements.css，构建时复制为各端 MiniNodeRenderer 的
    // elements.{wxss,acss} 并 @import，微信/支付宝共用同一份。
    const css = source('../components/shared/elements.css');
    expect(css).toMatch(/\.md-link\s*\{[^}]*display:\s*inline;/s);
  });

  it('centers Alipay display math in a full-width block', () => {
    const acss = source('../plugins/Latex/style.acss');
    expect(acss).toMatch(
      /\.katex-display\s*\{[^}]*display:\s*block;[^}]*width:\s*100%;[^}]*text-align:\s*center;/s,
    );
  });

  it('assigns Alipay KaTeX fonts via single-class kxf-* rules + unique families', () => {
    // 真机根因：(1) loadFontFace 同名 family 只认首字面 → 每字面唯一 family；(2) 本地路径 / base64
    // data URI 只在模拟器生效，真机只认白名单 https CDN ttf；(3) KaTeX 经嵌套 <mini-node-renderer>
    // 渲染，跨组件边界的后代选择器 / view→text 继承都不可靠 → 字体意图由 plugins/Latex/index.ts
    // 下沉成 kxf-* 类盖到字形 <text>，再用单类选择器赋字体（命中 text 自身）。
    const acss = source('../plugins/Latex/style.acss');
    const loader = source('../components/shared/loadKatexFonts.ts');
    // 必须是「单类」选择器（.kxf-x {），不能是会跨组件边界失效的后代选择器（.katex … text）。
    expect(acss).toMatch(/\.kxf-mathitalic\s*\{[^}]*font-family:\s*"KaTeX_MathItalic"/);
    expect(acss).toMatch(/\.kxf-main\s*\{[^}]*font-family:\s*"KaTeX_Main"/);
    expect(acss).toMatch(/\.kxf-ams\s*\{[^}]*font-family:\s*"KaTeX_AMS"/);
    // 不应再依赖后代选择器把字体赋到 .katex 内的 text（真机跨组件边界不命中）。
    expect(acss).not.toMatch(/\.katex \.mathnormal text\s*\{/);
    // 每个 kxf-* 唯一 family 都必须真的被 loadKatexFonts 注册（Alipay 用 alipayFamily）。
    for (const fam of [
      'KaTeX_MathItalic',
      'KaTeX_MathBoldItalic',
      'KaTeX_MainBold',
      'KaTeX_MainItalic',
      'KaTeX_SansSerifBold',
      'KaTeX_SansSerifItalic',
      'KaTeX_Size4',
    ]) {
      expect(acss, `style.acss references ${fam}`).toContain(`"${fam}"`);
      expect(loader, `loadKatexFonts registers ${fam}`).toContain(`'${fam}'`);
    }
    expect(loader).toContain("alipayFile: 'KaTeX_Main-Regular.ttf'");
    expect(loader).toContain("alipayFile: 'KaTeX_Math-Italic.ttf'");
    // 支付宝走白名单 CDN ttf：映射表覆盖每个 alipayFile，且真机分支只 push CDN url（无本地/base64）。
    expect(loader).toContain('export const KATEX_FONT_CDN');
    expect(loader).toContain("'KaTeX_Main-Regular.ttf': 'https://mdn.alipayobjects.com");
    expect(loader).toContain("'KaTeX_Size4-Regular.ttf': 'https://mdn.alipayobjects.com");
    expect(loader).toMatch(/if \(isAlipay\) \{\s*[\s\S]*?if \(cdn\) sources\.push\('url\("' \+ cdn \+ '"\)'\);\s*return sources;/);
    // 真机不再依赖包内本地路径 / base64 data URI（模拟器专属，已移除）。
    expect(loader).not.toContain('ALIPAY_LOCAL_BASES');
    expect(loader).not.toContain('loadInlineFontData');
    expect(loader).not.toContain('katex-font-data.js');
    expect(loader).not.toContain('/node_modules/');
    // 微信仍保留可解析的本地 miniprogram_npm ttf（构建npm 真实产出）作 CDN 之外的兜底。
    expect(loader).toContain("'/miniprogram_npm/' + PACKAGE_NAME + '/katex-fonts'");
  });

  it('keeps Alipay typewriter text classes on the real text leaf', () => {
    // 真机字体必须命中叶子 <text> 自身。逐字动画分支如果只把 kxf-* class 放到外层
    // <view>，支付宝真机不会把 font-family 可靠继承进每个字符 <text>，公式会回退系统字体。
    const axml = source('../components/alipay/MiniNodeRenderer/index.axml');
    // segClassOf keeps every font class (kxf-*, md-inline-code-txt, …) on the leaf so
    // Alipay 真机 fonts still resolve; it only swaps the inline-code pill box class off
    // the per-char leaves, which otherwise repeat the药丸 background/padding per character.
    expect(axml).toContain('class="md-anim-char {{u.segClassOf(node)}}"');
    expect(axml).toContain('style="{{u.styleOf(node)}}"');
    expect(axml).toContain('style="{{u.styleOf(c)}}"');
  });

  it('notifies font-ready at most once and only when not-yet-ready', () => {
    // <Markdown> may start font loading before nodes exist; <MiniNodeRenderer> registers
    // after it receives KaTeX nodes. onKatexFontsReady queues waiters until loadFontFace
    // completes, flushes them ONCE, and — critically — does NOT fire when already ready.
    // 后者是消除「流式每个 chunk 全页闪」的关键：已就绪的调用方不再触发强制重排。
    const loader = source('../components/shared/loadKatexFonts.ts');
    expect(loader).toContain('export function areKatexFontsReady()');
    expect(loader).toContain('export function ensureKatexFonts()');
    expect(loader).toContain('export function onKatexFontsReady(');
    expect(loader).toContain('readyCallbacks');
    // 只在尚未就绪时入队；已就绪直接 return（不回调、不重绘）。
    expect(loader).toMatch(/if \(ready\) return;\s*readyCallbacks\.push\(cb\);/s);
    // 全部字面完成后一次性 flush。
    expect(loader).toMatch(/for \(let i = 0; i < callbacks\.length; i\+\+\) callSafe\(callbacks\[i\]\);/);
  });

  it('build script publishes WeChat-only ttf and no base64 data module', () => {
    // 支付宝真机走 CDN ttf，包内本地 ttf / base64 data URI 均不生效 → 不再向 Alipay 包根发 ttf、
    // 不再生成 katex-font-data.js。微信的 miniprogram_dist 仍发布本地 ttf 作 CDN 之外的兜底。
    const buildScript = source('../../scripts/copy-component-assets.mjs');
    expect(buildScript).toContain('copyKatexTtfFonts(distMpRoot)');
    expect(buildScript).not.toContain('copyKatexTtfFonts(distRoot)');
    expect(buildScript).not.toContain('writeKatexTtfDataModule');
    expect(buildScript).not.toContain('data:font/ttf;base64,');
  });
});
