import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const examples = [
  {
    name: 'alipay',
    dir: join(root, 'examples', 'alipay'),
    pageExts: ['.js', '.axml', '.json'],
    // The shipped lean component, or a demo-local wrapper that bakes plugins
    // (function-bearing extensions can't cross setData — see markdown-rich/).
    markdownComponents: [
      '../../dist/components/Markdown/index',
      '../../components/markdown-rich/index',
    ],
  },
  {
    name: 'wechat',
    dir: join(root, 'examples', 'wechat'),
    pageExts: ['.js', '.wxml', '.json'],
    markdownComponents: [
      '../../dist/components/Markdown/index',
      '../../components/markdown-rich/index',
    ],
  },
];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function assertExists(file, message) {
  if (!existsSync(file)) {
    throw new Error(`${message}: ${file}`);
  }
}

for (const example of examples) {
  const appJson = join(example.dir, 'app.json');
  assertExists(appJson, `${example.name} app.json is missing`);

  const app = readJson(appJson);
  if (!Array.isArray(app.pages) || app.pages.length === 0) {
    throw new Error(`${example.name} app.json must declare at least one page`);
  }

  for (const page of app.pages) {
    for (const ext of example.pageExts) {
      assertExists(join(example.dir, page + ext), `${example.name} page file is missing`);
    }

    const pageJson = join(example.dir, page + '.json');
    const config = readJson(pageJson);
    const components = config.usingComponents || {};

    if (!example.markdownComponents.includes(components.markdown)) {
      throw new Error(
        `${example.name} ${page}.json must use one of ${example.markdownComponents.join(' | ')}, got ${components.markdown}`
      );
    }

    for (const [name, request] of Object.entries(components)) {
      const componentJson = resolve(dirname(pageJson), request + '.json');
      assertExists(componentJson, `${example.name} component "${name}" is missing`);
    }
  }
}

console.log('[x-markdown-mini] examples config ok');
