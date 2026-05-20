---
title: 首页
---

<section class="xmd-home">
  <div class="xmd-home-hero">
    <h1 class="xmd-home-title">轻量、稳定的<br />多端小程序 Markdown 渲染器</h1>
    <p class="xmd-home-subtitle">把 Markdown 转成微信和支付宝小程序可以直接消费的节点结构。内置 marked，支持一次性渲染、流式增量解析与平台差异消化。</p>
    <div class="xmd-home-cta">
      <button type="button" class="xmd-home-command" data-xmd-copy="npm install @ant-design/x-markdown-mini" aria-label="复制安装命令">
        <span class="xmd-home-command-prompt" aria-hidden="true">$</span>
        <code class="xmd-home-command-text">npm install @ant-design/x-markdown-mini</code>
        <span class="xmd-home-command-copy" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </span>
      </button>
      <a class="xmd-home-primary" href="/playground">打开 Playground</a>
      <a class="xmd-home-ghost" href="/docs/quickstart">阅读文档</a>
    </div>
  </div>

  <div class="xmd-home-grid">
    <article>
      <h2>轻量内核</h2>
      <p>内置 marked lexer，核心链路清晰，适合在多端环境稳定运行。</p>
    </article>
    <article>
      <h2>流式友好</h2>
      <p>稳定块只解析一次，只重算未闭合尾部，适合实时展示。</p>
    </article>
    <article>
      <h2>双端适配</h2>
      <p>微信和支付宝使用统一组件路径，平台差异由内部 renderer 消化。</p>
    </article>
  </div>
</section>

## 一行示例

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: markdown,
  platform: 'alipay',
  streaming: { hasNextChunk: true, semantic: true },
});
```

## 支持平台

支付宝 · 微信

## 下一步

- [Playground](/playground) — 在浏览器里写 Markdown，实时切平台预览节点
- [Examples](/examples/markdown) — 在小程序里如何接入
- [Docs](/docs/quickstart) — API、流式细节、平台矩阵、Changelog
- [GitHub](https://github.com/ant-design/x-markdown-mini) — 源码、Issue、Roadmap、Release Notes
