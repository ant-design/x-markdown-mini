/**
 * Per-locale homepage copy. Keeping both locales here (rather than in string
 * templates inside the two HomePage entries) is what lets the section components
 * stay identical across zh/en — only the text object differs.
 *
 * NOTE: several strings below are load-bearing for the `check:home` contract
 * (scripts/check-homepage.mjs). Do not reword them without updating that gate:
 *   zh: 多端，流式友好，高性能的小程序 Markdown 渲染器 · 原生的微信、支付宝渲染 · 自定义拓展 · 100% CommonMark
 *   en: Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer
 *       · Native WeChat and Alipay rendering · Custom extensions · 100% CommonMark
 */

export interface HomeFact {
  term: string;
  desc: string;
}

export interface ArchProof {
  /** icon key resolved to an inline SVG in Architecture.tsx */
  icon: 'math' | 'ext' | 'commonmark' | 'stream';
  title: React.ReactNode;
  desc: React.ReactNode;
}

export interface HomeCopy {
  /** eyebrow above the hero headline */
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: React.ReactNode;
  facts: HomeFact[];
  install: {
    copyLabel: string;
    copySuccessText: string;
    playgroundHref: string;
    playgroundLabel: string;
  };
  scrollCue: string;
  arch: {
    title: string;
    body: React.ReactNode;
    proof: ArchProof[];
  };
}
