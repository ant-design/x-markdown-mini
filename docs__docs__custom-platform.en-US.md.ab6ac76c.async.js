"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[6],{39959:function(a,d,e){e.r(d);var t=e(72269),l=e(93359),u=e(61788),x=e(19977),c=e(78003),o=e(2676),h=e(96057),p=e(83213),s=e(53683),r=e(64389),i=e(67294),_=e(43510),n=e(85893);function m(){return(0,n.jsx)(s.dY,{children:(0,n.jsx)(i.Suspense,{fallback:(0,n.jsx)(r.Z,{}),children:(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("div",{className:"markdown",children:[(0,n.jsxs)("h1",{id:"custom-platform",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#custom-platform",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"Custom Platform"]}),(0,n.jsx)("p",{children:_.texts[0].value}),(0,n.jsxs)("h2",{id:"introduce",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#introduce",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"Introduce"]}),(0,n.jsx)(o.Z,{lang:"ts",children:_.texts[1].value}),(0,n.jsxs)("h2",{id:"code-sample",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#code-sample",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"Code sample"]}),(0,n.jsx)(o.Z,{lang:"ts",children:_.texts[2].value}),(0,n.jsxs)("p",{children:[_.texts[3].value,(0,n.jsx)("code",{children:_.texts[4].value}),_.texts[5].value,(0,n.jsx)("code",{children:_.texts[6].value}),_.texts[7].value]})]})})})})}d.default=m},43510:function(a,d,e){e.r(d),e.d(d,{texts:function(){return t}});const t=[{value:"Custom platforms map the same Markdown tokens to a new mini-program node capability set. The built-in platforms today are WeChat and Alipay only; adding another platform requires a renderer, component assets, and matching tests.",paraId:0,tocIndex:0},{value:`import type { PlatformRenderer } from '@ant-design/x-markdown-mini';
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
