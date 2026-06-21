# examples · 真实 npm 接入示例

`examples/alipay` 与 `examples/wechat` 是两个独立的小程序工程，**完全以真实用户场景消费已发布的
npm 包** `@ant-design/x-markdown-mini`，不内置本仓库的 `dist/` 拷贝、不做任何魔改。

> 不要手改任何安装产物：`node_modules/@ant-design/x-markdown-mini/**`、`wechat/miniprogram_npm/**`。
> 渲染有问题就改库、重新发布、再升级依赖——不要在示例里打补丁。详见 `examples/CLAUDE.md`。

## 三个页面 · 两种接入方式

两端页面完全一致，便于左右对照：

| 页面 | 接入方式 | 说明 |
| --- | --- | --- |
| `pages/home` | — | 首页，跳转到两种接入示例 |
| `pages/component` | **组件接入** | 一行 `usingComponents` 引入 `markdown` 组件：`<markdown content latex highlight />`。页面无需 `require` 插件、无需 `@import` 样式。接入成本最低。 |
| `pages/js` | **JS 接入** | 页面自己 `require` 核心 + 插件，`new XMarkdownMini({...})` → `renderNodes()` 直出节点，交给底层 `<mini-node-renderer>` 渲染。多了显式装配，换来对实例/扩展的完全控制；样式需自行 `@import`（见 `js.acss` / `js.wxss`）。 |

`pages/sample.js` 是两个示例页共享的同一份 Markdown 内容（标题 / 列表 / 表格 / 行内代码 / 代码高亮 /
行内 + 块级 LaTeX / 引用），组件接入与 JS 接入渲染**同一份内容**，可直接对照结果是否一致。

接入要点（两端一致）：每个视图独立一个 `XMarkdownMini` 实例（流式状态不共享）；`escapeText: false`
（`<mini-node-renderer>` 的 `<text>{{value}}</text>` 不解码实体）；`setData` 前先
`flattenInlineNodes(nodes)`（小程序 `<text>` 不能嵌套自定义组件）。

## 引用路径：两端不同，是 IDE 的 npm 解析差异，不是可选项

| 平台 | 解析方式 | 引用前缀 | 示例 |
| --- | --- | --- | --- |
| 支付宝 | 直接读 `node_modules` 包根，**不认 `package.json#exports`**，子路径必须指向真实文件 | **必须带 `dist/`** | `@ant-design/x-markdown-mini/dist/es/Markdown/index`、`.../dist/index.js`、`.../dist/plugins/Latex/index.js` |
| 微信 | 用 `package.json#miniprogram`（→ `dist/miniprogram_dist`）作包根，「构建 npm」落到 `miniprogram_npm/` | **无 `dist/`** | `@ant-design/x-markdown-mini/es/Markdown/index`、`.../index.js`、`.../plugins/Latex/index.js` |

支付宝下若写成裸 `es/Markdown/index` 会报 `CE1000.01: cannot resolve module`——支付宝始终需要
显式的 `dist/` 段。

## 在开发者工具里运行

本目录没有 build / lint / test，示例是直接在各自 IDE 里打开的工程：

```bash
cd examples/alipay && npm install   # 之后用支付宝开发者工具打开 examples/alipay（直接读 node_modules）
cd examples/wechat && npm install   # 之后用微信开发者工具打开 examples/wechat → 工具 → 构建 npm
```

- **支付宝**：`mini.project.json` 已设 `compileOptions.transpile: {}`——发布的 `dist/` 是 ES2018
  （含对象展开 / `class`），IDE 需转译。改完依赖直接重新编译即可（无独立 npm 构建步骤）。
- **微信**：`npm install` 或依赖变更后，在 IDE 里执行 **工具 → 构建 npm** 重新生成 `miniprogram_npm/`。
  该产物即微信的导入包根，按构建产物对待，**不要手改**。
