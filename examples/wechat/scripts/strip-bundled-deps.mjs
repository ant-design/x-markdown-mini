// 微信「构建 npm」会沿依赖图递归打包 @ant-design/x-markdown-mini 的传递依赖。
// beta.1 的已发布 package.json 把 marked / remend 放回了 dependencies（beta.0 是 {}），
// 于是 npm i 装了独立的 node_modules/marked，构建 npm 解析 marked.esm.js 时撞上命名
// 捕获组正则 → SyntaxError: Unexpected token (13:560)。
//
// 但 marked / remend 早已被 tsup noExternal 内联打包进 dist（含 miniprogram 子树）的
// index.js，运行时从不 require('marked')，所以这两个 runtime 依赖对小程序是多余的。
// 这里在 install 后把「已安装副本」的 dependencies 清空，切断 x-markdown-mini → marked
// 这条依赖边，构建 npm 沿依赖图就到不了 marked，问题消失。
//
// 这是针对 beta.1 依赖回归的临时垫片；待 beta.2 把 marked/remend 挪回 devDependencies
// 并让 .d.ts 自包含后即可删除本脚本与对应的 postinstall。
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(here, '..', 'node_modules', '@ant-design', 'x-markdown-mini', 'package.json');

if (!existsSync(pkgPath)) {
  // 依赖尚未安装（例如 --ignore-scripts 后手动跑）——静默跳过，不报错。
  process.exit(0);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const had = pkg.dependencies && Object.keys(pkg.dependencies).length > 0;
if (had) {
  pkg.dependencies = {};
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[strip-bundled-deps] cleared @ant-design/x-markdown-mini runtime dependencies (bundled, not needed) so 构建 npm skips standalone marked.');
} else {
  console.log('[strip-bundled-deps] @ant-design/x-markdown-mini already has empty dependencies — nothing to do.');
}
