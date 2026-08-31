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
    "version": "1.1.0",
    "date": "2026-08-31",
    "items": [
      {
        "type": "feature",
        "html": "内置 <code>&lt;details&gt;</code> 折叠块支持。此前 <code>&lt;details&gt;&lt;summary&gt;…&lt;/summary&gt;…&lt;/details&gt;</code> 会渲染成原始文本——marked 的 html 分词器在空行处把这段切成互不相关的多个 token，开闭标签因而泄漏到已渲染内容的前后。现由内置块级分词器整块捕获：<code>&lt;summary&gt;</code> 取纯文本作标题（标签被剥离），正文按普通块级 markdown 解析（含空行分隔的段落与列表），<code>&lt;details open&gt;</code> 默认展开。内置 <code>MiniNodeRenderer</code>（微信 / 支付宝）渲染为可折叠区块，点击标题行展开收起，默认折叠。<strong>行为变化：</strong> <code>parse()</code> / <code>render()</code> 现在会产出新的 <code>details</code> token 类型，这段 markdown 不再走原 <code>html</code> 原始文本路径；注册 <code>name: 'details'</code> 的扩展仍可完全覆盖内置行为。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "<code>render(props)</code> / <code>renderNodes(props)</code> 的单次调用扩展会泄漏到后续调用。<code>applyPerCallExtensions</code> 用浅展开快照 <code>marked.defaults</code>，而 marked 的 <code>use()</code> 是<strong>原地</strong>改写既有的 <code>defaults.extensions</code> 容器及 <code>renderer</code> / <code>tokenizer</code> 实例，快照与被改写对象共享同一引用，还原等于没还原。此前只在实例已配置 <code>extensions</code> 时触发（容器已存在），现按原型克隆这三者。",
        "notes": []
      },
      {
        "type": "perf",
        "html": "主库体积因内置 <code>&lt;details&gt;</code> 分词器增加约 1.3 KB（gzip 约 0.4 KB），<code>check-bundle</code> 体积预算已同步上调。",
        "notes": []
      }
    ]
  },
  {
    "version": "1.0.2",
    "date": "2026-07-07",
    "items": [
      {
        "type": "fix",
        "html": "支付宝真机上 KaTeX 公式回退成系统字体。真机 <code>my.loadFontFace</code> 只认「已加入下载合法域名白名单的 https 网络字体」，包内本地 ttf 路径与 base64 data URI 仅在模拟器生效（此前它们能在本仓库自带 examples 里工作，是因为 examples 把字体同步到了工程根目录）。现改为从白名单 CDN 加载 KaTeX 字体（<code>mdn.alipayobjects.com</code>，20 个 ttf）。<strong>使用方需将该字体 CDN 域名加入小程序「下载合法域名」白名单。</strong> 微信仍保留可解析的本地 <code>miniprogram_npm</code> ttf（优先）+ 共享 CDN（兜底）。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "流式渲染公式时整页反复闪动。此前 <code>MiniNodeRenderer</code> 每收到一个 chunk 都会重新注册字体就绪回调，字体缓存后回调又同步触发，导致整棵渲染树反复「卸载-重挂」。现每个组件实例至多重排一次，且仅在「有公式 + 字体尚未就绪 + 非流式进行中」时触发。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "流式时有序列表序号（如 <code>1.</code>）换行。逐字入场动画把 marker 拆成多个 <code>&lt;text&gt;</code>，在仅 28rpx 宽的 marker 列里 <code>1</code> 和 <code>.</code> 分行。marker 现整体渲染为单个 <code>&lt;text&gt;</code>，与微信一致。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "尊重 <code>package.json#exports</code> 的构建工具（如 Minifish 2.0）无法解析、加载不出 <code>&lt;markdown&gt;</code> 组件。新增 <code>./es/Markdown/index</code> 与 <code>./es/MiniNodeRenderer/index</code> 无扩展名子路径导出映射（Node 的 <code>*</code> 通配不会自动补扩展名）。",
        "notes": []
      },
      {
        "type": "perf",
        "html": "移除内联 base64 字体数据模块（<code>katex-font-data.js</code>）与支付宝包根 ttf；字体 loader 抽为每个包根仅发一份的 <code>shared/loadKatexFonts.js</code>（不再内联进每个组件 wrapper）。包体减小。",
        "notes": []
      }
    ]
  },
  {
    "version": "1.0.1",
    "date": "2026-07-05",
    "items": [
      {
        "type": "feature",
        "html": "扩展可覆盖内置元素的渲染。扩展的 <code>name</code> 命中内置 token 类型（如 <code>table</code>、<code>code</code>）时，其 <code>miniRenderer</code> 会完全接管该 token 的渲染。此前仅 <code>code</code> 支持，现 <code>table</code> 同样可覆盖；只提供 <code>miniRenderer</code>、不提供 <code>tokenizer</code> 时解析仍走内置分词器，返回 <code>null</code> 回退到内置渲染。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "<code>\\[ … \\]</code> 块级公式紧跟文本行（无空行分隔）时不被识别。<code>blockKatex</code> 缺少 <code>start</code>，该行被并入段落、<code>\\[</code> <code>\\]</code> 退化成转义字符；补上块级 <code>start</code> 后可正确中断段落，识别为块级公式。",
        "notes": []
      },
      {
        "type": "fix",
        "html": "iOS &lt; 15.4 / 旧基础库上整包白屏。内联的 <code>marked</code> 词法器调用了 <code>Array.prototype.at</code>（<code>.at(-1)</code>），这些引擎不支持，运行时抛 <code>x.at is not a function</code>——<code>tsup</code> 只降语法不 polyfill 内建方法，<code>es-check</code> 只查语法也照不到。新增守卫式、不可枚举的 <code>Array/String#at</code> polyfill（在任何词法器代码前加载），并加 <code>check-bundle</code> 卡口防止其它未 polyfill 的运行时方法回归。",
        "notes": []
      },
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
    "version": "1.1.0",
    "date": "2026-08-31",
    "items": [
      {
        "type": "feature",
        "html": "built-in <code>&lt;details&gt;</code> support. <code>&lt;details&gt;&lt;summary&gt;…&lt;/summary&gt;…&lt;/details&gt;</code> previously rendered as raw text — marked's html tokenizer splits the region at blank lines into several unrelated tokens, so the opening and closing tags leaked around otherwise-rendered content. A built-in block tokenizer now captures the whole region: <code>&lt;summary&gt;</code> becomes a plain-text title (tags stripped), the body is lexed as regular block markdown (including blank-line-separated paragraphs and lists), and <code>&lt;details open&gt;</code> starts expanded. The bundled <code>MiniNodeRenderer</code> (WeChat / Alipay) renders it as a collapsible section — tapping the summary row toggles it, collapsed by default. <strong>Behavior change:</strong> <code>parse()</code> / <code>render()</code> now emit a new <code>details</code> token type and this markdown no longer takes the raw <code>html</code> text path; an extension registered as <code>name: 'details'</code> still overrides the built-in entirely.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "per-call extensions passed to <code>render(props)</code> / <code>renderNodes(props)</code> leaked into later calls. <code>applyPerCallExtensions</code> snapshotted <code>marked.defaults</code> with a shallow spread, but marked's <code>use()</code> mutates the existing <code>defaults.extensions</code> container and the <code>renderer</code> / <code>tokenizer</code> instances <strong>in place</strong>, so the snapshot aliased the very objects it was meant to restore. This previously only triggered when the instance already had <code>extensions</code> configured (container already present). All three are now cloned preserving their prototypes.",
        "notes": []
      },
      {
        "type": "perf",
        "html": "the built-in <code>&lt;details&gt;</code> tokenizer adds roughly 1.3 KB raw (~0.4 KB gzip) to the main library; <code>check-bundle</code> size budgets were raised to match.",
        "notes": []
      }
    ]
  },
  {
    "version": "1.0.2",
    "date": "2026-07-07",
    "items": [
      {
        "type": "fix",
        "html": "KaTeX formulas fell back to the system font on the Alipay real device. On device <code>my.loadFontFace</code> only accepts an https network font whose domain is on the download allowlist; package-local ttf paths and base64 data URIs work only in the simulator (they appeared to work in this repo's own examples only because the examples sync the fonts to the project root). KaTeX fonts now load from a whitelisted CDN (<code>mdn.alipayobjects.com</code>, 20 ttf). <strong>Consumers must add the font CDN domain to their mini-program download allowlist.</strong> WeChat keeps its resolvable local <code>miniprogram_npm</code> ttf (first) + shared CDN (fallback).",
        "notes": []
      },
      {
        "type": "fix",
        "html": "whole-page flicker while streaming formulas. <code>MiniNodeRenderer</code> re-registered a font-ready callback on every chunk, and the callback fired synchronously once fonts were cached, unmounting/remounting the entire render tree each chunk. Each component instance now reflows at most once, and only when there is a formula, fonts aren't ready yet, and streaming is not in progress.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "ordered-list markers (e.g. <code>1.</code>) wrapped across lines while streaming. The per-character entrance animation split the marker into separate <code>&lt;text&gt;</code> boxes, so <code>1</code> and <code>.</code> broke onto different lines inside the 28rpx-wide marker column. Markers now render as a single <code>&lt;text&gt;</code>, matching WeChat.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "bundlers that honor <code>package.json#exports</code> (e.g. Minifish 2.0) couldn't resolve and failed to load the <code>&lt;markdown&gt;</code> component. Added <code>./es/Markdown/index</code> and <code>./es/MiniNodeRenderer/index</code> no-extension subpath export maps (Node's <code>*</code> glob does not auto-append extensions).",
        "notes": []
      },
      {
        "type": "perf",
        "html": "removed the inlined base64 font data module (<code>katex-font-data.js</code>) and the Alipay-root ttf; the font loader is now shipped once per package root (<code>shared/loadKatexFonts.js</code>) instead of inlined into every component wrapper. Smaller package.",
        "notes": []
      }
    ]
  },
  {
    "version": "1.0.1",
    "date": "2026-07-05",
    "items": [
      {
        "type": "feature",
        "html": "extensions can override built-in element rendering. When an extension's <code>name</code> matches a built-in token type (e.g. <code>table</code>, <code>code</code>), its <code>miniRenderer</code> fully takes over that token's rendering. Previously only <code>code</code> supported this; now <code>table</code> can be overridden too. Providing only a <code>miniRenderer</code> (no <code>tokenizer</code>) keeps marked's built-in parsing; returning <code>null</code> falls back to the built-in rendering.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "<code>\\[ … \\]</code> display math was not recognized when it immediately followed a text line (no blank separator). <code>blockKatex</code> had no <code>start</code>, so the line was absorbed into the paragraph and its <code>\\[</code>/<code>\\]</code> degraded to escape tokens; a block <code>start</code> now interrupts the paragraph and recognizes the display math.",
        "notes": []
      },
      {
        "type": "fix",
        "html": "the whole bundle blanked on iOS &lt; 15.4 / older base libraries. The bundled <code>marked</code> lexer calls <code>Array.prototype.at</code> (<code>.at(-1)</code>), which those engines lack, throwing <code>x.at is not a function</code> — <code>tsup</code> only lowers syntax (not built-in methods) and <code>es-check</code> (syntax-only) couldn't catch it. Ships a guarded, non-enumerable <code>Array/String#at</code> polyfill loaded before any lexer code, plus a <code>check-bundle</code> gate against other un-polyfilled runtime methods.",
        "notes": []
      },
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
