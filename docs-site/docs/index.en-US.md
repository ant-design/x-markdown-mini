---
title: x-markdown-mini
toc: false
sidebar: false
---

<main class="xmd-landing">
  <section class="xmd-hero">
    <div class="xmd-hero-copy">
      <h1>Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer</h1>
      <p class="xmd-hero-subtitle">Built for AI chat and content surfaces: Markdown enters the parse chain and exits as render-ready <code>MiniNode[]</code> for WeChat or Alipay, without forcing Web HTML into a mini program.</p>
      <div class="xmd-hero-actions">
        <button type="button" class="xmd-install-command" data-xmd-copy="npm i @ant-design/x-markdown-mini" data-xmd-copy-success="Copied" aria-label="Copy install command">
          <span class="xmd-install-prompt" aria-hidden="true">$</span>
          <code>npm i @ant-design/x-markdown-mini</code>
          <span class="xmd-copy-control" aria-hidden="true">
            <svg class="xmd-copy-icon" viewBox="0 0 16 16" width="15" height="15" fill="none">
              <path d="M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z" stroke="currentColor" stroke-width="1.4"/>
              <path d="M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <svg class="xmd-check-icon" viewBox="0 0 16 16" width="15" height="15" fill="none">
              <path d="m3 8.2 3 3L13 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span data-xmd-copy-status>Copy</span>
          </span>
        </button>
        <a class="xmd-primary-link" href="/docs/quickstart-en">Get started</a>
        <a class="xmd-secondary-link" href="/playground-en">Playground</a>
      </div>
    </div>
    <figure class="xmd-hero-media">
      <div class="xmd-phone" role="img" aria-label="An AI reply streaming Markdown into native nodes inside a mini-program device preview">
        <span class="xmd-phone-island" aria-hidden="true"></span>
        <div class="xmd-phone-status" aria-hidden="true">
          <span class="xmd-phone-time">9:41</span>
          <span class="xmd-phone-ind">
            <span class="xmd-phone-sig"><i></i><i></i><i></i><i></i></span>
            <svg class="xmd-phone-wifi" viewBox="0 0 16 12" width="15" height="11" fill="currentColor"><path d="M8 2.4c2.46 0 4.7.95 6.36 2.5a.5.5 0 010 .72l-.7.7a.5.5 0 01-.7 0A6.45 6.45 0 008 4.5a6.45 6.45 0 00-4.96 1.82.5.5 0 01-.7 0l-.7-.7a.5.5 0 010-.72A9.16 9.16 0 018 2.4zm0 3.3c1.5 0 2.86.58 3.88 1.53a.5.5 0 01.02.72l-.72.72a.5.5 0 01-.68.02A3.4 3.4 0 008 7.8c-.96 0-1.84.36-2.5.93a.5.5 0 01-.68-.02l-.72-.72a.5.5 0 01.02-.72A5.66 5.66 0 018 5.7zm0 3.25c.62 0 1.18.24 1.6.63a.5.5 0 01.01.72l-1.26 1.27a.5.5 0 01-.7 0L6.4 10.3a.5.5 0 01.01-.72c.42-.39.98-.63 1.6-.63z"/></svg>
            <svg class="xmd-phone-batt" viewBox="0 0 26 12" width="24" height="11" fill="none"><rect x="0.6" y="0.6" width="21" height="10.8" rx="3" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.1"/><rect x="2.2" y="2.2" width="14" height="7.6" rx="1.6" fill="currentColor"/><rect x="23" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" fill-opacity="0.4"/></svg>
          </span>
        </div>
        <div class="xmd-phone-appbar" aria-hidden="true">
          <span class="xmd-phone-back">‹</span>
          <span class="xmd-phone-title">AI assistant</span>
          <span class="xmd-phone-more">···</span>
        </div>
        <div class="xmd-phone-screen">
          <p class="xmd-msg xmd-msg-user">Render a reply with math</p>
          <div class="xmd-msg xmd-msg-bot">
            <div class="xmd-stream">
              <h4 class="xmd-stream-block" data-step="1">Native node output</h4>
              <p class="xmd-stream-block" data-step="2"><strong>CommonMark / GFM</strong>, tables, code blocks, and links map to platform nodes.</p>
              <div class="xmd-stream-code xmd-stream-block" data-step="3"><code>renderNodes({ content, platform: 'alipay' })</code></div>
              <div class="xmd-stream-formula xmd-stream-block" data-step="4">E = mc<sup>2</sup></div>
              <span class="xmd-stream-caret" aria-hidden="true"></span>
            </div>
          </div>
        </div>
        <div class="xmd-phone-home" aria-hidden="true"></div>
      </div>
      <figcaption>The right preview uses real phone proportions for a mini-program surface</figcaption>
    </figure>
  </section>

  <section class="xmd-landing-section xmd-architecture">
    <div class="xmd-section-copy">
      <h2>One short path, straight to platform nodes</h2>
      <p>Parsing, streaming fixup, stable-block caching, and platform differences stay inside the renderer. Extensions use marked extensions and <code>miniRenderer</code>, so math, custom tokens, and code highlighting can return <code>MiniNode</code> directly.</p>
      <dl class="xmd-hero-facts" aria-label="Key metrics">
        <div><dt>~28 KB</dt><dd>gzipped bundle</dd></div>
        <div><dt>2</dt><dd>runtime deps: marked + remend</dd></div>
        <div><dt>2</dt><dd>WeChat / Alipay native node output</dd></div>
      </dl>
    </div>
    <div class="xmd-arch-board" aria-label="x-markdown-mini rendering architecture">
      <svg class="xmd-arch-svg" viewBox="0 0 980 500" role="img" aria-labelledby="xmd-arch-title xmd-arch-desc">
        <title id="xmd-arch-title">x-markdown-mini architecture</title>
        <desc id="xmd-arch-desc">One-shot rendering flows from Markdown through marked lexer, Token, platform renderer, and MiniNode output; streaming first passes through StreamingProcessor and reuses the same transform.</desc>
        <defs>
          <marker id="xmd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
          </marker>
        </defs>
        <text class="xmd-arch-lane-title" x="34" y="52">one-shot render</text>
        <rect class="xmd-arch-box" x="34" y="78" width="130" height="76" rx="10"/>
        <text class="xmd-arch-label" x="99" y="110" text-anchor="middle">Markdown</text>
        <text class="xmd-arch-note" x="99" y="132" text-anchor="middle">string</text>
        <path class="xmd-arch-line" d="M164 116 H220" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-box" x="234" y="78" width="150" height="76" rx="10"/>
        <text class="xmd-arch-label" x="309" y="110" text-anchor="middle">Marked instance</text>
        <text class="xmd-arch-note" x="309" y="132" text-anchor="middle">lexer + extensions</text>
        <path class="xmd-arch-line" d="M384 116 H438" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-box" x="452" y="78" width="116" height="76" rx="10"/>
        <text class="xmd-arch-label" x="510" y="110" text-anchor="middle">Token[]</text>
        <text class="xmd-arch-note" x="510" y="132" text-anchor="middle">marked tokens</text>
        <path class="xmd-arch-line" d="M568 116 H626" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-box xmd-arch-box-accent" x="640" y="62" width="170" height="108" rx="12"/>
        <text class="xmd-arch-label" x="725" y="100" text-anchor="middle">PlatformRenderer</text>
        <text class="xmd-arch-note" x="725" y="124" text-anchor="middle">renderTokens(tokens, ctx)</text>
        <text class="xmd-arch-note" x="725" y="148" text-anchor="middle">wechat / alipay</text>
        <path class="xmd-arch-line" d="M810 116 H858" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-box" x="872" y="78" width="86" height="76" rx="10"/>
        <text class="xmd-arch-label" x="915" y="110" text-anchor="middle">MiniNode[]</text>
        <text class="xmd-arch-note" x="915" y="132" text-anchor="middle">native</text>
        <text class="xmd-arch-lane-title" x="34" y="222">streaming render</text>
        <rect class="xmd-arch-platform" x="34" y="248" width="148" height="78" rx="10"/>
        <text class="xmd-arch-label" x="108" y="280" text-anchor="middle">chunk input</text>
        <text class="xmd-arch-note" x="108" y="302" text-anchor="middle">hasNextChunk</text>
        <path class="xmd-arch-line" d="M182 287 H238" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-platform xmd-arch-box-accent" x="252" y="226" width="210" height="122" rx="12"/>
        <text class="xmd-arch-label" x="357" y="268" text-anchor="middle">StreamingProcessor&lt;T&gt;</text>
        <text class="xmd-arch-note" x="357" y="292" text-anchor="middle">commit stable blocks</text>
        <text class="xmd-arch-note" x="357" y="316" text-anchor="middle">fix live tail with remend</text>
        <path class="xmd-arch-line" d="M462 287 H524" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-platform" x="538" y="248" width="166" height="78" rx="10"/>
        <text class="xmd-arch-label" x="621" y="280" text-anchor="middle">transform(markdown)</text>
        <text class="xmd-arch-note" x="621" y="302" text-anchor="middle">same parser + renderer</text>
        <path class="xmd-arch-line xmd-arch-line-soft" d="M621 248 V178 H725 V170"/>
        <path class="xmd-arch-line" d="M704 287 H762" marker-end="url(#xmd-arrow)"/>
        <rect class="xmd-arch-platform" x="776" y="248" width="182" height="78" rx="10"/>
        <text class="xmd-arch-label" x="867" y="280" text-anchor="middle">onPatch(nodes)</text>
        <text class="xmd-arch-note" x="867" y="302" text-anchor="middle">sync when delays are 0</text>
        <text class="xmd-arch-lane-title" x="34" y="394">extension points</text>
        <rect class="xmd-arch-chip" x="184" y="366" width="174" height="58" rx="999"/>
        <text class="xmd-arch-note xmd-arch-chip-text" x="271" y="390" text-anchor="middle">marked tokenizer / hooks</text>
        <text class="xmd-arch-note xmd-arch-chip-text" x="271" y="410" text-anchor="middle">CommonMark + GFM</text>
        <path class="xmd-arch-line xmd-arch-line-soft" d="M309 366 V154"/>
        <rect class="xmd-arch-chip" x="430" y="366" width="172" height="58" rx="999"/>
        <text class="xmd-arch-note xmd-arch-chip-text" x="516" y="390" text-anchor="middle">miniRenderer(token)</text>
        <text class="xmd-arch-note xmd-arch-chip-text" x="516" y="410" text-anchor="middle">formula / custom token</text>
        <path class="xmd-arch-line xmd-arch-line-soft" d="M516 366 V154"/>
        <rect class="xmd-arch-chip" x="674" y="366" width="182" height="58" rx="999"/>
        <text class="xmd-arch-note xmd-arch-chip-text" x="765" y="390" text-anchor="middle">platform quirks</text>
        <text class="xmd-arch-note xmd-arch-chip-text" x="765" y="410" text-anchor="middle">data-href / https images</text>
        <path class="xmd-arch-line xmd-arch-line-soft" d="M765 366 V170"/>
      </svg>
      <div class="xmd-arch-proof">
        <div><strong>Math</strong><span>LaTeX plugin on demand</span></div>
        <div><strong>Custom extensions</strong><span><code>miniRenderer</code> emits nodes</span></div>
        <div><strong>100% CommonMark</strong><span>Inherited from marked parsing</span></div>
        <div><strong>Streaming-friendly</strong><span>Stable-block cache, tail-only rerender</span></div>
      </div>
    </div>
  </section>
</main>
