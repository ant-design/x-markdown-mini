# IR 与统一节点结构说明

## IR（中间表示）

IR 节点格式：`{ t, a?, c?, raw? }`

- `t`：节点类型（如 `heading`、`paragraph`、`list`、`code`、`blockquote`、`strong`、`em`、`link`、`image` 等）
- `a`：可选属性（如 `depth`、`lang`、`href`）
- `c`：可选子节点数组
- `raw`：原始文本（如 code 块内容、纯文本）

块级与行内均用同一结构，由 `t` 区分。

## 统一 rich-text 节点

与微信小程序 `rich-text` 的 nodes 对齐：

- `name`：标签名，小写（如 `h1`、`p`、`div`、`span`、`a`、`img`、`b`、`i`、`code`、`pre`、`ul`、`ol`、`li`、`blockquote`、`hr`、`table`、`thead`、`tbody`、`tr`、`th`、`td`）
- `attrs`：属性对象，`class`/`style` 等小写
- `children`：子节点数组
- `animate`：可选，`'block' | 'text' | false`，用于块级/文本级动画

## 数据流

```
Markdown 字符串
  → marked.lexer() → Token[]
  → tokensToIR()   → IRNode[]
  → irToUnifiedNodes() → UnifiedNode[]
  → 各端适配 → 该端 nodes
```

详见 [architecture-overview.md](./architecture-overview.md)。
