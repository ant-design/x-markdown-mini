import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const exampleRoot = fileURLToPath(new URL('..', import.meta.url));
const miniprogramNpm = join(exampleRoot, 'miniprogram_npm');
const nodeOnlyTowxmlDeps = ['fs-extra', 'graceful-fs', 'jsonfile', 'universalify'];
const richTextParserDeps = ['mini-html-parser2', 'domhandler', 'domelementtype', 'entities', 'events'];

function copyDir(source, target) {
  if (!existsSync(source)) {
    throw new Error(`Missing dependency output: ${source}`);
  }

  rmSync(target, { force: true, recursive: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

copyDir(
  join(exampleRoot, 'node_modules', 'mp-html', 'dist', 'mp-weixin'),
  join(miniprogramNpm, 'mp-html'),
);
copyDir(
  join(exampleRoot, 'node_modules', 'mp-html', 'plugins'),
  join(miniprogramNpm, 'mp-html', 'plugins'),
);
copyDir(join(exampleRoot, 'node_modules', 'towxml'), join(miniprogramNpm, 'towxml'));
for (const dep of nodeOnlyTowxmlDeps) {
  rmSync(join(miniprogramNpm, dep), { force: true, recursive: true });
}
for (const dep of richTextParserDeps) {
  copyDir(join(exampleRoot, 'node_modules', dep), join(miniprogramNpm, dep));
}

// WeChat's npm compiler resolves domhandler's bare require("domelementtype") as
// miniprogram_npm/domhandler/domelementtype.js in some tool versions.
writeFileSync(
  join(miniprogramNpm, 'domhandler', 'domelementtype.js'),
  "module.exports = require('../domelementtype/index');\n",
);

const towxmlDecodeConfig = join(miniprogramNpm, 'towxml', 'decode.json');
const decodeConfig = readFileSync(towxmlDecodeConfig, 'utf8').replaceAll('"/towxml/', '"./');
writeFileSync(towxmlDecodeConfig, decodeConfig);

console.log('[x-markdown-mini] synced WeChat benchmark npm fixtures');
