// 把 mini-program 静态资源（.axml/.acss/.json/.sjs/.wxml/.wxss/.wxs）
//   从 src/components/{alipay,wechat}/<Comp>/ 复制到 dist 对应位置：
//     alipay → dist/es/<Comp>/ and dist/components/<Comp>/
//     wechat → dist/miniprogram_dist/es/<Comp>/ and dist/miniprogram_dist/components/<Comp>/
//   （JS 文件由 tsup 输出到同一位置）
//
// 注意：examples/{alipay,wechat} 现在通过 `npm i @ant-design/x-markdown-mini` 真实消费
// 已发布包（alipay 走 node_modules + dist/ 前缀，wechat 走 miniprogram_npm），不再向
// examples 目录回灌 dist/，所以本脚本不再同步 examples。
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
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
