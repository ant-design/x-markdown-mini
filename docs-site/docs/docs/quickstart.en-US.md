---
title: Docs
order: 1
nav:
  title: Docs
  order: 4
group:
  title: Getting Started
  order: 1
---

# x-markdown-mini Docs

A Markdown rendering library for WeChat / Alipay mini programs. The core path is short: feed in Markdown, parse it into `Token[]`, then emit `MiniNode[]` consumable by `rich-text` per platform.

<div class="xmd-doc-brief">
  <a href="#features">
    <span>01</span>
    <strong>Features</strong>
    <p>Multi-platform nodes, streaming rendering, GFM, platform fallback and extensibility.</p>
  </a>
  <a href="#api">
    <span>02</span>
    <strong>API</strong>
    <p>Start with <code>renderNodes</code>, drop down to parser / renderer when finer control is needed.</p>
  </a>
  <a href="#demos">
    <span>03</span>
    <strong>Demos</strong>
    <p>Mini-program integration examples for basic Markdown, tables, and fenced code blocks.</p>
  </a>
</div>

<h2 id="features">Features</h2>

<div class="xmd-doc-feature-grid">
  <div>
    <span>Unified output</span>
    <strong><code>MiniNode[]</code> for <code>rich-text</code></strong>
    <p>Application code only deals with <code>content</code> and the target platform; renderers handle WeChat / Alipay tag differences.</p>
  </div>
  <div>
    <span>Mini-program first</span>
    <strong>Conservative tags &amp; attributes</strong>
    <p>Instead of cramming Web Markdown output into a mini program, it picks node shapes that actually run on the target platform.</p>
  </div>
  <div>
    <span>Streaming friendly</span>
    <strong>Stable blocks + live tail</strong>
    <p>Suited for AI chat, long-form generation, and incremental updates — no need to wait for the full Markdown to arrive.</p>
  </div>
  <div>
    <span>Extensible</span>
    <strong>Plugins + custom token renderers</strong>
    <p>Built-in LaTeX and code-highlight plugins; you can also intercept specific tokens and map them to your own mini-program nodes.</p>
  </div>
</div>

<h2 id="api">API</h2>

### Install

```bash
npm install @ant-design/x-markdown-mini
```

### One-shot render

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
  selectable: true,
});
```

```xml
<!-- consume nodes in a WeChat / Alipay page -->
<rich-text nodes="{{nodes}}" />
```

`renderNodes` is the default entry point. It takes a Markdown string and returns `MiniNode[]` for the current platform. `platform: 'auto'` detects the runtime; you can also pass `'wechat'` or `'alipay'` explicitly.

### Streaming render

```ts
renderNodes({
  content: chunk,
  platform: 'wechat',
  streaming: { hasNextChunk: true },
  onPatch: (nodes) => {
    this.setData({ nodes });
  },
});
```

In streaming mode, `onPatch` receives the full node set after each pass. On the final chunk, set `hasNextChunk` to `false` so the processor flushes any leftover content. Full field list in the [API Reference](/docs/api-en).

### Plugins

LaTeX formulas and code syntax highlighting ship as standalone plugins — opt in without bloating the main bundle:

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [Latex(), CodeHighlight()],
});

// inline formulas $x^2$ and block formulas $$...\n...$$ both render
const nodes = md.renderNodes({ content: '$E=mc^2$', platform: 'alipay' });
```

**Importing styles** (in your mini-program page or component stylesheet):

```css
/* Alipay .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* WeChat .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";
```

For detailed options and a custom-extension primer, see [Extensions & Plugins](/docs/extensions-en).

<h2 id="demos">Demos</h2>

### Basic Markdown

<code src="../../src/demos/markdown/Basic.tsx"></code>

### GFM tables

<code src="../../src/demos/markdown/Table.tsx"></code>

### Fenced code blocks

<code src="../../src/demos/markdown/CodeBlock.tsx"></code>
