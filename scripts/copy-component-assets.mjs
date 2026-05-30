// 1. 把 mini-program 静态资源（.axml/.acss/.json/.sjs/.wxml/.wxss/.wxs）
//    从 src/components/{alipay,wechat}/<Comp>/ 复制到 dist 对应位置：
//      alipay → dist/es/<Comp>/ and dist/components/<Comp>/
//      wechat → dist/miniprogram_dist/es/<Comp>/ and dist/miniprogram_dist/components/<Comp>/
//    （JS 文件由 tsup 输出到同一位置）
// 2. 同步 dist 内对应平台的子树到 examples/{wechat,alipay}/dist/，
//    让两个 examples 目录可以被开发者工具直接打开。
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcRoot = join(root, 'src', 'components');
const distRoot = join(root, 'dist');
const distMpRoot = join(distRoot, 'miniprogram_dist');
const examplesRoot = join(root, 'examples');

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

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const sp = join(src, name);
    const dp = join(dest, name);
    const s = statSync(sp);
    if (s.isDirectory()) copyTree(sp, dp);
    else copyFileSync(sp, dp);
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

// 1. 静态资源 — keep legacy es/* and the unified components/* entry in sync.
const alipaySrc = join(srcRoot, 'alipay');
const wechatSrc = join(srcRoot, 'wechat');
copyComponentAssets(alipaySrc, distRoot, ALIPAY_EXT);
copyComponentAssets(wechatSrc, distMpRoot, WECHAT_EXT);
console.log('[x-markdown-mini] component static assets copied to es/* and components/* entries');

// 1b. Plugin styles — copy .acss to dist/plugins/<Name>/ and .wxss to dist/miniprogram_dist/plugins/<Name>/
const pluginsSrc = join(root, 'src', 'plugins');
if (existsSync(pluginsSrc)) {
  for (const plugin of readdirSync(pluginsSrc)) {
    const pluginDir = join(pluginsSrc, plugin);
    if (!statSync(pluginDir).isDirectory()) continue;
    // Alipay: .acss
    for (const f of readdirSync(pluginDir)) {
      if (f.endsWith('.acss')) {
        const destDir = join(distRoot, 'plugins', plugin);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(join(pluginDir, f), join(destDir, f));
      }
    }
    // WeChat: .wxss
    for (const f of readdirSync(pluginDir)) {
      if (f.endsWith('.wxss')) {
        const destDir = join(distMpRoot, 'plugins', plugin);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(join(pluginDir, f), join(destDir, f));
      }
    }
  }
  console.log('[x-markdown-mini] plugin styles copied to dist/plugins and dist/miniprogram_dist/plugins');
}

// 2. examples 同步：
//    examples/alipay/dist/  ← dist/{index.js, index.mjs, index.d.ts, es/, shared/}
//    examples/wechat/dist/  ← dist/miniprogram_dist/*
if (existsSync(examplesRoot)) {
  // Alipay example: 用主 dist（不包括 miniprogram_dist）
  const alipayExample = join(examplesRoot, 'alipay');
  if (existsSync(alipayExample)) {
    const out = join(alipayExample, 'dist');
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });
    for (const name of readdirSync(distRoot)) {
      if (name === 'miniprogram_dist') continue;
      const sp = join(distRoot, name);
      const dp = join(out, name);
      if (statSync(sp).isDirectory()) copyTree(sp, dp);
      else copyFileSync(sp, dp);
    }
    console.log('[x-markdown-mini] examples/alipay/dist synced');
  }
  // Wechat example: 用 miniprogram_dist 子树
  const wechatExample = join(examplesRoot, 'wechat');
  if (existsSync(wechatExample) && existsSync(distMpRoot)) {
    const out = join(wechatExample, 'dist');
    rmSync(out, { recursive: true, force: true });
    copyTree(distMpRoot, out);
    console.log('[x-markdown-mini] examples/wechat/dist synced');
  }
}
