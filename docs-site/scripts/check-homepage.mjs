import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const indexCn = read('docs/index.md');
const indexEn = read('docs/index.en-US.md');
const homeCn = read('src/demos/home/HomePage.tsx');
const homeEn = read('src/demos/home/HomePage.en-US.tsx');
const heroPhoneCn = read('src/demos/home/HeroPhonePreview.tsx');
const heroPhoneEn = read('src/demos/home/HeroPhonePreview.en-US.tsx');
const installPanel = read('src/demos/home/InstallPanel.tsx');
const phonePreview = read('src/components/PhonePreview/index.tsx');
const css = read('public/site.css');
const heroLess = read('src/demos/home/HeroPhonePreview.less');
const phoneLess = read('src/components/PhonePreview/index.less');
const js = read('public/site.js');
const dumiConfig = read('.dumirc.ts');
const zhHomeSource = [indexCn, homeCn, heroPhoneCn, installPanel, phonePreview].join('\n');
const enHomeSource = [indexEn, homeEn, heroPhoneEn, installPanel, phonePreview].join('\n');
const styleSource = [css, heroLess, phoneLess].join('\n');

// Markup the rebuilt homepage must keep. site.js keys homepage detection and
// SPA link enhancement off `.xmd-hero`; the copy button + status hooks drive
// the clipboard flash; the streaming phone demo is the hero's proof.
const sharedHeroMarkup = [
  'xmd-landing',
  'xmd-hero',
  'xmd-hero-copy',
  'xmd-hero-media',
  'xmd-phone',
  'xmd-phone-screen',
  'data-xmd-copy',
  'npm i @ant-design/x-markdown-mini',
  'data-xmd-copy-status',
  'xmd-architecture',
  'xmd-arch-board',
  'xmd-arch-svg',
  'xmd-arch-proof',
  'PlatformRenderer',
  'StreamingProcessor',
];

const requiredCnCopy = [
  '多端，流式友好，高性能的小程序 Markdown 渲染器',
  '原生的微信、支付宝渲染',
  '自定义拓展',
  '100% CommonMark',
];

const requiredEnCopy = [
  'Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer',
  'Native WeChat and Alipay rendering',
  'Custom extensions',
  '100% CommonMark',
];

const requiredCss = [
  '.markdown .xmd-hero',
  '.xmd-phone',
  '.xmd-phone-screen',
  '.markdown .xmd-install-command',
  '.markdown .xmd-playground-link',
  '.markdown .xmd-arch-board',
  '.markdown .xmd-arch-svg',
  '.markdown .xmd-arch-proof',
  'body.xmd-homepage',
  'body.xmd-over-hero',
  '.xmd-mini',
  '.xmd-site-footer',
  '.xmd-nav-cluster',
  '.xmd-header-support',
  'var(--xmd-accent)',
  '.dumi-default-navbar > li > a',
  '.dumi-default-sidebar dd > a.active',
];

const requiredJs = [
  'xmd-hero',
  'xmd-landing',
  'xmd-homepage',
  'xmd-over-hero',
  'data-xmd-copy-status',
  'xmd-site-footer',
  'xmd-nav-cluster',
  'xmd-header-support',
  'xmd-platform-tabs',
  'requestAnimationFrame',
  'xmd-doc-platform',
  'xmd-mini',
];

const requiredDumirc = [
  "name: 'viewport'",
  'width=device-width',
  "id: 'zh-CN'",
  "id: 'en-US'",
  "suffix: '-en'",
  "prefersColor: { default: 'light', switch: true }",
];

const forbiddenDumirc = [
  "{ title: '首页', link: '/' }",
  "{ title: 'Home', link: '/' }",
  "name: 'Ant Design x-markdown-mini'",
  "prefersColor: { default: 'light', switch: false }",
];

// Regression guards. The rebuild removed the per-section eyebrow + numbered-card
// AI scaffolding, the empty GIF placeholder, and the dead home v1/v2/v3/x-style
// iterations. None of these may come back into the homepage markup.
const forbiddenInIndex = [
  'xmd-hero-kicker',
  'xmd-section-kicker',
  'xmd-eyebrow',
  'xmd-preview-asset',
  'xmd-preview-placeholder',
  '真机预览 GIF',
  'Device preview GIF',
  '预览素材待替换',
  'Replace with final capture',
  '<span>01</span>',
  '<span>02</span>',
  '<span>03</span>',
  '<span>04</span>',
  'xmd-hero-cta',
  'xmd-home-x',
  'xmd-rich-panel',
  'xmd-home-recording',
  'xmd-home-animated-title',
];

// The dead homepage iterations must stay deleted from the stylesheet too, so the
// graveyard does not creep back on the next edit.
const forbiddenInCss = [
  '.xmd-home-x',
  '.xmd-rich-panel',
  '.xmd-scenes-preview',
  '.xmd-home-v3',
  '.xmd-hero-cta-primary',
  '.xmd-demo-source',
];

const missing = [];

for (const item of sharedHeroMarkup) {
  if (!zhHomeSource.includes(item)) {
    missing.push(`home zh source: ${item}`);
  }
  if (!enHomeSource.includes(item)) {
    missing.push(`home en source: ${item}`);
  }
}
for (const item of requiredCnCopy) {
  if (!zhHomeSource.includes(item)) missing.push(`home zh source: ${item}`);
}
for (const item of requiredEnCopy) {
  if (!enHomeSource.includes(item)) missing.push(`home en source: ${item}`);
}
for (const item of requiredCss) {
  if (!styleSource.includes(item)) missing.push(`style source: ${item}`);
}
for (const item of requiredJs) {
  if (!js.includes(item)) missing.push(`public/site.js: ${item}`);
}
for (const item of requiredDumirc) {
  if (!dumiConfig.includes(item)) missing.push(`.dumirc.ts: ${item}`);
}
for (const item of forbiddenDumirc) {
  if (dumiConfig.includes(item)) missing.push(`.dumirc.ts: remove ${item}`);
}
for (const item of forbiddenInIndex) {
  if (indexCn.includes(item)) missing.push(`docs/index.md: remove "${item}"`);
  if (indexEn.includes(item)) missing.push(`docs/index.en-US.md: remove "${item}"`);
}
for (const item of forbiddenInCss) {
  if (css.includes(item)) missing.push(`public/site.css: remove dead style "${item}"`);
}

for (const platformContract of ['xmd-doc-platform']) {
  if (!js.includes(platformContract)) {
    missing.push(`public/site.js: ${platformContract}`);
  }
}

if (missing.length > 0) {
  console.error('Homepage contract is missing:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Homepage contract: OK');
