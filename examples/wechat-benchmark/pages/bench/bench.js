// Drives the comparison: kicks each library off in sequence with a tiny gap
// between them so their setData rounds don't pile up in one frame, then
// records the elapsed wall time from kick-off to the library's "ready" signal:
//
//   - x-markdown-mini: `bind:rendercomplete` (emitted after onRenderComplete)
//   - mp-html        : `bindready`
//   - towxml         : synchronous parse + setData callback (no ready event)
//
// Not a microbenchmark — single-shot, includes everything from JS through to
// the `setData` round trip. The number we care about is the *ratio* between
// libraries, not absolute ms. Run multiple times and eyeball the median.
const { SAMPLES, defaultIndex } = require('./samples.js');

const app = getApp();

const LIBS = [
  { key: 'x', label: 'x-markdown-mini' },
  { key: 'mp', label: 'mp-html' },
  { key: 'tx', label: 'towxml' },
];

Page({
  data: {
    sampleIndex: defaultIndex,
    sampleName: '',
    sampleBytes: 0,

    running: false,
    xContent: '',
    mpContent: '',
    towxmlNodes: {},

    rows: LIBS.map((l) => ({ key: l.key, label: l.label, time: null, trend: '' })),
  },

  // Scratch state — kept off `data` so per-iteration mutation doesn't trip
  // setData diffing. Populated/cleared by runAll/_kick*/_record.
  _starts: {},
  _times: {},

  onLoad() {
    this._applySample(this.data.sampleIndex);
  },

  cycle() {
    const next = (this.data.sampleIndex + 1) % SAMPLES.length;
    this._applySample(next);
  },

  _applySample(idx) {
    const s = SAMPLES[idx];
    this.setData({
      sampleIndex: idx,
      sampleName: s.name,
      sampleBytes: s.content.length,
      xContent: '',
      mpContent: '',
      towxmlNodes: {},
      rows: LIBS.map((l) => ({ key: l.key, label: l.label, time: null, trend: '' })),
    });
  },

  runAll() {
    if (this.data.running) return;
    const sample = SAMPLES[this.data.sampleIndex];

    this.setData({
      running: true,
      rows: LIBS.map((l) => ({ key: l.key, label: l.label, time: null, trend: '' })),
      // clear everything first so each lib starts from a blank slate
      xContent: '',
      mpContent: '',
      towxmlNodes: {},
    });
    this._starts = {};
    this._times = {};

    // Stagger by 1 frame each — keeping them in separate setData rounds gives
    // each library its own measurement window instead of competing for the
    // same JS thread.
    setTimeout(() => this._kickX(sample.content), 50);
    setTimeout(() => this._kickMp(sample.content), 200);
    setTimeout(() => this._kickTowxml(sample.content), 400);
  },

  _kickX(content) {
    this._starts.x = Date.now();
    this.setData({ xContent: content });
  },

  onXReady() {
    if (this._starts.x == null) return;
    this._record('x', Date.now() - this._starts.x);
  },

  _kickMp(content) {
    this._starts.mp = Date.now();
    this.setData({ mpContent: content });
  },

  onMpReady() {
    if (this._starts.mp == null) return;
    this._record('mp', Date.now() - this._starts.mp);
  },

  _kickTowxml(content) {
    const t0 = Date.now();
    // towxml's parse is sync; its setData callback fires after the data hop.
    let nodes;
    try {
      nodes = app.towxml(content, 'markdown');
    } catch (err) {
      console.error('towxml parse failed', err);
      this._record('tx', -1);
      return;
    }
    this._starts.tx = t0;
    this.setData({ towxmlNodes: nodes }, () => {
      this._record('tx', Date.now() - this._starts.tx);
    });
  },

  _record(key, ms) {
    this._times[key] = ms;
    const rows = this.data.rows.map((r) => (r.key === key ? { ...r, time: ms } : r));
    this.setData({ rows });

    if (Object.keys(this._times).length === LIBS.length) {
      this._finalize();
    }
  },

  _finalize() {
    const times = LIBS.map((l) => this._times[l.key]).filter((t) => t > 0);
    if (times.length === 0) {
      this.setData({ running: false });
      return;
    }
    const min = Math.min(...times);
    const rows = this.data.rows.map((r) => {
      if (r.time == null || r.time <= 0) return r;
      const ratio = r.time / min;
      return { ...r, trend: ratio === 1 ? '⭐ 最快' : `${ratio.toFixed(2)}×` };
    });
    this.setData({ rows, running: false });
  },
});
