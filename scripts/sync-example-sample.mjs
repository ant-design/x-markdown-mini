import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { createSample } = require(join(root, 'examples', 'sample.js'));

for (const platform of ['wechat', 'alipay']) {
  const output = [
    '// 此文件由 examples/sample.js 生成，请勿直接修改。',
    '// 修改共享内容后运行：npm run sync:examples',
    `const SAMPLE = ${JSON.stringify(createSample(platform))};`,
    '',
    'module.exports = { SAMPLE };',
    '',
  ].join('\n');

  writeFileSync(join(root, 'examples', platform, 'pages', 'sample.js'), output);
}

console.log('[x-markdown-mini] example samples synced');
