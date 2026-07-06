---
title: 更新日志
---

# 更新日志

面向使用者的 API、构建产物与行为变化都记录在这里。迁移说明写在对应版本下，方便升级时按版本逐条核对。

> 官网 `/changelog` 时间轴由本文件生成（`docs-site/scripts/build-changelog.mjs` 解析 `## 版本`／`` `日期` ``／`- **类型**：…` 结构）。发版时在顶部新增一段即可，`npm run changelog` 可辅助从已合并 PR 拼条目。类型取 **破坏性** / **新增** / **修复** / **优化**。

## 1.0.1

`2026-07-05`

- **新增**：扩展可覆盖内置元素的渲染。扩展的 `name` 命中内置 token 类型（如 `table`、`code`）时，其 `miniRenderer` 会完全接管该 token 的渲染。此前仅 `code` 支持，现 `table` 同样可覆盖；只提供 `miniRenderer`、不提供 `tokenizer` 时解析仍走内置分词器，返回 `null` 回退到内置渲染。
- **修复**：`\[ … \]` 块级公式紧跟文本行（无空行分隔）时不被识别。`blockKatex` 缺少 `start`，该行被并入段落、`\[` `\]` 退化成转义字符；补上块级 `start` 后可正确中断段落，识别为块级公式。
- **修复**：iOS < 15.4 / 旧基础库上整包白屏。内联的 `marked` 词法器调用了 `Array.prototype.at`（`.at(-1)`），这些引擎不支持，运行时抛 `x.at is not a function`——`tsup` 只降语法不 polyfill 内建方法，`es-check` 只查语法也照不到。新增守卫式、不可枚举的 `Array/String#at` polyfill（在任何词法器代码前加载），并加 `check-bundle` 卡口防止其它未 polyfill 的运行时方法回归。
- **修复**：流式渲染时行内代码 `code` 中间出现多余空格。逐字 / 逐段入场动画会把行内代码文本拆成多个叶子 `<text>`，而每个叶子都带 `md-inline-code` 药丸的内外边距与底色，拼接后就出现了缝隙（支付宝逐字拆分最明显）。
  - 药丸盒模型（背景 / 内外边距 / 圆角）改为只画在外层整段容器上；拆出来的字符叶子改用纯等宽字体类 `md-inline-code-txt`（支付宝 `<text>` 不继承 font-family，字体必须留在叶子）。微信、支付宝两端一并修复。

## 1.0.0

`2026-07-03`

- **破坏性**：`XMarkdownMiniOptions` 重整。`lexerOptions` / 顶层 `extensions` / `plugins` 三个字段合并为单一的 `options: { gfm?, breaks?, extensions? }`，同步移除 `Plugin` 类型导出。
  - 迁移：`{ extensions: [...] }` → `{ options: { extensions: [...] } }`；`{ plugins: [Latex(), CodeHighlight()] }` → `{ options: { extensions: [Latex(), CodeHighlight()] } }`；`{ lexerOptions: { gfm } }` → `{ options: { gfm } }`。
- **破坏性**：内置组件 `<markdown />` 的 `plugins` prop 改名 `extensions`。
- **新增**：`MarkedConfig` 类型导出，统一描述构造器的 marked 配置块。
- **新增**：内置 `marked` lexer 并在构建时打进产物；整库 ESM 约 103KB / gzip 约 25KB。
- **新增**：流式增量解析——已稳定块缓存为 `stableNodes`，仅 tail 重新 lex。
- **新增**：微信 / 支付宝 `PlatformRenderer`，暴露平台能力与 token 到节点的转换入口。
- **新增**：`XMarkdownExtension` 接口，把 tokenizer 与 `miniRenderer` 写在同一个对象上；保留 `tokenRenderers` 作为 fallback。
- **修复**：动画类合并 bug——开启 `animation` 时块级节点不再丢失语义 class。
- **优化**：`chunkDelay = charDelay = 0` 时跳过 setTimeout 链，同步推回。
- **优化**：`<b>` / `<i>` 改为语义化 `<strong>` / `<em>`。
