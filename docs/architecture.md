# 架构

一句话：纯 JS 是 **Markdown → AI streaming fixup → marked Token[]**；组件是 **Markdown → AI streaming fixup → marked Token[] → 平台 renderer → MiniNode[]**。

```
┌──────────┐  marked lexer  ┌──────────┐  renderer.renderTokens  ┌──────────────┐
│ markdown │ ─────────────▶ │ Token[]  │ ──────────────────────▶ │ MiniNode[]   │
└──────────┘                └──────────┘                         └──────────────┘
```

## 各层职责

### 1. Lexer（`XMarkdownMini.parse()`）

基于 `marked` 的 Markdown 解析层，返回 marked 原生 `Token[]`。覆盖：

- 块级：标题、段落、围栏代码、引用、有序/无序列表、HR、HTML 透传、GFM 表格
- 行内：`**strong**`、`*em*`、`` `code` ``、`[text](url)`、`![alt](src)`、`<br>`、转义、硬换行

内置 `marked` 的取舍：

- 兼容性：复用成熟 Markdown lexer，避免重新实现 GFM 表格、列表嵌套、行内 token 等边界
- 体积：ESM 整库约 103KB（gzip 约 25KB），明显大于自研 lexer，但仍在当前小程序包体预算内
- 产物：`marked` 通过 `tsup noExternal` 打进 `dist/index.*` 和 `dist/miniprogram_dist/index.js`，消费方无需单独安装运行时依赖
- 流式增量解析友好（详见 [streaming.md](./streaming.md)）

### 2. 统一节点（`MiniNode`）

平台 renderer 的统一中间输出。它接近小程序原生节点容器的 `nodes` 形状，但不是富文本抽象：

```ts
interface MiniNode {
  name: string;                                       // 小写 tag
  attrs?: Record<string, string | number | boolean>;  // class / src / href ...
  children?: MiniNode[];
  animate?: 'block' | 'text' | false;                 // 块级/文本级动画标记
}
```

组件渲染路径会把 inline 树拍平为小程序 `<text>` 友好的节点。动画通过 `animate: 'block'` 标记，由 NodesRenderer 组件映射为 `md-animate-block`。

### 3. 公共 MiniNode renderer 与平台 adapter（`src/platforms/`）

每个平台暴露 `PlatformRenderer`：

```ts
interface PlatformRenderer {
  name: Platform;
  capabilities: PlatformCapabilities;
  renderTokens(tokens: Token[], ctx: RenderContext): MiniNode[];
}
```

当前内置 `wechatRenderer` 和 `alipayRenderer`。入口通过 `getPlatformRenderer(resolvePlatform(...))` 选择 renderer。Markdown token 到 MiniNode 的结构映射在 `platforms/shared/miniNodeRenderer.ts`；微信/支付宝只提供 adapter，处理链接属性、图片 URL、有序列表起始序号等平台差异。

### 4. 自定义 token renderer

marked 的 HTML `renderer` 不直接参与小程序节点渲染。推荐用 `XMarkdownExtension`，把 tokenizer 和 `miniRenderer` 写在同一个对象上：

```ts
new XMarkdownMini({
  options: {
    extensions: [
      {
        extensions: [
          {
            name: 'mention',
            level: 'inline',
            start: (src) => src.indexOf('@'),
            tokenizer: (src) => /* ... */,
            miniRenderer: (token) => ({ name: 'span', children: [/* ... */] }),
          },
        ],
      },
    ],
  },
});
```

`tokenRenderers` 已移除。请使用 `XMarkdownExtension` 的 `miniRenderer` 代替（见 `docs/extensions.md`）。

## 一次性 vs 流式

| 模式     | 入口                                | 何时用                           |
| -------- | ----------------------------------- | -------------------------------- |
| 解析     | `render(content)` / `parse(content)` | 只要 marked Token[]             |
| 流式解析 | `render({ content, streaming, onPatch })` | AI 流式优化后返回 marked Token[] |
| 一次性   | `renderNodes({ content, ... })`      | 已有完整 markdown                |
| 流式     | `renderNodes({ content, streaming, ... })` | LLM 边出边渲，需要 onPatch 推送 |

二者共享同一条流水线。流式处理发生在 lex 之前：先在 markdown 字符串层做增量合并、语义切块、tail fixup，再进入「lexer + renderer」，并通过 `onPatch` 增量推回。

## 目录速查

```
src/
├── index.ts                    # parse/render/renderNodes 主入口、平台自动识别
├── types.ts                    # 公共类型
├── platforms/
│   ├── wechat/
│   │   ├── index.ts            # 微信 renderer
│   │   └── tokensToWechat.ts   # Token[] → 微信 nodes
│   ├── alipay/
│   │   ├── index.ts            # 支付宝 renderer
│   │   └── tokensToAlipay.ts   # Token[] → 支付宝 nodes
│   ├── shared/                 # 平台 transformer 共用工具
│   ├── types.ts                # 平台与 renderer 能力类型
│   └── index.ts
└── streaming/
    └── StreamingProcessor.ts   # 流式打字机 + 增量解析
```
