// 跨"小程序 markdown 渲染器"性能对比 + 生成自包含 HTML 报告。
//
//   npx tsx benchmark/compare.ts            # 默认每项 400ms
//   npx tsx benchmark/compare.ts --time 600
//
// 口径说明（公平性）：
// - x-markdown-mini / towxml / mp-html 都做「markdown 字符串 → 可渲染节点树」的完整工作，
//   这是真正同口径的对比（小程序里要拿去 setData 渲染的形态）。
// - marked(lexer) / markdown-it(parse) 仅做「解析成 token」，不构建节点树，
//   作为「解析下界」参照——x-markdown-mini 做得更多却仍有竞争力。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { Bench } from 'tinybench';
import MarkdownIt from 'markdown-it';
import { marked } from 'marked';
// @ts-expect-error - towxml 无类型声明，运行期为 (str,type,opt)=>node tree
import towxml from 'towxml';

import { tokensToWechat } from '../src/platforms/wechat/tokensToWechat.js';

// --- mp-html 无头接入（markdown → html → 节点树，与 towxml/x-markdown-mini 同口径）---
// mp-html 的 parser 在模块加载期引用了 wx 全局；提供最小桩使其可在 Node 下运行。
// 桩仅影响 mp-html 自身（windowWidth/system 用于其内部样式计算），不参与计时口径。
(globalThis as { wx?: unknown }).wx = {
  canIUse: () => false,
  getSystemInfoSync: () => ({ windowWidth: 375, system: 'iOS 16' }),
  getWindowInfo: () => ({ windowWidth: 375 }),
  getDeviceInfo: () => ({ system: 'iOS 16' }),
  setNavigationBarTitle: () => {},
};
const requireCJS = createRequire(import.meta.url);
const MpParser = requireCJS('mp-html/src/miniprogram/parser.js');
const MpMarkdown = requireCJS('mp-html/plugins/markdown/index.js');
function mpHtmlRun(md: string): void {
  // 与真机一致：markdown 插件 onUpdate 把 md→html，parser 再把 html→nodes。
  const vm: { properties: { markdown: boolean }; imgList: unknown[]; plugins: unknown[] } = {
    properties: { markdown: true },
    imgList: [],
    plugins: [],
  };
  vm.plugins = [new MpMarkdown(vm)];
  new MpParser(vm).parse(md);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const benchDir = __dirname;
const samplesDir = join(benchDir, 'samples');

function arg(flag: string, fallback: string): string {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
const time = Number(arg('--time', '400'));
const warmupIterations = Number(arg('--warmup', '50'));

// --- 精选语料（覆盖块/行内/表格/代码/真实长文），保持报告清爽 ---
const CURATED: {
  file: string;
  label: string;
  group: 'markdown-it' | 'streaming';
  caveat?: string;
}[] = [
  { file: 'block-heading.md', label: '标题 Headings', group: 'markdown-it' },
  { file: 'block-list-nested.md', label: '嵌套列表 Nested list', group: 'markdown-it' },
  { file: 'block-tables.md', label: '表格 Tables', group: 'markdown-it' },
  {
    file: 'block-fences.md',
    label: '代码块 Code fences',
    group: 'markdown-it',
    caveat: '非完全同口径：towxml 默认对代码做语法高亮（highlight.js），x-markdown-mini 默认不高亮（高亮为可选插件）',
  },
  { file: 'block-bq-nested.md', label: '嵌套引用 Blockquote', group: 'markdown-it' },
  { file: 'inline-em-nested.md', label: '嵌套强调 Emphasis', group: 'markdown-it' },
  { file: 'inline-links-flat.md', label: '链接 Links', group: 'markdown-it' },
  { file: 'ai-chat-long.md', label: '真实长文 AI chat', group: 'streaming' },
];

interface Sample {
  file: string;
  label: string;
  content: string;
  bytes: number;
  caveat?: string;
}

function loadSamples(): Sample[] {
  return CURATED.map(({ file, label, group, caveat }) => {
    const dir = group === 'streaming' ? join(samplesDir, 'streaming') : join(samplesDir, 'markdown-it');
    const content = readFileSync(join(dir, file), 'utf8');
    return { file, label, content, bytes: Buffer.byteLength(content, 'utf8'), caveat };
  });
}

// --- 参与对比的渲染器 ---
const mdIt = new MarkdownIt();
interface Lib {
  key: string;
  name: string;
  note: string;
  /** true = 完整 markdown→节点树（同口径）；false = 仅解析参照 */
  fullTree: boolean;
  run: (content: string) => void;
}
const LIBS: Lib[] = [
  {
    key: 'x-markdown-mini',
    name: 'x-markdown-mini',
    note: 'markdown → 微信节点树（完整）',
    fullTree: true,
    run: (c) => {
      tokensToWechat(c);
    },
  },
  {
    key: 'towxml',
    name: 'towxml',
    note: 'markdown → wxml 节点树（完整）',
    fullTree: true,
    run: (c) => {
      towxml(c, 'markdown', {});
    },
  },
  {
    key: 'mp-html',
    name: 'mp-html',
    note: 'markdown → html → 节点树（完整）',
    fullTree: true,
    run: (c) => {
      mpHtmlRun(c);
    },
  },
  {
    key: 'marked',
    name: 'marked (仅 lex)',
    note: '仅解析成 token，不建树',
    fullTree: false,
    run: (c) => {
      marked.lexer(c);
    },
  },
  {
    key: 'markdown-it',
    name: 'markdown-it (仅 parse)',
    note: '仅解析成 token，不建树',
    fullTree: false,
    run: (c) => {
      mdIt.parse(c, {});
    },
  },
];

interface Cell {
  hz: number;
  rme: number;
}
type ResultMap = Record<string /*sampleFile*/, Record<string /*libKey*/, Cell>>;

async function main(): Promise<void> {
  const samples = loadSamples();
  const bench = new Bench({ time, warmupIterations });

  for (const s of samples) {
    for (const lib of LIBS) {
      bench.add(`${s.file}::${lib.key}`, () => lib.run(s.content));
    }
  }

  console.log(`running ${bench.tasks.length} tasks (time=${time}ms)…`);
  await bench.run();

  const results: ResultMap = {};
  for (const task of bench.tasks) {
    const [file, libKey] = task.name.split('::');
    if (!task.result || task.result.error) {
      console.error(`  FAIL ${task.name}: ${task.result?.error?.message ?? 'no result'}`);
      continue;
    }
    (results[file] ??= {})[libKey] = {
      hz: task.result.throughput.mean,
      rme: task.result.latency.rme,
    };
  }

  // 几何平均（相对 x-markdown-mini=1）
  const geomean: Record<string, number> = {};
  for (const lib of LIBS) {
    let logSum = 0;
    let n = 0;
    for (const s of samples) {
      const cell = results[s.file]?.[lib.key];
      if (cell) {
        logSum += Math.log(cell.hz);
        n += 1;
      }
    }
    geomean[lib.key] = n ? Math.exp(logSum / n) : 0;
  }
  const base = geomean['x-markdown-mini'] || 1;

  // 逐样本「x-mini / towxml」比率：中位数比 geomean 更稳健（不被代码块高亮等离群点放大）。
  const ratios: { file: string; label: string; ratio: number }[] = [];
  for (const s of samples) {
    const x = results[s.file]?.['x-markdown-mini']?.hz;
    const t = results[s.file]?.['towxml']?.hz;
    if (x && t) ratios.push({ file: s.file, label: s.label, ratio: x / t });
  }
  const sortedRatios = ratios.map((r) => r.ratio).sort((p, q) => p - q);
  const medianRatio = sortedRatios.length
    ? sortedRatios.length % 2
      ? sortedRatios[(sortedRatios.length - 1) / 2]
      : (sortedRatios[sortedRatios.length / 2 - 1] + sortedRatios[sortedRatios.length / 2]) / 2
    : 0;
  const longDoc = ratios.find((r) => r.file === 'ai-chat-long.md')?.ratio ?? 0;
  const wins = ratios.filter((r) => r.ratio >= 1).length;

  const meta = {
    node: process.version,
    timestamp: new Date().toISOString(),
    time,
    warmupIterations,
  };

  writeFileSync(
    join(benchDir, 'compare-results.json'),
    JSON.stringify({ meta, samples, geomean, results }, null, 2) + '\n',
  );

  const html = renderHtml({
    meta,
    samples,
    libs: LIBS,
    results,
    geomean,
    base,
    medianRatio,
    longDoc,
    wins,
  });
  writeFileSync(join(benchDir, 'compare-report.html'), html);
  console.log('done -> benchmark/compare-report.html  (+ compare-results.json)');

  // 控制台速览
  console.log('\nGeomean ops/sec (相对 x-markdown-mini):');
  for (const lib of LIBS) {
    const g = geomean[lib.key];
    console.log(
      `  ${lib.name.padEnd(26)} ${Math.round(g).toLocaleString().padStart(12)}  (${(g / base).toFixed(2)}×)`,
    );
  }
  console.log(
    `\nvs towxml（同口径）: 中位 ${medianRatio.toFixed(2)}× · geomean ${(base / (geomean['towxml'] || 1)).toFixed(2)}× · 真实长文 ${longDoc.toFixed(2)}× · ${wins}/${ratios.length} 样本占优`,
  );
}

// --- HTML 报告 ---
function fmt(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(Math.round(n));
}
function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

interface RenderArgs {
  meta: { node: string; timestamp: string; time: number; warmupIterations: number };
  samples: Sample[];
  libs: Lib[];
  results: ResultMap;
  geomean: Record<string, number>;
  base: number;
  medianRatio: number;
  longDoc: number;
  wins: number;
}

const COLORS: Record<string, string> = {
  'x-markdown-mini': '#1677ff',
  towxml: '#fa8c16',
  marked: '#bfbfbf',
  'markdown-it': '#d9d9d9',
};

function renderHtml(a: RenderArgs): string {
  const { meta, samples, libs, results, geomean, base, medianRatio, longDoc, wins } = a;
  const towxmlGeo = geomean['towxml'] || 0;
  const geoX = towxmlGeo ? base / towxmlGeo : 0;

  const legend = libs
    .map(
      (l) =>
        `<span class="lg"><i style="background:${COLORS[l.key]}"></i>${esc(l.name)}<small>${esc(l.note)}</small></span>`,
    )
    .join('');

  const sampleBlocks = samples
    .map((s) => {
      const cells = results[s.file] ?? {};
      const maxHz = Math.max(...libs.map((l) => cells[l.key]?.hz ?? 0));
      const rows = libs
        .map((l) => {
          const cell = cells[l.key];
          if (!cell) return '';
          const pct = maxHz ? (cell.hz / maxHz) * 100 : 0;
          const xCell = cells['x-markdown-mini'];
          const rel = xCell && cell.hz ? xCell.hz / cell.hz : 0;
          const relTxt =
            l.key === 'x-markdown-mini'
              ? '基准'
              : rel >= 1
                ? `x-mini 快 ${rel.toFixed(2)}×`
                : `x-mini ${rel.toFixed(2)}×`;
          return `
          <div class="row">
            <div class="rl">${esc(l.name)}</div>
            <div class="rb"><div class="bar" style="width:${pct.toFixed(1)}%;background:${COLORS[l.key]}"></div></div>
            <div class="rv">${fmt(cell.hz)} <small>ops/s · ±${cell.rme.toFixed(1)}%</small></div>
            <div class="rr ${l.key === 'x-markdown-mini' ? 'me' : ''}">${relTxt}</div>
          </div>`;
        })
        .join('');
      const caveat = s.caveat ? `<div class="caveat">⚠ ${esc(s.caveat)}</div>` : '';
      return `
      <section class="sample">
        <h3>${esc(s.label)} <small>${esc(s.file)} · ${(s.bytes / 1024).toFixed(1)} KB</small></h3>
        ${caveat}
        ${rows}
      </section>`;
    })
    .join('');

  const summaryCards = libs
    .map((l) => {
      const g = geomean[l.key] || 0;
      const rel = base ? g / base : 0;
      return `
      <div class="card ${l.key === 'x-markdown-mini' ? 'hl' : ''}">
        <div class="cn">${esc(l.name)}</div>
        <div class="cv" style="color:${COLORS[l.key]}">${fmt(g)}<span>ops/s</span></div>
        <div class="cr">${rel >= 1 ? rel.toFixed(2) + '×' : rel.toFixed(2) + '×'} vs x-mini</div>
      </div>`;
    })
    .join('');

  return `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>x-markdown-mini · 小程序渲染器性能对比</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 14px/1.6 -apple-system, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; color: #1f2329; background: #f5f6f8; }
  .wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
  header h1 { font-size: 26px; margin: 0 0 6px; }
  header p { color: #6b7280; margin: 0 0 4px; }
  .hero { background: linear-gradient(135deg,#1677ff,#3b82f6); color:#fff; border-radius:16px; padding:24px 28px; margin:24px 0; box-shadow:0 8px 24px rgba(22,119,255,.25); }
  .hero .big { font-size:40px; font-weight:800; line-height:1.1; }
  .hero .big small { font-size:16px; font-weight:500; opacity:.85; }
  .hero .sub { opacity:.9; margin-top:6px; }
  .legend { display:flex; flex-wrap:wrap; gap:16px; margin:16px 0 24px; }
  .lg { display:flex; align-items:center; gap:6px; font-size:13px; color:#4b5563; }
  .lg i { width:12px; height:12px; border-radius:3px; display:inline-block; }
  .lg small { color:#9ca3af; margin-left:4px; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-bottom:28px; }
  .card { background:#fff; border:1px solid #eceef1; border-radius:12px; padding:16px; }
  .card.hl { border-color:#1677ff; box-shadow:0 2px 10px rgba(22,119,255,.12); }
  .card .cn { font-size:13px; color:#6b7280; }
  .card .cv { font-size:26px; font-weight:700; margin:4px 0; }
  .card .cv span { font-size:12px; font-weight:500; color:#9ca3af; margin-left:4px; }
  .card .cr { font-size:12px; color:#6b7280; }
  .sample { background:#fff; border:1px solid #eceef1; border-radius:12px; padding:16px 18px; margin-bottom:14px; }
  .sample h3 { margin:0 0 12px; font-size:15px; }
  .sample h3 small { font-weight:400; color:#9ca3af; font-size:12px; margin-left:8px; }
  .row { display:grid; grid-template-columns:150px 1fr 130px 120px; align-items:center; gap:10px; padding:5px 0; }
  .rl { font-size:13px; color:#374151; }
  .rb { background:#f1f3f5; border-radius:6px; height:18px; overflow:hidden; }
  .bar { height:100%; border-radius:6px; transition:width .3s; }
  .rv { font-size:12px; text-align:right; color:#374151; }
  .rv small { color:#9ca3af; }
  .rr { font-size:12px; color:#6b7280; text-align:right; }
  .rr.me { color:#1677ff; font-weight:600; }
  footer { color:#9ca3af; font-size:12px; margin-top:24px; line-height:1.7; }
  .note { background:#fffbe6; border:1px solid #ffe58f; border-radius:10px; padding:12px 16px; font-size:13px; color:#7c6f00; margin:18px 0; line-height:1.7; }
  .caveat { background:#fff7e6; border-left:3px solid #ffa940; padding:6px 10px; font-size:12px; color:#ad6800; border-radius:4px; margin:0 0 10px; }
  @media (max-width:640px){ .row{grid-template-columns:96px 1fr; } .rv,.rr{grid-column:2; text-align:left; } }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>小程序 Markdown 渲染器性能对比</h1>
    <p>x-markdown-mini vs towxml（+ marked / markdown-it 解析参照）</p>
    <p>Node ${esc(meta.node)} · ${esc(meta.timestamp)} · 每项 ${meta.time}ms / warmup ${meta.warmupIterations}</p>
  </header>

  <div class="hero">
    <div class="big">${medianRatio ? medianRatio.toFixed(2) + '×' : '—'} <small>更快 vs towxml（中位数）</small></div>
    <div class="sub">
      同口径（markdown → 可渲染节点树）逐样本吞吐比的中位数，跨 ${samples.length} 个语料；
      geomean ${geoX.toFixed(2)}× · 真实长文场景 ${longDoc.toFixed(2)}× · ${wins}/${samples.length} 样本占优。
    </div>
  </div>

  <div class="note">
    <b>结论要点（实事求是）</b>：x-markdown-mini 在<b>真实长文、表格、标题、链接</b>等场景明显更快，
    尤其 <b>AI 长文（${longDoc.toFixed(1)}×）</b>——这正是流式聊天主场景；而在<b>深度嵌套的小语料</b>
    （嵌套引用 / 嵌套列表）上 towxml 更快（其底层 markdown-it 解析更快，x-mini 用 marked）。
    代码块那条是 towxml 默认高亮所致，非完全同口径。中位数 ${medianRatio.toFixed(2)}× 比 geomean 更能代表整体。
  </div>

  <div class="legend">${legend}</div>

  <h2 style="font-size:16px;margin:0 0 12px;">综合（几何平均 ops/sec）</h2>
  <div class="cards">${summaryCards}</div>

  <div class="note">
    口径：<b>x-markdown-mini</b> 与 <b>towxml</b> 均产出「markdown → 可渲染节点树」（小程序 setData 形态），是真正同口径的对比；
    <b>marked</b>/<b>markdown-it</b> 仅解析成 token、不建节点树，列为解析下界参照——x-markdown-mini 做得更多。
  </div>

  <h2 style="font-size:16px;margin:24px 0 12px;">分语料明细（横条越长越快）</h2>
  ${sampleBlocks}

  <footer>
    方法：tinybench，每项 warmup 后采样 ${meta.time}ms 取吞吐均值；±RME 为相对误差。<br/>
    同机同时段运行，结果随机器/负载波动，关注相对倍率而非绝对值。
  </footer>
</div>
</body>
</html>
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
