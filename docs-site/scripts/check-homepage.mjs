import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const indexCn = read('docs/index.md');
const indexEn = read('docs/index.en-US.md');
const css = read('public/site.css');
const js = read('public/site.js');
const dumiConfig = read('.dumirc.ts');

const sharedHeroMarkup = [
  'xmd-hero',
  'xmd-hero-wordmark',
  'xmd-hero-i',
  'xmd-hero-star',
  'xmd-hero-desc',
  'x-markdown-min',
];

const requiredCnCopy = [
  '多端、流式友好、高性能的小程序原生 Markdown 渲染器',
];

const requiredEnCopy = [
  'Multi-platform, streaming-friendly, high-performance native Markdown renderer for mini programs',
];

const requiredCss = [
  '.markdown .xmd-hero',
  '.markdown .xmd-hero-wordmark',
  '.markdown .xmd-hero-desc',
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
  'xmd-mini',
  'xmd-hero',
  'xmd-homepage',
  'xmd-over-hero',
  'xmd-site-footer',
  'xmd-nav-cluster',
  'xmd-header-support',
  'requestAnimationFrame',
];

const requiredDumirc = [
  "name: 'viewport'",
  'width=device-width',
  "id: 'zh-CN'",
  "id: 'en-US'",
  "suffix: '-en'",
  "prefersColor: { default: 'light', switch: true }",
];

const forbiddenInIndex = [
  'xmd-home-recording',
  'xmd-home-hero-gif',
  'xmd-gif-placeholder',
  'xmd-home-animated-title',
  'setupTitleTypewriter',
  'processTitleTypewriter',
  'xmd-home-section',
  'xmd-hero-cta',
];

const forbiddenDumirc = [
  "{ title: '首页', link: '/' }",
  "{ title: 'Home', link: '/' }",
  "prefersColor: { default: 'light', switch: false }",
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
  if (indexCn.includes(item)) missing.push(`docs/index.md: remove obsolete v3 token "${item}"`);
  if (indexEn.includes(item)) missing.push(`docs/index.en-US.md: remove obsolete v3 token "${item}"`);
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
