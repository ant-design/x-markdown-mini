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

- **新增**：自带迷你 lexer，移除 `marked` 运行时依赖。整库 ESM ~30KB / gzip ~7.8KB。
- **新增**：流式增量解析 —— 已稳定块缓存为 `stableNodes`，仅 tail 重 lex。
- **新增**：能力矩阵驱动的统一适配器 `adaptNodes`；八端适配器收敛为薄壳。
- **新增**：`PlatformAdapterConfig` 与 `PLATFORM_CAPABILITIES` 导出，便于自定义平台。
- **修复**：动画类合并 bug —— 开启 `animation` 时块级节点不再丢失语义 class。
- **优化**：`chunkDelay = charDelay = 0` 时跳过 setTimeout 链，同步推回。
- **优化**：`<b>/<i>` 改为语义化 `<strong>/<em>`。
