# 发版流程 / Release Guide

本项目里 **官网更新** 和 **npm 发布** 是两个解耦的触发器：

| 事件 | 触发条件 | 结果 |
| --- | --- | --- |
| 官网更新（版本徽标 + changelog） | **push / 合并到 `main`** | `deploy-docs.yml` → gh-pages → x-markdown-mini.ant.design（约 2–4 分钟生效） |
| npm 发布 | **push `vX.Y.Z` tag** | `release.yml` → build → test → `npm publish ./dist`（publish-from-dist） |

官网只认 `main` 上的文件，**不被 npm 发布触发**。要让官网显示新版本，就得把版本号/changelog 合进 `main`。

---

## A. 日常功能开发（每次）

```
功能分支 → PR → 合并到 main
```

**功能 PR 不碰 changelog、不改版本号。** 合并时不需要知道会发哪个版本。

> 前提：PR 用 squash-merge 或 merge commit（GitHub 默认会把 `#PR号` 写进 commit），发版时脚本才能把它们捞出来。

## B. 发布新版本（攒够功能后，单独一个 release PR）

1. **生成 changelog 草稿**——读「上个 tag 到现在」的所有 PR：

   ```bash
   npm run changelog            # 默认从最近的 tag 起，无需 --from
   # npm run changelog -- --from v1.0.1   # 需要覆盖边界时才传
   ```

   把输出粘进 `CHANGELOG.zh-CN.md` / `CHANGELOG.en-US.md` 顶部，加 `## X.Y.Z` + 日期，润色 + 翻译中文。类型用 **破坏性/新增/修复/优化**（Breaking/Added/Fixed/Improved）。

2. **改 3 处版本号**（漏一个 `npm test` 会红）：

   - `package.json`
   - `docs-site/public/site.js` 的 `CURRENT_VERSION`
   - `examples/alipay/package.json` + `examples/wechat/package.json` 的 `@ant-design/x-markdown-mini` 依赖

3. 以上改动 = **一个独立的 release PR** → 合并到 `main`。
   - 合并后官网自动更新（新徽标 + 新 changelog，约 2–4 分钟）。

4. **打 tag 触发发包**：

   ```bash
   git checkout main && git pull
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

   `release.yml` 会 build → test → 校验 tag 与 `dist/package.json` 版本一致 → `npm publish ./dist`。
   这个 tag 同时成为**下次** `npm run changelog` 的边界。

   > 本地兜底：也可以 `npm run release`（= build + `npm publish ./dist`）手动发，然后补打 tag。

## 一图流

```
功能PR ─┐
功能PR ─┼─→ main   （官网随功能更新，但版本号/changelog 不动）
功能PR ─┘
             │ 攒够了要发版
             ▼
   release PR：npm run changelog 拼条目 + 改 3 处版本号
             │ 合并 main
             ├─→ 官网自动更新（版本 + changelog）
             │
   git tag vX.Y.Z && git push origin vX.Y.Z
             └─→ release.yml 自动 npm publish ./dist
```

---

## ⚠️ 注意

- **别用裸 `npm publish`**（会按 `files:["dist"]` 发出旧的 `dist/`-嵌套布局）。发包只走 `git push tag`（CI）或本地 `npm run release`，两者都是 publish-from-dist。
- `npm publish` **不会**自动打 git tag，只有 `npm version` 会。本项目版本手动改 3 个文件，所以 tag 要自己打（见 B-4）。
- changelog 是根目录 `CHANGELOG.*.md`（唯一真源）→ `docs-site/scripts/build-changelog.mjs`（docs-site predev/prebuild）→ `changelog.generated.ts` → 时间轴组件。**只改 markdown，别改生成文件。** 同一份 CHANGELOG 也随 `npm run release` 打进 npm 包。
