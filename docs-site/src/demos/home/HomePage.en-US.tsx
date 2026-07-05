import React from 'react';
import HeroPhonePreview from './HeroPhonePreview.en-US';
import Hero from './sections/Hero';
import Architecture from './sections/Architecture';
import type { HomeCopy } from './sections/copy';

// English homepage copy. Shares the section structure with the zh version
// (see sections/); only the text differs. Some strings are load-bearing for the
// check:home contract — do not reword them casually.
const COPY: HomeCopy = {
  eyebrow: 'Mini-programs · Streaming Markdown',
  heroTitle: 'Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer',
  heroSubtitle: (
    <>
      Native WeChat and Alipay rendering: Markdown parses straight into per-platform{' '}
      <code>MiniNode[]</code>, streamed token by token, with no WebView and no Web HTML pushed into
      a mini program.
    </>
  ),
  facts: [
    { term: 'Token → Node', desc: 'marked lexer output flows straight into platform renderers' },
    { term: 'Streaming', desc: 'Stable blocks are cached while the open tail updates' },
    { term: 'WeChat / Alipay', desc: 'Platform quirks stay inside the transformer layer' },
  ],
  install: {
    copyLabel: 'Copy',
    copySuccessText: 'Copied',
    playgroundHref: '/playground-en',
    playgroundLabel: 'Playground',
  },
  scrollCue: 'Architecture & streaming',
  arch: {
    title: 'Native mini-program rendering',
    body: (
      <>
        Mini programs have no DOM, and <code>rich-text</code> brings its own whitelist.
        x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer,
        no adapter matrix, and platform differences stay explicit in the two transformers.
      </>
    ),
    proof: [
      { icon: 'math', title: 'Math', desc: <>LaTeX plugin on demand</> },
      { icon: 'ext', title: 'Custom extensions', desc: <><code>miniRenderer</code> emits nodes</> },
      { icon: 'commonmark', title: '100% CommonMark', desc: <>Inherited from marked parsing</> },
      { icon: 'stream', title: 'Streaming-friendly', desc: <>Stable-block cache, tail-only rerender</> },
    ],
  },
};

const DIAGRAM = {
  title: 'x-markdown-mini architecture',
  desc: 'Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.',
  labels: {
    markdown: 'Markdown',
    lexer: 'marked lexer',
    lexerNote: 'lexer + extensions',
    token: 'Token[]',
    tokenNote: 'marked tokens',
    platformRenderer: 'PlatformRenderer',
    wechat: 'wechat renderer',
    alipay: 'alipay renderer',
    node: 'MiniNode[]',
    nodeNote: 'native nodes',
    streaming: 'streaming',
    chunk: 'chunk',
    chunkNote: 'hasNextChunk',
    streamingProcessor: 'StreamingProcessor',
    stable: 'stable blocks cached',
    tail: 'tail re-parsed + fixup',
    extensions: 'extensions',
    extNote: 'LaTeX / highlight / @mention',
  },
};

export default function HomePage() {
  return (
    <div className="markdown">
      <main className="xmd-landing">
        <Hero copy={COPY} media={<HeroPhonePreview />} />
        <Architecture copy={COPY} diagram={DIAGRAM} />
      </main>
    </div>
  );
}
