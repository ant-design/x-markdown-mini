---
title: 首页
---

<section class="xmd-home xmd-home-v3">
<section class="xmd-home-slogan xmd-home-hero" aria-labelledby="xmd-home-title">
<div class="xmd-home-hero-copy">
<p class="xmd-home-kicker">小程序 Markdown 渲染器</p>
<h1 id="xmd-home-title">为 AI 流式内容设计的小程序 Markdown 渲染层。</h1>
<p class="xmd-home-subtitle">x-markdown-mini 把 Markdown 解析、未完成块修复、平台节点适配和组件渲染收进一条轻量链路。业务只传内容，微信、支付宝和后续小程序平台由 renderer 边界处理。</p>
<div class="xmd-home-actions">
<button type="button" class="xmd-home-command" data-xmd-copy="npm install @ant-design/x-markdown-mini" aria-label="复制安装命令"><span class="xmd-home-command-prompt" aria-hidden="true">$</span><code class="xmd-home-command-text">npm install @ant-design/x-markdown-mini</code><span class="xmd-home-command-copy" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span></button>
<a class="xmd-home-primary" href="/docs/quickstart">Read the docs</a>
<a class="xmd-home-secondary" href="/playground">Playground</a>
</div>
</div>
<div class="xmd-home-hero-visual" aria-label="Markdown 内容实时渲染为小程序节点">
<img class="xmd-home-brand" src="/brand/x-markdown-logo.png" alt="" />
<div class="xmd-hero-console">
<span>renderNodes(&#123;</span>
<span>  platform: 'wechat',</span>
<span>  streaming: &#123; hasNextChunk &#125;,</span>
<span>  content: markdown</span>
<span>&#125;)</span>
</div>
<div class="xmd-hero-phone">
<div class="xmd-hero-phone-bar"></div>
<h3>AI 回复</h3>
<p><strong>Markdown</strong>、表格、代码块和链接会被转换为当前平台可消费的 MiniNode[]。</p>
<pre><code>stableNodes + liveTail</code></pre>
</div>
</div>
</section>

<section class="xmd-home-section xmd-powered" aria-labelledby="xmd-powered-title">
<p id="xmd-powered-title">适合这些小程序场景</p>
<div>
<span>AI 助手</span>
<span>知识库问答</span>
<span>客服对话</span>
<span>文档预览</span>
<span>代码解释</span>
<span>跨端组件库</span>
</div>
</section>

<section class="xmd-home-section xmd-what" aria-labelledby="xmd-what-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">Introduction</p>
<h2 id="xmd-what-title">一个 fully-loaded 的小程序 Markdown renderer。</h2>
<p>它不是 WebView，也不是把 HTML 硬塞进小程序。内核先得到稳定 token，再按平台能力输出安全的节点结构；复杂能力留在扩展点里，默认路径保持轻。</p>
</div>
<div class="xmd-pipeline" aria-label="x-markdown-mini 渲染链路">
<div><span>01</span><strong>Markdown</strong><p>接收完整文本或持续追加的 LLM 输出。</p></div>
<div><span>02</span><strong>Streaming fixup</strong><p>修复未闭合 block、缓存稳定节点、flush 最后一段。</p></div>
<div><span>03</span><strong>Platform renderer</strong><p>按微信 / 支付宝能力过滤标签、属性和样式。</p></div>
<div><span>04</span><strong>MiniNode[]</strong><p>交给组件或 rich-text，进入小程序原生渲染。</p></div>
</div>
</section>

<section class="xmd-home-section xmd-capabilities" aria-labelledby="xmd-capabilities-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">Features</p>
<h2 id="xmd-capabilities-title">把流式 Markdown 需要的关键能力放在默认体验里。</h2>
<p>解析器、流式处理、平台适配和扩展边界彼此独立；你可以直接用组件，也可以只拿 headless API 接进自己的渲染层。</p>
</div>
<div class="xmd-capability-grid">
<a class="xmd-capability-card" href="/docs/platforms"><h3>多端节点输出</h3><p>当前支持微信 / 支付宝，同一 JS API，同一组件接入路径，平台差异由 renderer 吸收。</p></a>
<a class="xmd-capability-card" href="/docs/streaming"><h3>流式体验</h3><p>稳定块缓存、tail 补全、语义切块和最终 flush 解决半截 Markdown 抖动。</p></a>
<a class="xmd-capability-card" href="/examples/markdown"><h3>Typography & GFM</h3><p>支持标题、列表、链接、代码块、GFM 表格等常见 Markdown 表达。</p></a>
<a class="xmd-capability-card" href="/docs/api"><h3>Headless API</h3><p><code>render</code> 拿 token，<code>renderNodes</code> 拿平台节点，适合组件外的自定义链路。</p></a>
<a class="xmd-capability-card" href="/docs/custom-platform"><h3>自定义 renderer</h3><p>marked extensions、tokenRenderers、自定义平台 renderer 都在公开边界内完成。</p></a>
<a class="xmd-capability-card" href="/docs/adapter-rules"><h3>平台安全降级</h3><p>目标端不支持的标签、属性和样式在适配层收敛，不把判断散进业务代码。</p></a>
</div>
</section>

<section class="xmd-home-section xmd-playground-callout" aria-labelledby="xmd-playground-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">Playground</p>
<h2 id="xmd-playground-title">改 Markdown、切平台、看节点输出。</h2>
<p>Playground 用浏览器模拟小程序预览：左侧写 Markdown，右侧实时展示微信 / 支付宝渲染结果，并标出目标平台无法承载的标签与属性。</p>
<div class="xmd-proof-links">
<a href="/playground">进入 Playground</a>
<a href="/docs/adapter-rules">查看适配规则</a>
</div>
</div>
<div class="xmd-playground-panel" aria-label="Playground 调试界面示意">
<div class="xmd-playground-tabs"><span>Markdown</span><span>Wechat</span><span>Alipay</span></div>
<pre><code>## 实时预览

- 支持 GFM 表格
- 支持代码块
- 流式 tail 稳定处理</code></pre>
<div class="xmd-playground-output"><strong>MiniNode[]</strong><span>table · pre · code · a · text</span></div>
</div>
</section>

<section class="xmd-home-section xmd-get-started" aria-labelledby="xmd-start-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">Get started in seconds</p>
<h2 id="xmd-start-title">安装，然后选择组件或 API。</h2>
<p>组件路径适合直接接入页面；API 路径适合你已经有自己的 setData、缓存或渲染封装。</p>
</div>
<div class="xmd-start-code" aria-label="快速接入代码">
<div><span>Component</span><code>usingComponents: &#123; "markdown": "@ant-design/x-markdown-mini/es/Markdown/index" &#125;</code></div>
<div><span>API</span><code>const nodes = renderNodes(&#123; content, platform: "wechat" &#125;);</code></div>
<div><span>Streaming</span><code>renderNodes(&#123; content, streaming: &#123; hasNextChunk &#125;, onPatch &#125;);</code></div>
</div>
</section>

<section class="xmd-home-section xmd-docs-map" aria-labelledby="xmd-docs-title">
<div class="xmd-section-copy">
<p class="xmd-home-kicker">Showcase</p>
<h2 id="xmd-docs-title">从示例进入功能，从 API 进入工程接入。</h2>
<p>Examples 解释组件能力和典型交互；Docs 给出安装、平台规则、流式配置、类型和低层 API。需要验证性能时，再看 benchmark/baseline.json 和 npm pack --dry-run。</p>
</div>
<div class="xmd-doc-map-grid">
<a href="/examples/markdown"><span>Example</span><strong>Markdown 组件</strong><p>一次性渲染、GFM 表格、围栏代码块。</p></a>
<a href="/examples/streaming"><span>Example</span><strong>流式渲染</strong><p>基础流式、打字机模式、块级淡入动画。</p></a>
<a href="/docs/api"><span>API</span><strong>render / renderNodes</strong><p>解析入口、节点入口、回调和低层接口。</p></a>
<a href="/docs/types"><span>API</span><strong>类型导出</strong><p>MiniNode、平台输入、renderer 与 streaming config。</p></a>
</div>
</section>

<section class="xmd-home-section xmd-final-cta" aria-labelledby="xmd-final-title">
<p class="xmd-home-kicker">Upgrade your mini program Markdown experience</p>
<h2 id="xmd-final-title">从 Playground 开始验证你的内容。</h2>
<div class="xmd-proof-links">
<a href="/playground">打开 Playground</a>
<a href="/docs/quickstart">阅读快速开始</a>
</div>
</section>
</section>
