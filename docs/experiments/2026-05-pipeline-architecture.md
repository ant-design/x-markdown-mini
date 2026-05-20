# 实验：管线架构 A/B/C 三方对比

**日期**：2026-05-19（实验）→ 2026-05-20（后续简化）
**结论**：采用方案 C（per-platform 直产 transformer），放弃 UnifiedNode + adapter 两层结构
**作者归档此文档目的**：保留实验过程、参数、原始数据，方便日后回看决策依据

## 后续简化（2026-05-20）

C 改造完成后注意到 `tokensToUnified`（B 方案的产物，作为 `adapt:false` 路径保留）实际上没必要：

- 仓库内的 wechat / alipay 自渲染组件原本走 `adapt:false`，但它们的 wxml/axml 模板**按 `node.name` 派发**，不读 `node.attrs.href` 等平台特化字段——所以喂给它们 `tokensToWechat`/`tokensToAlipay` 的产物**渲染效果完全一样**。
- 无外部消费方依赖 `UnifiedNode` 作为"平台中立"产物（branch 仍在 `feature/initial-rewrite`，未发布）。
- 保留 `tokensToUnified` 意味着 ~254 行重复语义映射、~9KB bundle 体积、第三方 transformer 需要同步维护。

于是删掉了 `tokensToUnified` + `runPipeline` + `XMarkdownMini.adapt` flag。`flattenInline` 里补了 `md-del` / `md-inline-code` 的 TAG_CLASS 映射（之前是依赖 IR 层带过来）。

变化：
- bundle：89.91 KB → **80.97 KB**（−9 KB raw，gzip 20.04 → 19.5 KB 量级）
- 文件：少 `src/core/tokensToUnified.ts`、`src/pipeline.ts`、`src/__tests__/{tokensToUnified,pipeline}.test.ts`
- 公共 API：去掉 `tokensToUnified`、`runPipeline`、`XMarkdownMiniOptions.adapt`
- 组件：`new XMarkdownMini({ adapt: false, escapeText: false })` → `new XMarkdownMini({ escapeText: false })`

如果未来要为 SSR / 第三方渲染目标提供"平台中立"产物，可以再加回一个 `tokensToUnified`——但在没明确需求前，三个 transformer 并存只是给自己加维护负担。

---

## 背景

仓库当时的渲染管线是 4 步：

```
markdown string
  → parse (marked.Lexer.lex + 重命名为 IR 形状)        [src/core/lexer.ts]
  → IR tree                                            [{ t, a, c, raw } shape]
  → irToUnifiedNodes (IR → hast 形状的统一节点)        [src/core/irToUnifiedNodes.ts]
  → UnifiedNode[]                                      [{ name, attrs, children, animate }]
  → adaptToPlatform (按 capability 矩阵做平台降级)     [src/adapters/adapt.ts]
  → 平台节点
```

讨论中提出三种可能的简化方向：

- **A**：维持现状（参考基线）
- **B**：合并 IR 层——`marked tokens` 一遍直接到 `UnifiedNode`，**保留** UnifiedNode 和 adapter
- **C**：per-platform 直产——`marked tokens` 一遍直接到平台节点，**砍掉** UnifiedNode 和 adapter，各平台一个独立 transformer

架构推理上看 C 的代价是"通用语义映射逻辑会在 N 个平台 transformer 里重复"。但是否值得，需要数据说话。

## 实验设计

### 三个版本的实现

| 方案 | 实现路径 | 实验文件 |
|---|---|---|
| A | `runPipeline(content) + adaptToPlatform(_, target)` | 现网代码 |
| B | `tokensToUnified(content) + adaptToPlatform(_, target)` | `_experiment/tokensToUnified.ts`（254 行）|
| C | `tokensToWechat(content)` / `tokensToAlipay(content)` 直产 | `_experiment/tokensToWechat.ts`（248 行）+ `tokensToAlipay.ts`（246 行）|

C 的两个文件**完全独立**，没有共享 helper。所有 escape、joinClass、make-block、inline 行走逻辑都各写一遍。

### 正确性验证

要求三种实现产生的最终平台节点 **逐字节相同**，否则 perf 数字不可比。

- B vs A：跑 `runPipeline(content)` 和 `tokensToUnified(content)` 在全部语料上 `JSON.stringify` 后字符比对。
- C vs A：跑 `adaptToPlatform(runPipeline(content), target)` 和 `tokensTo<Target>(content)` 字符比对，wechat + alipay 两个目标都验。

验证脚本：`_experiment/verify.mjs`（已删，迁移完成后无意义）。

### 性能 bench

工具：tinybench
配置：
- `time: 1000` ms 单 scenario
- `warmupIterations: 100`
- 顺序执行（避免 CPU 竞争）
- 测的是"从 markdown string 到最终平台节点"完整路径

语料：仓库 `benchmark/samples/` 全部 28 个样本
- 27 个 markdown-it 自带微样本（block-*.md / inline-*.md / lorem1.txt / rawtabs.md）
- 1 个长 AI chat 对话（streaming/ai-chat-long.md，约 225 行）

每个样本 × 2 平台目标 × 3 方案 = 168 个 task。

bench 脚本：`_experiment/bench-abc.mjs`（已删）。

## 原始数据

### 正确性

| 验证项 | 结果 |
|---|---|
| B 输出 ≡ A 输出（在 UnifiedNode 层比较） | 28/28 字节相同 |
| C wechat ≡ adaptToPlatform(A, 'wechat') | 28/28 字节相同 |
| C alipay ≡ adaptToPlatform(A, 'alipay') | 28/28 字节相同 |

### 性能（运行环境：Darwin 25.4.0，Node v20.19.5）

**Wechat 目标**：

```
sample                               A hz         B hz         C hz     B−A%     C−A%     C−B%
--------------------------------------------------------------------------------------------
block-bq-flat.md                    74598        73178        72566    -1.9%    -2.7%    -0.8%
block-bq-nested.md                   7322         7620         8360    +4.1%   +14.2%    +9.7%
block-code.md                      468146       476247       600103    +1.7%   +28.2%   +26.0%
block-fences.md                    742107       732205      1033579    -1.3%   +39.3%   +41.2%
block-heading.md                    79612        86914       108886    +9.2%   +36.8%   +25.3%
block-hr.md                         68841        66677        73456    -3.1%    +6.7%   +10.2%
block-html.md                       92871        95644       124519    +3.0%   +34.1%   +30.2%
block-lheading.md                  166516       171605       195811    +3.1%   +17.6%   +14.1%
block-list-flat.md                   8622         6587         9176   -23.6%    +6.4%   +39.3%
block-list-nested.md                 5745         6198         7430    +7.9%   +29.3%   +19.9%
block-ref-flat.md                   19911        20603        22640    +3.5%   +13.7%    +9.9%
block-ref-list.md                   22898        22774        22539    -0.5%    -1.6%    -1.0%
block-ref-nested.md                 19423        19657        22096    +1.2%   +13.8%   +12.4%
block-tables.md                     21353        22137        27704    +3.7%   +29.7%   +25.1%
inline-autolink.md                  33259        33631        41066    +1.1%   +23.5%   +22.1%
inline-backticks.md                109365       111658       142254    +2.1%   +30.1%   +27.4%
inline-em-flat.md                   32166        32965        38712    +2.5%   +20.4%   +17.4%
inline-em-nested.md                 29106        30137        34108    +3.5%   +17.2%   +13.2%
inline-em-worst.md                  17004        17005        17273    +0.0%    +1.6%    +1.6%
inline-entity.md                    67475        69351        78402    +2.8%   +16.2%   +13.0%
inline-escape.md                    24340        24419        30254    +0.3%   +24.3%   +23.9%
inline-html.md                      22240        22300        26096    +0.3%   +17.3%   +17.0%
inline-links-flat.md                17279        17447        19894    +1.0%   +15.1%   +14.0%
inline-links-nested.md              13160        13386        13907    +1.7%    +5.7%    +3.9%
inline-newlines.md                  67889        69204        80615    +1.9%   +18.7%   +16.5%
lorem1.txt                           9549         9904        10134    +3.7%    +6.1%    +2.3%
rawtabs.md                          82265        84114        94952    +2.2%   +15.4%   +12.9%
ai-chat-long.md                      2721         2831         3192    +4.0%   +17.3%   +12.8%
--------------------------------------------------------------------------------------------
median:  B−A=+2.10%   C−A=+17.31%   C−B=+14.11%
mean:    B−A=+1.21%   C−A=+17.66%   C−B=+16.41%
```

**Alipay 目标**：

```
sample                               A hz         B hz         C hz     B−A%     C−A%     C−B%
--------------------------------------------------------------------------------------------
block-bq-flat.md                    71681        74509        86125    +3.9%   +20.2%   +15.6%
block-bq-nested.md                   8251         8256         8317    +0.1%    +0.8%    +0.7%
block-code.md                      464432       462295       593536    -0.5%   +27.8%   +28.4%
block-fences.md                    737238       748572      1035220    +1.5%   +40.4%   +38.3%
block-heading.md                    84991        86797       109003    +2.1%   +28.3%   +25.6%
block-hr.md                         68764        67974        71896    -1.1%    +4.6%    +5.8%
block-html.md                       96242        97719       123849    +1.5%   +28.7%   +26.7%
block-lheading.md                  167390       170683       196809    +2.0%   +17.6%   +15.3%
block-list-flat.md                   7188         4618         7550   -35.8%    +5.0%   +63.5%
block-list-nested.md                 6467         6966         6893    +7.7%    +6.6%    -1.1%
block-ref-flat.md                   20673        21479        23450    +3.9%   +13.4%    +9.2%
block-ref-list.md                   22183        23235        23790    +4.7%    +7.2%    +2.4%
block-ref-nested.md                 19833        19843        21831    +0.1%   +10.1%   +10.0%
block-tables.md                     21657        21421        27842    -1.1%   +28.6%   +30.0%
inline-autolink.md                  34279        35016        40944    +2.1%   +19.4%   +16.9%
inline-backticks.md                109519       111621       142492    +1.9%   +30.1%   +27.7%
inline-em-flat.md                   31955        33095        38261    +3.6%   +19.7%   +15.6%
inline-em-nested.md                 29796        30363        34369    +1.9%   +15.3%   +13.2%
inline-em-worst.md                  16829        17069        16981    +1.4%    +0.9%    -0.5%
inline-entity.md                    67971        69638        78965    +2.5%   +16.2%   +13.4%
inline-escape.md                    24078        24487        29350    +1.7%   +21.9%   +19.9%
inline-html.md                      22344        22854        26707    +2.3%   +19.5%   +16.9%
inline-links-flat.md                17477        17415        19380    -0.4%   +10.9%   +11.3%
inline-links-nested.md              13296        13428        13842    +1.0%    +4.1%    +3.1%
inline-newlines.md                  67620        69197        80157    +2.3%   +18.5%   +15.8%
lorem1.txt                           9758         9975        10264    +2.2%    +5.2%    +2.9%
rawtabs.md                          81399        83730        96426    +2.9%   +18.5%   +15.2%
ai-chat-long.md                      2719         2813         3207    +3.4%   +17.9%   +14.0%
--------------------------------------------------------------------------------------------
median:  B−A=+1.97%   C−A=+17.92%   C−B=+15.31%
mean:    B−A=+0.64%   C−A=+16.34%   C−B=+16.27%
```

### 代码量

| 方案 | 文件 | 行数 |
|---|---|---|
| A 当前 | lexer.ts (198) + irToUnifiedNodes.ts (202) + adapt.ts (135) + capabilities.ts (57) | **592** |
| B 合并 IR | tokensToUnified.ts (254) + adapt.ts (135) + capabilities.ts (57) | **446** |
| C per-platform | tokensToWechat.ts (248) + tokensToAlipay.ts (246) | **494** |

C 在两个 transformer 文件之间的 `diff` 输出 52 行，其中**真正语义层面的平台差异只有约 12 行**：
- `<ol start>`：wechat 保留，alipay 丢
- `<a href>`：wechat 改写成 `data-href` + 加 `class='md-link'`，alipay 保留 `href`
- `<img src>`：alipay 强制 https，wechat 不改

剩下 ~230 行（heading 分发、list 拍平、table 重组、inline 行走、escape 等通用语义映射）**两个文件逐字节相同**。

## 结论与决策

### 为什么 C 比 B/A 快这么多

B 相对 A 只省了 IR→UnifiedNode 一次浅遍历，预期收益 ~1-2%，实测 +1.2~2.1%，吻合。

C 相对 B 额外省了 **adaptToPlatform 一整遍树遍历**——adapter 要走全树、给每个节点重新创建 attrs 对象、做 `classMode` / `rewriteAnchorHref` / `caps` 判断。C 把这些决策**编进生成代码里直接产出平台节点**，没有第二次遍历，没有第二次对象分配。所以 C-B 还有 +14~16% 的差距。

### 决策

**采用 C**。理由按权重：

1. **+17% 是真实可用的提升**——尤其在流式 AI 对话场景，setData 每个 tick 都跑一遍完整管线，累计收益显著。
2. **平台数量稳定在 2 个**——本仓库就是 wechat + alipay，加平台的频率极低。C 的"复制一个 transformer 文件"代价可以接受。
3. **概念层数减少**——从 4 步管线变成 1 步直产，少一个抽象（UnifiedNode 中间产物）。
4. **adapter 不再是独立维护点**——`PLATFORM_CAPABILITIES` 这张能力矩阵、`adaptNodes`、`downgradeWrapper` / `flattenTable` 这些都消失。两个平台 transformer 各自负责自己的最终形态。
5. **流式缓存照常工作**——`StreamingProcessor` 每个实例只服务一个平台，缓存平台节点跟缓存 UnifiedNode 一样有效。

### 接受的代价

1. **代码重复 ~230 行 × 2 = ~460 行的通用语义映射**。改 heading 分发逻辑、改 escape 行为、改 tight list 拍平规则等，需要在两个文件里同步修改。
2. **加平台需要复制 ~245 行文件、改 ~12 行平台差异**，而不是给 caps 矩阵加一行。
3. **失去 "UnifiedNode 作为对外契约"**——但本仓库目前没有外部消费方依赖这层。`tokensToUnified` 仍保留作为 `adapt:false` 路径（自渲染组件消费），但不再是平台输出的中间产物。

### 不该这么做的反例（什么场景下应该选 B）

- 平台数 > 3 且经常加新平台
- 平台能力差异频繁变化、需要矩阵化管理
- 有第三方消费方依赖 UnifiedNode 作为公开 schema

仓库现状均不满足上述任一条，所以 C 在这里是最优解。

## 复现

实验时的临时文件（`_experiment/`）已合并/删除。要复现实验：

1. 把 `tokensToUnified.ts` / `tokensToWechat.ts` / `tokensToAlipay.ts` 三个 transformer 抽到一个独立目录
2. 写 verify 脚本：对每个语料跑 `JSON.stringify(transformer(content))` 和 `JSON.stringify(adaptToPlatform(runPipeline(content), target))` 比对
3. 写 bench 脚本：`tinybench.add('A-wechat/...', () => adaptToPlatform(runPipeline(content), 'wechat'))` 等
4. `npx tsx` 跑

实验代码可在 git 历史里找到（commit hash 见与本文档同 PR 的实验 commit）。
