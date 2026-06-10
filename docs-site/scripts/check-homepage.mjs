import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const indexCn = read('docs/index.md');
const indexEn = read('docs/index.en-US.md');
const css = read('public/site.css');
const js = read('public/site.js');
const dumiConfig = read('.dumirc.ts');

// Markup the rebuilt homepage must keep. site.js keys homepage detection and
// SPA link enhancement off `.xmd-hero`; the copy button + status hooks drive
// the clipboard flash; the streaming phone demo is the hero's proof.
const sharedHeroMarkup = [
  'class="xmd-landing"',
  'class="xmd-hero"',
  'xmd-hero-copy',
  'xmd-hero-media',
  'xmd-hero-facts',
  'xmd-phone',
  'xmd-phone-screen',
  'xmd-stream-block',
  'xmd-stream-caret',
  'data-xmd-copy="npm i @ant-design/x-markdown-mini"',
  'data-xmd-copy-status',
  'xmd-architecture',
  'xmd-arch-board',
  'xmd-arch-svg',
  'xmd-arch-proof',
  'one-shot render',
  'streaming render',
  'extension points',
];

const requiredCnCopy = [
  '多端，流式友好，高性能的小程序 Markdown 渲染器',
  '为 AI 对话和内容场景设计',
  '一条短链路，直接到平台节点',
  '微信 / 支付宝原生节点直出',
  '自定义拓展',
  '100% CommonMark',
  '~28 KB',
];

const requiredEnCopy = [
  'Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer',
  'Built for AI chat and content surfaces',
  'One short path, straight to platform nodes',
  'WeChat / Alipay native node output',
  'Custom extensions',
  '100% CommonMark',
  '~28 KB',
];

const requiredCss = [
  '.markdown .xmd-hero',
  '.markdown .xmd-hero-facts',
  '.markdown .xmd-phone',
  '.markdown .xmd-phone-screen',
  '.markdown .xmd-stream-block',
  '.markdown .xmd-stream-caret',
  '.markdown .xmd-arch-board',
  '.markdown .xmd-arch-svg',
  '.markdown .xmd-arch-proof',
  '@keyframes xmd-stream-rise',
  'prefers-reduced-motion',
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
  if (!indexCn.includes(item)) missing.push(`docs/index.md: ${item}`);
  if (!indexEn.includes(item)) missing.push(`docs/index.en-US.md: ${item}`);
}
for (const item of requiredCnCopy) {
  if (!indexCn.includes(item)) missing.push(`docs/index.md: ${item}`);
}
for (const item of requiredEnCopy) {
  if (!indexEn.includes(item)) missing.push(`docs/index.en-US.md: ${item}`);
}
for (const item of requiredCss) {
  if (!css.includes(item)) missing.push(`public/site.css: ${item}`);
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
