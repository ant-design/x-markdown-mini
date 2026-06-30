# x-markdown-mini 文档站

基于 [dumi](https://d.umijs.org) v2 构建的官网与文档。

## 分类

- **首页**（`/`）— hero、特性、快速接入
- **Examples**（`/examples/*`）— 组件分组下的接入示例（Markdown、流式渲染），含支付宝 / 微信代码切换 + 手机预览
- **Playground**（`/playground`）— 浏览器内编辑 Markdown，实时切换平台预览 + 真机降级提示
- **Docs**（`/docs/*`）— 入门 / 流式 / 平台 / 参考 四节
- **GitHub** — 外链

## 使用

```bash
# 1. 仓库根先构建主库（docs-site 通过 file:.. 引用）
cd ..
npm run build

# 2. 安装并启动文档站
cd docs-site
npm install
npm run dev    # http://localhost:8000

# 3. 构建静态站
npm run build  # 输出到 docs-site/dist
```

## 目录结构

```
docs-site/
├── .dumirc.ts            # 导航 / sidebar 配置
├── docs/                 # markdown 内容
│   ├── index.md
│   ├── examples/
│   ├── playground.md
│   └── docs/
└── src/
    ├── components/       # PhonePreview / Playground / DemoCard / DemoCode
    ├── demos/            # 各 demo 组件（被 markdown 通过 <code src> 引用）
    └── utils/
```
