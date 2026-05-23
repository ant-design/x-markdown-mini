import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(join(root.pathname, path), 'utf8');

const index = read('docs/index.md');
const css = read('public/site.css');
const dumiConfig = read('.dumirc.ts');

const requiredMarkup = [
  'xmd-home-v3',
  'xmd-home-slogan',
  'xmd-powered',
  'xmd-what',
  'xmd-pipeline',
  'xmd-capability-grid',
  'xmd-capability-card',
  'xmd-playground-callout',
  'xmd-playground-panel',
  'xmd-get-started',
  'xmd-start-code',
  'xmd-docs-map',
  'xmd-doc-map-grid',
  'xmd-final-cta',
  'Introduction',
  'Features',
  'Playground',
  'Get started in seconds',
  'Showcase',
  '多端节点输出',
  '流式体验',
  'Headless API',
  'Typography & GFM',
  'renderNodes',
  'npm pack --dry-run',
  'benchmark/baseline.json',
];

const requiredCss = [
  '.markdown .xmd-home-v3',
  '.markdown .xmd-home-slogan',
  '.markdown .xmd-powered',
  '.markdown .xmd-what',
  '.markdown .xmd-pipeline',
  '.markdown .xmd-capability-grid',
  '.markdown .xmd-capability-card',
  '.markdown .xmd-playground-callout',
  '.markdown .xmd-playground-panel',
  '.markdown .xmd-get-started',
  '.markdown .xmd-start-code',
  '.markdown .xmd-docs-map',
  '.markdown .xmd-doc-map-grid',
  '.markdown .xmd-final-cta',
  '.dumi-default-navbar > li > a',
];

const missing = [
  ...requiredMarkup.filter((item) => !index.includes(item)).map((item) => `docs/index.md: ${item}`),
  ...requiredCss.filter((item) => !css.includes(item)).map((item) => `public/site.css: ${item}`),
  ...['name: \'viewport\'', 'width=device-width'].filter((item) => !dumiConfig.includes(item)).map((item) => `.dumirc.ts: ${item}`),
];

for (const removedCopy of ['设计目标']) {
  if (index.includes(removedCopy)) {
    missing.push(`docs/index.md: remove capability heading copy ${removedCopy}`);
  }
}

for (const href of [
  'href="/docs/platforms"',
  'href="/docs/streaming"',
  'href="/docs/api"',
  'href="/docs/custom-platform"',
  'href="/docs/adapter-rules"',
  'href="/playground"',
  'href="/examples/markdown"',
  'href="/examples/streaming"',
  'href="/docs/types"',
]) {
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
