import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const index = read('docs/index.md');
const css = read('public/site.css');
const dumiConfig = read('.dumirc.ts');

const requiredMarkup = [
  'xmd-home-slogan',
  'xmd-capability-grid',
  'xmd-capability-card',
  'xmd-feature-demo',
  'xmd-performance',
  'xmd-package-table',
  '多端可用',
  'AI 流式友好',
  '高扩展',
  '高性能',
  'npm pack --dry-run',
  'benchmark/baseline.json',
];

const requiredCss = [
  '.markdown .xmd-home-slogan',
  '.markdown .xmd-capability-grid',
  '.markdown .xmd-capability-card',
  '.markdown .xmd-feature-demo',
  '@keyframes xmd-stream-caret',
  '@keyframes xmd-demo-progress',
  '.markdown .xmd-performance',
  '.markdown .xmd-package-table',
  '.dumi-default-navbar > li > a',
];

const missing = [
  ...requiredMarkup.filter((item) => !index.includes(item)).map((item) => `docs/index.md: ${item}`),
  ...requiredCss.filter((item) => !css.includes(item)).map((item) => `public/site.css: ${item}`),
  ...['name: \'viewport\'', 'width=device-width'].filter((item) => !dumiConfig.includes(item)).map((item) => `.dumirc.ts: ${item}`),
];

if (index.includes('Markdown renderer for mini programs')) {
  missing.push('docs/index.md: remove English hero kicker');
}

for (const removedCopy of ['设计目标', '首页只讲四件事']) {
  if (index.includes(removedCopy)) {
    missing.push(`docs/index.md: remove capability heading copy ${removedCopy}`);
  }
}

for (const removedNumber of ['>01</', '>02</', '>03</', '>04</']) {
  if (index.includes(removedNumber)) {
    missing.push(`docs/index.md: remove capability number ${removedNumber}`);
  }
}

for (const href of ['href="/docs/platforms"', 'href="/docs/streaming"', 'href="/docs/api"', 'href="#performance"']) {
  if (!index.includes(href)) {
    missing.push(`docs/index.md: capability card missing ${href}`);
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
