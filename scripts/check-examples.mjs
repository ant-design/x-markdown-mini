import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const require = createRequire(import.meta.url);
const { createSample } = require(join(root, 'examples', 'sample.js'));

// Each example demonstrates the same two integration paths, as a real npm
// consumer would wire them (no reaching into source):
//   - 组件接入: the shipped <Markdown> component via its package path, with
//     latex/highlight baked inside the component (booleans, not props).
//   - JS 接入: renderNodes() in page JS feeding the low-level MiniNodeRenderer.
// Import paths are now SYMMETRIC — NO dist/ segment on either platform. The package
// is published with the dist/ CONTENTS at its root (scripts/prepare-publish.mjs +
// `npm publish ./dist`), so `es/Markdown/index` resolves on both:
// - Alipay resolves npm subpaths RAW from the package root filesystem (it does NOT
//   honor package.json#exports) → es/ now sits at that root, so no dist/ prefix is
//   needed (a missing path would still be CE1000.01). It also needs Component2 plus
//   node_modules transpilation, or the component fails to register ("reading 'options'").
// - WeChat resolves via `package.json#miniprogram` (→ miniprogram_dist) + 构建npm.
const examples = [
  {
    name: 'alipay',
    dir: join(root, 'examples', 'alipay'),
    pageExts: ['.js', '.axml', '.json'],
    markdownComponent: '@ant-design/x-markdown-mini/es/Markdown/index',
    nodeRenderer: '@ant-design/x-markdown-mini/es/MiniNodeRenderer/index',
  },
  {
    name: 'wechat',
    dir: join(root, 'examples', 'wechat'),
    pageExts: ['.js', '.wxml', '.json'],
    markdownComponent: '@ant-design/x-markdown-mini/es/Markdown/index',
    nodeRenderer: '@ant-design/x-markdown-mini/es/MiniNodeRenderer/index',
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

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected "${expected}", got "${actual}"`);
  }
}

for (const example of examples) {
  const appJson = join(example.dir, 'app.json');
  assertExists(appJson, `${example.name} app.json is missing`);

  if (example.name === 'alipay') {
    const project = readJson(join(example.dir, 'mini.project.json'));
    assertEqual(
      project.compileOptions?.component2,
      true,
      'alipay example must enable the Component2 runtime required by npm components',
    );
  }

  const app = readJson(appJson);
  if (!Array.isArray(app.pages) || app.pages.length === 0) {
    throw new Error(`${example.name} app.json must declare at least one page`);
  }

  const { SAMPLE } = require(join(example.dir, 'pages', 'sample.js'));
  assertEqual(
    SAMPLE,
    createSample(example.name),
    `${example.name} sample is stale; run npm run sync:examples`,
  );

  // The two integration paths must both be present and reachable from home.
  for (const required of ['pages/component/component', 'pages/js/js', 'pages/home/home']) {
    if (!app.pages.includes(required)) {
      throw new Error(`${example.name} app.json must list ${required}`);
    }
  }

  for (const page of app.pages) {
    for (const ext of example.pageExts) {
      assertExists(join(example.dir, page + ext), `${example.name} page file is missing`);
    }

    const pageJson = join(example.dir, page + '.json');
    const config = readJson(pageJson);
    const components = config.usingComponents || {};

    // 组件接入页：必须用已发布包里的高层 <Markdown> 组件路径。
    if (page.endsWith('component/component')) {
      assertEqual(
        components.markdown,
        example.markdownComponent,
        `${example.name} 组件接入 page must use the shipped Markdown component`,
      );
    }
    // JS 接入页：必须用底层 MiniNodeRenderer 组件路径。
    if (page.endsWith('js/js')) {
      assertEqual(
        components['mini-node-renderer'],
        example.nodeRenderer,
        `${example.name} JS 接入 page must use the shipped MiniNodeRenderer`,
      );
    }

    // 只校验「本地相对路径」组件是否存在；包名路径（node_modules）安装后才存在，跳过。
    for (const [name, request] of Object.entries(components)) {
      if (request.startsWith('.')) {
        const componentJson = resolve(dirname(pageJson), request + '.json');
        assertExists(componentJson, `${example.name} component "${name}" is missing`);
      }
    }
  }
}

console.log('[x-markdown-mini] examples config ok');
