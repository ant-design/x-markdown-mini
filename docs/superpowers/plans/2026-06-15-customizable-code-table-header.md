# Customizable Code/Table Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `x-markdown-mini`'s code blocks and tables emit a data-driven header bar (language/title + copy button) by default, customizable via a render function passed in options, and disableable.

**Architecture:** The shared renderer (`miniNodeRenderer.ts`) attaches a `header: MiniNode[]` to the `pre`/`table` node — default content (label + a `copy-button` node carrying the raw copy payload), or whatever a `RenderContext.codeHeader`/`tableHeader` render function returns, or nothing when set to `false`. Options flow `XMarkdownMiniOptions.codeBlock/table.header → RenderContext`. The shipped `MiniNodeRenderer` components stop hard-coding the bar: they render `node.header` items inline (dispatching on `text` / `copy-button` / fallback) and bind a single `_copy` tap handler that reads the `data-copy` attribute.

**Tech Stack:** TypeScript (ES2018 output via tsup), marked, Vitest. Mini-program component templates: WeChat `.wxml`/`.wxs`, Alipay `.axml`/`.sjs`.

---

## File Structure

- `src/types.ts` — add `MiniNode.header`; new header context + renderer types; `RenderContext.codeHeader`/`tableHeader`.
- `src/platforms/shared/miniNodeRenderer.ts` — `copyButton()` helper, header builders, attach header in `case 'code'`/`case 'table'`.
- `src/XMarkdownMini.ts` — `XMarkdownMiniOptions.codeBlock`/`table`; store resolved values; pass into both `RenderContext` constructions in `renderNodes`.
- `src/index.ts` — re-export `copyButton` and the new public types.
- `src/components/wechat/MiniNodeRenderer/{index.wxml,index.wxs,index.ts}` — data-driven header + `_copy`.
- `src/components/alipay/MiniNodeRenderer/{index.axml,index.sjs,index.ts}` — data-driven header + `_copy`.
- `src/__tests__/miniNodeRenderer.test.ts` — header default / off / custom / copy payload tests.
- `src/__tests__/index.test.ts` — options wiring + `copyButton` export test.
- `docs-site/docs/components.md` (+ `.en-US`) — short "code/table header" section.

---

## Task 1: Shared renderer — default header + `copyButton` helper + types

**Files:**
- Modify: `src/types.ts`
- Modify: `src/platforms/shared/miniNodeRenderer.ts`
- Test: `src/__tests__/miniNodeRenderer.test.ts`

- [ ] **Step 1: Add types to `src/types.ts`**

Add the `header` field to the `MiniNode` interface (after `children`):

```ts
  /** 子节点 */
  children?: MiniNode[];
  /** 代码块/表格顶部 header 栏（语言/标题 + 复制按钮）。 */
  header?: MiniNode[];
  /** 是否开启动画 */
  animate?: boolean;
```

Add the header renderer types just above `export interface RenderContext {` :

```ts
/** Context passed to a code-block header renderer. */
export interface CodeHeaderContext {
  /** Resolved language id ('' when the fence has no language). */
  lang: string;
  /** Raw code text — the clipboard payload. */
  text: string;
  token: Tokens.Code;
}

/** Context passed to a table header renderer. */
export interface TableHeaderContext {
  /** Raw markdown source of the table — the clipboard payload. */
  markdown: string;
  token: Tokens.Table;
}

export type CodeHeaderRenderer = (ctx: CodeHeaderContext) => MiniNode | MiniNode[] | null;
export type TableHeaderRenderer = (ctx: TableHeaderContext) => MiniNode | MiniNode[] | null;
```

Add the two fields inside `RenderContext` (after `extensions?`):

```ts
  /**
   * Code-block header config. `true`/undefined = default (language + copy
   * button); `false` = no header; function = custom header nodes.
   */
  codeHeader?: boolean | CodeHeaderRenderer;
  /** Table header config. Same semantics as `codeHeader`. */
  tableHeader?: boolean | TableHeaderRenderer;
```

- [ ] **Step 2: Write the failing test in `src/__tests__/miniNodeRenderer.test.ts`**

Add this block inside the top-level `describe('renderTokensToMiniNodes', ...)` (reuse the existing `find`/`flatten` helpers and define a local adapter):

```ts
  const headerAdapter: MiniNodePlatformAdapter = {
    linkAttrs: (href) => ({ 'data-url': href }),
    imageSrc: (src) => src,
    olAttrs: () => ({}),
    capabilities: { supportsPre: true, supportsTable: true },
  };

  it('adds a default code-block header (language label + copy button with raw text)', () => {
    const tokens = Lexer.lex('```ts\nconst a = 1\n```');
    const nodes = renderTokensToMiniNodes(tokens, headerAdapter, { escapeText: false });
    const pre = find(nodes, 'pre')!;
    expect(pre.header).toBeDefined();
    expect(pre.header![0]).toEqual({ name: 'text', attrs: { class: 'md-codeblock-lang', value: 'ts' } });
    expect(pre.header![1]).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'const a = 1', class: 'md-copy-icon' } });
  });

  it('defaults the code-block header label to "code" when no language', () => {
    const nodes = renderTokensToMiniNodes(Lexer.lex('```\nplain\n```'), headerAdapter, { escapeText: false });
    expect(find(nodes, 'pre')!.header![0].attrs?.value).toBe('code');
  });

  it('adds a default table header ("表格" + copy button with markdown source)', () => {
    const src = '| a | b |\n| - | - |\n| 1 | 2 |';
    const nodes = renderTokensToMiniNodes(Lexer.lex(src), headerAdapter, { escapeText: false });
    const table = find(nodes, 'table')!;
    expect(table.header![0]).toEqual({ name: 'text', attrs: { class: 'md-tableblock-title', value: '表格' } });
    expect(table.header![1].name).toBe('copy-button');
    expect(String(table.header![1].attrs?.['data-copy'])).toContain('| a | b |');
  });

  it('copyButton() builds a copy-button node carrying the payload', () => {
    expect(copyButton('hello')).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'hello', class: 'md-copy-icon' } });
  });
```

Add `copyButton` to the import at the top of the test file:

```ts
import {
  renderTokensToMiniNodes,
  copyButton,
  type MiniNodePlatformAdapter,
} from '../platforms/shared/miniNodeRenderer.js';
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/miniNodeRenderer.test.ts -t "header"`
Expected: FAIL — `copyButton` is not exported and `pre.header` is `undefined`.

- [ ] **Step 4: Implement in `src/platforms/shared/miniNodeRenderer.ts`**

Add the import of the new types (extend the existing type import):

```ts
import type { MiniNode, RenderContext, CodeHeaderRenderer, TableHeaderRenderer } from '../../types.js';
```

Add these helpers near the other top-level helpers (e.g. just after the `collectText` function):

```ts
/** Build a copy-button MiniNode carrying the raw clipboard payload. */
export function copyButton(text: string): MiniNode {
  return { name: 'copy-button', attrs: { 'data-copy': text, class: 'md-copy-icon' } };
}

function asNodeArray(x: MiniNode | MiniNode[] | null | undefined): MiniNode[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function buildCodeHeader(ctx: RenderContext, lang: string, text: string, token: Tokens.Code): MiniNode[] {
  const cfg = ctx.codeHeader;
  if (cfg === false) return [];
  if (typeof cfg === 'function') return asNodeArray((cfg as CodeHeaderRenderer)({ lang, text, token }));
  return [
    { name: 'text', attrs: { class: 'md-codeblock-lang', value: lang || 'code' } },
    copyButton(text),
  ];
}

function buildTableHeader(ctx: RenderContext, token: Tokens.Table): MiniNode[] {
  const cfg = ctx.tableHeader;
  if (cfg === false) return [];
  const markdown = token.raw ?? '';
  if (typeof cfg === 'function') return asNodeArray((cfg as TableHeaderRenderer)({ markdown, token }));
  return [
    { name: 'text', attrs: { class: 'md-tableblock-title', value: '表格' } },
    copyButton(markdown),
  ];
}

function withHeader(node: MiniNode, header: MiniNode[]): MiniNode {
  if (header.length) node.header = header;
  return node;
}
```

Replace the `case 'code'` body so the header is attached on both the custom-render path and the default path (note: the no-`pre`-support plain-text fallback gets no header):

```ts
    case 'code': {
      const t = tok as Tokens.Code;
      const lang = ((t.lang ?? '').trim().split(/\s+/)[0]) ?? '';
      const preAttrs: MiniNodeAttrs = lang
        ? { class: 'md-code-block', lang }
        : { class: 'md-code-block' };
      const header = buildCodeHeader(ctx, lang, t.text ?? '', t);
      const custom = renderCustomToken(tok, ctx);
      if (custom.length) return withHeader(block('pre', custom, animate, adapter, tok, preAttrs), header);
      if (!supports(adapter, 'supportsPre')) {
        return textBlock(enc(t.text ?? ''), animate, adapter, tok);
      }
      const codeChild: MiniNode = {
        name: 'code',
        children: [{ name: 'text', attrs: { value: enc(t.text ?? '') } }],
      };
      return withHeader(block('pre', [codeChild], animate, adapter, tok, preAttrs), header);
    }
```

In the `case 'table'` body, change the final `return` (the `supportsTable` path) to attach the header. Find:

```ts
      const headerRow: MiniNode = { name: 'tr', attrs: { class: 'md-tr' }, children: headCells };
      return block('table', [headerRow, ...rowNodes], animate, adapter, tok, { class: 'md-table' });
```

Replace the `return` line with:

```ts
      const headerRow: MiniNode = { name: 'tr', attrs: { class: 'md-tr' }, children: headCells };
      return withHeader(
        block('table', [headerRow, ...rowNodes], animate, adapter, tok, { class: 'md-table' }),
        buildTableHeader(ctx, t),
      );
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/miniNodeRenderer.test.ts -t "header"`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/platforms/shared/miniNodeRenderer.ts src/__tests__/miniNodeRenderer.test.ts
git commit -m "feat(renderer): default data-driven header for code/table blocks"
```

---

## Task 2: Header off + custom render function (ctx-driven)

**Files:**
- Test: `src/__tests__/miniNodeRenderer.test.ts`
- (No implementation change — behavior already lives in the Task 1 builders; this task pins it with tests.)

- [ ] **Step 1: Write the failing test in `src/__tests__/miniNodeRenderer.test.ts`**

Add inside the same `describe`:

```ts
  it('omits the code/table header when configured false', () => {
    const codeNodes = renderTokensToMiniNodes(Lexer.lex('```ts\nx\n```'), headerAdapter, { codeHeader: false });
    expect(find(codeNodes, 'pre')!.header).toBeUndefined();
    const tableNodes = renderTokensToMiniNodes(Lexer.lex('| a |\n| - |\n| 1 |'), headerAdapter, { tableHeader: false });
    expect(find(tableNodes, 'table')!.header).toBeUndefined();
  });

  it('uses a custom code header function and passes lang/text', () => {
    let seen: { lang: string; text: string } | undefined;
    const nodes = renderTokensToMiniNodes(Lexer.lex('```py\nprint(1)\n```'), headerAdapter, {
      escapeText: false,
      codeHeader: ({ lang, text }) => {
        seen = { lang, text };
        return { name: 'text', attrs: { class: 'custom-head', value: lang.toUpperCase() } };
      },
    });
    expect(seen).toEqual({ lang: 'py', text: 'print(1)' });
    expect(find(nodes, 'pre')!.header).toEqual([{ name: 'text', attrs: { class: 'custom-head', value: 'PY' } }]);
  });

  it('uses a custom table header function and passes markdown source', () => {
    const src = '| a |\n| - |\n| 1 |';
    const nodes = renderTokensToMiniNodes(Lexer.lex(src), headerAdapter, {
      tableHeader: ({ markdown }) => [
        { name: 'text', attrs: { value: 'My Table' } },
        copyButton(markdown),
      ],
    });
    const header = find(nodes, 'table')!.header!;
    expect(header[0]).toEqual({ name: 'text', attrs: { value: 'My Table' } });
    expect(String(header[1].attrs?.['data-copy'])).toContain('| a |');
  });
```

- [ ] **Step 2: Run the test to verify behavior**

Run: `npx vitest run src/__tests__/miniNodeRenderer.test.ts -t "header"`
Expected: PASS (now 7 header tests total). If the "false" or custom tests fail, fix the Task 1 builders.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/miniNodeRenderer.test.ts
git commit -m "test(renderer): cover header off + custom header function"
```

---

## Task 3: Wire options into `XMarkdownMini` + export from package root

**Files:**
- Modify: `src/XMarkdownMini.ts`
- Modify: `src/index.ts`
- Test: `src/__tests__/index.test.ts`

- [ ] **Step 1: Write the failing test in `src/__tests__/index.test.ts`**

Add a new `describe` block (the file already imports `XMarkdownMini`; add `copyButton` and `MiniNode` finder inline):

```ts
import { copyButton } from '../index.js';

describe('code/table header options', () => {
  function findDeep(nodes: any[], name: string): any {
    const q = [...nodes];
    while (q.length) {
      const n = q.shift();
      if (n.name === name) return n;
      if (n.children) q.push(...n.children);
    }
    return undefined;
  }

  it('renders default headers and disables them via options', () => {
    const on = new XMarkdownMini().renderNodes({ content: '```ts\nx\n```', platform: 'alipay' });
    expect(findDeep(on, 'pre').header).toBeDefined();

    const off = new XMarkdownMini({ codeBlock: { header: false }, table: { header: false } });
    const codeNodes = off.renderNodes({ content: '```ts\nx\n```', platform: 'alipay' });
    expect(findDeep(codeNodes, 'pre').header).toBeUndefined();
    const tableNodes = off.renderNodes({ content: '| a |\n| - |\n| 1 |', platform: 'alipay' });
    expect(findDeep(tableNodes, 'table').header).toBeUndefined();
  });

  it('exports copyButton from the package root', () => {
    expect(copyButton('z')).toEqual({ name: 'copy-button', attrs: { 'data-copy': 'z', class: 'md-copy-icon' } });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/__tests__/index.test.ts -t "header options"`
Expected: FAIL — `copyButton` is not exported from `../index.js`, and the off-instance still has a header.

- [ ] **Step 3: Implement options in `src/XMarkdownMini.ts`**

Add the two fields to `XMarkdownMiniOptions` (after `components?: string[];`), importing the renderer types at the top:

```ts
import type {
  MiniNode,
  RenderContext,
  CodeHeaderRenderer,
  TableHeaderRenderer,
  XMarkdownExtension,
  XMarkdownMiniProps,
  XMarkdownMiniTokenProps,
  XMarkdownTokenizerExtension,
} from './types.js';
```

```ts
  /** 代码块 header。true=默认（语言名+复制按钮）；false=无；函数=自定义。默认 true。 */
  codeBlock?: { header?: boolean | CodeHeaderRenderer };
  /** 表格 header。true=默认（“表格”+复制按钮）；false=无；函数=自定义。默认 true。 */
  table?: { header?: boolean | TableHeaderRenderer };
```

Add instance fields (next to the other `private readonly` declarations):

```ts
  private readonly codeHeader: boolean | CodeHeaderRenderer | undefined;
  private readonly tableHeader: boolean | TableHeaderRenderer | undefined;
```

Set them in the constructor (next to `this.breaks = opts.breaks;`):

```ts
    this.codeHeader = opts.codeBlock?.header;
    this.tableHeader = opts.table?.header;
```

In `renderNodes`, add the two fields to **both** `RenderContext` object literals (the non-streaming one and the streaming one). Non-streaming:

```ts
        const ctx: RenderContext = {
          animation: false,
          selectable,
          escapeText: this.escapeText,
          extensions: ctxExtensions,
          codeHeader: this.codeHeader,
          tableHeader: this.tableHeader,
        };
```

Streaming:

```ts
      const ctx: RenderContext = {
        animation: stream.enableAnimation,
        selectable,
        escapeText: this.escapeText,
        extensions: ctxExtensions,
        codeHeader: this.codeHeader,
        tableHeader: this.tableHeader,
      };
```

- [ ] **Step 4: Re-export from `src/index.ts`**

Add `copyButton` to the existing `export { ... } from './platforms/index.js';`? No — `copyButton` lives in the shared renderer. Add a dedicated export line near the other shared re-exports (e.g. after the `flattenInlineTokens` export block):

```ts
export { copyButton } from './platforms/shared/miniNodeRenderer.js';
```

Add the public types to a `export type { ... }` near the other type exports:

```ts
export type {
  CodeHeaderContext,
  TableHeaderContext,
  CodeHeaderRenderer,
  TableHeaderRenderer,
} from './types.js';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/index.test.ts -t "header options"`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the full suite to catch regressions**

Run: `npm test`
Expected: all pass. If the CodeHighlight test in `plugins.test.ts` fails, confirm it only checks `JSON.stringify(...).toContain('custom-code')` (header addition does not remove `custom-code`) — it should still pass.

- [ ] **Step 7: Commit**

```bash
git add src/XMarkdownMini.ts src/index.ts src/__tests__/index.test.ts
git commit -m "feat: codeBlock/table header options + copyButton export"
```

---

## Task 4: WeChat component — data-driven header + `_copy`

**Files:**
- Modify: `src/components/wechat/MiniNodeRenderer/index.wxs`
- Modify: `src/components/wechat/MiniNodeRenderer/index.wxml`
- Modify: `src/components/wechat/MiniNodeRenderer/index.ts`

- [ ] **Step 1: Add `isCopy`/`copyOf` to `index.wxs`**

Add the two functions next to the other predicates:

```js
function isCopy(name) { return name === 'copy-button'; }
function copyOf(node) { return (node.attrs || {})['data-copy'] || ''; }
```

Add them to `module.exports`:

```js
  isPre: isPre,
  isTable: isTable,
  isCopy: isCopy,
  copyOf: copyOf,
  isRich: isRich,
```

- [ ] **Step 2: Replace the `isPre` branch bar in `index.wxml`**

Replace the existing `<view class="md-codeblock-bar">…</view>` (the lang `<text>` + copy `<image catch:tap="_copyCode">`) with a header guarded by `node.header` that renders header items inline:

```html
    <view wx:if="{{node.header}}" class="md-codeblock-bar">
      <block wx:for="{{node.header}}" wx:for-item="h" wx:for-index="hi" wx:key="hi">
        <text wx:if="{{u.isText(h.name)}}" class="{{u.classOf(h)}}">{{u.valueOf(h)}}</text>
        <image
          wx:elif="{{u.isCopy(h.name)}}"
          class="{{u.classOf(h) || 'md-copy-icon'}}"
          src="https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original"
          data-copy="{{u.copyOf(h)}}"
          catch:tap="_copy"
        />
        <view wx:else class="{{u.classOf(h)}}" style="{{u.styleOf(h)}}">
          <mini-node-renderer
            wx:if="{{h.children}}"
            generic:custom-slot="custom-slot"
            nodes="{{h.children}}"
            selectable="{{selectable}}"
            animation="{{false}}"
            slotComponents="{{slotComponents}}"
            bind:tap="_tap"
          />
        </view>
      </block>
    </view>
```

- [ ] **Step 3: Replace the `isTable` branch bar in `index.wxml`**

Replace the existing `<view class="md-tableblock-bar">…</view>` with the identical header loop but the `md-tableblock-bar` class:

```html
    <view wx:if="{{node.header}}" class="md-tableblock-bar">
      <block wx:for="{{node.header}}" wx:for-item="h" wx:for-index="hi" wx:key="hi">
        <text wx:if="{{u.isText(h.name)}}" class="{{u.classOf(h)}}">{{u.valueOf(h)}}</text>
        <image
          wx:elif="{{u.isCopy(h.name)}}"
          class="{{u.classOf(h) || 'md-copy-icon'}}"
          src="https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original"
          data-copy="{{u.copyOf(h)}}"
          catch:tap="_copy"
        />
        <view wx:else class="{{u.classOf(h)}}" style="{{u.styleOf(h)}}">
          <mini-node-renderer
            wx:if="{{h.children}}"
            generic:custom-slot="custom-slot"
            nodes="{{h.children}}"
            selectable="{{selectable}}"
            animation="{{false}}"
            slotComponents="{{slotComponents}}"
            bind:tap="_tap"
          />
        </view>
      </block>
    </view>
```

- [ ] **Step 4: Replace copy methods in `index.ts`**

Delete `collectText`, `collectTableText`, `_copyCode`, `_copyTable`. Keep `copyToClipboard`. Add one `_copy` method to the `methods` block:

```ts
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
```

After deletion the file no longer references `AnyNode` for collectors; keep the `AnyNode` interface only if still used — if nothing references it, delete it to satisfy lint.

- [ ] **Step 5: Build + lint to verify it compiles**

Run: `npm run lint && npm run build`
Expected: lint clean; build succeeds (tsup + post-steps).

- [ ] **Step 6: Confirm the template wiring with a grep**

Run: `grep -n "node.header\|_copy\b\|isCopy" src/components/wechat/MiniNodeRenderer/index.wxml dist/es/MiniNodeRenderer/index.js`
Expected: `index.wxml` shows `node.header` (×2) and `catch:tap="_copy"`; the built component JS contains `_copy` and no `_copyCode`/`_copyTable`.

- [ ] **Step 7: Commit**

```bash
git add src/components/wechat/MiniNodeRenderer/
git commit -m "feat(wechat): render data-driven code/table header + unified copy"
```

---

## Task 5: Alipay component — data-driven header + `_copy`

**Files:**
- Modify: `src/components/alipay/MiniNodeRenderer/index.sjs`
- Modify: `src/components/alipay/MiniNodeRenderer/index.axml`
- Modify: `src/components/alipay/MiniNodeRenderer/index.ts`

- [ ] **Step 1: Add `isCopy`/`copyOf` to `index.sjs`**

Add next to the other predicates:

```js
function isCopy(name) { return name === 'copy-button'; }
function copyOf(node) {
  var attrs = node.attrs || {};
  return attrs['data-copy'] || '';
}
```

Add to the `export default { ... }`:

```js
  isPre: isPre,
  isTable: isTable,
  isCopy: isCopy,
  copyOf: copyOf,
  isRich: isRich,
```

- [ ] **Step 2: Replace the `isPre` branch bar in `index.axml`**

Replace the existing `<view class="md-codeblock-bar">…</view>` with:

```html
    <view a:if="{{node.header}}" class="md-codeblock-bar">
      <block a:for="{{node.header}}" a:for-item="h" a:for-index="hi" a:key="hi">
        <text a:if="{{u.isText(h.name)}}" class="{{u.classOf(h)}}">{{u.valueOf(h)}}</text>
        <image
          a:elif="{{u.isCopy(h.name)}}"
          class="{{u.classOf(h) || 'md-copy-icon'}}"
          src="https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original"
          data-copy="{{u.copyOf(h)}}"
          catchTap="_copy"
        />
        <view a:else class="{{u.classOf(h)}}" style="{{u.styleOf(h)}}">
          <mini-node-renderer
            a:if="{{h.children}}"
            nodes="{{h.children}}"
            selectable="{{selectable}}"
            animation="{{false}}"
            slotComponents="{{slotComponents}}"
            onTap="onTap"
          >
            <slot slot-scope="prop" data="{{prop.data}}" />
          </mini-node-renderer>
        </view>
      </block>
    </view>
```

- [ ] **Step 3: Replace the `isTable` branch bar in `index.axml`**

Same loop with the `md-tableblock-bar` class:

```html
    <view a:if="{{node.header}}" class="md-tableblock-bar">
      <block a:for="{{node.header}}" a:for-item="h" a:for-index="hi" a:key="hi">
        <text a:if="{{u.isText(h.name)}}" class="{{u.classOf(h)}}">{{u.valueOf(h)}}</text>
        <image
          a:elif="{{u.isCopy(h.name)}}"
          class="{{u.classOf(h) || 'md-copy-icon'}}"
          src="https://mdn.alipayobjects.com/huamei_y8xg5f/afts/img/JXzqSoHDzm4AAAAAHpAAAAgADuJhAQFr/original"
          data-copy="{{u.copyOf(h)}}"
          catchTap="_copy"
        />
        <view a:else class="{{u.classOf(h)}}" style="{{u.styleOf(h)}}">
          <mini-node-renderer
            a:if="{{h.children}}"
            nodes="{{h.children}}"
            selectable="{{selectable}}"
            animation="{{false}}"
            slotComponents="{{slotComponents}}"
            onTap="onTap"
          >
            <slot slot-scope="prop" data="{{prop.data}}" />
          </mini-node-renderer>
        </view>
      </block>
    </view>
```

- [ ] **Step 4: Replace copy methods in `index.ts`**

Delete `collectText`, `collectTableText`, `_copyCode`, `_copyTable` (and the now-unused `AnyNode` interface if nothing else uses it). Keep `copyToClipboard`. Add to `methods`:

```ts
    _copy(this: any, e: any) {
      const ds = e && e.currentTarget && e.currentTarget.dataset;
      copyToClipboard((ds && ds.copy) || '');
    },
```

- [ ] **Step 5: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds; `copy-component-assets` copies the new `.axml`/`.sjs` into `dist`.

- [ ] **Step 6: Confirm the template wiring with a grep**

Run: `grep -n "node.header\|catchTap=\"_copy\"\|isCopy" src/components/alipay/MiniNodeRenderer/index.axml`
Expected: `node.header` (×2) and `catchTap="_copy"` present.

- [ ] **Step 7: Commit**

```bash
git add src/components/alipay/MiniNodeRenderer/
git commit -m "feat(alipay): render data-driven code/table header + unified copy"
```

---

## Task 6: Docs section + full gates

**Files:**
- Modify: `docs-site/docs/components.md` and `docs-site/docs/components.en-US.md` (if present)
- Modify: `scripts/check-bundle.mjs` (only if the size gate fails)

- [ ] **Step 1: Add a docs section**

Append to `docs-site/docs/components.md` a short section describing the feature (adjust to the file's existing heading style):

````markdown
## 代码块 / 表格 header

代码块与表格默认带一个 header 栏：代码块显示语言名 + 复制按钮（复制原始代码），表格显示“表格” + 复制按钮（复制 Markdown 源）。

关闭或自定义：

```ts
import { XMarkdownMini, copyButton } from '@ant-design/x-markdown-mini';

const md = new XMarkdownMini({
  codeBlock: { header: false },                 // 关闭代码块 header
  table: {
    header: ({ markdown }) => [                  // 自定义表格 header
      { name: 'text', attrs: { class: 'md-tableblock-title', value: 'Table' } },
      copyButton(markdown),                      // 复制按钮（点击复制 markdown 源）
    ],
  },
});
```

`header` 取值：`true`（默认 header）/ `false`（无 header）/ 函数（返回自定义 `MiniNode` 节点）。自定义函数在 `renderNodes` 阶段执行，返回静态节点；用 `copyButton(payload)` 拼一个会被组件识别为可复制的按钮。
````

If `docs-site/docs/components.en-US.md` exists, add the English equivalent.

- [ ] **Step 2: Run all CI gates**

Run: `npm test && npm run lint && npm run check:bundle`
Expected: tests pass (≥95%), lint clean, bundle gate passes.

If `check:bundle` fails on a size budget, bump the offending budget in `scripts/check-bundle.mjs` by the observed delta and note it in the commit message. Re-run `npm run check:bundle` to confirm.

- [ ] **Step 3: Commit**

```bash
git add docs-site/docs/components.md docs-site/docs/components.en-US.md scripts/check-bundle.mjs
git commit -m "docs: document code/table header customization"
```

---

## Self-Review Notes (for the implementer)

- **Type consistency:** the copy node is `{ name: 'copy-button', attrs: { 'data-copy': <string>, class: 'md-copy-icon' } }` everywhere (renderer default, `copyButton()` helper, wxs `copyOf`, component `_copy` reads `dataset.copy`). Do not rename.
- **Copy payloads:** code = `token.text` (raw, NOT `enc()`-escaped); table = `token.raw` (markdown source). The plain-text fallbacks (`!supportsPre` / `!supportsTable`) intentionally get no header.
- **Layout:** header items are rendered inline (`wx:for`/`a:for`) so the label `<text>` and copy `<image>` remain direct flex children of `.md-codeblock-bar` / `.md-tableblock-bar` — existing CSS is unchanged. Do not wrap the whole header in a single nested `mini-node-renderer` (that would collapse the flex layout into one host child).
- **Existing tests:** the CodeHighlight test (`plugins.test.ts`) checks `JSON.stringify(...).toContain('custom-code')` and still passes once a header is added; the `miniNodeRenderer.test.ts` `find()` helper traverses `children` only, so new header assertions read `node.header` directly (do not rely on `find` for header/copy-button nodes).
