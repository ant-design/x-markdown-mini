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
| `renderer` | marked HTML renderer；不会直接参与小程序节点渲染 |
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

extensions 也会自动应用到 `XMarkdownMini.renderNodes()` 走的 streaming 链路（因为内部用同一个 `Marked` 实例 lex）。自定义 token 要渲染到小程序节点，需要提供 `tokenRenderers`：

```ts
const md = new XMarkdownMini({
  extensions: [mentionExt],
  tokenRenderers: [
    {
      token: 'mention',
      render(token) {
        return {
          name: 'span',
          attrs: { class: 'md-mention' },
          children: [{ name: 'text', attrs: { value: `@${token.username}` } }],
        };
      },
    },
  ],
});
```

未被内置 transformer 或 `tokenRenderers` 识别的 token 仍会被跳过。

## 多实例隔离

```ts
const a = new XMarkdownMini({ extensions: [mentionExt] });
const b = new XMarkdownMini();

a.parse('@x');  // 'mention' token
b.parse('@x');  // 纯文本（b 不感知 mention）
```

每个 `XMarkdownMini` 实例构造时 `new Marked(...extensions)`，扩展只装在自己的 defaults 上，不会泄漏到全局 `marked` 单例。

## 插件系统

插件 = `extensions` + `tokenRenderers` 的自包含封装。用 `plugins` 数组传入，自动展开到对应的 `extensions` 和 `tokenRenderers`。

```ts
import type { Plugin } from '@ant-design/x-markdown-mini';

interface Plugin {
  extensions?: MarkedExtension[];
  tokenRenderers?: TokenRenderer[];
}
```

### 使用方式

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  plugins: [Latex(), CodeHighlight()],
});

const nodes = md.renderNodes({
  content: '$x^2$ and ```js\nconst x = 1;\n```',
  platform: 'alipay',
});
```

`plugins` 可以和 `extensions` / `tokenRenderers` 同时使用，两者会合并：

```ts
const md = new XMarkdownMini({
  extensions: [myExt],
  tokenRenderers: [{ token: 'mention', render }],
  plugins: [Latex(), CodeHighlight()],
});
// 等价于 extensions: [myExt, ...Latex()extensions, ...CodeHighlight().extensions]
//      tokenRenderers: [{ token: 'mention', render }, ...Latex().tokenRenderers, ...]
```

### 内置插件

#### Latex

数学公式渲染，基于 [KaTeX](https://katex.org/)。

```ts
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({ plugins: [Latex()] });
```

支持行内公式 `$x^2$` 和块级公式 `$$...\n...$$`。

**样式引入**：插件需要单独引入样式文件。

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

#### CodeHighlight

代码语法高亮，基于 [highlight.js](https://highlightjs.org/)。

```ts
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({ plugins: [CodeHighlight()] });
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

### 小程序组件使用

支付宝和微信组件均支持 `plugins` 属性：

```xml
<!-- 支付宝 axml -->
<markdown content="{{content}}" plugins="{{plugins}}" />
```

```ts
// 支付宝组件 JS
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

Component({
  data: { plugins: [Latex(), CodeHighlight()] },
});
```

```xml
<!-- 微信 wxml -->
<markdown content="{{content}}" plugins="{{plugins}}" />
```

```js
// 微信组件 JS
const Latex = require('@ant-design/x-markdown-mini/plugins/Latex').default;
const CodeHighlight = require('@ant-design/x-markdown-mini/plugins/CodeHighlight').default;

Component({
  properties: {
    plugins: { type: Array, value: [] },
  },
  data: { plugins: [Latex(), CodeHighlight()] },
});
```

## 体积成本

extensions 本身打包到用户代码里（不影响 `x-markdown-mini` 的 dist size）。本库已捆绑 marked + remend，自定义扩展不引入额外的 marked 副本。

内置插件按需引入：主库（~105 KB）不含 KaTeX 和 highlight.js。`plugins/Latex`（~486 KB，含 KaTeX）和 `plugins/CodeHighlight`（~184 KB，含 highlight.js/lib/common）各自独立打包，仅在 import 时才增大产物体积。
