// 把 mini-program 静态资源（.axml/.acss/.json/.sjs/.wxml/.wxss/.wxs）
//   从 src/components/{alipay,wechat}/<Comp>/ 复制到 dist 对应位置：
//     alipay → dist/es/<Comp>/ and dist/components/<Comp>/
//     wechat → dist/miniprogram_dist/es/<Comp>/ and dist/miniprogram_dist/components/<Comp>/
//   （JS 文件由 tsup 输出到同一位置）
//
// 注意：examples/{alipay,wechat} 现在通过 `npm i @ant-design/x-markdown-mini` 真实消费
// 已发布包（alipay 走 node_modules + dist/ 前缀，wechat 走 miniprogram_npm），不再向
// examples 目录回灌 dist/，所以本脚本不再同步 examples。
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcRoot = join(root, 'src', 'components');
const distRoot = join(root, 'dist');
const distMpRoot = join(distRoot, 'miniprogram_dist');

const ALIPAY_EXT = /\.(axml|acss|json|sjs)$/;
const WECHAT_EXT = /\.(wxml|wxss|json|wxs)$/;

function walkAndCopy(srcDir, destDir, filter) {
  if (!existsSync(srcDir)) return;
  for (const name of readdirSync(srcDir)) {
    const sp = join(srcDir, name);
    const s = statSync(sp);
    if (s.isDirectory()) {
      walkAndCopy(sp, join(destDir, name), filter);
    } else if (filter.test(name)) {
      mkdirSync(destDir, { recursive: true });
      copyFileSync(sp, join(destDir, name));
    }
  }
}

function copyComponentAssets(platformSrc, baseDest, filter) {
  if (!existsSync(platformSrc)) return;
  for (const comp of readdirSync(platformSrc)) {
    const sd = join(platformSrc, comp);
    if (!statSync(sd).isDirectory()) continue;
    walkAndCopy(sd, join(baseDest, 'es', comp), filter);
    walkAndCopy(sd, join(baseDest, 'components', comp), filter);
  }
}

function copyKatexTtfFonts(baseDest) {
  const srcDir = join(root, 'node_modules', 'katex', 'dist', 'fonts');
  if (!existsSync(srcDir)) return;
  const destDir = join(baseDest, 'katex-fonts');
  rmSync(destDir, { force: true, recursive: true });
  mkdirSync(destDir, { recursive: true });
  for (const f of readdirSync(srcDir)) {
    if (f.endsWith('.ttf')) copyFileSync(join(srcDir, f), join(destDir, f));
  }
}

// 1. 静态资源 — keep legacy es/* and the unified components/* entry in sync.
const alipaySrc = join(srcRoot, 'alipay');
const wechatSrc = join(srcRoot, 'wechat');
copyComponentAssets(alipaySrc, distRoot, ALIPAY_EXT);
copyComponentAssets(wechatSrc, distMpRoot, WECHAT_EXT);
console.log('[x-markdown-mini] component static assets copied to es/* and components/* entries');

// 1a. 共享元素样式 — 单一来源 src/components/shared/elements.css「内联拼接」到各端
// MiniNodeRenderer 的 index.{wxss,acss} 输出开头。不产出独立分片、不用 @import：在含
// index.json 的组件目录里放裸 .wxss 分片会让微信「构建 npm」的编译器崩溃
// (getDevCodeByFileList)。内联后产物与历史上「元素样式直接写在 index 里」的结构一致。
const sharedElements = join(srcRoot, 'shared', 'elements.css');
if (existsSync(sharedElements)) {
  const shared = readFileSync(sharedElements, 'utf8').replace(/\s*$/, '\n');
  const splitLeadingImports = (css) => {
    const match = css.match(/^((?:@import\s+[^;]+;\s*)+)/);
    if (!match) return { imports: '', body: css };
    return {
      imports: match[1].replace(/\s*$/, '\n'),
      body: css.slice(match[1].length).replace(/^\s*/, ''),
    };
  };
  const inlineTargets = [
    {
      src: join(srcRoot, 'alipay', 'MiniNodeRenderer', 'index.acss'),
      outs: [
        join(distRoot, 'es', 'MiniNodeRenderer', 'index.acss'),
        join(distRoot, 'components', 'MiniNodeRenderer', 'index.acss'),
      ],
    },
    {
      src: join(srcRoot, 'wechat', 'MiniNodeRenderer', 'index.wxss'),
      outs: [
        join(distMpRoot, 'es', 'MiniNodeRenderer', 'index.wxss'),
        join(distMpRoot, 'components', 'MiniNodeRenderer', 'index.wxss'),
      ],
    },
  ];
  for (const { src, outs } of inlineTargets) {
    if (!existsSync(src)) continue;
    const own = readFileSync(src, 'utf8');
    const { imports, body } = splitLeadingImports(own);
    const merged = `${imports}${shared}\n${body}`;
    for (const out of outs) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, merged);
    }
  }
  console.log('[x-markdown-mini] shared element styles inlined into MiniNodeRenderer index.{wxss,acss}');
}

// 1b. Plugin styles — copy .acss to dist/plugins/<Name>/ and .wxss to dist/miniprogram_dist/plugins/<Name>/
const pluginsSrc = join(root, 'src', 'plugins');
if (existsSync(pluginsSrc)) {
  for (const plugin of readdirSync(pluginsSrc)) {
    const pluginDir = join(pluginsSrc, plugin);
    if (!statSync(pluginDir).isDirectory()) continue;
    rmSync(join(distRoot, 'plugins', plugin, 'fonts.acss'), { force: true });
    rmSync(join(distMpRoot, 'plugins', plugin, 'fonts.wxss'), { force: true });
    // Alipay: .acss
    for (const f of readdirSync(pluginDir)) {
      if (f.endsWith('.acss') && f !== 'fonts.acss') {
        const destDir = join(distRoot, 'plugins', plugin);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(join(pluginDir, f), join(destDir, f));
      }
    }
    // WeChat: .wxss
    for (const f of readdirSync(pluginDir)) {
      if (f.endsWith('.wxss') && f !== 'fonts.wxss') {
        const destDir = join(distMpRoot, 'plugins', plugin);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(join(pluginDir, f), join(destDir, f));
      }
    }
  }
  console.log('[x-markdown-mini] plugin styles copied to dist/plugins and dist/miniprogram_dist/plugins');
}

// 1c. KaTeX runtime fonts — publish real ttf files in the npm package.
// They are loaded lazily via loadFontFace only when latex is enabled / formula nodes exist.
copyKatexTtfFonts(distRoot);
copyKatexTtfFonts(distMpRoot);
console.log('[x-markdown-mini] KaTeX ttf fonts copied to dist/katex-fonts entries');
