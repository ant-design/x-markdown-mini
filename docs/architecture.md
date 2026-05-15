# 架构

一句话：**Markdown → IR → 统一节点 → 平台节点**，四步流水线。

```
┌──────────┐  parse   ┌──────┐  irToUnifiedNodes  ┌──────────────┐  adaptToPlatform  ┌──────────────┐
│ markdown │ ───────▶ │  IR  │ ─────────────────▶ │ Unified Node │ ────────────────▶ │  Platform    │
│  string  │          │ tree │                    │   (rich-text)│                   │    nodes     │
└──────────┘          └──────┘                    └──────────────┘                   └──────────────┘
```

## 各层职责

### 1. Lexer（`src/core/lexer.ts`）

零依赖的迷你 Markdown 解析器，直接产出 IR 树。覆盖：

- 块级：标题、段落、围栏代码、引用、有序/无序列表、HR、HTML 透传、GFM 表格
- 行内：`**strong**`、`*em*`、`` `code` ``、`[text](url)`、`![alt](src)`、`<br>`、转义、硬换行

替换 `marked` 的目的：

- 体积：~30KB ESM（gzip ~7.8KB）整库，远小于 marked 单独 ~50KB
- 直接产 IR，省去一层 token → IR 转换
- 流式增量解析友好（详见 [streaming.md](./streaming.md)）

### 2. IR 层（`src/types.ts` 中的 `IRNode`）

最小化的中间表示。字段约定：

```ts
interface IRNode {
  t: IRNodeType;             // 类型，例如 'heading' / 'paragraph' / 'strong'
  a?: Record<string, ...>;   // 属性，例如 { depth: 1 }
  c?: IRNode[];              // 子节点
  raw?: string;              // 原始文本（code、codespan、text 用）
}
```

为什么单独有 IR 层？

- 让流式处理可以「锁定已稳定块」并只重解析尾部，详见 streaming.md
- 让适配器层只关心节点结构，不再关心 markdown 语法

### 3. 统一节点（`UnifiedNode`）

与微信 `rich-text` 的 `nodes` 协议对齐：

```ts
interface UnifiedNode {
  name: string;                                       // 小写 tag
  attrs?: Record<string, string | number | boolean>;  // class / src / href ...
  children?: UnifiedNode[];
  animate?: 'block' | 'text' | false;                 // 块级/文本级动画标记
}
```

每个块级节点都带 `class="md-xxx"`（如 `md-paragraph`、`md-heading md-h1`、`md-code-block`），消费方可统一在 WXSS / ACSS 上做样式与动画。

### 4. 适配器层（`src/adapters/`）

所有适配器共用 `adaptNodes(nodes, config)`，配置来源于 `PlatformAdapterConfig`：

```ts
interface PlatformAdapterConfig {
  caps: PlatformCapabilities;        // 该平台的能力矩阵
  classMode?: 'strip' | 'preserve';  // 是否剥离内部 class（多数平台需要）
  rewriteAnchorHref?: boolean;       // <a href> → <a data-href>（微信特有）
}
```

`PlatformCapabilities` 见 [platforms.md](./platforms.md)。`adaptNodes` 处理：

- 移除 `selectable`（属于 rich-text 组件级属性，不应出现在内部节点）
- 按 `classMode` 决定是否剥离 class
- 标签级降级：`<pre>` / `<blockquote>` / `<table>` 在不支持时降为 `<div>`
- 属性级降级：`<ol start>`、`http://` 图片 → `https://`
- `<video>`：在不支持的平台上丢弃

## 一次性 vs 流式

| 模式     | 入口                                | 何时用                           |
| -------- | ----------------------------------- | -------------------------------- |
| 一次性   | `render({ content, ... })`          | 已有完整 markdown                |
| 流式     | `render({ content, streaming, ... })` | LLM 边出边渲，需要 onPatch 推送 |

二者共享同一条流水线 —— 流式只是把「lexer + ir → unified」按已稳定块缓存，并通过 `onPatch` 增量推回。

## 目录速查

```
src/
├── index.ts                    # render(props) 主入口、平台自动识别
├── pipeline.ts                 # runPipeline / renderOnce
├── types.ts                    # 公共类型
├── core/
│   ├── lexer.ts                # parse(): markdown → IR
│   ├── irToUnifiedNodes.ts     # IR → UnifiedNode[]
│   └── index.ts
├── adapters/
│   ├── adapt.ts                # 通用 capability-driven 映射器
│   ├── capabilities.ts         # 能力矩阵 + 适配配置
│   ├── wechat.ts / alipay.ts / douyin.ts / other.ts   # 各端薄壳
│   └── index.ts
└── streaming/
    └── StreamingProcessor.ts   # 流式打字机 + 增量解析
```
