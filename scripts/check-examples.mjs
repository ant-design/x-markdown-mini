import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const require = createRequire(import.meta.url);
const { createSample } = require(join(root, 'examples', 'sample.js'));
const LOCAL_DIST_DEP = 'file:../../dist';

// Each example demonstrates the same two integration paths against the package
// root produced by npm publish ./dist (no reaching into src):
//   - 组件接入: the shipped <Markdown> component via its package path, with
//     latex/highlight baked inside the component (booleans, not props).
//   - JS 接入: renderNodes() in page JS feeding the low-level MiniNodeRenderer.
// Local development consumes file:../../dist so changes can be validated in the
// mini-program IDE before publishing. Published package contents have no dist/
// segment. Both examples use package requests and let their IDE resolve the
// installed package:
// - Alipay resolves npm subpaths RAW from the package root filesystem (it does NOT
//   honor package.json#exports) → es/ now sits at that root, so no dist/ prefix is
//   needed (a missing path would still be CE1000.01). It also needs Component2 plus
//   node_modules transpilation, or the component fails to register ("reading 'options'").
// - WeChat 构建npm resolves `package.json#miniprogram` (→ miniprogram_dist) into
//   miniprogram_npm. Pages must keep using the package request; treating that
//   generated directory as an ordinary relative component path is not supported.
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
  const packageJson = readJson(join(example.dir, 'package.json'));
  assertEqual(
    packageJson.dependencies?.['@ant-design/x-markdown-mini'],
    LOCAL_DIST_DEP,
    `${example.name} example must consume the local dist package`,
  );

  if (example.name === 'alipay') {
    const project = readJson(join(example.dir, 'mini.project.json'));
    assertEqual(
      project.compileOptions?.component2,
      true,
      'alipay example must enable the Component2 runtime required by npm components',
    );
  }

  if (example.name === 'wechat') {
    const project = readJson(join(example.dir, 'project.config.json'));
    assertEqual(
      project.setting?.packNpmManually,
      true,
      'wechat example must explicitly map npm output for the installed package',
    );
    const npmRelation = project.setting?.packNpmRelationList?.[0];
    assertEqual(
      npmRelation?.packageJsonPath,
      './package.json',
      'wechat example npm mapping must use its own package.json',
    );
    assertEqual(
      npmRelation?.miniprogramNpmDistDir,
      './',
      'wechat example npm mapping must emit miniprogram_npm under the mini-program root',
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
