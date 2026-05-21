# x-markdown-mini Agent Guide

## 产品定位

`@ant-design/x-markdown-mini` 是面向小程序生态的轻量 Markdown 渲染器。它的核心目标不是做一个通用 Web Markdown 组件，而是把 Markdown、AI 流式输出、小程序 `rich-text` 节点协议和不同平台的渲染差异收进一条稳定链路里。

一句话：

> 多端可用、AI 流式友好、高扩展、高性能、低包体积的小程序 Markdown 渲染器。

## 核心特性

### 1. 多端可用

当前内置支持：

- 支付宝小程序：`alipay`
- 微信小程序：`wechat`

平台入口统一，业务侧可以传入 `platform: 'auto' | 'alipay' | 'wechat'`。`auto` 会根据运行时环境识别 `my` / `wx`，无法识别时回退到支付宝路径。

新增小程序平台时，推荐按现有平台 renderer 扩展：

1. 在 `src/platforms/types.ts` 的 `Platform` 联合类型中追加平台名。
2. 新增对应 `src/platforms/<platform>/` renderer。
3. 在 `src/platforms/index.ts` 注册 renderer 和运行时识别规则。
4. 根据平台能力处理 `<a>`、`<img>`、`<ol start>`、表格、代码块等差异。
5. 如需组件用法，同步补齐对应组件产物与构建复制逻辑。

### 2. JS 和组件两种用法

#### JS 用法

适合业务自己控制渲染、缓存、节点 diff 或二次加工：

```ts
import { renderNodes } from '@ant-design/x-markdown-mini';

const nodes = renderNodes({
  content: markdown,
  platform: 'wechat',
  selectable: true,
});
```

也可以只拿 marked tokens：

```ts
import { parse, render } from '@ant-design/x-markdown-mini';

const tokens = parse(markdown);
const sameTokens = render(markdown);
```

#### 组件用法

适合直接在小程序页面里接入。包内提供 Markdown / NodesRenderer 组件，支付宝和微信通过不同构建产物适配各自模板与样式。

```jsonc
{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
```

```xml
<markdown
  content="{{content}}"
  selectable="{{true}}"
  streaming="{{ { hasNextChunk: hasNextChunk, semantic: true } }}"
/>
```

## AI 流式友好

AI 输出 Markdown 时，最容易出问题的不是完整文档，而是中间状态：

- 未闭合粗体：`这是 **重点`
- 未闭合行内代码：`` `code`
- 未闭合链接：`[标题](https://`
- 未闭合 fenced code block
- 表格输出到一半
- 列表、引用、段落还没到稳定边界

`x-markdown-mini` 的流式链路发生在 lexer 之前：

```text
累计 markdown
  -> 语义分块 / 打字机推进
  -> 稳定块缓存
  -> tail fixup
  -> marked Token[]
  -> 平台 renderer
  -> MiniNode[]
```

关键能力：

- **稳定块缓存**：已经到达安全边界的内容缓存为稳定节点，不再重复解析。
- **tail 重解析**：每次只重新处理未稳定尾部，避免整篇内容反复重算。
- **tail 补全**：默认通过 `remend` 对未闭合 Markdown 片段做补全，减少闪烁和格式跳变。
- **语义分块渲染**：支持按中文标点、换行或自定义分隔符推进输出。
- **尾缀处理**：fixup 只作用于未稳定 tail，不污染原始 `renderedText`，也不重写已提交稳定段。
- **onPatch 推送**：流式过程中通过 `onPatch(nodes)` 或 `onPatch(tokens)` 把最新可渲染结果交给业务。

典型用法：

```ts
renderNodes({
  content: accumulatedMarkdown,
  platform: 'wechat',
  streaming: {
    hasNextChunk: true,
    semantic: true,
    enableAnimation: true,
  },
  onPatch: (nodes) => {
    this.setData({ nodes });
  },
});
```

最后一轮：

```ts
renderNodes({
  content: finalMarkdown,
  platform: 'wechat',
  streaming: { hasNextChunk: false },
  onPatch: (nodes) => {
    this.setData({ nodes });
  },
  onRenderComplete: () => {
    console.log('done');
  },
});
```

## 高扩展性

扩展点集中在两层：

### marked extensions

`XMarkdownMini` 支持按实例传入 `MarkedExtension[]`。扩展安装在当前实例，不污染全局 marked 单例。

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  extensions: [customMarkedExtension],
});
```

### tokenRenderers

自定义 tokenizer 产出的 token 如果要进入小程序节点渲染链路，需要提供 `tokenRenderers`：

```ts
const md = new XMarkdownMini({
  extensions: [mentionExtension],
  tokenRenderers: [
    {
      token: 'mention',
      render: (token) => ({
        name: 'span',
        attrs: { class: 'md-mention' },
        children: [{ name: 'text', attrs: { value: token.raw } }],
      }),
    },
  ],
});
```

### LaTeX 与代码高亮

当前仓库没有把 KaTeX、MathJax、Shiki、Prism、highlight.js 等重型依赖打进核心包。正确策略是：

- LaTeX：通过 marked extension 识别 `$...$` / `$$...$$`，再用 `tokenRenderers` 输出小程序可渲染节点。
- 代码高亮：按需加载高亮器，只在业务确实展示代码块时加载语言 grammar 或高亮结果。
- 核心包保持 headless、轻量、无重型渲染依赖。

这意味着“支持 LaTeX / 代码高亮”的准确表达是：核心提供扩展机制，业务可按需接入，而不是默认把这些能力全部内置进包体。

## 高性能

性能设计原则：

- 不引入平台无关中间 IR，直接从 marked tokens 生成目标平台节点。
- 平台差异编进各平台 renderer，避免额外 adapter 全树遍历。
- 流式模式缓存稳定块，只重算 tail。
- `chunkDelay = 0` 且 `charDelay = 0` 时跳过 timer，同步推送 patch。
- 小程序组件只做必要 flatten 和模板渲染，避免把复杂运行时塞进页面。

当前性能基线见：

- `benchmark/baseline.json`
- `npm run bench`
- `npm run bench:check`

官网首页使用的公开指标：

- 相对 `remark`：约 `8.2x`
- 相对 `marked`：约 `0.86x`
- `ai-chat-long.md` 完整节点流水线：约 `3,740 ops/s`

这些数字来自仓库内 tinybench 基线，更新性能相关代码时必须重新跑 benchmark，并解释 baseline 变化。

## 低包体积

核心包体积策略：

- 核心只内置必要 Markdown lexer 与流式修复能力。
- 不默认打入 LaTeX 渲染器、代码高亮器、主题 CSS、大型 AST 工具链。
- 支付宝与微信组件产物分平台输出，减少运行时判断。
- `sideEffects: false`，方便消费方 tree-shaking。

当前 README 中记录的核心产物量级：

- ESM 整库约 `103 KB`
- gzip 约 `25 KB`

本地包体积可通过以下命令复核：

```bash
npm run build
npm run check:bundle
npm pack --dry-run
```

## 兼容性好

兼容性目标是“小程序可跑”，不是只在现代浏览器里跑。

关键措施：

- tsup 输出目标为 ES2018。
- `scripts/check-bundle.mjs` 使用 `es-check` 检查 dist 语法。
- 构建后运行 `scripts/patch-modern-regex.mjs`，避免 named capture group regex literal 触发支付宝 IDE 编译错误。
- 图片、链接、有序列表等平台差异在 renderer 中处理。
- 微信通过 `package.json#miniprogram` 进入 `dist/miniprogram_dist`，支付宝走默认包根。

## 开发与验证命令

常用命令：

```bash
npm run build
npm test
npm run bench
npm run bench:check
npm run check:bundle
```

文档站：

```bash
cd docs-site
npm run check:home
npm run build
npm run dev
```

## Agent 工作原则

修改这个仓库时按以下优先级判断：

1. 小程序运行稳定性优先于 Web 端优雅抽象。
2. 性能和包体积优先于“默认内置所有高级功能”。
3. 新能力优先通过 extension / tokenRenderer / 按需加载接入。
4. 平台差异优先落在平台 renderer，不要把业务侧暴露给平台细节。
5. 流式路径必须验证未闭合 Markdown、稳定块缓存、tail fixup 和最终 flush。
6. 包体积、ES2018 兼容、benchmark baseline 是硬门槛，不要凭感觉改。

## 事实边界

- 已确认内置平台：支付宝、微信。
- 已确认入口：JS API 与小程序组件。
- 已确认流式能力：稳定块缓存、tail fixup、语义分块、`onPatch`。
- 已确认扩展机制：marked extensions 与 `tokenRenderers`。
- LaTeX 和代码高亮应描述为“可通过扩展机制按需接入”，不要写成当前核心已内置。
