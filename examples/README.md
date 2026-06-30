# examples · 本地 dist 接入示例

`examples/alipay` 与 `examples/wechat` 是两个独立的小程序工程，通过
`"@ant-design/x-markdown-mini": "file:../../dist"` 消费仓库根目录构建出的本地 `dist/` 包。
这让真机/IDE 调试能直接验证当前源码构建结果，不必先发布 beta 包。

> 不要手改任何安装产物：`node_modules/@ant-design/x-markdown-mini/**`、`wechat/miniprogram_npm/**`。
> 渲染有问题就改库、`npm run build`、再在示例里重新安装/构建 npm——不要在示例里打补丁。
> 详见 `examples/CLAUDE.md`。

## 四个页面 · 两种接入方式 + 性能对比

两端页面完全一致，便于左右对照：

| 页面 | 接入方式 | 说明 |
| --- | --- | --- |
| `pages/home` | — | 首页，跳转到两种接入示例 |
| `pages/component` | **组件接入** | 一行 `usingComponents` 引入 `markdown` 组件：`<markdown content latex highlight />`。页面无需 `require` 插件、无需 `@import` 样式。接入成本最低。 |
| `pages/js` | **JS 接入** | 页面自己 `require` 核心 + 插件，`new XMarkdownMini({...})` → `renderNodes()` 直出节点，交给底层 `<mini-node-renderer>` 渲染。多了显式装配，换来对实例/扩展的完全控制；样式需自行 `@import`（见 `js.acss` / `js.wxss`）。 |
| `pages/benchmark` | **性能对比** | 在当前开发者工具内执行两类基准：纯 JS 吞吐率，以及单渲染器真实流式 `setData` + 组件渲染。微信对照 `towxml`、`mp-html markdown`、`marked + rich-text`，支付宝对照 `mp-html markdown`、`marked + rich-text`。 |

`examples/sample.js` 是微信和支付宝的唯一 Markdown 内容源（标题 / 长段落 / 列表 / 表格 / 行内代码 /
代码高亮 / 行内 + 块级 LaTeX / 引用）。修改后在仓库根目录运行 `npm run sync:examples`，脚本会生成
两端各自的 `pages/sample.js`；`npm run check:examples` 会阻止副本与共享源发生漂移。组件接入与 JS
接入渲染**同一份内容**，可直接对照结果是否一致。

接入要点（两端一致）：每个视图独立一个 `XMarkdownMini` 实例（流式状态不共享）；`escapeText: false`
（`<mini-node-renderer>` 的 `<text>{{value}}</text>` 不解码实体）；`setData` 前先
`flattenInlineNodes(nodes)`（小程序 `<text>` 不能嵌套自定义组件）。

## 引用路径：两端一致，均无 `dist/`

本地 `file:../../dist` 依赖等价于发布时的 **「`dist/` 内容即包根」**（`npm publish ./dist`），
`es/`、`plugins/`、`shared/`、`index.js`、`miniprogram_dist/` 都在包根，故两端写法完全一致：

| 平台 | 解析方式 | 示例 |
| --- | --- | --- |
| 支付宝 | 直接读 `node_modules` 包根，**不认 `package.json#exports`**；`postinstall` 会把 `../../dist` 拷成项目内真实目录，避免 IDE 跟随 symlink 逃出项目根 | `@ant-design/x-markdown-mini/es/Markdown/index`、`.../index.js`、`.../plugins/Latex/index.js` |
| 微信 | 用 `package.json#miniprogram`（→ `miniprogram_dist`）作包根，「构建 npm」落到 `miniprogram_npm/` | `@ant-design/x-markdown-mini/es/Markdown/index`、`.../index.js`、`.../plugins/Latex/index.js` |

> 历史：旧的 `dist/` 嵌套布局（≤ `beta.3`）下支付宝必须带 `dist/` 前缀，裸 `es/Markdown/index`
> 会报 `CE1000.01: cannot resolve module`。改为 publish-from-dist 后此差异消除。若再遇到
> `CE1000.01`，先确认安装的版本包根有 `es/`（`ls node_modules/@ant-design/x-markdown-mini/es`）。

## 在开发者工具里运行

本目录没有 build / lint / test，示例是直接在各自 IDE 里打开的工程：

```bash
npm run build                    # 先在仓库根目录生成 dist
cd examples/alipay && npm install   # 之后用支付宝开发者工具打开 examples/alipay（直接读 node_modules）
cd examples/wechat && npm install   # 之后用微信开发者工具打开 examples/wechat → 工具 → 构建 npm
```

性能对比页分成两个实验：

1. **JS 吞吐率**：`x-markdown-mini` 测 `Markdown -> MiniNode[]`，`towxml` 测 `Markdown -> WXML tree`，`mp-html markdown` 测插件里的 `Markdown -> HTML`。这不是完整首屏渲染耗时，也不包含图片加载、组件排版、`setData` 传输和真实设备绘制；它用于快速定位解析/转换阶段的量级差异。
2. **真实流式渲染**：用固定 chunk 序列模拟 AI/SSE 累积输出，一次只挂载并驱动一个渲染器，方便在开发者工具性能面板里看单一方案的真实成本。`x-markdown-mini` 跑 `renderNodes({ streaming }) -> flattenInlineNodes -> setData -> MiniNodeRenderer`；`mp-html` 跑 markdown 插件转 HTML 后交给 `<mp-html>`；`marked + rich-text` 跑 marked 转 HTML 后交给原生 `<rich-text>`；微信额外跑 `towxml` 转 WXML tree 后交给 `<towxml>`。页面记录帧数、总耗时、每帧耗时、JS 转换耗时和 `setData` 回调等待。

- **支付宝**：`mini.project.json` 已设 `compileOptions.transpile: {}`——发布的代码是 ES2018
  （含对象展开 / `class`），IDE 需转译。`file:../../dist` 在 npm 里默认会生成 symlink，
  支付宝 IDE 会把 symlink 解析到项目外并报 `CE1000.01`；因此 `npm install` 的
  `postinstall` 会把本地 `dist` 同步成 `examples/alipay/node_modules/@ant-design/x-markdown-mini`
  下的实体目录。改完库后重新 `npm run build`，再在 `examples/alipay` 里跑一次 `npm install`。
- **微信**：`npm install` 或依赖变更后，在 IDE 里执行 **工具 → 构建 npm** 重新生成 `miniprogram_npm/`。
  该产物即微信的导入包根，按构建产物对待，**不要手改**。
