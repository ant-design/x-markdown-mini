const { XMarkdownMini } = require('@ant-design/x-markdown-mini/index.js');
const { flattenInlineNodes } = require('@ant-design/x-markdown-mini/shared/flattenInline.js');
const { SAMPLE } = require('../sample.js');

const PLATFORM = 'alipay';
const STREAM_CHUNK_SIZE = 48;
const STREAM_FRAME_DELAY = 40;

const CASES = [
  { id: 'short', name: '短文', repeat: 1, desc: '约 1 篇示例回复' },
  { id: 'medium', name: '中等', repeat: 4, desc: '约 4 篇示例回复' },
  { id: 'long', name: '长文', repeat: 10, desc: '约 10 篇示例回复' },
];

const STREAM_RENDERERS = [
  { id: 'x-markdown-mini', name: 'x-markdown-mini', desc: 'streaming renderNodes -> MiniNodeRenderer' },
  { id: 'marked-rich-text', name: 'marked + rich-text', desc: 'marked HTML -> rich-text' },
  { id: 'mp-html-markdown', name: 'mp-html', desc: 'markdown plugin -> mp-html component' },
];

const RESEARCH = [
  { name: 'x-markdown-mini', scope: '微信 / 支付宝', status: 'JS + 流式自动执行', note: 'JS 模式测 Markdown -> MiniNode[]；流式模式开启 streaming。' },
  { name: 'marked + rich-text', scope: '支付宝常见自拼管线', status: 'JS + 流式自动执行', note: '使用 mp-html markdown 插件内置 marked，再交给原生 rich-text。' },
  { name: 'mp-html + markdown plugin', scope: '支付宝主流跨端方案', status: 'JS + 流式自动执行', note: 'Markdown 先经插件转 HTML，再由 mp-html 组件渲染。' },
  { name: 'towxml', scope: '微信主流 parser', status: 'JS 自动检测', note: '仅在 JS 吞吐率模式跑 Markdown -> WXML tree；不作为支付宝真实组件渲染。' },
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
  for (let i = 0; i < chars.length; i += chunkSize) chunks.push(chars.slice(i, i + chunkSize).join(''));
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

function tryRequire(paths) {
  const tried = [];
  let lastError = null;
  for (let i = 0; i < paths.length; i += 1) {
    try {
      return require(paths[i]);
    } catch (err) {
      tried.push(paths[i]);
      lastError = err;
    }
  }
  return {
    __benchmarkMissing: true,
    tried,
    lastError: lastError && lastError.message ? lastError.message : String(lastError || ''),
  };
}

function formatRequireFailure(name, result, action) {
  const detail = result && result.__benchmarkMissing
    ? `尝试路径：${result.tried.join('、')}；最后错误：${result.lastError || 'unknown'}`
    : '';
  return `未检测到 ${name}。${action}${detail ? ` ${detail}` : ''}`;
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

function createMpHtmlSuite() {
  const Markdown = tryRequire([
    '../../node_modules/mp-html/plugins/markdown/index',
    '../../node_modules/mp-html/plugins/markdown/index.js',
    'mp-html/plugins/markdown/index',
    'mp-html/plugins/markdown/index.js',
  ]);
  if (!Markdown || Markdown.__benchmarkMissing) {
    return {
      id: 'mp-html-markdown',
      name: 'mp-html',
      stage: 'Markdown -> HTML -> mp-html',
      runnable: false,
      reason: formatRequireFailure('mp-html markdown', Markdown, '请确认 examples/alipay/node_modules 中存在 mp-html 后重新编译。'),
    };
  }
  const plugin = new Markdown({ properties: { markdown: true }, options: { markdown: true }, _ids: {} });
  return {
    id: 'mp-html-markdown',
    name: 'mp-html',
    stage: 'Markdown -> HTML -> mp-html',
    runnable: true,
    run(content) {
      return plugin.onUpdate(content);
    },
  };
}

function createMarkedRichTextSuite() {
  const markedModule = tryRequire([
    '../../node_modules/mp-html/plugins/markdown/marked.min',
    '../../node_modules/mp-html/plugins/markdown/marked.min.js',
    'mp-html/plugins/markdown/marked.min',
    'mp-html/plugins/markdown/marked.min.js',
  ]);
  if (!markedModule || markedModule.__benchmarkMissing || !markedModule.marked) {
    return {
      id: 'marked-rich-text',
      name: 'marked + rich-text',
      stage: 'Markdown -> HTML -> rich-text',
      runnable: false,
      reason: formatRequireFailure('mp-html 内置 marked', markedModule, '请确认 examples/alipay/node_modules 中存在 mp-html 后重新编译。'),
    };
  }
  return {
    id: 'marked-rich-text',
    name: 'marked + rich-text',
    stage: 'Markdown -> HTML -> rich-text',
    runnable: true,
    run(content) {
      return markedModule.marked(content);
    },
  };
}

function createTowxmlSuite() {
  const towxml = tryRequire([
    '../../node_modules/towxml/index',
    '../../node_modules/towxml/index.js',
    'towxml/index',
    'towxml/index.js',
  ]);
  if (!towxml || towxml.__benchmarkMissing) {
    return {
      id: 'towxml',
      name: 'towxml',
      stage: 'Markdown -> WXML tree',
      runnable: false,
      reason: formatRequireFailure('towxml', towxml, '请确认 examples/alipay/node_modules 中存在 towxml 后重新编译。'),
    };
  }
  return {
    id: 'towxml',
    name: 'towxml',
    stage: 'Markdown -> WXML tree',
    runnable: true,
    run(content) {
      return towxml(content, 'markdown', { theme: 'light' });
    },
  };
}

function createSuite(id) {
  if (id === 'x-markdown-mini') return createXMarkdownSuite();
  if (id === 'marked-rich-text') return createMarkedRichTextSuite();
  if (id === 'mp-html-markdown') return createMpHtmlSuite();
  return createTowxmlSuite();
}

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
    streamProgressText: '',
  },

  resetOutput(extra) {
    this.setData(Object.assign({
      results: [],
      skipped: [],
      benchmarkNodes: [],
      richTextHtml: '',
      mpHtmlContent: '',
      streamProgressText: '',
    }, extra || {}));
  },

  onModeTap(e) {
    this.resetOutput({ mode: e.currentTarget.dataset.mode });
  },

  onRendererTap(e) {
    this.resetOutput({ streamRenderer: e.currentTarget.dataset.id });
  },

  onCaseTap(e) {
    const id = e.currentTarget.dataset.id;
    this.resetOutput({ selectedCase: CASES.filter((item) => item.id === id)[0] || CASES[1] });
  },

  onIterationTap(e) {
    this.setData({ iterations: Number(e.currentTarget.dataset.value), results: [], skipped: [] });
  },

  onRun() {
    if (this.data.mode === 'stream') this.runStreamingBenchmark();
    else this.runJsBenchmark();
  },

  runJsBenchmark() {
    const content = repeatMarkdown(this.data.selectedCase.repeat);
    const suites = [createXMarkdownSuite(), createMarkedRichTextSuite(), createMpHtmlSuite(), createTowxmlSuite()];
    const skipped = suites
      .filter((suite) => !suite.runnable)
      .map((suite) => ({ id: suite.id, name: suite.name, stage: suite.stage, reason: suite.reason }));

    this.setData({ running: true, summary: 'JS 吞吐率测试运行中...', results: [], skipped });
    setTimeout(() => {
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
      this.renderStreamingFrame(rendererId, accumulated, index < chunks.length, md, suite)
        .then((outputSize) => {
          transformTotal += now() - renderStarted;
          maxNodes = Math.max(maxNodes, outputSize);
          frames += 1;
          const setDataStarted = now();
          this.setData({ streamProgressText: `${frames} / ${chunks.length} 帧` }, () => {
            setDataTotal += now() - setDataStarted;
            setTimeout(step, STREAM_FRAME_DELAY);
          });
        })
        .catch((err) => {
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

  renderStreamingFrame(rendererId, markdown, hasNextChunk, md, suite) {
    return new Promise((resolve) => {
      if (rendererId === 'x-markdown-mini') {
        md.renderNodes({
          content: markdown,
          platform: PLATFORM,
          streaming: { hasNextChunk, semantic: true, enableAnimation: false },
          onPatch: (nodes) => {
            const flat = flattenInlineNodes(nodes);
            this.setData({ benchmarkNodes: flat }, () => resolve(countNodes(flat)));
          },
        });
        return;
      }
      const output = suite.run(markdown);
      if (rendererId === 'marked-rich-text') {
        this.setData({ richTextHtml: output }, () => resolve(countNodes(output)));
      } else {
        this.setData({ mpHtmlContent: output }, () => resolve(countNodes(output)));
      }
    });
  },
});
