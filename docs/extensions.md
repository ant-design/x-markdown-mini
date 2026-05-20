# marked 扩展

`XMarkdownMini` 接受 [marked](https://marked.js.org) 的扩展数组，等价于 `marked.use(...)`。每个 `XMarkdownMini` 实例持有自己的 `Marked` 实例，**不污染全局**，多实例之间扩展互不可见。

## 一句话上手

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import type { MarkedExtension, Tokens } from '@ant-design/x-markdown-mini';

const mentionExt: MarkedExtension = {
  extensions: [
    {
      name: 'mention',
      level: 'inline',
      start: (src) => src.match(/@/)?.index,
      tokenizer(src) {
        const m = /^@([a-zA-Z0-9_-]+)/.exec(src);
        if (!m) return undefined;
        return { type: 'mention', raw: m[0], username: m[1] };
      },
    },
  ],
};

const md = new XMarkdownMini({ extensions: [mentionExt] });
const tokens = md.parse('hi @alice');
// tokens 里第一段 paragraph.tokens 含 { type: 'mention', username: 'alice' }
```

## 支持的扩展类型

`extensions: MarkedExtension[]` 接收的每一项可以包含：

| 字段 | 用途 |
| --- | --- |
| `extensions` | 自定义 block / inline tokenizer + 可选 renderer，产出新 token 类型 |
| `tokenizer` | 覆盖内置 tokenizer 方法（不新增 token 类型，改变现有 token 解析行为） |
| `renderer` | 覆盖内置 renderer（仅在使用 marked 的 HTML 渲染时生效，小程序流程不用） |
| `walkTokens` | 后置遍历钩子，常用于给 token 加属性 |
| `hooks` | preprocess / postprocess 文本/HTML 钩子 |
| `gfm`, `breaks`, `pedantic` 等 | 等同于 lexer 选项 |

## walkTokens 钩子

```ts
const walkExt: MarkedExtension = {
  walkTokens(token) {
    if (token.type === 'link') {
      (token as Tokens.Link).href = (token as Tokens.Link).href.replace(
        /^http:/,
        'https:',
      );
    }
  },
};

const md = new XMarkdownMini({ extensions: [walkExt] });
md.parse(content);  // walkTokens 被自动调用一次每个 token
```

> `XMarkdownMini.parse()` 内部会复刻 marked `parse()` 路径的 walkTokens 调用——`lexer()` 默认不跑，但 `parse()` 跑。

## 在 streaming / render 路径

extensions 也会自动应用到 `XMarkdownMini.render()` 走的 streaming 链路（因为内部用同一个 `Marked` 实例 lex）。但要注意：

- **自定义 tokenizer 产生的 token**：在 `parse()` 输出里看得到；走 `render()` 的话，未被 `tokensToWechatNodes` / `tokensToAlipayNodes` 识别的 token 类型会被静默跳过（不渲染、不报错）。
- **walkTokens / hooks**：始终生效。

要让自定义 token 真正渲染到小程序 UI，路径是：
1. 用 `parse()` 拿到 tokens
2. 自己映射成 `UnifiedNode[]`（参考 `tokensToWechatNodes` 源码）
3. 经 `flattenInlineTokens` 或自渲染模板渲出

## 多实例隔离

```ts
const a = new XMarkdownMini({ extensions: [mentionExt] });
const b = new XMarkdownMini();

a.parse('@x');  // 'mention' token
b.parse('@x');  // 纯文本（b 不感知 mention）
```

每个 `XMarkdownMini` 实例构造时 `new Marked(...extensions)`，扩展只装在自己的 defaults 上，不会泄漏到全局 `marked` 单例。

## 体积成本

extensions 本身打包到用户代码里（不影响 `x-markdown-mini` 的 dist size）。本库已捆绑 marked + remend，自定义扩展不引入额外的 marked 副本。
