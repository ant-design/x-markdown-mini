---
title: 文档
order: 1
nav:
  title: Docs
  order: 4
group:
  title: 入门
  order: 1
---

# x-markdown-mini 文档

面向微信、支付宝等小程序的 Markdown 渲染库。核心路径很短：输入 Markdown，解析成 `Token[]`，再按平台输出 `rich-text` 可消费的 `MiniNode[]`。

<div class="xmd-doc-brief">
  <a href="#features">
    <span>01</span>
    <strong>特性</strong>
    <p>多端节点、流式渲染、GFM、平台降级和扩展能力。</p>
  </a>
  <a href="#api">
    <span>02</span>
    <strong>API</strong>
    <p>先用 <code>renderNodes</code>，需要更细控制时再下探到 parser / renderer。</p>
  </a>
  <a href="#demos">
    <span>03</span>
    <strong>示例 DEMO</strong>
    <p>基础 Markdown、表格、围栏代码块的端侧接入示例。</p>
  </a>
</div>

<h2 id="features">特性</h2>

<div class="xmd-doc-feature-grid">
  <div>
    <span>统一输出</span>
    <strong><code>MiniNode[]</code> 适配 <code>rich-text</code></strong>
    <p>业务层只关心 <code>content</code> 和目标平台；微信、支付宝的标签差异由 renderer 处理。</p>
  </div>
  <div>
    <span>小程序优先</span>
    <strong>保守标签与属性</strong>
    <p>不把 Web Markdown 结果硬塞进小程序，而是按端能力选择可运行的节点结构。</p>
  </div>
  <div>
    <span>流式友好</span>
    <strong>稳定块 + live tail</strong>
    <p>适合 AI 对话、长文生成、逐段更新，不必等完整 Markdown 到齐。</p>
  </div>
  <div>
    <span>可扩展</span>
    <strong>插件 + 自定义 token renderer</strong>
    <p>内置 LaTeX 公式和代码高亮插件；也可以接管局部 token，映射成自己的小程序节点。</p>
  </div>
</div>

<h2 id="api">API 说明</h2>

### 安装

```bash
npm install @ant-design/x-markdown-mini
```

### 一次性渲染

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: '# Hello\n\n**x-markdown-mini**',
  platform: 'auto',
  selectable: true,
});
```

```xml
<!-- 微信 / 支付宝页面里消费 nodes -->
<rich-text nodes="{{nodes}}" />
```

`renderNodes` 是默认入口。它接收 Markdown 字符串，返回当前平台可用的 `MiniNode[]`。`platform: 'auto'` 会根据运行环境判断，也可以显式传 `'wechat'` 或 `'alipay'`。

### 流式渲染

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

流式模式下，`onPatch` 会收到每轮解析后的全量节点；最后一段把 `hasNextChunk` 置为 `false`，让处理器 flush 残余内容。完整字段见 [API 参考](/docs/api)。

### 插件

LaTeX 公式和代码语法高亮作为独立插件提供，按需引入不影响主包体积：

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  plugins: [Latex(), CodeHighlight()],
});

// 行内公式 $x^2$ 和块级公式 $$...\n...$$ 均可渲染
const nodes = md.renderNodes({ content: '$E=mc^2$', platform: 'alipay' });
```

**样式引入**（在小程序页面或组件的样式文件中 import）：

```css
/* 支付宝 .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* 微信 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";
```

详细选项和自定义扩展入门见 [扩展与插件](/docs/extensions)。

<h2 id="demos">示例 DEMO</h2>

### 基础 Markdown

<code src="../../src/demos/markdown/Basic.tsx"></code>

### GFM 表格

<code src="../../src/demos/markdown/Table.tsx"></code>

### 围栏代码块

<code src="../../src/demos/markdown/CodeBlock.tsx"></code>
