import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const index = read('docs/index.md');
const css = read('public/site.css');
const dumiConfig = read('.dumirc.ts');

const requiredMarkup = [
  'xmd-home-v3',
  'xmd-home-minimal',
  'xmd-home-wordmark',
  'xmd-home-animated-title',
  'xmd-home-recording',
  'xmd-home-hero-gif',
  'xmd-gif-placeholder',
  '多端',
  '流式友好',
  '可扩展',
  '高性能',
  'Markdown 渲染器',
  '预留录屏展示位',
];

const requiredCss = [
  '.markdown .xmd-home-v3',
  '.markdown .xmd-home-minimal',
  '.markdown .xmd-home-wordmark',
  '.markdown .xmd-home-animated-title',
  '.markdown .xmd-home-recording',
  '.markdown .xmd-home-hero-gif',
  '.markdown .xmd-gif-placeholder',
  '@keyframes xmdCharType',
  '.dumi-default-navbar > li > a',
];

const missing = [
  ...requiredMarkup.filter((item) => !index.includes(item)).map((item) => `docs/index.md: ${item}`),
  ...requiredCss.filter((item) => !css.includes(item)).map((item) => `public/site.css: ${item}`),
  ...['name: \'viewport\'', 'width=device-width'].filter((item) => !dumiConfig.includes(item)).map((item) => `.dumirc.ts: ${item}`),
];

for (const removedCopy of [
  '设计目标',
  '适合这些小程序场景',
  '小程序 Markdown 渲染器',
  'Introduction',
  'Features',
  'Get started in seconds',
  'Showcase',
]) {
  if (index.includes(removedCopy)) {
    missing.push(`docs/index.md: remove capability heading copy ${removedCopy}`);
  }
}

for (const duplicateTag of ['微信 / 支付宝', '流式增量渲染', 'Headless API', '组件即插即用']) {
  if (index.includes(`<span>${duplicateTag}</span>`)) {
    missing.push(`docs/index.md: remove duplicated hero tag ${duplicateTag}`);
  }
}

if (missing.length > 0) {
  console.error('Homepage contract is missing:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Homepage contract: OK');
