---
title: 首页
---

<section class="xmd-home">
<section class="xmd-home-slogan" aria-labelledby="xmd-home-title">
<h1 id="xmd-home-title">多端、流式、可扩展的小程序 Markdown 渲染器。</h1>
<p class="xmd-home-subtitle">x-markdown-mini 把 Markdown、AI 流式输出和小程序平台差异收进一个轻量内核，输出微信、支付宝可直接消费的节点结构，也保留快速扩展其他小程序的 renderer 边界。</p>
<div class="xmd-home-actions">
<button type="button" class="xmd-home-command" data-xmd-copy="npm install @ant-design/x-markdown-mini" aria-label="复制安装命令"><span class="xmd-home-command-prompt" aria-hidden="true">$</span><code class="xmd-home-command-text">npm install @ant-design/x-markdown-mini</code><span class="xmd-home-command-copy" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span></button>
<a class="xmd-home-primary" href="/docs/quickstart">快速开始</a>
<a class="xmd-home-secondary" href="/playground">Playground</a>
</div>
</section>

<section class="xmd-home-section xmd-capabilities" aria-labelledby="xmd-capabilities-title">
<div class="xmd-capability-grid">
<a class="xmd-capability-card" href="/docs/platforms">
<h3 id="xmd-capability-platforms">多端可用</h3>
<p>当前支持支付宝 / 微信；同一套 JS API，同一条组件接入路径，新增平台时扩展 renderer，而不是把业务拖进平台判断。</p>
</a>
<a class="xmd-capability-card" href="/docs/streaming">
<h3 id="xmd-capability-streaming">AI 流式友好</h3>
<p>稳定块缓存、tail 补全、语义分块渲染和最终 flush 都在 Markdown 进入 lexer 前处理，半截格式不再频繁跳变。</p>
</a>
<a class="xmd-capability-card" href="/docs/api">
<h3 id="xmd-capability-extensions">高扩展</h3>
<p>marked extensions + tokenRenderers 覆盖自定义语法；LaTeX、代码高亮这类重能力走按需接入，不塞进核心包。</p>
</a>
<a class="xmd-capability-card" href="#performance">
<h3 id="xmd-capability-performance">高性能</h3>
<p>tokens 直接生成目标平台节点，少一层中间 IR；ES2018 产物、bundle gate 和 benchmark gate 一起守住兼容与体积。</p>
</a>
</div>
</section>

<section class="xmd-home-section xmd-feature-demo" aria-labelledby="xmd-feature-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">流式演示</p>
<h2 id="xmd-feature-title">边输出边渲染，仍然保持节点稳定。</h2>
<p>主功能不只是“解析 Markdown”。真正麻烦的是半截代码块、未闭合链接、表格降级、平台属性过滤和持续进入的流式文本。这里用轻量 CSS 动画模拟 GIF 效果，避免首页为了演示牺牲加载速度。</p>
<ul class="xmd-feature-list">
<li><strong>流式友好</strong><span>稳定块缓存 + tail 修复，未闭合 Markdown 不再闪烁。</span></li>
<li><strong>平台输出</strong><span>同一份内容输出微信 / 支付宝 rich-text 节点。</span></li>
<li><strong>按需扩展</strong><span>LaTeX、代码高亮、自定义 token renderer 不必 fork 内核。</span></li>
</ul>
</div>
<div class="xmd-demo-stage" role="img" aria-label="Markdown 流式渲染到小程序节点的动态演示">
<div class="xmd-demo-toolbar"><span></span><span></span><span></span><strong>streaming preview</strong></div>
<div class="xmd-demo-body">
<div class="xmd-demo-source">
<span># 接入 SSE 回复</span>
<span>```tsx</span>
<span>renderNodes(&#123;</span>
<span>  platform: 'wechat',</span>
<span>  streaming: &#123; hasNextChunk &#125;</span>
<span>&#125;)</span>
<span>```</span>
</div>
<div class="xmd-demo-phone">
<div class="xmd-demo-phone-bar"></div>
<h3>接入 SSE 回复</h3>
<p>renderNodes 输出 MiniNode[]，可以直接交给 rich-text。</p>
<pre><code>platform: 'wechat'
streaming: true</code></pre>
<div class="xmd-demo-progress"><i></i></div>
</div>
</div>
</div>
</section>

<section class="xmd-home-section xmd-performance" id="performance" aria-labelledby="xmd-performance-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">性能与体积</p>
<h2 id="xmd-performance-title">性能和体积放在首页，不靠形容词。</h2>
<p>性能数据来自 <code>benchmark/baseline.json</code>：Node v20.19.5、tinybench 每项 500ms、2026-05-20 基线。包体积来自本地 <code>npm pack --dry-run</code> 和 npm registry <code>dist.unpackedSize</code> 查询（2026-05-21）。</p>
</div>
<div class="xmd-metric-grid">
<article><span>vs remark</span><strong>8.2x</strong><p>28 个 fixture 几何平均；remark 是通用 AST 工具链，不是小程序节点路径。</p></article>
<article><span>vs marked</span><strong>0.86x</strong><p>接近 marked 本体，同时多做平台节点生成和实例隔离。</p></article>
<article><span>完整节点流水线</span><strong>3,740 ops/s</strong><p><code>ai-chat-long.md</code> 一次性 Markdown 到微信 MiniNode[]。</p></article>
</div>
<div class="xmd-package-table" aria-label="包体积对比">
<table>
<thead><tr><th>包</th><th>版本</th><th>unpacked</th><th>说明</th></tr></thead>
<tbody>
<tr><td>@ant-design/x-markdown-mini</td><td>0.1.0</td><td>383 KB</td><td>本地 npm pack；含微信 / 支付宝组件产物。</td></tr>
<tr><td>towxml</td><td>3.0.6</td><td>354 KB</td><td>npm registry dist.unpackedSize。</td></tr>
<tr><td>marked</td><td>18.0.3</td><td>438 KB</td><td>解析器本体；不含小程序组件适配。</td></tr>
<tr><td>markdown-it</td><td>14.1.0</td><td>749 KB</td><td>通用 Web Markdown parser。</td></tr>
<tr><td>mp-html</td><td>2.5.2</td><td>2,339 KB</td><td>小程序 HTML 渲染器，覆盖面更宽但体积更大。</td></tr>
</tbody>
</table>
</div>
<div class="xmd-proof-links">
<a href="/docs/streaming">流式渲染文档</a>
<a href="/docs/platforms">平台能力矩阵</a>
<a href="https://github.com/ant-design/x-markdown-mini">GitHub</a>
</div>
</section>
</section>
