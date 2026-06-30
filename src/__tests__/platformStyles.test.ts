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
    // 真机根因：(1) loadFontFace 同名 family 只认首字面 → 每字面唯一 family；(2) woff 虽回调
    // loaded 但不参与 <text> 排版，支付宝 runtime 必须加载 ttf；(3) KaTeX 经嵌套
    // <mini-node-renderer> 渲染，跨组件边界的后代选择器 / view→text 继承都不可靠 → 字体意图由
    // plugins/Latex/index.ts 下沉成 kxf-* 类盖到字形 <text>，再用单类选择器赋字体（命中 text 自身）。
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
    expect(loader).toMatch(/const ALIPAY_LOCAL_BASES = \[\s*'\/katex-fonts'/);
    expect(loader).toMatch(/if \(isAlipay\) \{\s*for \(let i = 0; i < localBases\.length; i\+\+\)/);
    expect(loader).toContain('function loadInlineFontData()');
    expect(loader).toContain("req('../../katex-font-data.js')");
    expect(loader).toContain("data && data[f.alipayFile]");
    expect(loader).toContain('if (isAlipay) {');
    expect(loader).toContain("CDN + '/' + f.alipayFile");
    expect(loader).toContain("'/node_modules/' + PACKAGE_NAME + '/dist/katex-fonts'");
    expect(loader).toContain("'/node_modules/' + PACKAGE_NAME + '/katex-fonts'");
    expect(loader).toContain("'/miniprogram_npm/' + PACKAGE_NAME + '/dist/miniprogram_dist/katex-fonts'");
    expect(loader).toContain("'/miniprogram_npm/' + PACKAGE_NAME + '/katex-fonts'");
    expect(loader).toMatch(/sources\.push\('url\("' \+ localBases\[i\] \+ '\/' \+ f\.alipayFile \+ '"\)'\);/);
  });

  it('keeps Alipay typewriter text classes on the real text leaf', () => {
    // 真机字体必须命中叶子 <text> 自身。逐字动画分支如果只把 kxf-* class 放到外层
    // <view>，支付宝真机不会把 font-family 可靠继承进每个字符 <text>，公式会回退系统字体。
    const axml = source('../components/alipay/MiniNodeRenderer/index.axml');
    expect(axml).toContain('class="md-anim-char {{u.classOf(node)}}"');
  });

  it('keeps all KaTeX font-ready callbacks until fonts finish loading', () => {
    // <Markdown> may start font loading before nodes exist; <MiniNodeRenderer> registers
    // after it receives KaTeX nodes. Real devices need both callbacks preserved so a
    // late renderer can still force a redraw after loadFontFace completes.
    const loader = source('../components/shared/loadKatexFonts.ts');
    expect(loader).toContain('readyCallbacks');
    expect(loader).toMatch(/if \(onReady\) readyCallbacks\.push\(onReady\);/);
    expect(loader).toMatch(/if \(ready\) \{\s*callSafe\(onReady\);/s);
    expect(loader).toMatch(/for \(let i = 0; i < callbacks\.length; i\+\+\) callSafe\(callbacks\[i\]\);/);
  });

  it('build script emits inline ttf font data modules for package roots', () => {
    const buildScript = source('../../scripts/copy-component-assets.mjs');
    expect(buildScript).toContain('writeKatexTtfDataModule(distRoot)');
    expect(buildScript).toContain('writeKatexTtfDataModule(distMpRoot)');
    expect(buildScript).toContain('data:font/ttf;base64,');
  });
});
