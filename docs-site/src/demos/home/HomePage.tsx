import React from 'react';
import HeroPhonePreview from './HeroPhonePreview';
import InstallPanel from './InstallPanel';

const HERO_COPY_HTML = `<h1>多端，流式友好，高性能的小程序 Markdown 渲染器</h1>
      <p class="xmd-hero-subtitle">原生的微信、支付宝渲染：Markdown 直接解析为各端的 <code>MiniNode[]</code>，token 级流式直出，不经过 WebView，也不把 Web HTML 塞进小程序。</p>`;

const REST_HTML = `<section class="xmd-landing-section xmd-architecture">
    <div class="xmd-arch-board" aria-label="x-markdown-mini 渲染架构">
      <svg class="xmd-arch-svg" viewBox="0 0 920 288" role="img" aria-labelledby="xmd-arch-title xmd-arch-desc">
        <title id="xmd-arch-title">x-markdown-mini 架构图</title>
        <desc id="xmd-arch-desc">Markdown 经 marked lexer、Token 到平台 renderer 输出 MiniNode；流式经 StreamingProcessor 复用同一 transform。</desc>
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
        <text class="xmd-arch-lane-title" x="624" y="150">复用同一 transform</text>
      </svg>
      <div class="xmd-arch-proof">
        <div>
          <div class="xmd-arch-proof-head">
            <svg class="xmd-arch-proof-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>
            <strong>公式</strong>
          </div>
          <span>LaTeX 插件按需引入</span>
        </div>
        <div>
          <div class="xmd-arch-proof-head">
            <svg class="xmd-arch-proof-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>
            <strong>自定义拓展</strong>
          </div>
          <span><code>miniRenderer</code> 直出节点</span>
        </div>
        <div>
          <div class="xmd-arch-proof-head">
            <svg class="xmd-arch-proof-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <strong>100% CommonMark</strong>
          </div>
          <span>继承 marked 解析能力</span>
        </div>
        <div>
          <div class="xmd-arch-proof-head">
            <svg class="xmd-arch-proof-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <strong>流式友好</strong>
          </div>
          <span>稳定块缓存，只重跑尾部</span>
        </div>
      </div>
    </div>
  </section>`;

export default function HomePage() {
  return (
    <div className="markdown">
      <main className="xmd-landing">
        <section className="xmd-hero">
          <div className="xmd-hero-copy">
            <div dangerouslySetInnerHTML={{ __html: HERO_COPY_HTML }} />
            <InstallPanel
              copyLabel="复制"
              copySuccessText="已复制"
              playgroundHref="/playground"
              playgroundLabel="在线体验"
            />
          </div>
          <HeroPhonePreview />
        </section>
        <div dangerouslySetInnerHTML={{ __html: REST_HTML }} />
      </main>
    </div>
  );
}
