---
title: Code Highlight
order: 1
nav:
  title: Docs
  order: 4
group:
  title: B Plugins
  order: 3
---

# Code Highlight

`CodeHighlight` uses `highlight.js` to take over fenced code blocks. Blocks without a language, or with an unknown one, fall back to the built-in plain code renderer. The plugin is opt-in, so pages that do not register it keep the lean default path.

## Introduce

```ts
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
```

## Code sample

<code src="../../src/demos/plugins/CodeHighlightDemo.tsx"></code>

Registered by default: JavaScript, TypeScript, Python, Java, CSS, XML, JSON, SQL, Bash, Shell, C, C++, Go, Rust, YAML, Markdown, Diff, Plaintext.

## Custom languages

```ts
import python from 'highlight.js/lib/languages/python';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

CodeHighlight({
  languages: { python },
  hljsOptions: { ignoreIllegals: true },
});
```
