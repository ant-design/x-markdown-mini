"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[706],{75180:function(s,d,t){t.r(d);var o=t(72269),u=t(93359),m=t(61788),x=t(19977),c=t(78003),i=t(2676),h=t(96057),v=t(83213),a=t(53683),r=t(64389),_=t(67294),n=t(43423),e=t(85893);function l(){return(0,e.jsx)(a.dY,{children:(0,e.jsx)(_.Suspense,{fallback:(0,e.jsx)(r.Z,{}),children:(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h1",{id:"custom-plugin",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#custom-plugin",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Custom Plugin"]}),(0,e.jsxs)("p",{children:[n.texts[0].value,(0,e.jsx)("code",{children:n.texts[1].value}),n.texts[2].value,(0,e.jsx)("code",{children:n.texts[3].value}),n.texts[4].value,(0,e.jsx)("code",{children:n.texts[5].value}),n.texts[6].value]}),(0,e.jsxs)("h2",{id:"introduce",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#introduce",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Introduce"]}),(0,e.jsx)(i.Z,{lang:"ts",children:n.texts[7].value}),(0,e.jsxs)("h2",{id:"code-sample",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#code-sample",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Code sample"]}),(0,e.jsxs)("p",{children:[n.texts[8].value,(0,e.jsx)("code",{children:n.texts[9].value}),n.texts[10].value,(0,e.jsx)("code",{children:n.texts[11].value}),n.texts[12].value,(0,e.jsx)("code",{children:n.texts[13].value}),n.texts[14].value]})]}),(0,e.jsx)(a.Dl,{demo:{id:"docs-docs-plugins-custom-demo-footnotedemo"},previewerProps:{filename:"src/demos/plugins/FootnoteDemo.tsx"}}),(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h2",{id:"plugin-structure",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#plugin-structure",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Plugin structure"]}),(0,e.jsx)("p",{children:n.texts[15].value}),(0,e.jsx)(i.Z,{lang:"ts",children:n.texts[16].value}),(0,e.jsxs)("h2",{id:"rules",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#rules",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Rules"]}),(0,e.jsxs)("ul",{children:[(0,e.jsx)("li",{children:n.texts[17].value}),(0,e.jsxs)("li",{children:[(0,e.jsx)("code",{children:n.texts[18].value}),n.texts[19].value,(0,e.jsx)("code",{children:n.texts[20].value}),n.texts[21].value]}),(0,e.jsx)("li",{children:n.texts[22].value}),(0,e.jsx)("li",{children:n.texts[23].value})]})]})]})})})}d.default=l},43423:function(s,d,t){t.r(d),t.d(d,{texts:function(){return o}});const o=[{value:"Use ",paraId:0,tocIndex:0},{value:"XMarkdownExtension",paraId:0,tocIndex:0},{value:" for custom syntax: the tokenizer and ",paraId:0,tocIndex:0},{value:"miniRenderer",paraId:0,tocIndex:0},{value:" live in the same extension and emit ",paraId:0,tocIndex:0},{value:"MiniNode",paraId:0,tocIndex:0},{value:" directly, with no HTML round-trip.",paraId:0,tocIndex:0},{value:`import type { XMarkdownExtension } from '@ant-design/x-markdown-mini';
import { XMarkdownMini } from '@ant-design/x-markdown-mini';
`,paraId:1,tocIndex:1},{value:"The built-in footnote plugin as an example, using the syntax ",paraId:2,tocIndex:2},{value:"Markdown[^1:a lightweight markup language]",paraId:2,tocIndex:2},{value:". The host page renders the marker and popover; the built-in ",paraId:2,tocIndex:2},{value:"Markdown",paraId:2,tocIndex:2},{value:" component just needs its ",paraId:2,tocIndex:2},{value:"footnote",paraId:2,tocIndex:2},{value:" prop.",paraId:2,tocIndex:2},{value:"The full implementation of the footnote plugin above:",paraId:3,tocIndex:3},{value:`import type { MiniNode, Tokens, XMarkdownExtension } from '@ant-design/x-markdown-mini';

const RULE = /^\\[\\^(?:([^\\]:]+):)?([\\s\\S]+?)\\]/;

export function Footnote(): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'footnote',
        level: 'inline',
        start(src: string): number | undefined {
          const i = src.indexOf('[^');
          return i < 0 ? undefined : i;
        },
        tokenizer(src: string): Tokens.Generic | undefined {
          const m = RULE.exec(src);
          if (!m) return undefined;
          return {
            type: 'footnote',
            raw: m[0],
            label: (m[1] ?? 'note').trim(),
            content: m[2].trim(),
          } as unknown as Tokens.Generic;
        },
        miniRenderer(token): MiniNode {
          const t = token as unknown as { label: string; content: string };
          return {
            name: 'footnote',
            tag: 'footnote',
            attrs: {
              label: t.label,
              content: t.content,
              class: 'md-footnote',
            },
          };
        },
      },
    ],
  };
}
`,paraId:4,tocIndex:3},{value:"The tokenizer decides how source text becomes a token.",paraId:5,tocIndex:4},{value:"miniRenderer",paraId:5,tocIndex:4},{value:" decides how a token becomes a ",paraId:5,tocIndex:4},{value:"MiniNode",paraId:5,tocIndex:4},{value:".",paraId:5,tocIndex:4},{value:"Tokens not handled by a plugin continue through the platform renderer.",paraId:5,tocIndex:4},{value:"A user extension with the same name takes precedence over the auto-synthesized custom-component tokenizer.",paraId:5,tocIndex:4}]}}]);
