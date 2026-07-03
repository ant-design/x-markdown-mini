"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[667],{75233:function(o,d,e){e.r(d);var s=e(72269),m=e(93359),l=e(61788),c=e(19977),x=e(78003),t=e(2676),E=e(96057),h=e(83213),a=e(53683),i=e(64389),r=e(67294),_=e(61367),n=e(85893);function u(){return(0,n.jsx)(a.dY,{children:(0,n.jsx)(r.Suspense,{fallback:(0,n.jsx)(i.Z,{}),children:(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("div",{className:"markdown",children:[(0,n.jsxs)("h1",{id:"\u81EA\u5B9A\u4E49\u5E73\u53F0",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u81EA\u5B9A\u4E49\u5E73\u53F0",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u81EA\u5B9A\u4E49\u5E73\u53F0"]}),(0,n.jsx)("p",{children:_.texts[0].value}),(0,n.jsxs)("h2",{id:"\u5F15\u5165",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u5F15\u5165",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u5F15\u5165"]}),(0,n.jsx)(t.Z,{lang:"ts",children:_.texts[1].value}),(0,n.jsxs)("h2",{id:"\u4EE3\u7801\u793A\u4F8B",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u4EE3\u7801\u793A\u4F8B",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u4EE3\u7801\u793A\u4F8B"]}),(0,n.jsx)(t.Z,{lang:"ts",children:_.texts[2].value}),(0,n.jsxs)("p",{children:[_.texts[3].value,(0,n.jsx)("code",{children:_.texts[4].value}),_.texts[5].value,(0,n.jsx)("code",{children:_.texts[6].value}),_.texts[7].value]})]})})})})}d.default=u},61367:function(o,d,e){e.r(d),e.d(d,{texts:function(){return s}});const s=[{value:"\u81EA\u5B9A\u4E49\u5E73\u53F0\u7528\u4E8E\u628A\u540C\u4E00\u5957 Markdown token \u6620\u5C04\u5230\u65B0\u7684\u5C0F\u7A0B\u5E8F\u8282\u70B9\u80FD\u529B\u3002\u5F53\u524D\u5185\u7F6E\u5E73\u53F0\u53EA\u6709\u5FAE\u4FE1\u548C\u652F\u4ED8\u5B9D\uFF1B\u65B0\u589E\u5E73\u53F0\u65F6\u5E94\u8865 renderer\u3001\u7EC4\u4EF6\u4EA7\u7269\u548C\u5BF9\u5E94\u6D4B\u8BD5\u3002",paraId:0,tocIndex:0},{value:`import type { PlatformRenderer } from '@ant-design/x-markdown-mini';
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
`,paraId:2,tocIndex:2},{value:"\u771F\u6B63\u53D1\u5E03\u65B0\u5E73\u53F0\u8FD8\u9700\u8981\u5728 ",paraId:3,tocIndex:2},{value:"src/platforms/types.ts",paraId:3,tocIndex:2},{value:" \u589E\u52A0\u5E73\u53F0\u7C7B\u578B\uFF0C\u5E76\u5728 ",paraId:3,tocIndex:2},{value:"src/platforms/index.ts",paraId:3,tocIndex:2},{value:" \u589E\u52A0\u8FD0\u884C\u65F6\u63A2\u6D4B\u548C\u6CE8\u518C renderer\u3002",paraId:3,tocIndex:2}]}}]);
