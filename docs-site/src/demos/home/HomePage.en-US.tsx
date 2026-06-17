import React from 'react';
import HeroPhonePreview from './HeroPhonePreview.en-US';
import InstallPanel from './InstallPanel';

const HERO_COPY_HTML = `<h1>Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer</h1>
      <p class="xmd-hero-subtitle">Native WeChat and Alipay rendering: Markdown parses straight into per-platform <code>MiniNode[]</code>, streamed token by token, with no WebView and no Web HTML pushed into a mini program.</p>
      <dl class="xmd-hero-facts" aria-label="x-markdown-mini core capabilities">
        <div><dt>Token → Node</dt><dd>marked lexer output flows straight into platform renderers</dd></div>
        <div><dt>Streaming</dt><dd>Stable blocks are cached while the open tail updates</dd></div>
        <div><dt>WeChat / Alipay</dt><dd>Platform quirks stay inside the transformer layer</dd></div>
      </dl>`;

const REST_HTML = `<section class="xmd-landing-section xmd-architecture">
    <div class="xmd-section-copy">
      <h2>Not disguised HTML. A short native pipeline.</h2>
      <p>Mini programs have no DOM, and <code>rich-text</code> brings its own whitelist. x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer, no adapter matrix, and platform differences stay explicit in the two transformers.</p>
    </div>
    <div class="xmd-arch-board" aria-label="x-markdown-mini rendering architecture">
      <svg class="xmd-arch-svg" viewBox="0 0 920 288" role="img" aria-labelledby="xmd-arch-title xmd-arch-desc">
        <title id="xmd-arch-title">x-markdown-mini architecture</title>
        <desc id="xmd-arch-desc">Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.</desc>
        <defs>
          <marker id="xmd-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#a3a3a3"/></marker>
          <marker id="xmd-accent-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#2563eb"/></marker>
        </defs>
        <rect class="xmd-arch-box" x="24" y="46" width="120" height="68" rx="10"/>
        <text class="xmd-arch-label" x="84" y="78" text-anchor="middle">Markdown</text>
        <text class="xmd-arch-note" x="84" y="97" text-anchor="middle">string</text>
        <rect class="xmd-arch-box" x="180" y="46" width="148" height="68" rx="10"/>
        <text class="xmd-arch-label" x="254" y="78" text-anchor="middle">marked lexer</text>
        <text class="xmd-arch-note" x="254" y="97" text-anchor="middle">lexer + extensions</text>
        <rect class="xmd-arch-box" x="364" y="46" width="112" height="68" rx="10"/>
        <text class="xmd-arch-label" x="420" y="78" text-anchor="middle">Token[]</text>
        <text class="xmd-arch-note" x="420" y="97" text-anchor="middle">marked tokens</text>
        <rect class="xmd-arch-box xmd-arch-box-accent" x="512" y="46" width="188" height="68" rx="10"/>
        <text class="xmd-arch-label" x="606" y="78" text-anchor="middle">PlatformRenderer</text>
        <text class="xmd-arch-note" x="606" y="97" text-anchor="middle">wechat / alipay</text>
        <rect class="xmd-arch-box" x="736" y="46" width="132" height="68" rx="10"/>
        <text class="xmd-arch-label" x="802" y="78" text-anchor="middle">MiniNode[]</text>
        <text class="xmd-arch-note" x="802" y="97" text-anchor="middle">native nodes</text>
        <path class="xmd-arch-flow" d="M144 80 H176" marker-end="url(#xmd-flow-arrow)"/>
        <path class="xmd-arch-flow" d="M328 80 H360" marker-end="url(#xmd-flow-arrow)"/>
        <path class="xmd-arch-flow" d="M476 80 H508" marker-end="url(#xmd-flow-arrow)"/>
        <path class="xmd-arch-flow" d="M700 80 H732" marker-end="url(#xmd-flow-arrow)"/>
        <text class="xmd-arch-lane-title" x="24" y="178">streaming</text>
        <rect class="xmd-arch-platform" x="180" y="196" width="148" height="60" rx="10"/>
        <text class="xmd-arch-label" x="254" y="223" text-anchor="middle">chunk</text>
        <text class="xmd-arch-note" x="254" y="241" text-anchor="middle">hasNextChunk</text>
        <rect class="xmd-arch-platform" x="364" y="196" width="212" height="60" rx="10"/>
        <text class="xmd-arch-label" x="470" y="223" text-anchor="middle">StreamingProcessor</text>
        <text class="xmd-arch-note" x="470" y="241" text-anchor="middle">commit stable blocks</text>
        <path class="xmd-arch-flow" d="M328 226 H360" marker-end="url(#xmd-flow-arrow)"/>
        <path class="xmd-arch-line" d="M470 196 C 506 152 606 166 606 118" marker-end="url(#xmd-accent-arrow)"/>
        <text class="xmd-arch-lane-title" x="624" y="150">reuse same transform</text>
      </svg>
      <div class="xmd-arch-proof">
        <div><strong>Math</strong><span>LaTeX plugin on demand</span></div>
        <div><strong>Custom extensions</strong><span><code>miniRenderer</code> emits nodes</span></div>
        <div><strong>100% CommonMark</strong><span>Inherited from marked parsing</span></div>
        <div><strong>Streaming-friendly</strong><span>Stable-block cache, tail-only rerender</span></div>
      </div>
    </div>
  </section>

  `;

export default function HomePage() {
  return (
    <div className="markdown">
      <main className="xmd-landing">
        <section className="xmd-hero">
          <div className="xmd-hero-copy">
            <div dangerouslySetInnerHTML={{ __html: HERO_COPY_HTML }} />
            <InstallPanel
              copyLabel="Copy"
              copySuccessText="Copied"
              playgroundHref="/playground-en"
              playgroundLabel="Playground"
            />
          </div>
          <HeroPhonePreview />
        </section>
        <div dangerouslySetInnerHTML={{ __html: REST_HTML }} />
      </main>
    </div>
  );
}
