// AUTO-GENERATED from CHANGELOG.zh-CN.md / CHANGELOG.en-US.md by
// docs-site/scripts/build-changelog.mjs (docs-site predev/prebuild). DO NOT EDIT —
// edit the root CHANGELOG.*.md instead. The item html is trusted, escaped-then-
// re-tagged inline markdown (code / strong / links).

export interface GeneratedItem {
  type: 'breaking' | 'feature' | 'fix' | 'perf';
  html: string;
  notes: string[];
}
export interface GeneratedRelease {
  version: string;
  date: string;
  items: GeneratedItem[];
}

export const ZH_RELEASES: GeneratedRelease[] = [
  {
    "version": "1.0.1",
    "date": "2026-07-04",
    "items": [
      {
        "type": "fix",
        "html": "流式渲染时行内代码 <code>code</code> 中间出现多余空格。逐字 / 逐段入场动画会把行内代码文本拆成多个叶子 <code>&lt;text&gt;</code>，而每个叶子都带 <code>md-inline-code</code> 药丸的内外边距与底色，拼接后就出现了缝隙（支付宝逐字拆分最明显）。",
        "notes": [
          "药丸盒模型（背景 / 内外边距 / 圆角）改为只画在外层整段容器上；拆出来的字符叶子改用纯等宽字体类 <code>md-inline-code-txt</code>（支付宝 <code>&lt;text&gt;</code> 不继承 font-family，字体必须留在叶子）。微信、支付宝两端一并修复。"
        ]
      }
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-07-03",
    "items": [
      {
        "type": "breaking",
        "html": "<code>XMarkdownMiniOptions</code> 重整。<code>lexerOptions</code> / 顶层 <code>extensions</code> / <code>plugins</code> 三个字段合并为单一的 <code>options: { gfm?, breaks?, extensions? }</code>，同步移除 <code>Plugin</code> 类型导出。",
        "notes": [
          "迁移：<code>{ extensions: [...] }</code> → <code>{ options: { extensions: [...] } }</code>；<code>{ plugins: [Latex(), CodeHighlight()] }</code> → <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>；<code>{ lexerOptions: { gfm } }</code> → <code>{ options: { gfm } }</code>。"
        ]
      },
      {
        "type": "breaking",
        "html": "内置组件 <code>&lt;markdown /&gt;</code> 的 <code>plugins</code> prop 改名 <code>extensions</code>。",
        "notes": []
      },
      {
        "type": "feature",
        "html": "<code>MarkedConfig</code> 类型导出，统一描述构造器的 marked 配置块。",
        "notes": []
      },
      {
        "type": "feature",
        "html": "内置 <code>marked</code> lexer 并在构建时打进产物；整库 ESM 约 103KB / gzip 约 25KB。",
        "notes": []
      },
      {
        "type": "feature",
        "html": "流式增量解析——已稳定块缓存为 <code>stableNodes</code>，仅 tail 重新 lex。",
        "notes": []
      },
      {
        "type": "feature",
        "html": "微信 / 支付宝 <code>PlatformRenderer</code>，暴露平台能力与 token 到节点的转换入口。",
        "notes": []
      },
      {
        "type": "feature",
        "html": "<code>XMarkdownExtension</code> 接口，把 tokenizer 与 <code>miniRenderer</code> 写在同一个对象上；保留 <code>tokenRenderers</code> 作为 fallback。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "动画类合并 bug——开启 <code>animation</code> 时块级节点不再丢失语义 class。",
        "notes": []
      },
      {
        "type": "perf",
        "html": "<code>chunkDelay = charDelay = 0</code> 时跳过 setTimeout 链，同步推回。",
        "notes": []
      },
      {
        "type": "perf",
        "html": "<code>&lt;b&gt;</code> / <code>&lt;i&gt;</code> 改为语义化 <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code>。",
        "notes": []
      }
    ]
  }
];

export const EN_RELEASES: GeneratedRelease[] = [
  {
    "version": "1.0.1",
    "date": "2026-07-04",
    "items": [
      {
        "type": "fix",
        "html": "inline code <code>code</code> showed spurious gaps mid-word while streaming. The per-character / per-segment entrance animation splits the inline-code text into several leaf <code>&lt;text&gt;</code> nodes, and each leaf carried the <code>md-inline-code</code> pill's padding, margin and background — so the pills tiled with visible gaps (worst on Alipay, which splits per character).",
        "notes": [
          "The pill box (background / padding / radius) now paints only on the outer container; the split character leaves use a font-only <code>md-inline-code-txt</code> class instead (Alipay <code>&lt;text&gt;</code> does not inherit font-family, so the monospace font must stay on the leaf). Fixed on both WeChat and Alipay."
        ]
      }
    ]
  },
  {
    "version": "1.0.0",
    "date": "2026-07-03",
    "items": [
      {
        "type": "breaking",
        "html": "<code>XMarkdownMiniOptions</code> collapsed. <code>lexerOptions</code> / top-level <code>extensions</code> / <code>plugins</code> are gone, replaced by a single <code>options: { gfm?, breaks?, extensions? }</code> bag. The <code>Plugin</code> type is removed.",
        "notes": [
          "Migration: <code>{ extensions: [...] }</code> → <code>{ options: { extensions: [...] } }</code>; <code>{ plugins: [Latex(), CodeHighlight()] }</code> → <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>; <code>{ lexerOptions: { gfm } }</code> → <code>{ options: { gfm } }</code>."
        ]
      },
      {
        "type": "breaking",
        "html": "the bundled <code>&lt;markdown /&gt;</code> component renames its <code>plugins</code> prop to <code>extensions</code>.",
        "notes": []
      },
      {
        "type": "feature",
        "html": "<code>MarkedConfig</code> exported, describing the constructor's marked-side configuration bag.",
        "notes": []
      },
      {
        "type": "feature",
        "html": "bundle marked's lexer into the build. Full ESM bundle around 103 KB / ~25 KB gzip.",
        "notes": []
      },
      {
        "type": "feature",
        "html": "streaming incremental parsing — committed blocks are cached as <code>stableNodes</code>, only the tail is re-lexed.",
        "notes": []
      },
      {
        "type": "feature",
        "html": "WeChat / Alipay <code>PlatformRenderer</code>, exposing platform capabilities and the token-to-node entry point.",
        "notes": []
      },
      {
        "type": "feature",
        "html": "<code>XMarkdownExtension</code> interface — colocates the tokenizer and its <code>miniRenderer</code> on a single object. <code>tokenRenderers</code> is retained as a fallback.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "animation-class merge bug — with <code>animation</code> enabled, block-level nodes no longer drop their semantic class.",
        "notes": []
      },
      {
        "type": "perf",
        "html": "when <code>chunkDelay = charDelay = 0</code>, skip the setTimeout chain and push synchronously.",
        "notes": []
      },
      {
        "type": "perf",
        "html": "emit semantic <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code> instead of <code>&lt;b&gt;</code> / <code>&lt;i&gt;</code>.",
        "notes": []
      }
    ]
  }
];
