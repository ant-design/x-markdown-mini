---
title: Changelog
order: 3
nav:
  title: Docs
  order: 4
group:
  title: 参考
  order: 4
---

# Changelog

记录面向使用者的 API、构建产物和行为变化。迁移说明优先写在对应版本下，方便升级时直接按版本核对。

## 引入

```bash
npm install @ant-design/x-markdown-mini@latest
```

## 代码示例

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex(), CodeHighlight()],
});
```

## 1.0.0

- **Breaking**：`XMarkdownMiniOptions` 重整。`lexerOptions` / 顶层 `extensions` / `plugins` 三个字段合并为单一的 `options: { gfm?, breaks?, extensions? }`；同步移除 `Plugin` 类型导出。
  - 迁移：`{ extensions: [...] }` → `{ options: { extensions: [...] } }`；`{ plugins: [Latex(), CodeHighlight()] }` → `{ options: { extensions: [Latex(), CodeHighlight()] } }`；`{ lexerOptions: { gfm } }` → `{ options: { gfm } }`。
- **Breaking**：内置组件 `<markdown />` 的 `plugins` prop 改名 `extensions`。
- **新增**：`MarkedConfig` 类型导出，统一描述构造器的 marked 配置块。
- **新增**：内置 `marked` lexer，并在构建时打进产物。整库 ESM 约 103KB / gzip 约 25KB。
- **新增**：流式增量解析 —— 已稳定块缓存为 `stableNodes`，仅 tail 重 lex。
- **新增**：微信 / 支付宝 `PlatformRenderer`，暴露平台能力与 token 到节点的转换入口。
- **新增**：`XMarkdownExtension` 接口，把 tokenizer 与 `miniRenderer` 写在同一个对象上；保留 `tokenRenderers` 作为 fallback。
- **修复**：动画类合并 bug —— 开启 `animation` 时块级节点不再丢失语义 class。
- **优化**：`chunkDelay = charDelay = 0` 时跳过 setTimeout 链，同步推回。
- **优化**：`<b>/<i>` 改为语义化 `<strong>/<em>`。
