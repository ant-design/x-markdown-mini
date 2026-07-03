"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[6],{39959:function(a,s,n){n.r(s);var d=n(72269),l=n(93359),u=n(61788),c=n(19977),x=n(78003),t=n(2676),h=n(96057),p=n(83213),o=n(53683),i=n(64389),r=n(67294),_=n(43510),e=n(85893);function m(){return(0,e.jsx)(o.dY,{children:(0,e.jsx)(r.Suspense,{fallback:(0,e.jsx)(i.Z,{}),children:(0,e.jsx)(e.Fragment,{children:(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h1",{id:"custom-platform",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#custom-platform",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Custom Platform"]}),(0,e.jsx)("p",{children:_.texts[0].value}),(0,e.jsxs)("h2",{id:"introduce",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#introduce",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Introduce"]}),(0,e.jsx)(t.Z,{lang:"ts",children:_.texts[1].value}),(0,e.jsxs)("h2",{id:"code-sample",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#code-sample",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Code sample"]}),(0,e.jsx)(t.Z,{lang:"ts",children:_.texts[2].value}),(0,e.jsxs)("p",{children:[_.texts[3].value,(0,e.jsx)("code",{children:_.texts[4].value}),_.texts[5].value,(0,e.jsx)("code",{children:_.texts[6].value}),_.texts[7].value]})]})})})})}s.default=m},43510:function(a,s,n){n.r(s),n.d(s,{texts:function(){return d}});const d=[{value:"Custom platforms map the same Markdown tokens to a new mini-program node capability set. The built-in platforms today are WeChat and Alipay only; adding another platform requires a renderer, component assets, and matching tests.",paraId:0,tocIndex:0},{value:`import type { PlatformRenderer } from '@ant-design/x-markdown-mini';
import { tokensToWechatNodes } from '@ant-design/x-markdown-mini';
`,paraId:1,tocIndex:1},{value:`import type { PlatformRenderer } from '@ant-design/x-markdown-mini';
import { tokensToWechatNodes } from '@ant-design/x-markdown-mini';

export const customRenderer: PlatformRenderer = {
  name: 'wechat',
  capabilities: {
    supportsOlStart: true,
    requiresHttpsImage: false,
    anchorHrefMode: 'data-href',
    supportsTable: true,
    supportsPre: true,
    supportsBlockquote: true,
  },
  renderTokens: tokensToWechatNodes,
};
`,paraId:2,tocIndex:2},{value:"Shipping a new platform also requires adding the platform type to ",paraId:3,tocIndex:2},{value:"src/platforms/types.ts",paraId:3,tocIndex:2},{value:", plus runtime detection and renderer registration in ",paraId:3,tocIndex:2},{value:"src/platforms/index.ts",paraId:3,tocIndex:2},{value:".",paraId:3,tocIndex:2}]}}]);
