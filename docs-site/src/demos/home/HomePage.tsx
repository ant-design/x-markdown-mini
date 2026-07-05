import React from 'react';
import HeroPhonePreview from './HeroPhonePreview';
import Hero from './sections/Hero';
import Architecture from './sections/Architecture';
import type { HomeCopy } from './sections/copy';

// 中文首页文案。区块结构与英文版共享（见 sections/），此处只提供文本。
// 注意：部分字符串受 check:home 契约约束，勿随意改写。
const COPY: HomeCopy = {
  eyebrow: '小程序 · 流式 Markdown',
  heroTitle: '多端，流式友好，高性能的小程序 Markdown 渲染器',
  heroSubtitle: (
    <>
      原生的微信、支付宝渲染：Markdown 直接解析为各端的 <code>MiniNode[]</code>，token
      级流式直出，不经过 WebView，也不把 Web HTML 塞进小程序。
    </>
  ),
  facts: [
    { term: 'Token → Node', desc: 'marked 词法结果直接进入平台 renderer' },
    { term: 'Streaming', desc: '稳定块缓存，只重算未完成尾部' },
    { term: 'WeChat / Alipay', desc: '平台差异在 transformer 内收敛' },
  ],
  install: {
    copyLabel: '复制',
    copySuccessText: '已复制',
    playgroundHref: '/playground',
    playgroundLabel: '在线体验',
  },
  scrollCue: '架构与流式原理',
  arch: {
    title: '原生小程序渲染',
    body: (
      <>
        小程序没有 DOM，<code>rich-text</code> 又会重新套白名单。x-markdown-mini
        直接产出可渲染的节点树：lexer 之后没有中间 IR，没有适配器矩阵，平台差异在两个
        transformer 里明说。
      </>
    ),
    proof: [
      { icon: 'math', title: '公式', desc: <>LaTeX 插件按需引入</> },
      { icon: 'ext', title: '自定义拓展', desc: <><code>miniRenderer</code> 直出节点</> },
      { icon: 'commonmark', title: '100% CommonMark', desc: <>继承 marked 解析能力</> },
      { icon: 'stream', title: '流式友好', desc: <>稳定块缓存，只重跑尾部</> },
    ],
  },
};

const DIAGRAM = {
  title: 'x-markdown-mini 架构图',
  desc: 'Markdown 经 marked lexer、Token 到平台 renderer 输出 MiniNode；流式经 StreamingProcessor 复用同一 transform。',
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
