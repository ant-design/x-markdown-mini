const { XMarkdownMini } = require('@ant-design/x-markdown-mini/index.js');
const { flattenInlineNodes } = require('@ant-design/x-markdown-mini/shared/flattenInline.js');
const { SAMPLE } = require('../sample.js');
const Towxml = safeRequire('towxml', () => require('../../miniprogram_npm/towxml/index'));
const MpHtmlMarkdown = safeRequire('mp-html markdown', () => require('../../miniprogram_npm/mp-html/plugins/markdown/index'));
const MpHtmlMarked = safeRequire('mp-html marked', () => require('../../miniprogram_npm/mp-html/plugins/markdown/marked.min'));
const MpHtmlParser = safeRequire('mp-html parser', () => require('../../miniprogram_npm/mp-html/parser'));
const RichTextParser = safeRequire('mini-html-parser2', () => require('../../miniprogram_npm/mini-html-parser2/lib/index'));

const PLATFORM = 'wechat';
const STREAM_CHUNK_SIZE = 16;
const STREAM_FRAME_DELAY = 80;

const CASES = [
  { id: 'short', name: '短文', repeat: 1, desc: '约 1 篇示例回复' },
  { id: 'medium', name: '中等', repeat: 4, desc: '约 4 篇示例回复' },
  { id: 'long', name: '长文', repeat: 10, desc: '约 10 篇示例回复' },
];

const STREAM_RENDERERS = [
  { id: 'x-markdown-mini', name: 'x-markdown-mini', desc: 'streaming renderNodes -> MiniNodeRenderer' },
  { id: 'marked-rich-text', name: 'marked + rich-text', desc: 'marked HTML -> rich-text nodes' },
  { id: 'mp-html-markdown', name: 'mp-html', desc: 'markdown plugin -> mp-html component' },
  { id: 'towxml', name: 'towxml', desc: 'Markdown -> WXML tree -> towxml component' },
];

const RESEARCH = [
  { name: 'x-markdown-mini', scope: '微信 / 支付宝', status: 'JS + 流式自动执行', note: 'JS 模式测 Markdown -> MiniNode[]；流式模式开启 streaming。' },
  { name: 'towxml', scope: '微信主流', status: 'JS + 流式自动执行', note: 'Towxml 官方定位是 HTML/Markdown 转微信 WXML 的渲染库。' },
  { name: 'marked + rich-text', scope: '多端常见自拼管线', status: 'JS + 流式自动执行', note: 'JS 模式测 Markdown -> HTML -> rich-text nodes；流式模式交给原生 rich-text。' },
  { name: 'mp-html + markdown plugin', scope: '多端主流', status: 'JS + 流式自动执行', note: 'JS 模式测 Markdown -> HTML -> mp-html nodes；流式模式交给 mp-html 组件渲染。' },
  { name: 'wxParse / wemark', scope: '微信历史方案', status: '手动接入', note: '停止维护或维护不足；保留为手动 adapter，不作为默认依赖。' },
];

function now() {
  return Date.now();
}

function repeatMarkdown(repeat) {
  const chunks = [];
  for (let i = 0; i < repeat; i += 1) chunks.push(SAMPLE);
  return chunks.join('\n\n---\n\n');
}

function splitChunks(content, chunkSize) {
  const chars = Array.from(content);
  const chunks = [];
  for (let i = 0; i < chars.length; i += chunkSize) {
    chunks.push(chars.slice(i, i + chunkSize).join(''));
  }
  return chunks;
}

function byteLength(content) {
  return encodeURIComponent(content).replace(/%[0-9A-F]{2}/g, 'x').length;
}

function countNodes(value) {
  if (!value) return 0;
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) return value.reduce((sum, item) => sum + countNodes(item), 0);
  if (typeof value === 'object') return 1 + countNodes(value.children || value.child || value.nodes);
  return 1;
}

function safeRequire(name, load) {
  try {
    return load();
  } catch (err) {
    return {
      __benchmarkMissing: true,
      name,
      message: err && err.message ? err.message : String(err),
    };
  }
}

function missingSuite(id, name, stage, loaded, action) {
  return {
    id,
    name,
    stage,
    runnable: false,
    reason: `未检测到 ${loaded.name || name}。${action} 最后错误：${loaded.message || 'unknown'}`,
  };
}

function createMpHtmlMarkdownPlugin() {
  return new MpHtmlMarkdown({
    properties: { markdown: true },
    options: { markdown: true },
    _ids: {},
  });
}

function renderMpHtmlNodes(content) {
  const parser = new MpHtmlParser({
    data: { markdown: true, scrollTable: true },
    imgList: [],
    plugins: [createMpHtmlMarkdownPlugin()],
  });
  return parser.parse(content);
}

function renderMpHtmlHtml(content) {
  return createMpHtmlMarkdownPlugin().onUpdate(content);
}

function parseRichTextNodes(html) {
  let result = [];
  let failure = null;
  RichTextParser(html, (err, nodes) => {
    failure = err;
    result = nodes || [];
  });
  if (failure) throw failure;
  return result;
}

function formatRate(value) {
  if (!Number.isFinite(value)) return '-';
  if (value >= 1000) return `${(value / 1000).toFixed(2)} MB/s`;
  return `${value.toFixed(1)} KB/s`;
}

function createXMarkdownSuite() {
  const md = new XMarkdownMini({ escapeText: false });
  return {
    id: 'x-markdown-mini',
    name: 'x-markdown-mini',
    stage: 'Markdown -> MiniNode[]',
    runnable: true,
    run(content) {
      return md.renderNodes({ content, platform: PLATFORM });
    },
  };
}

function createTowxmlSuite() {
  if (!Towxml || Towxml.__benchmarkMissing) {
    return missingSuite('towxml', 'towxml', 'Markdown -> WXML tree', Towxml, '请确认 examples/wechat/miniprogram_npm/towxml 已同步。');
  }
  return {
    id: 'towxml',
    name: 'towxml',
    stage: 'Markdown -> WXML tree',
    runnable: true,
    run(content) {
      return Towxml(content, 'markdown', { theme: 'light' });
    },
  };
}

function createMpHtmlSuite() {
  if (!MpHtmlMarkdown || MpHtmlMarkdown.__benchmarkMissing) {
    return missingSuite('mp-html-markdown', 'mp-html', 'Markdown -> HTML -> mp-html nodes', MpHtmlMarkdown, '请确认 examples/wechat/miniprogram_npm/mp-html 已同步。');
  }
  if (!MpHtmlParser || MpHtmlParser.__benchmarkMissing) {
    return missingSuite('mp-html-markdown', 'mp-html', 'Markdown -> HTML -> mp-html nodes', MpHtmlParser, '请确认 examples/wechat/miniprogram_npm/mp-html 已同步。');
  }
  return {
    id: 'mp-html-markdown',
    name: 'mp-html',
    stage: 'Markdown -> HTML -> mp-html nodes',
    runnable: true,
    run(content) {
      return renderMpHtmlNodes(content);
    },
  };
}

function createMpHtmlHtmlSuite() {
  if (!MpHtmlMarkdown || MpHtmlMarkdown.__benchmarkMissing) {
    return missingSuite('mp-html-markdown', 'mp-html', 'Markdown -> HTML -> mp-html', MpHtmlMarkdown, '请确认 examples/wechat/miniprogram_npm/mp-html 已同步。');
  }
  return {
    id: 'mp-html-markdown',
    name: 'mp-html',
    stage: 'Markdown -> HTML -> mp-html',
    runnable: true,
    run(content) {
      return renderMpHtmlHtml(content);
    },
  };
}

function createMarkedRichTextSuite() {
  if (!MpHtmlMarked || MpHtmlMarked.__benchmarkMissing || !MpHtmlMarked.marked) {
    return missingSuite('marked-rich-text', 'marked + rich-text', 'Markdown -> HTML -> rich-text nodes', MpHtmlMarked, '请确认 examples/wechat/miniprogram_npm/mp-html 已同步。');
  }
  if (!RichTextParser || RichTextParser.__benchmarkMissing) {
    return missingSuite('marked-rich-text', 'marked + rich-text', 'Markdown -> HTML -> rich-text nodes', RichTextParser, '请确认 examples/wechat/miniprogram_npm/mini-html-parser2 已同步。');
  }
  return {
    id: 'marked-rich-text',
    name: 'marked + rich-text',
    stage: 'Markdown -> HTML -> rich-text nodes',
    runnable: true,
    run(content) {
      return parseRichTextNodes(MpHtmlMarked.marked(content));
    },
  };
}

function createMarkedRichTextHtmlSuite() {
  if (!MpHtmlMarked || MpHtmlMarked.__benchmarkMissing || !MpHtmlMarked.marked) {
    return missingSuite('marked-rich-text', 'marked + rich-text', 'Markdown -> HTML -> rich-text', MpHtmlMarked, '请确认 examples/wechat/miniprogram_npm/mp-html 已同步。');
  }
  return {
    id: 'marked-rich-text',
    name: 'marked + rich-text',
    stage: 'Markdown -> HTML -> rich-text',
    runnable: true,
    run(content) {
      return MpHtmlMarked.marked(content);
    },
  };
}

function createManualSuite() {
  return {
    id: 'wxparse-wemark',
    name: 'wxParse / wemark',
    stage: 'Manual adapter',
    runnable: false,
    reason: '历史方案需要拷贝组件源码并暴露 JS parser；默认不作为强依赖。',
  };
}

function createSuite(id) {
  if (id === 'x-markdown-mini') return createXMarkdownSuite();
  if (id === 'marked-rich-text') return createMarkedRichTextHtmlSuite();
  if (id === 'mp-html-markdown') return createMpHtmlHtmlSuite();
  if (id === 'towxml') return createTowxmlSuite();
  return createManualSuite();
}

const JS_BENCHMARKS = [
  createXMarkdownSuite,
  createTowxmlSuite,
  createMarkedRichTextSuite,
  createMpHtmlSuite,
  createManualSuite,
];

function benchmarkSuite(suite, content, iterations) {
  try {
    suite.run(content);
    const bytes = byteLength(content) * iterations;
    const started = now();
    let output;
    for (let i = 0; i < iterations; i += 1) output = suite.run(content);
    const total = Math.max(now() - started, 1);
    return {
      id: suite.id,
      name: suite.name,
      stage: suite.stage,
      total,
      avg: total / iterations,
      outputSize: countNodes(output),
      throughput: bytes / total,
      status: 'done',
    };
  } catch (err) {
    return {
      id: suite.id,
      name: suite.name,
      stage: suite.stage,
      total: 0,
      avg: 0,
      outputSize: 0,
      throughput: 0,
      status: 'error',
      reason: err && err.message ? err.message : String(err),
    };
  }
}

Page({
  data: {
    mode: 'js',
    streamRenderer: 'x-markdown-mini',
    streamRenderers: STREAM_RENDERERS,
    cases: CASES,
    selectedCase: CASES[1],
    iterations: 20,
    running: false,
    summary: 'JS 吞吐率模式跑多 parser；真实流式模式一次只挂一个 renderer。',
    results: [],
    skipped: [],
    research: RESEARCH,
    benchmarkNodes: [],
    richTextHtml: '',
    mpHtmlContent: '',
    towxmlNodes: null,
    streamProgressText: '',
  },

  resetOutput(extra) {
    this.setData(Object.assign({
      results: [],
      skipped: [],
      benchmarkNodes: [],
      richTextHtml: '',
      mpHtmlContent: '',
      towxmlNodes: null,
      streamProgressText: '',
    }, extra || {}));
  },

  nextBenchmarkRunId() {
    this._benchmarkRunId = (this._benchmarkRunId || 0) + 1;
    return this._benchmarkRunId;
  },

  isActiveBenchmarkRun(runId) {
    return this._benchmarkRunId === runId;
  },

  onModeTap(e) {
    this.nextBenchmarkRunId();
    this.resetOutput({ mode: e.currentTarget.dataset.mode });
  },

  onRendererTap(e) {
    this.nextBenchmarkRunId();
    this.resetOutput({ streamRenderer: e.currentTarget.dataset.id });
  },

  onCaseTap(e) {
    const id = e.currentTarget.dataset.id;
    this.nextBenchmarkRunId();
    this.resetOutput({ selectedCase: CASES.filter((item) => item.id === id)[0] || CASES[1] });
  },

  onIterationTap(e) {
    this.nextBenchmarkRunId();
    this.setData({ iterations: Number(e.currentTarget.dataset.value), results: [], skipped: [] });
  },

  onRun() {
    if (this.data.mode === 'stream') this.runStreamingBenchmark();
    else this.runJsBenchmark();
  },

  runJsBenchmark() {
    const runId = this.nextBenchmarkRunId();
    const content = repeatMarkdown(this.data.selectedCase.repeat);
    const suites = JS_BENCHMARKS.map((create) => create());
    const skipped = suites
      .filter((suite) => !suite.runnable)
      .map((suite) => ({ id: suite.id, name: suite.name, stage: suite.stage, reason: suite.reason }));

    this.setData({ running: true, summary: 'JS 吞吐率测试运行中...', results: [], skipped });
    setTimeout(() => {
      if (!this.isActiveBenchmarkRun(runId)) return;
      const results = suites
        .filter((suite) => suite.runnable)
        .map((suite) => benchmarkSuite(suite, content, this.data.iterations))
        .sort((a, b) => b.throughput - a.throughput)
        .map((item, index) => Object.assign({}, item, {
          rank: index + 1,
          totalText: item.status === 'error' ? '失败' : `${item.total.toFixed(0)} ms`,
          avgText: item.status === 'error' ? '-' : `${item.avg.toFixed(2)} ms`,
          throughputText: item.status === 'error' ? '-' : formatRate(item.throughput),
        }));
      this.setData({
        running: false,
        results,
        summary: `JS 吞吐率已运行 ${this.data.selectedCase.name} / ${this.data.iterations} 次；不包含 setData 和组件绘制。`,
      });
    }, 30);
  },

  runStreamingBenchmark() {
    const runId = this.nextBenchmarkRunId();
    const rendererId = this.data.streamRenderer;
    const renderer = STREAM_RENDERERS.filter((item) => item.id === rendererId)[0] || STREAM_RENDERERS[0];
    const suite = rendererId === 'x-markdown-mini' ? null : createSuite(rendererId);
    if (suite && !suite.runnable) {
      this.setData({
        running: false,
        results: [],
        skipped: [{ id: suite.id, name: suite.name, stage: suite.stage, reason: suite.reason }],
        summary: `${renderer.name} 不可运行。`,
      });
      return;
    }

    const content = repeatMarkdown(this.data.selectedCase.repeat);
    const chunks = splitChunks(content, STREAM_CHUNK_SIZE);
    const md = new XMarkdownMini({ escapeText: false });
    let index = 0;
    let accumulated = '';
    let frames = 0;
    let transformTotal = 0;
    let setDataTotal = 0;
    let maxNodes = 0;
    const started = now();
    this.resetOutput({ running: true, summary: `${renderer.name} 真实流式渲染测试运行中...`, streamProgressText: `0 / ${chunks.length} 帧` });

    const step = () => {
      if (!this.isActiveBenchmarkRun(runId)) {
        md.reset();
        return;
      }
      if (index >= chunks.length) {
        const total = Math.max(now() - started, 1);
        md.reset();
        this.setData({
          running: false,
          results: [{
            id: `${rendererId}-stream`,
            name: renderer.name,
            stage: 'Cumulative Markdown -> selected renderer',
            rank: 1,
            total,
            avg: total / Math.max(frames, 1),
            outputSize: maxNodes,
            frames,
            totalText: `${total.toFixed(0)} ms`,
            avgText: `${(total / Math.max(frames, 1)).toFixed(2)} ms`,
            throughputText: formatRate(byteLength(content) / total),
            framesText: `${frames}`,
            setDataText: `${setDataTotal.toFixed(0)} ms`,
            renderText: `${transformTotal.toFixed(0)} ms`,
          }],
          streamProgressText: `${frames} / ${frames} 帧`,
          summary: `${renderer.name} 真实流式渲染已完成；页面只渲染了这一个 renderer。`,
        });
        return;
      }

      accumulated += chunks[index];
      index += 1;
      const renderStarted = now();
      this.renderStreamingFrame(rendererId, accumulated, index < chunks.length, md, suite, runId)
        .then((outputSize) => {
          if (!this.isActiveBenchmarkRun(runId)) {
            md.reset();
            return;
          }
          transformTotal += now() - renderStarted;
          maxNodes = Math.max(maxNodes, outputSize);
          frames += 1;
          const setDataStarted = now();
          this.setData({ streamProgressText: `${frames} / ${chunks.length} 帧` }, () => {
            if (!this.isActiveBenchmarkRun(runId)) {
              md.reset();
              return;
            }
            setDataTotal += now() - setDataStarted;
            setTimeout(step, STREAM_FRAME_DELAY);
          });
        })
        .catch((err) => {
          if (!this.isActiveBenchmarkRun(runId)) return;
          md.reset();
          this.setData({
            running: false,
            skipped: [{ id: rendererId, name: renderer.name, stage: 'Streaming render', reason: err && err.message ? err.message : String(err) }],
            summary: `${renderer.name} 流式渲染失败。`,
          });
        });
    };
    setTimeout(step, 30);
  },

  renderStreamingFrame(rendererId, markdown, hasNextChunk, md, suite, runId) {
    return new Promise((resolve) => {
      if (!this.isActiveBenchmarkRun(runId)) {
        resolve(0);
        return;
      }
      if (rendererId === 'x-markdown-mini') {
        md.renderNodes({
          content: markdown,
          platform: PLATFORM,
          streaming: { hasNextChunk, semantic: true, enableAnimation: false },
          onPatch: (nodes) => {
            if (!this.isActiveBenchmarkRun(runId)) {
              resolve(0);
              return;
            }
            const flat = flattenInlineNodes(nodes);
            this.setData({ benchmarkNodes: flat }, () => resolve(countNodes(flat)));
          },
        });
        return;
      }
      const output = suite.run(markdown);
      if (!this.isActiveBenchmarkRun(runId)) {
        resolve(0);
        return;
      }
      if (rendererId === 'marked-rich-text') {
        this.setData({ richTextHtml: output }, () => resolve(countNodes(output)));
      } else if (rendererId === 'mp-html-markdown') {
        this.setData({ mpHtmlContent: output }, () => resolve(countNodes(output)));
      } else {
        this.setData({ towxmlNodes: output }, () => resolve(countNodes(output)));
      }
    });
  },
});
