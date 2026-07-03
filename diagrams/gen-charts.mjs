import { writeFileSync } from 'node:fs';

const OUT = new URL('.', import.meta.url).pathname;
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// niceCeil: round a max value up to a clean axis top with `ticks` divisions
function niceAxis(max, ticks = 4) {
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const top = step * ticks;
  return { top, step };
}

function groupedBar({ title, subtitle, categories, series, unit, yTicks = 4, W = 760, H = 440, heroCat = -1 }) {
  const m = { l: 58, r: 20, t: 74, b: 78 };
  const plotW = W - m.l - m.r;
  const plotH = H - m.t - m.b;
  const allVals = series.flatMap((s) => s.data.filter((v) => v != null));
  const { top: yMax, step } = niceAxis(Math.max(...allVals), yTicks);
  const y = (v) => m.t + plotH - (v / yMax) * plotH;

  const gW = plotW / categories.length;
  const gPad = gW * 0.16;
  const innerW = gW - gPad * 2;
  const bW = innerW / series.length;

  let el = '';
  // background
  el += `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>`;
  // hero highlight band
  if (heroCat >= 0) {
    const hx = m.l + heroCat * gW;
    el += `<rect x="${hx.toFixed(1)}" y="${m.t}" width="${gW.toFixed(1)}" height="${plotH}" fill="#e6f4ff" opacity="0.55"/>`;
  }
  // title
  el += `<text x="${m.l}" y="30" font-family="${FONT}" font-size="19" font-weight="700" fill="#141414">${esc(title)}</text>`;
  if (subtitle) el += `<text x="${m.l}" y="50" font-family="${FONT}" font-size="12.5" fill="#8c8c8c">${esc(subtitle)}</text>`;

  // gridlines + y ticks
  for (let v = 0; v <= yMax + 1e-9; v += step) {
    const yy = y(v);
    el += `<line x1="${m.l}" y1="${yy.toFixed(1)}" x2="${m.l + plotW}" y2="${yy.toFixed(1)}" stroke="${v === 0 ? '#bfbfbf' : '#f0f0f0'}" stroke-width="1"/>`;
    const label = Number.isInteger(step) ? v : v.toFixed(step < 1 ? 1 : 0);
    el += `<text x="${m.l - 10}" y="${(yy + 4).toFixed(1)}" text-anchor="end" font-family="${FONT}" font-size="11.5" fill="#8c8c8c">${label}</text>`;
  }
  el += `<text x="14" y="${m.t + plotH / 2}" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#8c8c8c" transform="rotate(-90 14 ${m.t + plotH / 2})">${esc(unit)}</text>`;

  // bars
  categories.forEach((cat, ci) => {
    const gx = m.l + ci * gW + gPad;
    series.forEach((s, si) => {
      const v = s.data[ci];
      const bx = gx + si * bW;
      if (v == null) {
        el += `<text x="${(bx + bW / 2).toFixed(1)}" y="${(m.t + plotH - 8).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="#bfbfbf">—</text>`;
        return;
      }
      const by = y(v);
      const bh = m.t + plotH - by;
      const pad = Math.min(3, bW * 0.14);
      el += `<rect x="${(bx + pad).toFixed(1)}" y="${by.toFixed(1)}" width="${(bW - pad * 2).toFixed(1)}" height="${bh.toFixed(1)}" rx="2.5" fill="${s.color}"/>`;
      el += `<text x="${(bx + bW / 2).toFixed(1)}" y="${(by - 5).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="${s.hero ? 700 : 500}" fill="${s.hero ? '#0958d9' : '#595959'}">${v}</text>`;
    });
    const cx = m.l + ci * gW + gW / 2;
    const isHero = ci === heroCat;
    el += `<text x="${cx.toFixed(1)}" y="${(m.t + plotH + 22).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="12.5" font-weight="${isHero ? 700 : 500}" fill="${isHero ? '#0958d9' : '#595959'}">${esc(cat)}</text>`;
  });

  // legend
  const legendY = H - 30;
  const legItems = series.map((s) => ({ name: s.name, color: s.color, hero: s.hero }));
  const approxW = legItems.map((it) => 20 + it.name.length * 7.4 + 18);
  const totalW = approxW.reduce((a, b) => a + b, 0);
  let lx = m.l + Math.max(0, (plotW - totalW) / 2);
  legItems.forEach((it, i) => {
    el += `<rect x="${lx.toFixed(1)}" y="${legendY - 10}" width="13" height="13" rx="2.5" fill="${it.color}"/>`;
    el += `<text x="${(lx + 19).toFixed(1)}" y="${legendY + 1}" font-family="${FONT}" font-size="12" font-weight="${it.hero ? 700 : 400}" fill="${it.hero ? '#0958d9' : '#595959'}">${esc(it.name)}</text>`;
    lx += approxW[i];
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">${el}</svg>`;
}

const GRAY = ['#9aa4b2', '#c4ccd6', '#e2e6ec'];

// ---- 1. WeChat conversion perf ----
const wechat = groupedBar({
  title: '转换性能 · 微信',
  subtitle: 'Markdown → 可渲染节点树，单次耗时（ms，越低越好）· Node v20',
  categories: ['短文 2.9KB', '中等 11.6KB', '长文 29KB'],
  unit: 'ms / 次',
  series: [
    { name: 'x-markdown-mini', color: '#1677ff', hero: true, data: [0.24, 0.55, 0.82] },
    { name: 'marked + rich-text', color: GRAY[0], data: [0.32, 0.64, 1.19] },
    { name: 'mp-html', color: GRAY[1], data: [0.37, 0.89, 2.08] },
    { name: 'towxml', color: GRAY[2], data: [0.84, 1.51, 3.58] },
  ],
});
writeFileSync(OUT + '04-perf-wechat.svg', wechat);

// ---- 2. Alipay conversion perf ----
const alipay = groupedBar({
  title: '转换性能 · 支付宝',
  subtitle: 'Markdown → 可渲染节点树，单次耗时（ms，越低越好）· towxml 仅微信',
  categories: ['短文 2.9KB', '中等 11.6KB', '长文 29KB'],
  unit: 'ms / 次',
  series: [
    { name: 'x-markdown-mini', color: '#1677ff', hero: true, data: [0.09, 0.42, 0.82] },
    { name: 'marked + rich-text', color: GRAY[0], data: [0.31, 0.67, 1.27] },
    { name: 'mp-html', color: GRAY[1], data: [0.38, 0.95, 2.42] },
    { name: 'towxml', color: GRAY[2], data: [null, null, null] },
  ],
});
writeFileSync(OUT + '05-perf-alipay.svg', alipay);

// ---- 3. Bundle size (hero = x-markdown-mini group) ----
const bundle = groupedBar({
  title: '包体积',
  subtitle: '打进小程序的运行时 JS（KB，越低越好）· 主包上限 2 MB',
  categories: ['x-markdown-mini', 'mp-html + marked', 'towxml'],
  unit: 'KB',
  yTicks: 4,
  heroCat: 0,
  series: [
    { name: '原始大小', color: '#1677ff', hero: true, data: [126, 60, 528] },
    { name: 'gzip 后', color: '#91caff', data: [31, 22, 162] },
  ],
});
writeFileSync(OUT + '06-bundle.svg', bundle);

console.log('generated: 04-perf-wechat.svg, 05-perf-alipay.svg, 06-bundle.svg');
