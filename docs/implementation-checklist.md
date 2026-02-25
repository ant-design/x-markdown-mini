# x-markdown-mini 实现 Checklist（单包版）

## 一、仓库与包结构

- [ ] 根目录即唯一包，使用一个 `package.json`（无需 `packages/` 多包）
- [ ] 安装并锁定依赖：`marked`、TypeScript 类型
- [ ] 配置 TypeScript：根目录 `tsconfig.json`（或 `tsconfig.base.json` + 引用）
- [ ] 配置 ESLint、Prettier（可选）
- [ ] 根目录 `README.md` 简要说明项目目标与架构（可引用 `docs/architecture-overview.md`）

---

## 二、类型与 Props 设计

- [ ] 在 `src/` 下定义类型文件（如 `src/types.ts`）：
  - [ ] `SemanticStreamingConfig`（delimiters、maxChunkSize、chunkDelays、charDelays）
  - [ ] `Platform`（wechat | alipay | douyin | baidu | qq | kuaishou | dingtalk | jd | other）
  - [ ] `XMarkdownMiniProps`（content、platform、hasNextChunk、streaming、animation、selectable、options、onRenderStart / onRenderProgress / onRenderComplete）
- [ ] 设计 IR 节点类型（如 `{ t, a?, c? }`，块级/行内）
- [ ] 设计统一 rich-text 节点类型（如 `{ name, attrs, children }`，与微信 nodes 对齐，小写 name/class/style）
- [ ] 在统一节点上预留动画元数据（如 `animate?: 'block' | 'text' | false`）

---

## 三、解析流水线（一次性渲染）

- [ ] **Lexer**：封装 `marked.lexer(markdown, options)`，得到 Token 树
- [ ] **tokensToIR**：实现 `src/core/tokensToIR.ts`
  - [ ] 块级：heading、paragraph、list、code、blockquote、hr 等
  - [ ] 行内：em、strong、link、code、image 等
  - [ ] 支持嵌套（列表、引用等）
- [ ] **irToUnifiedNodes**：实现 `src/core/irToUnifiedNodes.ts`
  - [ ] IR 树 → 统一 rich-text 节点数组
  - [ ] 根据 `animation` 等配置在节点上写入动画标记（至少块级）
- [ ] **一次性主入口**：实现 `src/core/index.ts` 或 `src/index.ts`
  - [ ] `content` → lexer → tokensToIR → irToUnifiedNodes → 返回统一节点
  - [ ] 调用 `onRenderStart`、`onRenderComplete`
- [ ] 为 tokensToIR、irToUnifiedNodes 写基础单元测试（常见 Markdown 用例）

---

## 四、流式增强（StreamingProcessor）

- [ ] 在 `src/streaming/` 实现 `StreamingProcessor`：
  - [ ] 状态：buffer、renderedText、pendingChunks、previousMarkdown
  - [ ] `handleContentUpdate(content)`：增量则追加 delta 到 buffer，否则 reset
  - [ ] `splitIntoChunks(hasNextChunk)`：按 delimiters + maxChunkSize 切块，`!hasNextChunk` 时把剩余 buffer 推入最后一块
  - [ ] `renderLoop`：按 chunkDelays/charDelays 推进 renderedText，每次更新调用现有「lexer → tokensToIR → irToUnifiedNodes」并触发 onRenderProgress / onPatch
  - [ ] 流结束（`!hasNextChunk && renderedText === fullContent`）时调用 onRenderComplete
- [ ] 在主入口中：`streaming === false/undefined` 走一次性路径；`streaming === true | SemanticStreamingConfig` 且配合 `hasNextChunk` 走流式路径
- [ ] 为 StreamingProcessor 写测试：语义分块、hasNextChunk 尾块、增量与重置

---

## 五、动画支持（块级为主）

- [ ] 在 `irToUnifiedNodes` 中根据配置为块打动画标记（如 `animate: 'block'`）
- [ ] 约定动画 class 名称（如 `md-animate-block`），在文档中说明推荐 keyframes/样式（由使用方在各端 CSS 中实现）

---

## 六、平台薄适配（同一包内）

- [ ] **微信** `src/adapters/wechat.ts`：统一节点 → 微信 rich-text nodes（标签白名单、属性兼容），导出如 `renderWechat(props)` 或通过统一入口 `render(..., { platform: 'wechat' })`
- [ ] **支付宝** `src/adapters/alipay.ts`：统一节点 → 支付宝 rich-text 结构（array、Pascal/line-space 等）
- [ ] **抖音** `src/adapters/douyin.ts`：与微信类似，处理抖音扩展（如 video）
- [ ] **其他端** `src/adapters/other.ts`：百度/QQ/快手/钉钉等，白名单微调；若无 rich-text，输出统一节点供通用递归组件使用

---

## 七、通用递归组件（无 rich-text 端 / 可选）

- [ ] 在 `src/recursive/` 或 `src/adapters/` 下提供基于统一节点的递归渲染逻辑（view/text），便于无 rich-text 端使用
- [ ] 若有文本级动画需求，可在此实现「animation-text」式组件逻辑（按 chunkList 逐段淡入），并在文档中说明用法与样式约定

---

## 八、对外 API 与入口

- [ ] 主入口（如 `src/index.ts`）统一导出：
  - [ ] `render(props: XMarkdownMiniProps)`，内部按 `platform` 选适配器；或
  - [ ] `renderWechat` / `renderAlipay` / `renderDouyin` / `renderOther` + 通用 `render`
- [ ] 在 `package.json` 中配置 `main`/`module`/`types` 指向编译后的入口

---

## 九、测试与文档

- [ ] 单元测试：tokensToIR、irToUnifiedNodes、StreamingProcessor、各适配器输出结构（可快照）
- [ ] 在 `docs/` 中补充（或链接架构文档）：
  - [ ] IR 与统一节点结构说明
  - [ ] 流式与动画配置说明
  - [ ] 各端使用示例代码片段
- [ ] 预留扩展说明：后续 theme/tokens、节点级埋点等
