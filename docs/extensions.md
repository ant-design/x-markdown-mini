# marked 扩展

`XMarkdownMini` 通过构造器的 `extensions` 字段接收 [marked](https://marked.js.org) 扩展数组，等价于 `marked.use(...)`。每个 `XMarkdownMini` 实例持有自己的 `Marked` 实例，**不污染全局**，多实例之间扩展互不可见。

> **扩展是实例级的**：扩展会在构造时焊进 `new Marked(...)`，无法 per-call 修改。`renderNodes(props)` / `render(props)` 只接 per-call 的 `gfm?` / `breaks?` 覆盖，不接扩展。

## 一句话上手

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import type { XMarkdownExtension, Tokens } from '@ant-design/x-markdown-mini';

const mentionExt: XMarkdownExtension = {
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
      // 直接返回 MiniNode 进入小程序渲染链路
      miniRenderer(token) {
        return {
          name: 'span',
          attrs: { class: 'md-mention' },
          children: [{ name: 'text', attrs: { value: `@${token.username}` } }],
        };
      },
    },
  ],
};

const md = new XMarkdownMini({ extensions: [mentionExt] });
const tokens = md.parse('hi @alice');
// tokens 里第一段 paragraph.tokens 含 { type: 'mention', username: 'alice' }
```

## 两种扩展形态

`extensions: (XMarkdownExtension | MarkedExtension)[]` 同时接受：

- `XMarkdownExtension`（推荐）：tokenizer 和 `miniRenderer` 写在同一个对象上，直接返回 `MiniNode`。
- `MarkedExtension`（marked 原生）：仅做 tokenizer / walkTokens / hooks，社区插件兼容路径。

每一项内部 `extensions[]` 元素可以含：

| 字段 | 用途 |
| --- | --- |
| `name` / `level` / `start` / `tokenizer` | 标准 marked tokenizer 接口 |
| `miniRenderer` | 直接返回 `MiniNode \| MiniNode[]`（推荐） |
| `renderer` | marked 风格的 HTML 字符串 renderer，框架会自动 `htmlToMiniNodes` 转换 |
| `childTokens` | 提示 marked 子 token 字段名 |

外层对象还可以带 `walkTokens` / `hooks` / `tokenizer`（marked 全局钩子）。

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

## 多实例隔离

```ts
const a = new XMarkdownMini({ extensions: [mentionExt] });
const b = new XMarkdownMini();

a.parse('@x');  // 'mention' token
b.parse('@x');  // 纯文本（b 不感知 mention）
```

每个 `XMarkdownMini` 实例构造时 `new Marked(...extensions)`，扩展只装在自己的 defaults 上，不会泄漏到全局 `marked` 单例。

## 内置扩展

LaTeX 公式和代码高亮以独立子路径包发布。`Latex()` / `CodeHighlight()` 返回的就是 `XMarkdownExtension`，直接塞进 `extensions` 即可。

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [Latex(), CodeHighlight()],
});

const nodes = md.renderNodes({
  content: '$x^2$ and ```js\nconst x = 1;\n```',
  platform: 'alipay',
});
```

### Latex

数学公式渲染，基于 [KaTeX](https://katex.org/)。

```ts
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({ extensions: [Latex()] });
```

支持行内公式 `$x^2$` 和块级公式 `$$...\n...$$`。

**样式引入**：

- 支付宝小程序：`@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";`
- 微信小程序：`@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`

样式包含 KaTeX 字体（通过 CDN 加载）和公式排版。

**选项**：

```ts
Latex({
  // 透传给 katex.renderToString() 的选项
  katexOptions: { throwOnError: false, strict: false },
  // KaTeX 渲染出错时的回调，返回 MiniNode[] 替代默认错误显示
  onError(tex, err) {
    return [{ name: 'text', attrs: { value: `[公式错误: ${err.message}]` } }];
  },
})
```

### CodeHighlight

代码语法高亮，基于 [highlight.js](https://highlightjs.org/)。

```ts
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({ extensions: [CodeHighlight()] });
```

默认注册 18 种常用语言（javascript、typescript、python、java、css、xml、json、sql、bash、shell、c、cpp、go、rust、yaml、markdown、diff、plaintext）。只对标注了语言的围栏代码块生效，无语言标注时回退到默认渲染。

**样式引入**：

- 支付宝小程序：`@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";`
- 微信小程序：`@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`

默认样式为 GitHub 浅色主题（`.hljs-keyword`、`.hljs-string` 等类名）。

**选项**：

```ts
// 自定义语言子集（只注册需要的语言，减小产物体积）
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';

CodeHighlight({
  languages: { javascript, python },
})

// 透传 hljs.highlight() 选项
CodeHighlight({
  hljsOptions: { ignoreIllegals: true },
})
```

## 小程序组件使用

支付宝和微信组件均支持 `extensions` 属性：

```xml
<!-- 支付宝 axml -->
<markdown content="{{content}}" extensions="{{extensions}}" />
```

```ts
// 支付宝组件 JS
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

Component({
  data: { extensions: [Latex(), CodeHighlight()] },
});
```

```xml
<!-- 微信 wxml -->
<markdown content="{{content}}" extensions="{{extensions}}" />
```

```js
// 微信组件 JS
const Latex = require('@ant-design/x-markdown-mini/plugins/Latex').default;
const CodeHighlight = require('@ant-design/x-markdown-mini/plugins/CodeHighlight').default;

Component({
  properties: {
    extensions: { type: Array, value: [] },
  },
  data: { extensions: [Latex(), CodeHighlight()] },
});
```

## 体积成本

extensions 本身打包到用户代码里（不影响 `x-markdown-mini` 的 dist size）。本库已捆绑 marked + remend，自定义扩展不引入额外的 marked 副本。

内置扩展按需引入：主库（~105 KB）不含 KaTeX 和 highlight.js。`plugins/Latex`（~486 KB，含 KaTeX）和 `plugins/CodeHighlight`（~184 KB，含 highlight.js/lib/common）各自独立打包，仅在 import 时才增大产物体积。
