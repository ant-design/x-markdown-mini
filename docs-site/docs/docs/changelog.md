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

## 0.1.0 _（未发布）_

- **新增**：内置 `marked` lexer，并在构建时打进产物。整库 ESM 约 103KB / gzip 约 25KB。
- **新增**：流式增量解析 —— 已稳定块缓存为 `stableNodes`，仅 tail 重 lex。
- **新增**：微信 / 支付宝 `PlatformRenderer`，暴露平台能力与 token 到节点的转换入口。
- **新增**：`tokenRenderers`，让 marked 自定义 token 可以进入小程序节点渲染链路。
- **修复**：动画类合并 bug —— 开启 `animation` 时块级节点不再丢失语义 class。
- **优化**：`chunkDelay = charDelay = 0` 时跳过 setTimeout 链，同步推回。
- **优化**：`<b>/<i>` 改为语义化 `<strong>/<em>`。
