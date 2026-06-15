# 设计：代码块 / 表格可定制 Header（含复制按钮）

- 日期：2026-06-15
- 范围：`x-markdown-mini` 库本身（渲染器 + 双平台组件 + 选项 API），不涉及文档站
- 状态：已确认设计，待写实现计划

## 背景与现状

`x-markdown-mini` 把 markdown 渲染为 `MiniNode[]`，再由 shipped 的 `MiniNodeRenderer` 组件渲染为小程序原生节点。

经核对，shipped 组件**已经**默认给代码块和表格渲染了 header 栏 + 复制按钮，但这些 header 是**写死在组件模板里**的（`src/components/wechat/MiniNodeRenderer/index.wxml` 与 `src/components/alipay/MiniNodeRenderer/index.axml` 的 `pre` / `table` 分支）：

- 代码块：`.md-codeblock-bar` = 语言标签（`u.langOf(node) || 'code'`）+ 复制图标（`_copyCode` → `collectText` → 剪贴板）。
- 表格：`.md-tableblock-bar` = 硬编码标题“表格” + 复制图标（`_copyTable` → `collectTableText` 产 **TSV** → 剪贴板）。

复制图标用的是远程 PNG：`https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original`。

## 目标

1. 代码块与表格默认就有 header 栏（保持现状的默认开）。
2. header 上有复制按钮。
3. **支持自定义 header**——通过选项传入渲染函数。
4. 表格复制内容由 TSV 改为 **Markdown 源**。
5. header 支持**关闭**（选项可控）。

## 关键决策（已与用户确认）

| 决策点 | 结论 |
|---|---|
| 改动对象 | 改库本身（渲染器 + 组件），默认开 |
| 自定义方式 | 选项里传渲染函数 |
| 架构 | **A 全数据驱动**：渲染器把整条 bar 作为 MiniNode 产出；组件模板不再写死 bar，只通用渲染节点 + 给 `copy-button` 节点绑 tap |
| 代码复制内容 | `token.text`（原始代码文本） |
| 表格复制内容 | `token.raw`（Markdown 源） |
| 代码默认标题 | 语言名（无语言时 `'code'`） |
| 表格默认标题 | `'表格'`（其他语言靠自定义函数；不引入 locale 系统，YAGNI） |
| 复制图标 | 保留现有远程 PNG，归组件模板管 |
| per-call 覆盖 | 不做，仅构造级选项（与 `extensions`/`components` 一致） |

## 设计

### 1. 选项 API（构造级）

```ts
interface XMarkdownMiniOptions {
  // …现有字段…
  /** 代码块 header。true=默认（语言名+复制按钮）；false=无；函数=自定义。默认 true。 */
  codeBlock?: { header?: boolean | CodeHeaderRenderer };
  /** 表格 header。true=默认（“表格”+复制按钮）；false=无；函数=自定义。默认 true。 */
  table?: { header?: boolean | TableHeaderRenderer };
}

interface CodeHeaderContext {
  lang: string;          // 解析后的语言（无则 ''）
  text: string;          // 原始代码文本（复制载荷）
  token: Tokens.Code;
}
interface TableHeaderContext {
  markdown: string;      // 表格的 markdown 源（复制载荷）
  token: Tokens.Table;
}
type CodeHeaderRenderer  = (ctx: CodeHeaderContext)  => MiniNode | MiniNode[] | null;
type TableHeaderRenderer = (ctx: TableHeaderContext) => MiniNode | MiniNode[] | null;
```

返回 `null` 或 `[]` 等价于「该块无 header」。

导出帮助函数，供自定义 header 作者拼复制按钮：

```ts
/** 构造一个复制按钮节点；组件会识别 `copy-button` 并绑定复制行为。 */
export function copyButton(text: string): MiniNode;
// → { name: 'copy-button', attrs: { 'data-copy': text, class: 'md-copy-icon' } }
```

### 2. 节点结构

`MiniNode` 新增可选字段：

```ts
interface MiniNode {
  name: string;
  attrs?: MiniNodeAttrs;
  children?: MiniNode[];
  animate?: boolean;
  header?: MiniNode[];   // 新增：代码块/表格的 header 栏内容
}
```

渲染器 `case 'code'` 产出：

```jsonc
{
  "name": "pre",
  "attrs": { "class": "md-code-block", "lang": "ts" },
  "header": [
    { "name": "text", "attrs": { "class": "md-codeblock-lang", "value": "ts" } },
    { "name": "copy-button", "attrs": { "data-copy": "<原始代码文本>", "class": "md-copy-icon" } }
  ],
  "children": [ /* code 正文节点 */ ]
}
```

渲染器 `case 'table'` 产出：

```jsonc
{
  "name": "table",
  "attrs": { "class": "md-table" },
  "header": [
    { "name": "text", "attrs": { "class": "md-tableblock-title", "value": "表格" } },
    { "name": "copy-button", "attrs": { "data-copy": "<表格 markdown 源>", "class": "md-copy-icon" } }
  ],
  "children": [ /* headerRow + rowNodes（与现状一致） */ ]
}
```

`header` 决策逻辑（在 `miniNodeRenderer.ts` 内的小辅助函数）：

- `cfg === false` → 不产出 `header`。
- `typeof cfg === 'function'` → 调用它，结果规整为数组（`null`→省略）。
- 否则（`true`/`undefined`）→ 内置默认 header。

代码无语言时，默认语言标签文案为 `'code'`（与现状模板的 `|| 'code'` 对齐）。

### 3. 组件改造（wechat 与 alipay 同步）

模板 `isPre` / `isTable` 分支不再写死 bar：

```html
<!-- pre 伪代码 -->
<view class="md-codeblock {{node.animate ? 'md-animate-block' : ''}}">
  <view wx:if="{{node.header}}" class="md-codeblock-bar">
    <mini-node-renderer nodes="{{node.header}}" selectable="{{selectable}}"
      animation="{{false}}" slotComponents="{{slotComponents}}"
      generic:custom-slot="custom-slot" bind:tap="_tap" bind:appear="_appear" />
  </view>
  <scroll-view scroll-x class="md-code-block">
    <mini-node-renderer wx:if="{{node.children}}" nodes="{{node.children}}" … />
  </scroll-view>
</view>
```

`table` 同理（`md-tableblock` / `md-tableblock-bar` / `md-table-scroll`）。

新增 `copy-button` 分支（放在通用 `view`/`text` 分支之前）：

```html
<image
  wx:elif="{{u.isCopy(node.name)}}"
  class="{{u.classOf(node) || 'md-copy-icon'}}"
  src="https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original"
  data-copy="{{u.copyOf(node)}}"
  catch:tap="_copy"
/>
```

wxs/sjs 新增：

```js
function isCopy(name) { return name === 'copy-button'; }
function copyOf(node) { return (node.attrs || {})['data-copy'] || ''; }
```

组件 TS：

- 新增 `_copy(e)`：`copyToClipboard(e.currentTarget.dataset.copy)`。
- 删除 `_copyCode` / `_copyTable` / `collectText` / `collectTableText`（载荷已随数据携带，无需在组件里重算）。
- 保留 `copyToClipboard`（含成功/失败 toast，文案保持中文）。

alipay 版用 `catchTap` / `my.setClipboard`（与现状一致），其余对称。

### 4. 数据流

`RenderContext` 新增：

```ts
interface RenderContext {
  // …现有字段…
  codeHeader?: boolean | CodeHeaderRenderer;
  tableHeader?: boolean | TableHeaderRenderer;
}
```

`src/index.ts` 在为 `renderNodes` 构建 ctx 时，从实例选项解析：`ctx.codeHeader = options.codeBlock?.header`，`ctx.tableHeader = options.table?.header`（`undefined` 即默认 `true` 行为）。`miniNodeRenderer` 读取这两个字段。

### 5. 边界与交互

- **flattenInline**：header 里的语言/标题标签是标准的 `text > text` 内联结构，照常处理；`copy-button` 是叶子节点，不参与内联扁平化。
- **streaming**：尾块每 tick 重新生成，header 一并重建，无状态问题。
- **escapeText**：`data-copy` 是纯文本载荷，复制即原样写剪贴板，不做转义。
- **payload 重复**：代码块的 `data-copy` 会与正文文本各存一份（代码块通常不大，可接受）。

## 影响面

- `src/types.ts`：`MiniNode.header`；新增 header 选项与函数类型；`XMarkdownMiniOptions.codeBlock`/`table`；`RenderContext.codeHeader`/`tableHeader`。
- `src/index.ts`：把选项解析进 ctx；导出 `copyButton` 帮助函数（及新类型）。
- `src/platforms/shared/miniNodeRenderer.ts`：`case 'code'` / `case 'table'` 构建 `header`；内置默认 header 与决策辅助。
- 组件（各 4 文件 × 2 平台）：`.wxml`/`.axml`、`.wxs`/`.sjs`、`.ts`、（`.wxss`/`.acss` 复用现有 `.md-codeblock-bar`/`.md-tableblock-bar` 样式，基本无需改）。
- 测试：更新 `tokensToWechat`/`tokensToAlipay` 中 pre/table 结构断言（现含 `header`）；新增用例覆盖 header 开/关/自定义、代码复制载荷=原文、表格复制载荷=markdown 源、`copyButton` 帮助函数。
- `scripts/check-bundle.mjs` 体积预算：如默认 header 使体积越界则同步上调并在 commit 说明。
- docs-site：组件文档补一节「代码块/表格 header 与自定义」。

## 行为变更说明（破坏性提示）

`renderNodes` 默认会在 `pre`/`table` 节点上多出 `header` 字段。使用 shipped 组件的消费者无感（行为与现状一致，只是 header 来源从模板变成数据）。**自渲染**消费者（不用 shipped 组件、自己遍历 MiniNode）会新看到 `header` 节点——可用 `codeBlock:{header:false}` / `table:{header:false}` 关闭。

## 验收标准

1. 默认（无选项）：代码块 header = 语言名 + 复制按钮；表格 header = “表格” + 复制按钮，与现状视觉一致。
2. 代码复制 = 原始代码文本；表格复制 = 原始 markdown 表格源。
3. `codeBlock:{header:false}` / `table:{header:false}` → 对应块无 header。
4. 传入自定义函数 → header 用函数返回的节点；含 `copyButton(payload)` 时点击可复制。
5. 双平台（wechat/alipay）行为一致；`npm test` / `npm run lint` / `npm run check:bundle` 通过。
