## 一、介绍与接入
### 它解决什么问题
小程序渲染 Markdown 已有几种现成方案，但在 AI 流式场景下都有明显短板。

| 方案 | 问题 |
| --- | --- |
| **rich-text 渲染** | 标签白名单裁剪，不认识的标签直接丢弃；屏蔽全部点击事件；图片仅支持网络图；支付宝端不接收 HTML 字符串，只认节点数组 |
| **towxml / mp-html** | 无增量解析——每追加一段文字就把全文从头重解析一遍，CPU 开销 O(n²)；整棵节点树全量 `setData` 过桥，跨线程开销随文本长度线性增长 |
| **wemark** | 停止维护，最后提交停在 2018 年 |
| **半截 Markdown** | 代码块未闭合、`**加粗` 只写一半——现有库均无“结尾自动补全”，直接渲染会抖动甚至报错 |

流式渲染下有两道叠加的瓶颈：

| 瓶颈 | 原因 | 现有方案 |
| --- | --- | --- |
| CPU | 每追加一段即全文重解析，O(n²) | 全部全量重解析，无增量 |
| 跨线程 | `setData` 传整棵树，数据量随文本增长 | 全部全量传输 |

x-markdown-mini 针对这两点做了两件事：

1. **Markdown 直接转平台节点，不中转 HTML**——省去“HTML → 再解析回节点”的往返，长文转换比 towxml 快约 4.4×。
2. **稳定块只解析一次**——写完的段落永久缓存，仅重解析结尾未完成的一小段并做结尾补全，CPU 从 O(n²) 降到 O(n)。

> 说明：CPU 瓶颈已解决；`setData` 目前仍传整棵树，“只推结尾”的局部更新是下一步。

### 核心特性
+ **转换快**：少绕一层 HTML，长文转换比 towxml 快 4.4×、比 mp-html 快 2.5×。
+ **流式友好**：稳定块缓存 + 结尾补全（`**加粗` → `**加粗**`），半截代码块也能稳定渲染。
+ **不走 rich-text**：`MiniNodeRenderer` 直接渲染原生 `text / view / image / scroll-view`，保留事件与动画。
+ **可扩展**：`extensions` 插件机制支持 LaTeX、代码高亮、@提及等自定义语法，直接产出节点，不绕 HTML；`components` 白名单支持注册自定义小程序组件标签，业务定制无需 fork 源码。
+ **多端一份代码**：微信、支付宝（可扩展抖音），平台差异内部消化。
+ **体积轻**：核心 126 KB，gzip 后 31 KB，含解析、流式、转换、渲染全套。

### 安装
```bash
npm i @ant-design/x-markdown-mini
```

---

## 二、架构
### 整体结构
x-markdown-mini 分为入口、流式引擎、解析、转换、渲染五层，扩展机制横向作用于解析与转换层。

<!-- 图：diagrams/01-架构.svg（静态） -->

- **入口层**：`parse` / `render` / `renderNodes` 三个 API，默认复用共享实例；并发场景按视图各自 `new XMarkdownMini`。
- **流式引擎**：`StreamingProcessor<T>` 负责稳定块缓存与结尾补全，仅流式路径启用。
- **解析层**：实例隔离的 `marked.Lexer`，产出 `Token[]`。
- **转换层**：`renderTokensToMiniNodes` 是唯一的语义映射（无中间 IR），平台差异由 `MiniNodePlatformAdapter` 消化（微信 `a[data-href]`、支付宝 https 图片 / 丢弃 `ol start` 等约 6 行差异）。
- **渲染层**：`MiniNodeRenderer` 组件按 `node.name` 分发到原生组件。
- **扩展机制**：`extensions` 注册自定义语法解析器、`components` 注册自定义标签白名单，均实例隔离、不污染全局。

### 原生小程序语法，不中转 HTML
<!-- 保留原 GIF -->

实测对比：直接转小程序节点，比中间多套一层“通用节点”的方案吞吐高约 17%。

### Markdown 解析流程
一次性 `parse` / `render` 的链路：Markdown 字符串经 `marked.lexer` 得到 `Token[]`，再由 `renderTokensToMiniNodes` 结合平台 adapter 直接产出 `MiniNode[]`，最后交给 `MiniNodeRenderer` 分发到原生组件。全程不经过 HTML。

<!-- 图：diagrams/02-解析流程.svg（动效） -->

### 流式引擎：StreamingProcessor
`StreamingProcessor<T>` 与具体转换器无关：`XMarkdownMini` 用不同的 `T` 实例化两次，分别驱动 `Token[]` 与 `MiniNode[]` 两条流式路径。每追加一段 chunk 的处理如下：

<!-- 图：diagrams/03-流式解析.svg（动效） -->

1. **扫描稳定分界**：代码块外、被空行收尾的段落即“稳定块”。
2. **稳定块复用**：已提交的稳定块命中缓存直接复用，不再解析。
3. **结尾补全**：对未完成的结尾做 remend 补全（`**加粗` → `**加粗**`，未闭合代码块 / 表格自动闭合），仅作用于未提交的结尾。
4. **只重解析结尾**：稳定块复用缓存，仅对补全后的结尾段重新解析。
5. **合并输出**：缓存节点 + 新结尾节点 → `onPatch` 回调 → 视图更新。

### 扩展机制
两种扩展方式均无需 fork 源码：

+ `extensions`：注册自定义语法解析器（LaTeX、代码高亮、@提及等），走 marked 的 tokenizer 钩子，直接产出 MiniNode，不绕 HTML；实例隔离，不污染全局。
+ `components`：注册自定义小程序组件标签白名单，自动合成行内解析器。例如渲染 `<ant-button>`、`<ant-tag>`，加一行配置即可。

### 三个入口
| 接口 | 作用 |
| --- | --- |
| `parse(content)` | 仅词法，返回 Token |
| `render(props)` | 支持流式回调，供组件内部使用 |
| `renderNodes(props)` | 返回 MiniNode 节点树，按 platform 选平台 |

---

## 三、实验对比
### 转换性能
<!-- 保留原两张 benchmark 图 -->

Node v20，同一份 Markdown 分短文（2.9 KB）、中等（11.6 KB）、长文（29 KB）三档，每档 20 次 × 3 轮取平均，仅测“Markdown → 可渲染节点树”的转换耗时。

| 平台 / 篇幅 | x-markdown-mini | marked+rich-text | mp-html | towxml |
| --- | ---: | ---: | ---: | ---: |
| 微信 · 短文 | **0.24** | 0.32 | 0.37 | 0.84 |
| 微信 · 中等 | **0.55** | 0.64 | 0.89 | 1.51 |
| 微信 · 长文 | **0.82** | 1.19 | 2.08 | 3.58 |
| 支付宝 · 短文 | **0.09** | 0.31 | 0.38 | — |
| 支付宝 · 中等 | **0.42** | 0.67 | 0.95 | — |
| 支付宝 · 长文 | **0.82** | 1.27 | 2.42 | — |

篇幅越长领先越多。长文场景：比 towxml 快 4.4×，比 mp-html 快 2.5×。原因在于其余方案都要走“Markdown → HTML → 再解析回节点”一个往返，x-markdown-mini 直接从语法树拼节点，少一层：

| 方案 | 链路 | 绕 HTML？ |
| --- | --- | --- |
| **x-markdown-mini** | md → token → MiniNode | 否 |
| towxml | md → HTML → 再解析 → wxml 树 | 是 |
| mp-html | md → HTML → Parser → 节点树 | 是 |
| marked + rich-text | md → HTML → 引擎解析 → 节点 | 是 |

### 包体积
主包上限 2 MB，运行时体积需严格控制：

| 方案 | 原始大小 | gzip 后 | 说明 |
| --- | ---: | ---: | --- |
| **x-markdown-mini** | ~126 KB | ~31 KB | 解析 + 流式 + 转换 + 渲染，全套自带 |
| towxml | ~528 KB | ~162 KB | 含 highlight.js 等大件，为 x-markdown-mini 的 4 倍+ |
| mp-html + marked | ~60 KB | ~22 KB | 仅 HTML 渲染器 + 外挂 marked，无流式引擎 |

mp-html 体积更小，但不含流式引擎与结尾补全；x-markdown-mini 的 126 KB 提供的是开箱即用的流式 Markdown 引擎。

---

## 四、结论
两个核心设计：

1. **直接转平台节点**：md → token → MiniNode，不绕 HTML，长文转换比 towxml 快 4.4×。
2. **稳定块流式引擎**：已写完的部分只解析一次，CPU 从 O(n²) 降到 O(n)。

体积仅为 towxml 的零头，可扩展，微信 / 支付宝一份代码。下一步：补齐真机评测。

> 性能数据来自 `benchmark/experiments/2026-06-26-render-parity-results.md`（Node v20）；包体积按各库实际打进小程序的运行时 JS 测得（towxml 3.0.6、mp-html 2.5.2）。
