# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This directory holds the **consumer-facing example mini-programs** for `@ant-design/x-markdown-mini`. Their whole purpose is to prove the package works **exactly as a real end user would consume it from npm**.

## The one rule that governs everything here: no 魔改

These examples must reflect a pristine real-user integration. **Never hand-modify any built/installed artifact** to make a demo work:

- Do **not** edit `examples/*/node_modules/@ant-design/x-markdown-mini/**` (the installed package).
- Do **not** edit `examples/wechat/miniprogram_npm/**` (the WeChat 构建 npm output).
- Do **not** copy this repo's `dist/` into the examples or shim/strip anything.

If a demo renders wrong or an import won't resolve, the fix belongs in the **published package**, not in the example: change `src/`, rebuild, **republish a new version**, then bump the example's `dependencies` and reinstall. The only files you should ever edit in an example are its own page/app sources (`pages/**`, `app.*`, `*.json` config, `*.acss`/`*.wxss`, `sample.js`) and `package.json`'s version pin.

Corollary: the examples depend on a **published** version (currently `@ant-design/x-markdown-mini@0.1.0-beta.3` via npm), never on a local `file:`/`link:` path. A change to the library is only "done" for the examples once it's republished and reinstalled.

## Layout — two apps, same three pages, two integration modes

`alipay/` and `wechat/` are independent mini-program projects, each opened in its own IDE. Both expose the identical page set, so the two platforms can be compared side by side:

- `pages/home` — landing page linking to the two integration demos.
- `pages/component` — **组件接入 (component mode)**: a one-line `usingComponents` brings in the `markdown` component; `<markdown content latex highlight />`. No page-level `require`, no manual style `@import`. The lowest-cost path.
- `pages/js` — **JS 接入 (JS mode)**: the page itself `require`s the core + plugins, constructs `new XMarkdownMini({ escapeText: false, extensions: [...] })`, calls `renderNodes({ content, platform, onPatch })`, and feeds the result to the lower-level `<mini-node-renderer>` component. More wiring, full control over the instance/extensions. Styles must be `@import`ed manually (see `js.acss`/`js.wxss`).

`pages/sample.js` is shared by both demo pages on each platform — one Markdown fixture (headings, list, table, code highlight, inline + block LaTeX, blockquote) so component mode and JS mode render the **same** content for visual diffing. Key things baked into the demos: a **fresh `XMarkdownMini` per view** (streaming state isn't shared), `escapeText: false` (because `<mini-node-renderer>`'s `<text>{{value}}</text>` doesn't decode entities), and `flattenInlineNodes(nodes)` before `setData` (mini-program `<text>` can't nest custom components).

## Platform import paths differ — this is IDE npm-resolution, not a choice

The same logical import is written differently per platform. Do not "unify" them:

| Platform | How the IDE resolves npm | Import prefix | Example |
| --- | --- | --- | --- |
| **Alipay** | Reads the `node_modules` package root directly and **ignores `package.json#exports`**, so subpaths must point at real on-disk files | **`dist/` required** | `@ant-design/x-markdown-mini/dist/es/Markdown/index`, `.../dist/index.js`, `.../dist/plugins/Latex/index.js` |
| **WeChat** | Uses `package.json#miniprogram` (→ `dist/miniprogram_dist`) as the package root after **构建 npm** lands it in `miniprogram_npm/` | **no `dist/`** | `@ant-design/x-markdown-mini/es/Markdown/index`, `.../index.js`, `.../plugins/Latex/index.js` |

Because Alipay ignores `exports`, the bare `es/Markdown/index` form **fails with `CE1000.01: cannot resolve module`** there — Alipay always needs the explicit `dist/` segment. (A package republish that exposes those subpaths at the package root could remove the prefix; until then, keep `dist/`.)

## Running the examples (opened in their respective IDEs, not built here)

There is no build/lint/test step in this directory — these are apps you open in a devtool.

```bash
cd examples/alipay && npm install   # then open examples/alipay in Alipay DevTool (reads node_modules directly)
cd examples/wechat && npm install   # then open examples/wechat in WeChat DevTool → 工具 → 构建 npm
```

- **Alipay**: `mini.project.json` sets `compileOptions.transpile: {}` — required because the shipped `dist/` is ES2018 (object spread / `class`) and the IDE must transpile it. After changing a dependency, just recompile (no separate npm-build step).
- **WeChat**: after `npm install` or any dependency change, run **工具 → 构建 npm** in the IDE to regenerate `miniprogram_npm/`. That generated tree is the package root WeChat imports from — treat it as build output (see the no-魔改 rule), never edit it by hand.
