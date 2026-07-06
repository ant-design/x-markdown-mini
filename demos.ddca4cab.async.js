"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[433],{8267:function(B,d,e){e.r(d),e.d(d,{default:function(){return c}});var m=e(67294),o=e(87534),u=e(61344),r=e(85893);function c(){return(0,r.jsx)(o.Z,{copy:u.EN})}},72565:function(B,d,e){e.r(d),e.d(d,{default:function(){return c}});var m=e(67294),o=e(87534),u=e(61344),r=e(85893);function c(){return(0,r.jsx)(o.Z,{copy:u.ZH})}},79563:function(B,d,e){e.r(d),e.d(d,{default:function(){return p}});var m=e(67294),o=e(15335),u=e(85893),r=`## \u7EC4\u4EF6\u6E32\u67D3

\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 \`content\`\uFF0C\u7EC4\u4EF6\u5185\u90E8\u5B8C\u6210\u89E3\u6790\u548C\u6E32\u67D3\u3002

- \u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u4E92\u4E0D\u5E72\u6270
- \u5378\u8F7D\u65F6\u81EA\u52A8\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001
- [\u67E5\u770B API](https://github.com/ant-design/x-markdown-mini)
`,c=`Page({
  data: {
    content: '## \u7EC4\u4EF6\u6E32\u67D3\\n\\n\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 content\u2026',
  },
  onComplete() {
    console.log('render complete');
  },
});`,n=`.page {
  padding: 16px;
}`,l=[{key:"markdown",title:"Markdown \u7EC4\u4EF6",description:"\u4E1A\u52A1\u9875\u4F18\u5148\u63A5\u5165 Markdown \u7EC4\u4EF6\u3002\u7EC4\u4EF6\u5185\u90E8\u521B\u5EFA\u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u5E76\u5728\u751F\u547D\u5468\u671F\u7ED3\u675F\u65F6\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001\u3002",navTitle:"Markdown \u7EC4\u4EF6",markdown:r,alipay:{template:`<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    onRenderComplete="onComplete"
  />
</view>`,script:c,style:n,json:`{
  "defaultTitle": "Markdown \u7EC4\u4EF6",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`},wechat:{template:`<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    bind:rendercomplete="onComplete"
  />
</view>`,script:c,style:n,json:`{
  "navigationBarTitleText": "Markdown \u7EC4\u4EF6",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}}];function p(){return(0,u.jsx)(o.O,{demos:l,codeMinHeight:560})}},44928:function(B,d,e){e.r(d),e.d(d,{default:function(){return a}});var m=e(67294),o=e(15335),u=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,r=`.page {
  padding: 16px;
}
`,c=`const { renderNodes } = require('@ant-design/x-markdown-mini');

const content = '# Hello\\n\\n**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002\\n\\n- \u65E0\u9700 WebView\\n- \u65E0\u9700 HTML \u767D\u540D\u5355';

Page({
  data: {
    nodes: [],
  },
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content,
        platform: 'alipay',
        selectable: true,
      }),
    });
  },
});
`,n=`{
  "defaultTitle": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,l=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,p=`.page {
  padding: 16px;
}
`,v=`const { renderNodes } = require('@ant-design/x-markdown-mini');

const content = '# Hello\\n\\n**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002\\n\\n- \u65E0\u9700 WebView\\n- \u65E0\u9700 HTML \u767D\u540D\u5355';

Page({
  data: {
    nodes: [],
  },
  onLoad() {
    this.setData({
      nodes: renderNodes({
        content,
        platform: 'wechat',
        selectable: true,
      }),
    });
  },
});
`,N=`{
  "navigationBarTitleText": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,i=e(85893),P=`# Hello

**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002

- \u65E0\u9700 WebView
- \u65E0\u9700 HTML \u767D\u540D\u5355
`,C=[{key:"render-nodes",title:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",description:"\u63A8\u8350\u5148\u7528 renderNodes \u751F\u6210 MiniNode[]\uFF0C\u518D\u4EA4\u7ED9 MiniNodeRenderer \u6216\u81EA\u5B9A\u4E49\u6E32\u67D3\u7EC4\u4EF6\u63A5\u7BA1\u3002",navTitle:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",previewTitle:"\u771F\u5B9E\u9875\u9762\u6587\u4EF6",platformNotes:{alipay:"index.axml / dist components",wechat:"index.wxml / components"},markdown:P,alipay:{template:u,script:c,style:r,json:n},wechat:{template:l,script:v,style:p,json:N}}];function a(){return(0,i.jsx)(o.O,{demos:C,codeMinHeight:560})}},4015:function(B,d,e){e.r(d),e.d(d,{default:function(){return f}});var m=e(67294),o=e(19632),u=e.n(o),r=e(5574),c=e.n(r),n=e(10744),l=e(9579),p=e(21483),v=e(87397),N=e(83478),i=e(38116),P=e(5114),C=e(7037),a=e(85893),t=P._B,$=[50,30,20,10,50],ee=[300,200,100,0],ae=900,re=2800;function ie(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function J(){var g=(0,N.useDocPlatform)(),E=c()(g,1),h=E[0],x=(0,m.useRef)(null),y=(0,m.useCallback)(function(){return x.current||(x.current=new n.XMarkdownMini({gfm:!0,extensions:[(0,l.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),x.current},[]),A=(0,m.useMemo)(function(){try{return y().renderNodes({content:t,platform:h,selectable:!0})}catch(T){return[]}},[h,y]),M=(0,m.useState)(A),k=c()(M,2),H=k[0],b=k[1],R=(0,m.useState)(!1),W=c()(R,2),O=W[0],S=W[1],s=(0,m.useState)(!1),D=c()(s,2),F=D[0],Y=D[1],I=(0,m.useRef)(0),z=(0,m.useRef)(),K=(0,m.useRef)(),G=(0,m.useCallback)(function(){var T=y(),L=I.current+1;I.current=L,T.reset(),b([]),S(!0);try{T.renderNodes({content:t,platform:h,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:ee,charDelay:$}},onPatch:function(oe){I.current===L&&b(u()(oe))},onRenderComplete:function(){I.current===L&&(S(!1),z.current=setTimeout(G,re))}})}catch(te){I.current===L&&(b(A),S(!1))}},[h,y,A]);(0,m.useEffect)(function(){if(ie()||F){b(A),S(!1);return}return b(A),S(!1),K.current=setTimeout(G,ae),function(){var T;I.current+=1,K.current&&clearTimeout(K.current),z.current&&clearTimeout(z.current),(T=x.current)===null||T===void 0||T.reset()}},[h,G,A,F]);var V=(0,m.useMemo)(function(){return(0,i.a)(H,O)},[H,O]),Q=(0,a.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!F,"aria-label":F?"Play streaming demo":"Pause streaming demo",title:F?"Play":"Pause",onClick:function(){return Y(function(L){return!L})},children:F?(0,a.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,a.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,a.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,a.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,a.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,a.jsx)(v.PhoneShell,{platform:h,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:Q,children:V})})}var Z=e(18181),U=e(49682),X={eyebrow:"Mini-programs \xB7 Streaming Markdown",heroTitle:"Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer",heroSubtitle:(0,a.jsxs)(a.Fragment,{children:["Native WeChat and Alipay rendering: Markdown parses straight into per-platform"," ",(0,a.jsx)("code",{children:"MiniNode[]"}),", streamed token by token, with no WebView and no Web HTML pushed into a mini program."]}),facts:[{term:"Token \u2192 Node",desc:"marked lexer output flows straight into platform renderers"},{term:"Streaming",desc:"Stable blocks are cached while the open tail updates"},{term:"WeChat / Alipay",desc:"Platform quirks stay inside the transformer layer"}],install:{copyLabel:"Copy",copySuccessText:"Copied",playgroundHref:"/playground-en",playgroundLabel:"Playground"},scrollCue:"Architecture & streaming",arch:{title:"Native mini-program rendering",body:(0,a.jsxs)(a.Fragment,{children:["Mini programs have no DOM, and ",(0,a.jsx)("code",{children:"rich-text"})," brings its own whitelist. x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer, no adapter matrix, and platform differences stay explicit in the two transformers."]}),proof:[{icon:"math",title:"Math",desc:(0,a.jsx)(a.Fragment,{children:"LaTeX plugin on demand"})},{icon:"ext",title:"Custom extensions",desc:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("code",{children:"miniRenderer"})," emits nodes"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,a.jsx)(a.Fragment,{children:"Inherited from marked parsing"})},{icon:"stream",title:"Streaming-friendly",desc:(0,a.jsx)(a.Fragment,{children:"Stable-block cache, tail-only rerender"})}]}},q={title:"x-markdown-mini architecture",desc:"Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function f(){return(0,a.jsx)("div",{className:"markdown",children:(0,a.jsxs)("main",{className:"xmd-landing",children:[(0,a.jsx)(Z.Z,{copy:X,media:(0,a.jsx)(J,{})}),(0,a.jsx)(U.Z,{copy:X,diagram:q})]})})}},41540:function(B,d,e){e.r(d),e.d(d,{default:function(){return f}});var m=e(67294),o=e(19632),u=e.n(o),r=e(5574),c=e.n(r),n=e(10744),l=e(9579),p=e(21483),v=e(87397),N=e(83478),i=e(38116),P=e(5114),C=e(7037),a=e(85893),t=P._B,$=[50,30,20,10,50],ee=[300,200,100,0],ae=900,re=2800;function ie(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function J(){var g=(0,N.useDocPlatform)(),E=c()(g,1),h=E[0],x=(0,m.useRef)(null),y=(0,m.useCallback)(function(){return x.current||(x.current=new n.XMarkdownMini({gfm:!0,extensions:[(0,l.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),x.current},[]),A=(0,m.useMemo)(function(){try{return y().renderNodes({content:t,platform:h,selectable:!0})}catch(T){return[]}},[h,y]),M=(0,m.useState)(A),k=c()(M,2),H=k[0],b=k[1],R=(0,m.useState)(!1),W=c()(R,2),O=W[0],S=W[1],s=(0,m.useState)(!1),D=c()(s,2),F=D[0],Y=D[1],I=(0,m.useRef)(0),z=(0,m.useRef)(),K=(0,m.useRef)(),G=(0,m.useCallback)(function(){var T=y(),L=I.current+1;I.current=L,T.reset(),b([]),S(!0);try{T.renderNodes({content:t,platform:h,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:ee,charDelay:$}},onPatch:function(oe){I.current===L&&b(u()(oe))},onRenderComplete:function(){I.current===L&&(S(!1),z.current=setTimeout(G,re))}})}catch(te){I.current===L&&(b(A),S(!1))}},[h,y,A]);(0,m.useEffect)(function(){if(ie()||F){b(A),S(!1);return}return b(A),S(!1),K.current=setTimeout(G,ae),function(){var T;I.current+=1,K.current&&clearTimeout(K.current),z.current&&clearTimeout(z.current),(T=x.current)===null||T===void 0||T.reset()}},[h,G,A,F]);var V=(0,m.useMemo)(function(){return(0,i.a)(H,O)},[H,O]),Q=(0,a.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!F,"aria-label":F?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:F?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return Y(function(L){return!L})},children:F?(0,a.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,a.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,a.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,a.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,a.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,a.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,a.jsx)(v.PhoneShell,{platform:h,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:Q,children:V})})}var Z=e(18181),U=e(49682),X={eyebrow:"\u5C0F\u7A0B\u5E8F \xB7 \u6D41\u5F0F Markdown",heroTitle:"\u591A\u7AEF\uFF0C\u6D41\u5F0F\u53CB\u597D\uFF0C\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668",heroSubtitle:(0,a.jsxs)(a.Fragment,{children:["\u539F\u751F\u7684\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u6E32\u67D3\uFF1AMarkdown \u76F4\u63A5\u89E3\u6790\u4E3A\u5404\u7AEF\u7684 ",(0,a.jsx)("code",{children:"MiniNode[]"}),"\uFF0Ctoken \u7EA7\u6D41\u5F0F\u76F4\u51FA\uFF0C\u4E0D\u7ECF\u8FC7 WebView\uFF0C\u4E5F\u4E0D\u628A Web HTML \u585E\u8FDB\u5C0F\u7A0B\u5E8F\u3002"]}),facts:[{term:"Token \u2192 Node",desc:"marked \u8BCD\u6CD5\u7ED3\u679C\u76F4\u63A5\u8FDB\u5165\u5E73\u53F0 renderer"},{term:"Streaming",desc:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u7B97\u672A\u5B8C\u6210\u5C3E\u90E8"},{term:"WeChat / Alipay",desc:"\u5E73\u53F0\u5DEE\u5F02\u5728 transformer \u5185\u6536\u655B"}],install:{copyLabel:"\u590D\u5236",copySuccessText:"\u5DF2\u590D\u5236",playgroundHref:"/playground",playgroundLabel:"\u5728\u7EBF\u4F53\u9A8C"},scrollCue:"\u67B6\u6784\u4E0E\u6D41\u5F0F\u539F\u7406",arch:{title:"\u539F\u751F\u5C0F\u7A0B\u5E8F\u6E32\u67D3",body:(0,a.jsxs)(a.Fragment,{children:["\u5C0F\u7A0B\u5E8F\u6CA1\u6709 DOM\uFF0C",(0,a.jsx)("code",{children:"rich-text"})," \u53C8\u4F1A\u91CD\u65B0\u5957\u767D\u540D\u5355\u3002x-markdown-mini \u76F4\u63A5\u4EA7\u51FA\u53EF\u6E32\u67D3\u7684\u8282\u70B9\u6811\uFF1Alexer \u4E4B\u540E\u6CA1\u6709\u4E2D\u95F4 IR\uFF0C\u6CA1\u6709\u9002\u914D\u5668\u77E9\u9635\uFF0C\u5E73\u53F0\u5DEE\u5F02\u5728\u4E24\u4E2A transformer \u91CC\u660E\u8BF4\u3002"]}),proof:[{icon:"math",title:"\u516C\u5F0F",desc:(0,a.jsx)(a.Fragment,{children:"LaTeX \u63D2\u4EF6\u6309\u9700\u5F15\u5165"})},{icon:"ext",title:"\u81EA\u5B9A\u4E49\u62D3\u5C55",desc:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("code",{children:"miniRenderer"})," \u76F4\u51FA\u8282\u70B9"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,a.jsx)(a.Fragment,{children:"\u7EE7\u627F marked \u89E3\u6790\u80FD\u529B"})},{icon:"stream",title:"\u6D41\u5F0F\u53CB\u597D",desc:(0,a.jsx)(a.Fragment,{children:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u8DD1\u5C3E\u90E8"})}]}},q={title:"x-markdown-mini \u67B6\u6784\u56FE",desc:"Markdown \u7ECF marked lexer\u3001Token \u5230\u5E73\u53F0 renderer \u8F93\u51FA MiniNode\uFF1B\u6D41\u5F0F\u7ECF StreamingProcessor \u590D\u7528\u540C\u4E00 transform\u3002",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function f(){return(0,a.jsx)("div",{className:"markdown",children:(0,a.jsxs)("main",{className:"xmd-landing",children:[(0,a.jsx)(Z.Z,{copy:X,media:(0,a.jsx)(J,{})}),(0,a.jsx)(U.Z,{copy:X,diagram:q})]})})}},82175:function(B,d,e){e.r(d);var m=e(67294),o=e(45960),u=e(85893),r=`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \`inline code\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)

> \u5F15\u7528\u5757\uFF1A\u7528\u4E8E\u6F14\u793A blockquote \u7684\u6E32\u67D3\u964D\u7EA7\u3002
`,c=`.page { padding: 24rpx; }
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}`,n=`Page({
  data: {
    content: \`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \\\`inline code\\\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)
\`,
  },
});`;d.default=function(){return(0,u.jsx)(o.DemoCard,{markdown:r,alipay:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:n,style:c,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`},wechat:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:n,style:c,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}})}},16337:function(B,d,e){e.r(d);var m=e(67294),o=e(45960),u=e(85893),r="## \u56F4\u680F\u4EE3\u7801\u5757\n\n```js\nconst greet = (name) => `Hello ${name}`;\ngreet('mini');\n```\n",c="Page({\n  data: {\n    content: '\\`\\`\\`js\\nconst greet = (name) => \\`Hello \\${name}\\`;\\n\\`\\`\\`',\n  },\n});";d.default=function(){return(0,u.jsx)(o.DemoCard,{markdown:r,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:c},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:c}})}},22389:function(B,d,e){e.r(d);var m=e(67294),o=e(45960),u=e(85893),r=`## GFM \u8868\u683C

| \u5E73\u53F0   | platform   |
|--------|------------|
| \u5FAE\u4FE1   | \`wechat\`  |
| \u652F\u4ED8\u5B9D | \`alipay\`  |
| \u6296\u97F3   | \`douyin\`  |
`,c=`Page({
  data: {
    content: \`| \u5E73\u53F0 | platform |
|------|----------|
| \u5FAE\u4FE1 | wechat   |
| \u652F\u4ED8\u5B9D | alipay |\`,
  },
});`;d.default=function(){return(0,u.jsx)(o.DemoCard,{markdown:r,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:c},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:c}})}},1248:function(B,d,e){e.r(d);var m=e(67294),o=e(5114),u=e(85893);d.default=function(){return(0,u.jsx)(o.XQ,{})}},64558:function(B,d,e){e.r(d);var m=e(67294),o=e(21483),u=e(45960),r=e(85893),c="```",n="\u9AD8\u4EAE\u7531 `highlight.js` \u5B8C\u6210\uFF1A\n\n".concat(c,`ts
function greet(name: string): string {
  // \u6A21\u677F\u5B57\u7B26\u4E32 + \u7C7B\u578B\u6807\u6CE8
  return \`Hello, \${name}\`;
}
`).concat(c,`

\u672A\u77E5\u8BED\u8A00\u4F1A\u56DE\u9000\u5230\u666E\u901A\u4EE3\u7801\u5757\u3002
`),l=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,p=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`,v=[(0,o.default)()];d.default=function(){return(0,r.jsx)(u.DemoCard,{markdown:n,extensions:v,files:[{name:"usage.ts",lang:"ts",code:l},{name:"style",lang:"css",code:p},{name:"input.md",lang:"md",code:n}]})}},31792:function(B,d,e){e.r(d),e.d(d,{default:function(){return v}});var m=e(67294),o=`import type { MiniNode, Tokens, XMarkdownExtension } from '@ant-design/x-markdown-mini';

/**
 * \u8986\u76D6\u5185\u7F6E \`table\` \u6E32\u67D3\u3002
 *
 * extension \u7684 \`name\` \u547D\u4E2D\u5185\u7F6E token \u7C7B\u578B\uFF08\u8FD9\u91CC\u662F \`table\`\uFF09\u65F6\uFF0C\`miniRenderer\`
 * \u4F1A\u5B8C\u5168\u63A5\u7BA1\u8BE5 token \u7684\u6E32\u67D3\uFF0C\u66FF\u6362\u5185\u7F6E\u7ED3\u679C \u2014\u2014 \u4E0E CodeHighlight \u8986\u76D6 \`code\` \u540C\u7406\u3002
 * \u8FD9\u91CC\u53EA\u63D0\u4F9B \`miniRenderer\`\u3001\u4E0D\u63D0\u4F9B \`tokenizer\`\uFF1A\u89E3\u6790\u4ECD\u8D70 marked \u5185\u7F6E\u8868\u683C\u5206\u8BCD\u5668\uFF0C
 * \u53EA\u6709\u300CToken \u2192 MiniNode\u300D\u8FD9\u4E00\u6B65\u88AB\u66FF\u6362\u3002\u628A\u8868\u683C\u6539\u6E32\u67D3\u6210\u300C\u6BCF\u884C\u4E00\u6761\u300D\u7684\u5217\u8868\u3002
 *
 * \u8FD4\u56DE \`null\` \u6216\u7A7A\u6570\u7EC4\u5219\u56DE\u9000\u5230\u5185\u7F6E\u6E32\u67D3\u3002
 */
export function createCustomTableExtension(): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'table',
        level: 'block',
        miniRenderer(token): MiniNode[] {
          const t = token as unknown as Tokens.Table;
          const headers = (t.header ?? []).map((cell) => cell.text);
          const items: MiniNode[] = (t.rows ?? []).map((row) => {
            const line = row
              .map((cell, i) => (headers[i] ? \`\${headers[i]}\uFF1A\${cell.text}\` : cell.text))
              .join('\uFF0C');
            return {
              name: 'li',
              attrs: { class: 'md-list-item' },
              children: [
                { name: 'text', attrs: { class: 'md-list-marker', value: '\u2022' } },
                {
                  name: 'div',
                  attrs: { class: 'md-list-content' },
                  children: [{ name: 'text', attrs: { value: line } }],
                },
              ],
            };
          });
          return [{ name: 'ul', attrs: { class: 'md-list' }, children: items }];
        },
      },
    ],
  };
}
`,u=e(45960),r=e(66579),c=e(85893),n=`| \u5E73\u53F0 | \u72B6\u6001 | \u8BF4\u660E |
| --- | --- | --- |
| \u5FAE\u4FE1 | \u2705 | \u5DF2\u652F\u6301 |
| \u652F\u4ED8\u5B9D | \u2705 | \u5DF2\u652F\u6301 |
`,l=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createCustomTableExtension } from './customTableExtension';

// name \u547D\u4E2D\u5185\u7F6E 'table'\uFF1AminiRenderer \u5B8C\u5168\u63A5\u7BA1\u8868\u683C\u6E32\u67D3
//\uFF08\u4E0E CodeHighlight \u8986\u76D6 'code' \u540C\u7406\uFF09\u3002\u4E0D\u63D0\u4F9B tokenizer\uFF0C\u89E3\u6790\u4ECD\u8D70\u5185\u7F6E\u5206\u8BCD\u5668\u3002
const md = new XMarkdownMini({
  extensions: [createCustomTableExtension()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,p=[(0,r.createCustomTableExtension)()],v=function(){return(0,c.jsx)(u.DemoCard,{markdown:n,extensions:p,files:[{name:"customTableExtension.ts",lang:"ts",code:o},{name:"usage.ts",lang:"ts",code:l},{name:"input.md",lang:"md",code:n}]})}},59659:function(B,d,e){e.r(d),e.d(d,{default:function(){return v}});var m=e(67294),o=`import type {
  MiniNode,
  RenderContext,
  Token,
  Tokens,
  XMarkdownExtension,
} from '@ant-design/x-markdown-mini';

const FOOTNOTE_RULE = /^\\[\\^(?:([^\\]:]+):)?([\\s\\S]+?)\\]/;

export function createFootnoteExtension(defaultLabel = '\u6CE8'): XMarkdownExtension {
  return {
    extensions: [
      {
        name: 'footnote',
        level: 'inline',
        start(src: string): number | undefined {
          const index = src.indexOf('[^');
          return index < 0 ? undefined : index;
        },
        tokenizer(src: string): Tokens.Generic | undefined {
          const match = FOOTNOTE_RULE.exec(src);
          if (!match) return undefined;
          return {
            type: 'footnote',
            raw: match[0],
            label: (match[1] ?? defaultLabel).trim(),
            content: match[2].trim(),
          } as unknown as Tokens.Generic;
        },
        miniRenderer(token: Token, _ctx: RenderContext): MiniNode {
          const footnote = token as unknown as { label: string; content: string };
          return {
            name: 'footnote',
            tag: 'footnote',
            attrs: {
              label: footnote.label,
              content: footnote.content,
              class: 'md-footnote',
            },
          };
        },
      },
    ],
  };
}
`,u=e(45960),r=e(84629),c=e(85893),n=`Markdown[^1:\u4E00\u79CD\u8F7B\u91CF\u6807\u8BB0\u8BED\u8A00] \u5F88\u9002\u5408\u79FB\u52A8\u7AEF\u9605\u8BFB\uFF0C
\u4E5F\u65B9\u4FBF\u6A21\u578B\u6D41\u5F0F\u8F93\u51FA[^2:LLM \u9010 token \u8FD4\u56DE\u6587\u672C]\u3002
`,l=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createFootnoteExtension } from './footnoteExtension';

const md = new XMarkdownMini({
  extensions: [createFootnoteExtension()],
});

// \u4EA7\u51FA name: 'footnote' \u7684 MiniNode\uFF0C
// marker \u4E0E\u5F39\u5C42\u7531\u5BBF\u4E3B\u9875\u9762\u6E32\u67D3\uFF08\u7EC4\u4EF6\u5C42\u8D70 slot / \u62BD\u8C61\u8282\u70B9\uFF09
const nodes = md.renderNodes({ content, platform: 'auto' });`,p=[(0,r.createFootnoteExtension)()],v=function(){return(0,c.jsx)(u.DemoCard,{markdown:n,extensions:p,files:[{name:"footnoteExtension.ts",lang:"ts",code:o},{name:"usage.ts",lang:"ts",code:l},{name:"input.md",lang:"md",code:n}]})}},39666:function(B,d,e){e.r(d);var m=e(67294),o=e(9579),u=e(45960),r=e(85893),c=`\u8D28\u80FD\u65B9\u7A0B\uFF1A$E=mc^2$

\u5757\u7EA7\u516C\u5F0F\uFF1A

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

\u4E5F\u652F\u6301 \\( a^2 + b^2 = c^2 \\) \u4E0E \\[ x = y + z \\]
`,n=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex({ katexOptions: { throwOnError: false } })],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,l=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`,p=[(0,o.default)({katexOptions:{throwOnError:!1}})];d.default=function(){return(0,r.jsx)(u.DemoCard,{markdown:c,extensions:p,files:[{name:"usage.ts",lang:"ts",code:n},{name:"style",lang:"css",code:l},{name:"input.md",lang:"md",code:c}]})}},5065:function(B,d,e){e.r(d);var m=e(67294),o=e(45960),u=e(85893),r=`# \u5757\u7EA7\u52A8\u753B

\u65B0\u5757\u6DE1\u5165\uFF1B\u5DF2 commit \u7684\u5757\u5F15\u7528\u7A33\u5B9A\uFF0C\u4E0D\u91CD\u653E\u3002
`,c=`.md-animate-block {
  animation: md-fade-in 320ms cubic-bezier(.2,.7,.2,1) both;
}
@keyframes md-fade-in {
  from { opacity: 0; transform: translateY(8rpx); }
  to   { opacity: 1; transform: none; }
}`,n=`Page({
  data: {
    content: '# \u52A8\u753B\\n\u770B\u6BCF\u4E2A\u6BB5\u843D\u8FDB\u5165\u65F6\u7684\u6DE1\u5165\u3002',
    streaming: { hasNextChunk: false, enableAnimation: true },
  },
});`;d.default=function(){return(0,u.jsx)(o.DemoCard,{markdown:r,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:n,style:c},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:n,style:c}})}},8386:function(B,d,e){e.r(d),e.d(d,{default:function(){return C}});var m=e(67294),o=e(15335),u=`<view class="page">
  <button class="primary" onTap="startStream">\u5F00\u59CB\u6D41\u5F0F\u8F93\u51FA</button>
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    onRenderComplete="onComplete"
  />
</view>
`,r=`.page {
  padding: 16px;
}

.primary {
  margin-bottom: 12px;
  color: #fff;
  background: #1677ff;
  border-radius: 8px;
}
`,c=`let timer = null;

const FULL = '# \u6D41\u5F0F\u8F93\u51FA\\n\\n\u8FB9\u5582\u6570\u636E\u8FB9\u6E32\u67D3\u3002\u5DF2\u7A33\u5B9A\u7684\u5757\u53EA\u89E3\u6790\u4E00\u6B21\u3002';

Page({
  data: {
    content: '',
    streaming: false,
  },
  onUnload() {
    if (timer) clearTimeout(timer);
  },
  startStream() {
    if (timer) clearTimeout(timer);
    let index = 0;
    const tick = () => {
      index = Math.min(index + 4, FULL.length);
      const done = index >= FULL.length;
      this.setData({
        content: FULL.slice(0, index),
        streaming: { hasNextChunk: !done, enableAnimation: true },
      });
      if (!done) timer = setTimeout(tick, 50);
    };
    tick();
  },
  onComplete() {
    console.log('stream complete');
  },
});
`,n=`{
  "defaultTitle": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
`,l=`<view class="page">
  <button class="primary" bindtap="startStream">\u5F00\u59CB\u6D41\u5F0F\u8F93\u51FA</button>
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    bind:rendercomplete="onComplete"
  />
</view>
`,p=`.page {
  padding: 16px;
}

.primary {
  margin-bottom: 12px;
  color: #fff;
  background: #1677ff;
  border-radius: 8px;
}
`,v=`let timer = null;

const FULL = '# \u6D41\u5F0F\u8F93\u51FA\\n\\n\u8FB9\u5582\u6570\u636E\u8FB9\u6E32\u67D3\u3002\u5DF2\u7A33\u5B9A\u7684\u5757\u53EA\u89E3\u6790\u4E00\u6B21\u3002';

Page({
  data: {
    content: '',
    streaming: false,
  },
  onUnload() {
    if (timer) clearTimeout(timer);
  },
  startStream() {
    if (timer) clearTimeout(timer);
    let index = 0;
    const tick = () => {
      index = Math.min(index + 4, FULL.length);
      const done = index >= FULL.length;
      this.setData({
        content: FULL.slice(0, index),
        streaming: { hasNextChunk: !done, enableAnimation: true },
      });
      if (!done) timer = setTimeout(tick, 50);
    };
    tick();
  },
  onComplete() {
    console.log('stream complete');
  },
});
`,N=`{
  "navigationBarTitleText": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
`,i=e(85893),P=[{key:"basic",title:"\u57FA\u7840\u6D41\u5F0F",description:"\u6BCF\u8F6E\u4F20\u5165\u7D2F\u8BA1 Markdown\uFF0C\u6700\u540E\u4E00\u8F6E\u628A hasNextChunk \u7F6E\u4E3A false\uFF0C\u5185\u90E8\u4F1A flush \u5269\u4F59 tail\u3002",navTitle:"\u6D41\u5F0F\u8F93\u51FA",markdown:`# \u6D41\u5F0F\u8F93\u51FA

\u6A21\u578B\u8FB9\u751F\u6210\uFF0CUI \u8FB9\u6E32\u67D3\uFF0C\u50CF\u6253\u5B57\u673A\u4E00\u6837\u9010\u5B57\u5448\u73B0\u3002

- \u53CC\u7A7A\u884C\u5916\u7684\u7A33\u5B9A\u5757\u53EA\u89E3\u6790\u4E00\u6B21
- \u6BCF\u8F6E\u53EA\u91CD\u89E3\u6790 tail
- **\u672A\u95ED\u5408\u7684\u7C97\u4F53**\u3001\`\u672A\u95ED\u5408\u884C\u5185\u4EE3\u7801\` \u4F1A\u5728 tail \u81EA\u52A8\u8865\u5168

\u53F3\u4E0A\u89D2\u53EF\u6682\u505C / \u91CD\u64AD\u8FD9\u6BB5\u6D41\u5F0F\u6F14\u793A\u3002`,animation:!0,autoStream:!0,alipay:{template:u,script:c,style:r,json:n},wechat:{template:l,script:v,style:p,json:N}}];function C(){return(0,i.jsx)(o.O,{demos:P,codeMinHeight:560})}},83538:function(B,d,e){e.r(d);var m=e(67294),o=e(45960),u=e(85893),r=`# \u6253\u5B57\u673A\u6A21\u5F0F

\u6309\u53E5\u53F7\u3001\u95EE\u53F7\u3001\u6362\u884C\u5207\u5757\uFF1B\u6BCF\u5757\u518D\u6309 charDelay \u9010\u5B57\u63A8\u8FDB\u3002\u8D85\u957F\u53E5\u6309 maxChunkSize \u515C\u5E95\u5207\u3002
`,c=`Page({
  data: {
    content: '\u4E00\u6BB5\u957F\u957F\u7684\u5BF9\u8BDD\u5185\u5BB9\u2026',
    streaming: {
      hasNextChunk: true,
      semantic: {
        delimiters: /[\u3002\uFF01\uFF1F\\n]/,
        maxChunkSize: 60,
        chunkDelay: 50,
        charDelay: 20,
      },
      enableAnimation: true,
    },
  },
});`;d.default=function(){return(0,u.jsx)(o.DemoCard,{markdown:r,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:c},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:c}})}},15335:function(B,d,e){e.d(d,{O:function(){return re}});var m=e(5574),o=e.n(m),u=e(67294),r=e(87397),c=e(75892),n=e(83478),l=e(19632),p=e.n(l),v=e(10744),N=e(38116),i=e(85893),P=[50,30,20,10,50],C=[300,200,100,0],a=700,t=2600;function $(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ee(J){var Z=J.content,U=J.platform,X=J.navTitle,q=J.backHref,f=J.moreHref,g=J.extensions,E=(0,u.useRef)(null),h=(0,u.useCallback)(function(){return E.current||(E.current=new v.XMarkdownMini({gfm:!0,extensions:g})),E.current},[g]),x=(0,u.useMemo)(function(){try{return h().renderNodes({content:Z,platform:U,selectable:!0})}catch(V){return[]}},[Z,U,h]),y=(0,u.useState)(x),A=o()(y,2),M=A[0],k=A[1],H=(0,u.useState)(!1),b=o()(H,2),R=b[0],W=b[1],O=(0,u.useState)(!1),S=o()(O,2),s=S[0],D=S[1],F=(0,u.useRef)(0),Y=(0,u.useRef)(),I=(0,u.useRef)(),z=(0,u.useCallback)(function(){var V=h(),Q=F.current+1;F.current=Q,V.reset(),k([]),W(!0);try{V.renderNodes({content:Z,platform:U,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:C,charDelay:P}},onPatch:function(L){F.current===Q&&k(p()(L))},onRenderComplete:function(){F.current===Q&&(W(!1),Y.current=setTimeout(z,t))}})}catch(T){F.current===Q&&(k(x),W(!1))}},[Z,U,h,x]);(0,u.useEffect)(function(){if($()||s){k(x),W(!1);return}return k(x),W(!1),I.current=setTimeout(z,a),function(){var V;F.current+=1,I.current&&clearTimeout(I.current),Y.current&&clearTimeout(Y.current),(V=E.current)===null||V===void 0||V.reset()}},[U,z,x,s]);var K=(0,u.useMemo)(function(){return(0,N.a)(M,R)},[M,R]),G=(0,i.jsx)("button",{type:"button",className:"xmd-autostream-play","aria-pressed":!s,"aria-label":s?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:s?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return D(function(Q){return!Q})},children:s?(0,i.jsx)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"currentColor","aria-hidden":"true",children:(0,i.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,i.jsxs)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"currentColor","aria-hidden":"true",children:[(0,i.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,i.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,i.jsx)(r.PhoneShell,{platform:U,navTitle:X,backHref:q,moreHref:f,navRight:G,children:K})}var ae={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},re=function(Z){var U,X,q,f,g,E,h=Z.demos,x=Z.codeMinHeight,y=Z.codeMaxHeight,A=(0,n.useDocPlatform)(),M=o()(A,1),k=M[0],H=(0,u.useState)((U=(X=h[0])===null||X===void 0?void 0:X.key)!==null&&U!==void 0?U:""),b=o()(H,2),R=b[0],W=b[1],O=typeof window!="undefined"&&(window.location.pathname.endsWith("-en")||document.documentElement.lang.toLowerCase().startsWith("en")),S={tablist:O?"Switch demo":"\u5207\u6362\u793A\u4F8B",preview:O?"Mini-program preview":"\u5C0F\u7A0B\u5E8F\u9884\u89C8",previewFallback:O?"Live preview":"\u771F\u673A\u9884\u89C8",introduce:O?"Introduce":"\u5F15\u5165",codeSample:O?"Code sample":"\u4EE3\u7801\u793A\u4F8B",register:O?(0,i.jsxs)(i.Fragment,{children:["Register the component in ",(0,i.jsx)("code",{children:"index.json"}),":"]}):(0,i.jsxs)(i.Fragment,{children:["\u5728 ",(0,i.jsx)("code",{children:"index.json"})," \u4E2D\u6CE8\u518C\u7EC4\u4EF6\uFF1A"]}),demoCode:"Demo Code"},s=(0,u.useMemo)(function(){var D;return(D=h.find(function(F){return F.key===R}))!==null&&D!==void 0?D:h[0]},[R,h]);return s?(0,i.jsxs)("div",{className:"xmd-doc-demo",children:[(0,i.jsxs)("div",{className:"xmd-doc-demo-main",children:[h.length>1?(0,i.jsx)("div",{className:"xmd-doc-demo-tabs",role:"tablist","aria-label":S.tablist,children:h.map(function(D){return(0,i.jsx)("button",{type:"button",className:"xmd-doc-demo-tab ".concat(D.key===s.key?"is-active":""),onClick:function(){return W(D.key)},role:"tab","aria-selected":D.key===s.key,children:D.title},D.key)})}):null,s.alipay||s.wechat?(0,i.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,i.jsx)("h2",{className:"xmd-doc-demo-section-label",children:S.introduce}),(0,i.jsx)("p",{className:"xmd-doc-demo-desc",children:S.register}),(0,i.jsx)(c.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["json"],collapsible:!1},"intro-".concat(s.key,"-").concat(k))]}):null,s.alipay||s.wechat?(0,i.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,i.jsx)("h2",{className:"xmd-doc-demo-section-label",children:S.codeSample}),s.description?(0,i.jsx)("p",{className:"xmd-doc-demo-desc",children:s.description}):null,(0,i.jsx)(c.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["template","script"],collapsible:!1},"usage-".concat(s.key,"-").concat(k)),(0,i.jsx)(c.DemoCode,{alipay:s.alipay,wechat:s.wechat,files:s.files,defaultFile:s.defaultFile,title:S.demoCode,defaultCollapsed:!0,minHeight:x,maxHeight:y},"full-".concat(s.key,"-").concat(k))]}):null]}),(0,i.jsxs)("aside",{className:"xmd-doc-demo-preview","aria-label":S.preview,children:[(0,i.jsxs)("div",{className:"xmd-doc-demo-preview-head",children:[(0,i.jsx)("span",{className:"xmd-doc-demo-preview-title",children:(q=(f=s.previewTitle)!==null&&f!==void 0?f:s.navTitle)!==null&&q!==void 0?q:S.previewFallback}),(0,i.jsx)("span",{className:"xmd-doc-demo-preview-platform","data-platform":k,children:ae[k]})]}),(g=s.platformNotes)!==null&&g!==void 0&&g[k]?(0,i.jsx)("span",{className:"xmd-doc-demo-preview-note",children:s.platformNotes[k]}):null,s.autoStream&&s.markdown?(0,i.jsx)(ee,{content:s.markdown,platform:k,navTitle:s.navTitle,extensions:s.extensions},"stream-".concat(s.key,"-").concat(k)):(0,i.jsx)(r.PhonePreview,{platform:k,navTitle:s.navTitle,markdown:s.sections?void 0:s.markdown,sections:(E=s.sections)!==null&&E!==void 0?E:s.markdown?[{markdown:s.markdown,animation:s.animation}]:void 0,extensions:s.extensions,components:s.components,gfm:s.gfm,breaks:s.breaks,streamingTail:s.streamingTail})]})]}):null},ie=null},5114:function(B,d,e){e.d(d,{XQ:function(){return q},_B:function(){return U}});var m=e(19632),o=e.n(m),u=e(5574),r=e.n(u),c=e(64599),n=e.n(c),l=e(67294),p=e(10744),v=e(9579),N=e(21483),i=e(38116),P=e(87397),C=e(83478),a=e(71508),t=e(85893),$="https://render.alipay.com/p/s/x-markdown-mini-demo",ee={zh:{alipayHint:"\u7528\u652F\u4ED8\u5B9D\u626B\u4E00\u626B\uFF0C\u771F\u673A\u9884\u89C8",wechatComingSoon:"\u7533\u8BF7\u4E2D",wechatHint:"\u5FAE\u4FE1 AppID \u5BA1\u6838\u4E2D\uFF0C\u5373\u5C06\u5F00\u653E"},en:{alipayHint:"Scan with Alipay to preview on device",wechatComingSoon:"Coming soon",wechatHint:"WeChat AppID under review \u2014 opening soon"}};function ae(g){var E=g.platform,h=g.isEn,x=ee[h?"en":"zh"];return E==="wechat"?(0,t.jsxs)("div",{className:"xmd-scan-pop is-locked",role:"tooltip","aria-label":x.wechatHint,children:[(0,t.jsxs)("div",{className:"xmd-scan-qr",children:[(0,t.jsx)("div",{className:"xmd-scan-placeholder","aria-hidden":"true",children:(0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("rect",{x:"5",y:"10.5",width:"14",height:"9.5",rx:"2",stroke:"currentColor",strokeWidth:"1.6"}),(0,t.jsx)("path",{d:"M8 10.5V8a4 4 0 0 1 8 0v2.5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]})}),(0,t.jsx)("span",{className:"xmd-scan-badge",children:x.wechatComingSoon})]}),(0,t.jsx)("p",{className:"xmd-scan-hint",children:x.wechatHint})]}):(0,t.jsxs)("div",{className:"xmd-scan-pop",role:"tooltip","aria-label":x.alipayHint,children:[(0,t.jsx)("div",{className:"xmd-scan-qr",children:(0,t.jsx)(a.t,{value:$,size:120,level:"M",bgColor:"#ffffff",fgColor:"#171717",marginSize:0})}),(0,t.jsx)("p",{className:"xmd-scan-hint",children:x.alipayHint})]})}var re={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},ie=["alipay","wechat"],J=[50,30,20,10,50],Z=[300,200,100,0],U=`\u4F60\u597D\uFF01\u6211\u662F AI \u52A9\u624B\uFF0C\u4E0B\u9762\u4E3A\u4F60\u6F14\u793A x-markdown-mini \u7684\u6D41\u5F0F\u6E32\u67D3\u80FD\u529B\u3002

## \u6D41\u5F0F\u8865\u5168

\u6D41\u5F0F\u8F93\u5165\u65F6\uFF0C**\u672A\u95ED\u5408\u7684\u7C97\u4F53**\u4F1A\u88AB\u81EA\u52A8\u8865\u5168\uFF0C\`\u672A\u95ED\u5408\u7684\u884C\u5185\u4EE3\u7801\`\u4E5F\u4F1A\uFF0C\u751A\u81F3 [\u672A\u5B8C\u6210\u7684\u94FE\u63A5](https://example.com) \u4E5F\u80FD\u6B63\u786E\u5904\u7406\u3002

## \u4EE3\u7801\u9AD8\u4EAE

\`\`\`typescript
interface MarkdownRenderer {
  render(content: string): Token[];
  renderNodes(props: Props): MiniNode[];
}

const xmd = new XMarkdownMini({
  options: { extensions: [Latex(), CodeHighlight()] },
});
\`\`\`

## \u6570\u5B66\u516C\u5F0F

\u884C\u5185\u516C\u5F0F\uFF1A$E = mc^2$\uFF0C\u4EE5\u53CA\u6B27\u62C9\u516C\u5F0F $e^{i\\pi} + 1 = 0$\u3002

\u5757\u7EA7\u516C\u5F0F\uFF1A

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## \u8868\u683C

| \u7279\u6027 | \u72B6\u6001 | \u8BF4\u660E |
|---|---|---|
| GFM | \u2705 | \u8868\u683C/\u5220\u9664\u7EBF/\u4EFB\u52A1\u5217\u8868 |
| \u6D41\u5F0F | \u2705 | \u8865\u5168 + \u7F13\u5B58 + \u52A8\u753B |
| \u63D2\u4EF6 | \u2705 | LaTeX / \u4EE3\u7801\u9AD8\u4EAE |

---

*x-markdown-mini \u2014 \u591A\u7AEF\u3001\u6D41\u5F0F\u53CB\u597D\u3001\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668*`;function X(g,E){var h=(0,p.getPlatformRenderer)(E).capabilities,x=0,y=0,A=0,M=function W(O){var S=O.name,s=O.attrs,D=O.children;S==="ol"&&s&&s.start!=null&&Number(s.start)!==1&&!h.supportsOlStart&&(x+=1),S==="img"&&s&&typeof s.src=="string"&&/^http:\/\//i.test(s.src)&&h.requiresHttpsImage&&(y+=1),S==="a"&&s&&"data-href"in s&&E==="wechat"&&(A+=1);var F=n()(D!=null?D:[]),Y;try{for(F.s();!(Y=F.n()).done;){var I=Y.value;W(I)}}catch(z){F.e(z)}finally{F.f()}},k=n()(g),H;try{for(k.s();!(H=k.n()).done;){var b=H.value;M(b)}}catch(W){k.e(W)}finally{k.f()}var R=[];return x&&R.push({kind:"ol-start",label:"<ol start> \u4E0D\u652F\u6301\uFF0C\u5E8F\u53F7\u4ECE 1 \u5F00\u59CB"}),y&&R.push({kind:"http-image",label:"".concat(y," \u5F20 http \u56FE\u7247\u6539\u5199\u4E3A https")}),A&&R.push({kind:"anchor",label:"<a href> \u2192 data-href\uFF0C\u9700\u6D88\u8D39\u65B9\u62E6\u622A tap"}),R}var q=function(E){var h=E.initialMarkdown,x=h===void 0?U:h,y=(0,l.useState)(x),A=r()(y,2),M=A[0],k=A[1],H=(0,C.useDocPlatform)(),b=r()(H,1),R=b[0],W=(0,l.useState)(R),O=r()(W,2),S=O[0],s=O[1],D=(0,l.useState)(!1),F=r()(D,2),Y=F[0],I=F[1],z=(0,l.useState)(!0),K=r()(z,2),G=K[0],V=K[1],Q=(0,l.useState)(!1),T=r()(Q,2),L=T[0],te=T[1],oe=(0,l.useState)(!0),ne=r()(oe,2),_=ne[0],ze=ne[1],Ye=(0,l.useState)(!0),Me=r()(Ye,2),he=Me[0],$e=Me[1],Ze=(0,l.useState)(!0),Ne=r()(Ze,2),xe=Ne[0],Ge=Ne[1],Ve=(0,l.useState)(!0),be=r()(Ve,2),fe=be[0],Qe=be[1],Je=(0,l.useState)(!0),Se=r()(Je,2),pe=Se[0],_e=Se[1],qe=(0,l.useState)(!0),Pe=r()(qe,2),me=Pe[0],en=Pe[1],nn=(0,l.useState)(!0),Te=r()(nn,2),Ce=Te[0],tn=Te[1],an=(0,l.useState)(!0),Le=r()(an,2),le=Le[0],rn=Le[1],on=(0,l.useState)(18),Be=r()(on,2),ke=Be[0],sn=Be[1],dn=(0,l.useState)(120),Re=r()(dn,2),je=Re[0],cn=Re[1],ln=(0,l.useState)(24),Oe=r()(ln,2),we=Oe[0],un=Oe[1],mn=(0,l.useState)(!1),Ie=r()(mn,2),se=Ie[0],ge=Ie[1],hn=(0,l.useState)([]),He=r()(hn,2),We=He[0],De=He[1],ce=(0,l.useRef)(0);(0,l.useEffect)(function(){s(R)},[R]);var de=S,xn=(0,l.useCallback)(function(j){s(j),window.localStorage.setItem("xmd-doc-platform",j),window.dispatchEvent(new CustomEvent("xmd-platform-change",{detail:{platform:j}}))},[]),ue=(0,l.useRef)(null),Ke=(0,l.useRef)(""),ve=(0,l.useCallback)(function(){var j="".concat(G,"|").concat(L,"|").concat(he,"|").concat(xe,"|").concat(fe,"|").concat(pe);if(ue.current&&Ke.current===j)return ue.current;var w=[];return xe&&w.push((0,v.default)({katexOptions:{throwOnError:!1}})),fe&&w.push((0,N.default)()),ue.current=new p.XMarkdownMini({escapeText:he,streamingFixup:pe?"remend":!1,gfm:G,breaks:L,extensions:w}),Ke.current=j,ue.current},[G,L,he,xe,fe,pe]);(0,l.useEffect)(function(){return function(){var j;(j=ue.current)===null||j===void 0||j.reset(),ce.current+=1}},[]);var Ue=(0,l.useMemo)(function(){if(se)return{reactNodes:(0,i.a)(We,me),issues:[]};try{var j=ve(),w=j.renderNodes({content:M,platform:de,selectable:_});return{reactNodes:(0,i.a)(w),issues:X(w,de)}}catch(ye){return{reactNodes:[(0,t.jsxs)("p",{className:"xmd-preview-error",children:["\u6E32\u67D3\u5931\u8D25\uFF1A",String(ye)]},"error")],issues:[]}}},[M,de,_,se,We,me,ve]),fn=Ue.reactNodes,wn=Ue.issues,pn=(0,l.useCallback)(function(){var j=ve(),w=ce.current+1;ce.current=w,j.reset(),ge(!0),De([]),k("");try{var ye=j.renderNodes({content:U,platform:de,selectable:_,streaming:{hasNextChunk:!1,enableAnimation:me,semantic:Ce?{maxChunkSize:ke,chunkDelay:le?Z:je,charDelay:le?J:we}:!1},onRenderProgress:function(Ae){var jn=Ae.markdown;ce.current===w&&k(jn)},onPatch:function(Ae){ce.current===w&&De(o()(Ae))},onRenderComplete:function(){ce.current===w&&ge(!1)}});ye.length>0&&De(ye)}catch(Fe){ge(!1)}},[de,_,me,Ce,le,ke,je,we,ve]),gn=(0,l.useCallback)(function(){var j;ce.current+=1,ge(!1),(j=ue.current)===null||j===void 0||j.reset()},[]),vn=(0,l.useState)(!1),Xe=r()(vn,2),Ee=Xe[0],En=Xe[1];(0,l.useEffect)(function(){typeof window!="undefined"&&En(window.location.pathname.includes("-en"))},[]);var yn=Ee?"Playground":"\u5728\u7EBF\u6F14\u793A",Cn=Ee?"/-en":"/",kn=Ee?"/docs/code-examples-en":"/docs/code-examples";return(0,t.jsxs)("div",{className:"xmd-pg",children:[(0,t.jsxs)("section",{className:"xmd-pg-editor-wrap","aria-label":"Markdown \u8F93\u5165",children:[(0,t.jsxs)("div",{className:"xmd-pg-editor-header",children:[(0,t.jsx)("label",{className:"xmd-pg-label",htmlFor:"xmd-pg-input",children:"Markdown"}),(0,t.jsxs)("div",{className:"xmd-pg-header-actions",children:[(0,t.jsxs)("button",{type:"button",className:"xmd-pg-stream-btn ".concat(se?"is-active":""),onClick:se?gn:pn,"aria-label":se?"\u505C\u6B62\u6D41\u5F0F":"\u6D41\u5F0F\u6F14\u793A",children:[(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,t.jsx)("polygon",{points:"5 3 19 12 5 21 5 3"})}),(0,t.jsx)("span",{children:se?"\u505C\u6B62":"\u6D41\u5F0F"})]}),(0,t.jsx)("button",{type:"button",className:"xmd-pg-config-toggle ".concat(Y?"is-active":""),onClick:function(){return I(!Y)},"aria-expanded":Y,"aria-label":"\u914D\u7F6E",children:(0,t.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,t.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})})]})]}),Y&&(0,t.jsxs)("div",{className:"xmd-pg-config",children:[(0,t.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,t.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u89E3\u6790"}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:G,onChange:function(w){return V(w.target.checked)}}),(0,t.jsx)("span",{children:"GFM"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8868\u683C/\u5220\u9664\u7EBF"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:L,onChange:function(w){return te(w.target.checked)}}),(0,t.jsx)("span",{children:"Breaks"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\\n \u2192 br"})]})]}),(0,t.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,t.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6E32\u67D3"}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:_,onChange:function(w){return ze(w.target.checked)}}),(0,t.jsx)("span",{children:"Selectable"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u6587\u672C\u53EF\u9009"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:he,onChange:function(w){return $e(w.target.checked)}}),(0,t.jsx)("span",{children:"Escape"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"HTML \u8F6C\u4E49"})]})]}),(0,t.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,t.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u63D2\u4EF6"}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:fe,onChange:function(w){return Qe(w.target.checked)}}),(0,t.jsx)("span",{children:"CodeHighlight"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"hljs \u8BED\u6CD5\u9AD8\u4EAE"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:xe,onChange:function(w){return Ge(w.target.checked)}}),(0,t.jsx)("span",{children:"LaTeX"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"KaTeX \u516C\u5F0F"})]})]}),(0,t.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,t.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6D41\u5F0F"}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:pe,onChange:function(w){return _e(w.target.checked)}}),(0,t.jsx)("span",{children:"Fixup"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8865\u5168\u672A\u95ED\u5408\u8BED\u6CD5"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:me,onChange:function(w){return en(w.target.checked)}}),(0,t.jsx)("span",{children:"Animation"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u5757\u52A8\u753B"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:Ce,onChange:function(w){return tn(w.target.checked)}}),(0,t.jsx)("span",{children:"Semantic"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8BED\u4E49\u5206\u5757"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,t.jsx)("input",{type:"checkbox",checked:le,onChange:function(w){return rn(w.target.checked)}}),(0,t.jsx)("span",{children:"\u53D8\u901F"}),(0,t.jsx)("span",{className:"xmd-pg-config-desc",children:"\u968F\u5757\u52A0\u901F\u6253\u5B57\u673A"})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,t.jsx)("span",{children:"Max"}),(0,t.jsx)("input",{type:"number",min:8,max:400,value:ke,onChange:function(w){return sn(Number(w.target.value)||80)}})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,t.jsx)("span",{children:"Chunk"}),(0,t.jsx)("input",{type:"number",min:0,max:2e3,disabled:le,value:je,onChange:function(w){return cn(Number(w.target.value)||0)}})]}),(0,t.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,t.jsx)("span",{children:"Char"}),(0,t.jsx)("input",{type:"number",min:0,max:200,disabled:le,value:we,onChange:function(w){return un(Number(w.target.value)||0)}})]})]})]}),(0,t.jsx)("textarea",{id:"xmd-pg-input",className:"xmd-pg-input",spellCheck:!1,value:M,onChange:function(w){se||k(w.target.value)},placeholder:"\u8F93\u5165 Markdown\uFF0C\u53F3\u4FA7\u5B9E\u65F6\u9884\u89C8\u2026",readOnly:se})]}),(0,t.jsxs)("section",{className:"xmd-pg-preview-wrap","aria-label":"\u9884\u89C8",children:[(0,t.jsx)("div",{className:"xmd-pg-platform-switch",role:"tablist","aria-label":"\u5207\u6362\u9884\u89C8\u5E73\u53F0",children:ie.map(function(j){return(0,t.jsxs)("div",{className:"xmd-pg-platform-tab",children:[(0,t.jsxs)("button",{type:"button",className:"xmd-pg-platform-btn ".concat(j===de?"is-active":""),onClick:function(){return xn(j)},role:"tab","aria-selected":j===de,children:[re[j],(0,t.jsx)("svg",{className:"xmd-pg-platform-scanhint",viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18"})})]}),(0,t.jsx)(ae,{platform:j,isEn:Ee})]},j)})}),(0,t.jsx)(P.PhoneShell,{platform:de,navTitle:yn,backHref:Cn,moreHref:kn,autoScroll:se,children:fn})]})]})},f=null},87534:function(B,d,e){e.d(d,{Z:function(){return l}});var m=e(64599),o=e.n(m),u=e(67294),r=e(85893),c={breaking:"\u{1F4A5}",feature:"\u{1F195}",fix:"\u{1F41B}",perf:"\u26A1\uFE0F"};function n(){var p=(0,u.useRef)(null);return(0,u.useEffect)(function(){var v=p.current;if(v){var N=Array.from(v.querySelectorAll(".xmd-cl-entry"));if(N.length!==0){var i=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(i||typeof IntersectionObserver=="undefined"){N.forEach(function(C){return C.classList.add("is-in")});return}var P=new IntersectionObserver(function(C){var a=o()(C),t;try{for(a.s();!(t=a.n()).done;){var $=t.value;$.isIntersecting&&($.target.classList.add("is-in"),P.unobserve($.target))}}catch(ee){a.e(ee)}finally{a.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return N.forEach(function(C){return P.observe(C)}),function(){return P.disconnect()}}}},[]),p}function l(p){var v=p.copy,N=n();return(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("main",{className:"xmd-changelog",children:[(0,r.jsxs)("header",{className:"xmd-cl-hero",children:[(0,r.jsx)("h1",{children:v.title}),(0,r.jsx)("p",{className:"xmd-cl-subtitle",children:v.subtitle})]}),(0,r.jsx)("ol",{className:"xmd-cl-list",ref:N,children:v.releases.map(function(i,P){return(0,r.jsxs)("li",{className:"xmd-cl-entry xmd-reveal",children:[(0,r.jsx)("span",{className:"xmd-cl-marker","aria-hidden":"true",children:(0,r.jsx)("span",{className:"xmd-cl-dot"})}),(0,r.jsxs)("div",{className:"xmd-cl-content",children:[(0,r.jsxs)("div",{className:"xmd-cl-meta",children:[(0,r.jsxs)("h2",{className:"xmd-cl-version",children:[i.version,P===0&&(0,r.jsx)("span",{className:"xmd-cl-latest",children:v.latest})]}),(0,r.jsx)("time",{className:"xmd-cl-date",children:i.date})]}),(0,r.jsx)("ul",{className:"xmd-cl-changes",children:i.items.map(function(C,a){return(0,r.jsxs)("li",{className:"xmd-cl-change",children:[(0,r.jsxs)("span",{className:"xmd-cl-tag xmd-cl-tag--".concat(C.type),children:[(0,r.jsx)("span",{className:"xmd-cl-tag-emoji","aria-hidden":"true",children:c[C.type]}),v.types[C.type]]}),(0,r.jsxs)("div",{className:"xmd-cl-text",children:[(0,r.jsx)("p",{dangerouslySetInnerHTML:{__html:C.html}}),C.notes.length>0&&(0,r.jsx)("ul",{className:"xmd-cl-notes",children:C.notes.map(function(t,$){return(0,r.jsx)("li",{dangerouslySetInnerHTML:{__html:t}},$)})})]})]},a)})})]})]},i.version)})})]})})}},61344:function(B,d,e){e.d(d,{EN:function(){return r},ZH:function(){return u}});var m=[{version:"1.0.1",date:"2026-07-05",items:[{type:"feature",html:"\u6269\u5C55\u53EF\u8986\u76D6\u5185\u7F6E\u5143\u7D20\u7684\u6E32\u67D3\u3002\u6269\u5C55\u7684 <code>name</code> \u547D\u4E2D\u5185\u7F6E token \u7C7B\u578B\uFF08\u5982 <code>table</code>\u3001<code>code</code>\uFF09\u65F6\uFF0C\u5176 <code>miniRenderer</code> \u4F1A\u5B8C\u5168\u63A5\u7BA1\u8BE5 token \u7684\u6E32\u67D3\u3002\u6B64\u524D\u4EC5 <code>code</code> \u652F\u6301\uFF0C\u73B0 <code>table</code> \u540C\u6837\u53EF\u8986\u76D6\uFF1B\u53EA\u63D0\u4F9B <code>miniRenderer</code>\u3001\u4E0D\u63D0\u4F9B <code>tokenizer</code> \u65F6\u89E3\u6790\u4ECD\u8D70\u5185\u7F6E\u5206\u8BCD\u5668\uFF0C\u8FD4\u56DE <code>null</code> \u56DE\u9000\u5230\u5185\u7F6E\u6E32\u67D3\u3002",notes:[]},{type:"fix",html:"<code>\\[ \u2026 \\]</code> \u5757\u7EA7\u516C\u5F0F\u7D27\u8DDF\u6587\u672C\u884C\uFF08\u65E0\u7A7A\u884C\u5206\u9694\uFF09\u65F6\u4E0D\u88AB\u8BC6\u522B\u3002<code>blockKatex</code> \u7F3A\u5C11 <code>start</code>\uFF0C\u8BE5\u884C\u88AB\u5E76\u5165\u6BB5\u843D\u3001<code>\\[</code> <code>\\]</code> \u9000\u5316\u6210\u8F6C\u4E49\u5B57\u7B26\uFF1B\u8865\u4E0A\u5757\u7EA7 <code>start</code> \u540E\u53EF\u6B63\u786E\u4E2D\u65AD\u6BB5\u843D\uFF0C\u8BC6\u522B\u4E3A\u5757\u7EA7\u516C\u5F0F\u3002",notes:[]},{type:"fix",html:"iOS &lt; 15.4 / \u65E7\u57FA\u7840\u5E93\u4E0A\u6574\u5305\u767D\u5C4F\u3002\u5185\u8054\u7684 <code>marked</code> \u8BCD\u6CD5\u5668\u8C03\u7528\u4E86 <code>Array.prototype.at</code>\uFF08<code>.at(-1)</code>\uFF09\uFF0C\u8FD9\u4E9B\u5F15\u64CE\u4E0D\u652F\u6301\uFF0C\u8FD0\u884C\u65F6\u629B <code>x.at is not a function</code>\u2014\u2014<code>tsup</code> \u53EA\u964D\u8BED\u6CD5\u4E0D polyfill \u5185\u5EFA\u65B9\u6CD5\uFF0C<code>es-check</code> \u53EA\u67E5\u8BED\u6CD5\u4E5F\u7167\u4E0D\u5230\u3002\u65B0\u589E\u5B88\u536B\u5F0F\u3001\u4E0D\u53EF\u679A\u4E3E\u7684 <code>Array/String#at</code> polyfill\uFF08\u5728\u4EFB\u4F55\u8BCD\u6CD5\u5668\u4EE3\u7801\u524D\u52A0\u8F7D\uFF09\uFF0C\u5E76\u52A0 <code>check-bundle</code> \u5361\u53E3\u9632\u6B62\u5176\u5B83\u672A polyfill \u7684\u8FD0\u884C\u65F6\u65B9\u6CD5\u56DE\u5F52\u3002",notes:[]},{type:"fix",html:"\u6D41\u5F0F\u6E32\u67D3\u65F6\u884C\u5185\u4EE3\u7801 <code>code</code> \u4E2D\u95F4\u51FA\u73B0\u591A\u4F59\u7A7A\u683C\u3002\u9010\u5B57 / \u9010\u6BB5\u5165\u573A\u52A8\u753B\u4F1A\u628A\u884C\u5185\u4EE3\u7801\u6587\u672C\u62C6\u6210\u591A\u4E2A\u53F6\u5B50 <code>&lt;text&gt;</code>\uFF0C\u800C\u6BCF\u4E2A\u53F6\u5B50\u90FD\u5E26 <code>md-inline-code</code> \u836F\u4E38\u7684\u5185\u5916\u8FB9\u8DDD\u4E0E\u5E95\u8272\uFF0C\u62FC\u63A5\u540E\u5C31\u51FA\u73B0\u4E86\u7F1D\u9699\uFF08\u652F\u4ED8\u5B9D\u9010\u5B57\u62C6\u5206\u6700\u660E\u663E\uFF09\u3002",notes:["\u836F\u4E38\u76D2\u6A21\u578B\uFF08\u80CC\u666F / \u5185\u5916\u8FB9\u8DDD / \u5706\u89D2\uFF09\u6539\u4E3A\u53EA\u753B\u5728\u5916\u5C42\u6574\u6BB5\u5BB9\u5668\u4E0A\uFF1B\u62C6\u51FA\u6765\u7684\u5B57\u7B26\u53F6\u5B50\u6539\u7528\u7EAF\u7B49\u5BBD\u5B57\u4F53\u7C7B <code>md-inline-code-txt</code>\uFF08\u652F\u4ED8\u5B9D <code>&lt;text&gt;</code> \u4E0D\u7EE7\u627F font-family\uFF0C\u5B57\u4F53\u5FC5\u987B\u7559\u5728\u53F6\u5B50\uFF09\u3002\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u4E24\u7AEF\u4E00\u5E76\u4FEE\u590D\u3002"]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> \u91CD\u6574\u3002<code>lexerOptions</code> / \u9876\u5C42 <code>extensions</code> / <code>plugins</code> \u4E09\u4E2A\u5B57\u6BB5\u5408\u5E76\u4E3A\u5355\u4E00\u7684 <code>options: { gfm?, breaks?, extensions? }</code>\uFF0C\u540C\u6B65\u79FB\u9664 <code>Plugin</code> \u7C7B\u578B\u5BFC\u51FA\u3002",notes:["\u8FC1\u79FB\uFF1A<code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>\uFF1B<code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>\uFF1B<code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>\u3002"]},{type:"breaking",html:"\u5185\u7F6E\u7EC4\u4EF6 <code>&lt;markdown /&gt;</code> \u7684 <code>plugins</code> prop \u6539\u540D <code>extensions</code>\u3002",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> \u7C7B\u578B\u5BFC\u51FA\uFF0C\u7EDF\u4E00\u63CF\u8FF0\u6784\u9020\u5668\u7684 marked \u914D\u7F6E\u5757\u3002",notes:[]},{type:"feature",html:"\u5185\u7F6E <code>marked</code> lexer \u5E76\u5728\u6784\u5EFA\u65F6\u6253\u8FDB\u4EA7\u7269\uFF1B\u6574\u5E93 ESM \u7EA6 103KB / gzip \u7EA6 25KB\u3002",notes:[]},{type:"feature",html:"\u6D41\u5F0F\u589E\u91CF\u89E3\u6790\u2014\u2014\u5DF2\u7A33\u5B9A\u5757\u7F13\u5B58\u4E3A <code>stableNodes</code>\uFF0C\u4EC5 tail \u91CD\u65B0 lex\u3002",notes:[]},{type:"feature",html:"\u5FAE\u4FE1 / \u652F\u4ED8\u5B9D <code>PlatformRenderer</code>\uFF0C\u66B4\u9732\u5E73\u53F0\u80FD\u529B\u4E0E token \u5230\u8282\u70B9\u7684\u8F6C\u6362\u5165\u53E3\u3002",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> \u63A5\u53E3\uFF0C\u628A tokenizer \u4E0E <code>miniRenderer</code> \u5199\u5728\u540C\u4E00\u4E2A\u5BF9\u8C61\u4E0A\uFF1B\u4FDD\u7559 <code>tokenRenderers</code> \u4F5C\u4E3A fallback\u3002",notes:[]},{type:"fix",html:"\u52A8\u753B\u7C7B\u5408\u5E76 bug\u2014\u2014\u5F00\u542F <code>animation</code> \u65F6\u5757\u7EA7\u8282\u70B9\u4E0D\u518D\u4E22\u5931\u8BED\u4E49 class\u3002",notes:[]},{type:"perf",html:"<code>chunkDelay = charDelay = 0</code> \u65F6\u8DF3\u8FC7 setTimeout \u94FE\uFF0C\u540C\u6B65\u63A8\u56DE\u3002",notes:[]},{type:"perf",html:"<code>&lt;b&gt;</code> / <code>&lt;i&gt;</code> \u6539\u4E3A\u8BED\u4E49\u5316 <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code>\u3002",notes:[]}]}],o=[{version:"1.0.1",date:"2026-07-05",items:[{type:"feature",html:"extensions can override built-in element rendering. When an extension's <code>name</code> matches a built-in token type (e.g. <code>table</code>, <code>code</code>), its <code>miniRenderer</code> fully takes over that token's rendering. Previously only <code>code</code> supported this; now <code>table</code> can be overridden too. Providing only a <code>miniRenderer</code> (no <code>tokenizer</code>) keeps marked's built-in parsing; returning <code>null</code> falls back to the built-in rendering.",notes:[]},{type:"fix",html:"<code>\\[ \u2026 \\]</code> display math was not recognized when it immediately followed a text line (no blank separator). <code>blockKatex</code> had no <code>start</code>, so the line was absorbed into the paragraph and its <code>\\[</code>/<code>\\]</code> degraded to escape tokens; a block <code>start</code> now interrupts the paragraph and recognizes the display math.",notes:[]},{type:"fix",html:"the whole bundle blanked on iOS &lt; 15.4 / older base libraries. The bundled <code>marked</code> lexer calls <code>Array.prototype.at</code> (<code>.at(-1)</code>), which those engines lack, throwing <code>x.at is not a function</code> \u2014 <code>tsup</code> only lowers syntax (not built-in methods) and <code>es-check</code> (syntax-only) couldn't catch it. Ships a guarded, non-enumerable <code>Array/String#at</code> polyfill loaded before any lexer code, plus a <code>check-bundle</code> gate against other un-polyfilled runtime methods.",notes:[]},{type:"fix",html:"inline code <code>code</code> showed spurious gaps mid-word while streaming. The per-character / per-segment entrance animation splits the inline-code text into several leaf <code>&lt;text&gt;</code> nodes, and each leaf carried the <code>md-inline-code</code> pill's padding, margin and background \u2014 so the pills tiled with visible gaps (worst on Alipay, which splits per character).",notes:["The pill box (background / padding / radius) now paints only on the outer container; the split character leaves use a font-only <code>md-inline-code-txt</code> class instead (Alipay <code>&lt;text&gt;</code> does not inherit font-family, so the monospace font must stay on the leaf). Fixed on both WeChat and Alipay."]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> collapsed. <code>lexerOptions</code> / top-level <code>extensions</code> / <code>plugins</code> are gone, replaced by a single <code>options: { gfm?, breaks?, extensions? }</code> bag. The <code>Plugin</code> type is removed.",notes:["Migration: <code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>; <code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>; <code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>."]},{type:"breaking",html:"the bundled <code>&lt;markdown /&gt;</code> component renames its <code>plugins</code> prop to <code>extensions</code>.",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> exported, describing the constructor's marked-side configuration bag.",notes:[]},{type:"feature",html:"bundle marked's lexer into the build. Full ESM bundle around 103 KB / ~25 KB gzip.",notes:[]},{type:"feature",html:"streaming incremental parsing \u2014 committed blocks are cached as <code>stableNodes</code>, only the tail is re-lexed.",notes:[]},{type:"feature",html:"WeChat / Alipay <code>PlatformRenderer</code>, exposing platform capabilities and the token-to-node entry point.",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> interface \u2014 colocates the tokenizer and its <code>miniRenderer</code> on a single object. <code>tokenRenderers</code> is retained as a fallback.",notes:[]},{type:"fix",html:"animation-class merge bug \u2014 with <code>animation</code> enabled, block-level nodes no longer drop their semantic class.",notes:[]},{type:"perf",html:"when <code>chunkDelay = charDelay = 0</code>, skip the setTimeout chain and push synchronously.",notes:[]},{type:"perf",html:"emit semantic <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code> instead of <code>&lt;b&gt;</code> / <code>&lt;i&gt;</code>.",notes:[]}]}],u={title:"\u66F4\u65B0\u65E5\u5FD7",subtitle:"\u9762\u5411\u4F7F\u7528\u8005\u7684 API\u3001\u6784\u5EFA\u4EA7\u7269\u4E0E\u884C\u4E3A\u53D8\u5316\u90FD\u8BB0\u5F55\u5728\u8FD9\u91CC\u3002\u8FC1\u79FB\u8BF4\u660E\u5199\u5728\u5BF9\u5E94\u7248\u672C\u4E0B\uFF0C\u65B9\u4FBF\u5347\u7EA7\u65F6\u6309\u7248\u672C\u9010\u6761\u6838\u5BF9\u3002",latest:"\u6700\u65B0",types:{breaking:"\u7834\u574F\u6027",feature:"\u65B0\u589E",fix:"\u4FEE\u590D",perf:"\u4F18\u5316"},releases:m},r={title:"Changelog",subtitle:"User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.",latest:"Latest",types:{breaking:"Breaking",feature:"Added",fix:"Fixed",perf:"Improved"},releases:o}},49682:function(B,d,e){e.d(d,{Z:function(){return N}});var m=e(97857),o=e.n(m),u=e(67294),r=e(9783),c=e.n(r),n=e(85893);function l(i){var P=i.title,C=i.desc,a=i.labels;return(0,n.jsxs)("svg",{className:"xmd-arch-svg",viewBox:"0 0 960 400",role:"img","aria-labelledby":"xmd-arch-title xmd-arch-desc",children:[(0,n.jsx)("title",{id:"xmd-arch-title",children:P}),(0,n.jsx)("desc",{id:"xmd-arch-desc",children:C}),(0,n.jsxs)("defs",{children:[(0,n.jsx)("marker",{id:"xmd-flow-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,n.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#a3a3a3"})}),(0,n.jsx)("marker",{id:"xmd-accent-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7.5",markerHeight:"7.5",orient:"auto-start-reverse",children:(0,n.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#2563eb"})}),(0,n.jsx)("marker",{id:"xmd-amber-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,n.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#c99a1f"})})]}),(0,n.jsx)("path",{className:"xmd-arch-flow",d:"M148 82 H184",markerEnd:"url(#xmd-flow-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-flow",d:"M338 82 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-flow",d:"M482 82 H520",markerEnd:"url(#xmd-flow-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-flow",d:"M738 82 H780",markerEnd:"url(#xmd-flow-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-flow",d:"M338 290 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-line",d:"M503 248 C 540 210 631 226 631 190",markerEnd:"url(#xmd-accent-arrow)"}),(0,n.jsx)("path",{className:"xmd-arch-ext-line",d:"M760 262 C 760 224 706 226 700 190",markerEnd:"url(#xmd-amber-arrow)"}),(0,n.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"24",y:"50",width:"124",height:"64",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-label",x:"86",y:"80",textAnchor:"middle",children:a.markdown}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"86",y:"99",textAnchor:"middle",children:"string"}),(0,n.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"188",y:"50",width:"150",height:"64",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-label",x:"263",y:"80",textAnchor:"middle",children:a.lexer}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"263",y:"99",textAnchor:"middle",children:a.lexerNote}),(0,n.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"378",y:"50",width:"104",height:"64",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-label",x:"430",y:"80",textAnchor:"middle",children:a.token}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"430",y:"99",textAnchor:"middle",children:a.tokenNote}),(0,n.jsx)("rect",{className:"xmd-arch-group",x:"524",y:"36",width:"214",height:"152",rx:"12"}),(0,n.jsx)("text",{className:"xmd-arch-group-title",x:"631",y:"58",textAnchor:"middle",children:"PlatformRenderer"}),(0,n.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"74",width:"174",height:"44",rx:"8"}),(0,n.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"101",textAnchor:"middle",children:a.wechat}),(0,n.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"126",width:"174",height:"44",rx:"8"}),(0,n.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"153",textAnchor:"middle",children:a.alipay}),(0,n.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-node",x:"784",y:"50",width:"148",height:"64",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-label",x:"858",y:"80",textAnchor:"middle",children:a.node}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"858",y:"99",textAnchor:"middle",children:a.nodeNote}),(0,n.jsx)("text",{className:"xmd-arch-lane-title",x:"24",y:"244",children:a.streaming}),(0,n.jsx)("rect",{className:"xmd-arch-platform",x:"188",y:"262",width:"150",height:"56",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-label",x:"263",y:"291",textAnchor:"middle",children:a.chunk}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"263",y:"309",textAnchor:"middle",children:a.chunkNote}),(0,n.jsx)("rect",{className:"xmd-arch-group",x:"378",y:"248",width:"250",height:"110",rx:"12"}),(0,n.jsx)("text",{className:"xmd-arch-group-title",x:"503",y:"270",textAnchor:"middle",children:"StreamingProcessor"}),(0,n.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"284",width:"214",height:"28",rx:"7"}),(0,n.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"303",textAnchor:"middle",children:a.stable}),(0,n.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"320",width:"214",height:"28",rx:"7"}),(0,n.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"339",textAnchor:"middle",children:a.tail}),(0,n.jsx)("rect",{className:"xmd-arch-ext",x:"690",y:"262",width:"210",height:"72",rx:"10"}),(0,n.jsx)("text",{className:"xmd-arch-group-title",x:"795",y:"290",textAnchor:"middle",children:a.extensions}),(0,n.jsx)("text",{className:"xmd-arch-note",x:"795",y:"311",textAnchor:"middle",children:a.extNote}),(0,n.jsxs)("g",{className:"xmd-arch-pulses","aria-hidden":"true",children:[(0,n.jsx)("circle",{className:"xmd-arch-pulse",cx:"148",cy:"82",r:"3.4",style:c()({animationDelay:"0s"},"--tx","36px")}),(0,n.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"82",r:"3.4",style:c()({animationDelay:".35s"},"--tx","36px")}),(0,n.jsx)("circle",{className:"xmd-arch-pulse",cx:"482",cy:"82",r:"3.4",style:c()({animationDelay:".7s"},"--tx","38px")}),(0,n.jsx)("circle",{className:"xmd-arch-pulse",cx:"738",cy:"82",r:"3.4",style:c()({animationDelay:"1.05s"},"--tx","42px")}),(0,n.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"290",r:"3.4",style:c()({animationDelay:".55s"},"--tx","36px")})]})]})}var p=e(24849),v={math:(0,n.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,n.jsx)("path",{d:"M4 4h9l-4.5 6L13 16H4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),ext:(0,n.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,n.jsx)("path",{d:"M4 6h12M4 10h12M4 14h7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,n.jsx)("circle",{cx:"15.5",cy:"14",r:"2",stroke:"currentColor",strokeWidth:"1.5"})]}),commonmark:(0,n.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,n.jsx)("path",{d:"m4 10 3 3 9-9",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),stream:(0,n.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,n.jsx)("path",{d:"M3 7h6M3 13h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,n.jsx)("path",{d:"M12 4l4 6-4 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})};function N(i){var P=i.copy,C=i.diagram,a=(0,p.v)();return(0,n.jsxs)("section",{className:"xmd-landing-section xmd-architecture xmd-reveal",ref:a,children:[(0,n.jsxs)("div",{className:"xmd-section-copy",children:[(0,n.jsx)("h2",{children:P.arch.title}),(0,n.jsx)("p",{children:P.arch.body})]}),(0,n.jsxs)("div",{className:"xmd-arch-board","aria-label":C.title,children:[(0,n.jsx)(l,o()({},C)),(0,n.jsx)("div",{className:"xmd-arch-proof",children:P.arch.proof.map(function(t,$){return(0,n.jsxs)("div",{children:[(0,n.jsxs)("div",{className:"xmd-arch-proof-head",children:[v[t.icon],(0,n.jsx)("strong",{children:t.title})]}),(0,n.jsx)("span",{children:t.desc})]},$)})})]})]})}},18181:function(B,d,e){e.d(d,{Z:function(){return n}});var m=e(67294),o=e(85893),u="npm i @ant-design/x-markdown-mini";function r(l){var p=l.copyLabel,v=l.copySuccessText,N=l.playgroundHref,i=l.playgroundLabel;return(0,o.jsxs)("div",{className:"xmd-hero-actions",children:[(0,o.jsxs)("button",{type:"button",className:"xmd-install-command","data-xmd-copy":u,"data-xmd-copy-success":v,"aria-label":p,children:[(0,o.jsx)("span",{className:"xmd-install-prompt","aria-hidden":"true",children:"$"}),(0,o.jsx)("code",{children:u}),(0,o.jsxs)("span",{className:"xmd-copy-control","aria-hidden":"true",children:[(0,o.jsxs)("svg",{className:"xmd-copy-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:[(0,o.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:"1.4"}),(0,o.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]}),(0,o.jsx)("svg",{className:"xmd-check-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:(0,o.jsx)("path",{d:"m3 8.2 3 3L13 4",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,o.jsx)("span",{"data-xmd-copy-status":!0})]})]}),(0,o.jsx)("a",{className:"xmd-secondary-link xmd-playground-link",href:N,children:i})]})}var c=e(24849);function n(l){var p=l.copy,v=l.media,N=(0,c.v)();return(0,o.jsxs)("section",{className:"xmd-hero",children:[(0,o.jsxs)("div",{className:"xmd-hero-copy xmd-reveal",ref:N,children:[(0,o.jsx)("span",{className:"xmd-hero-eyebrow",children:p.eyebrow}),(0,o.jsx)("h1",{children:p.heroTitle}),(0,o.jsx)("p",{className:"xmd-hero-subtitle",children:p.heroSubtitle}),(0,o.jsx)(r,{copyLabel:p.install.copyLabel,copySuccessText:p.install.copySuccessText,playgroundHref:p.install.playgroundHref,playgroundLabel:p.install.playgroundLabel}),(0,o.jsx)("dl",{className:"xmd-hero-facts","aria-label":p.eyebrow,children:p.facts.map(function(i){return(0,o.jsxs)("div",{children:[(0,o.jsx)("dt",{children:i.term}),(0,o.jsx)("dd",{children:i.desc})]},i.term)})})]}),v]})}},24849:function(B,d,e){e.d(d,{v:function(){return r}});var m=e(64599),o=e.n(m),u=e(67294);function r(){var c=(0,u.useRef)(null);return(0,u.useEffect)(function(){var n=c.current;if(n){var l=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(l||typeof IntersectionObserver=="undefined"){n.classList.add("is-in");return}var p=new IntersectionObserver(function(v){var N=o()(v),i;try{for(N.s();!(i=N.n()).done;){var P=i.value;P.isIntersecting&&(P.target.classList.add("is-in"),p.unobserve(P.target))}}catch(C){N.e(C)}finally{N.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return p.observe(n),function(){return p.disconnect()}}},[]),c}},38116:function(B,d,e){e.d(d,{a:function(){return q}});var m=e(19632),o=e.n(m),u=e(5574),r=e.n(u),c=e(97857),n=e.n(c),l=e(64599),p=e.n(l),v=e(67294);function N(){return{segments:[],prev:"",nextId:0}}function i(f,g){for(var E=Math.min(f.length,g.length),h=0;h<E&&f[h]===g[h];)h++;return h}function P(f,g){if(g===f.prev)return f;var E=i(f.prev,g),h=[],x=0,y=p()(f.segments),A;try{for(y.s();!(A=y.n()).done;){var M=A.value;if(x>=E)break;var k=x+M.text.length;k<=E?h.push(M):h.push({id:M.id,text:M.text.slice(0,E-x)}),x=k}}catch(R){y.e(R)}finally{y.f()}var H=f.nextId,b=g.slice(E);return b&&h.push({id:H++,text:b}),{segments:h,prev:g,nextId:H}}var C=e(85893);function a(f){if(typeof document=="undefined")return f;var g=document.createElement("textarea");return g.innerHTML=f,g.value}var t=function(g){var E=g.value,h=a(E),x=(0,v.useRef)(N());return x.current=P(x.current,h),(0,C.jsx)(C.Fragment,{children:x.current.segments.map(function(y){return(0,C.jsx)("span",{className:"animation-text-char",children:y.text},y.id)})})},$=null,ee={h1:"md-h1",h2:"md-h2",h3:"md-h3",pre:"md-code-block",blockquote:"md-blockquote",a:"md-link",ul:"md-list",ol:"md-list",table:"md-table"},ae=new Set(["br","img","hr","input"]);function re(f){var g;f&&(g=navigator.clipboard)!==null&&g!==void 0&&g.writeText&&navigator.clipboard.writeText(f).catch(function(){})}var ie=(0,C.jsxs)("svg",{viewBox:"0 0 16 16",width:14,height:14,fill:"none","aria-hidden":"true",children:[(0,C.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:1.4}),(0,C.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round"})]});function J(f,g){if(f.name==="copy-button"){var E,h=((E=f.attrs)===null||E===void 0?void 0:E["data-copy"])!=null?String(f.attrs["data-copy"]):"";return(0,C.jsx)("button",{type:"button",className:"md-copy-btn","aria-label":"\u590D\u5236",onClick:function(){return re(h)},children:ie},g)}if(f.name==="text"){var x,y;return(0,C.jsx)("span",{className:(x=f.attrs)!==null&&x!==void 0&&x.class?String(f.attrs.class):void 0,children:((y=f.attrs)===null||y===void 0?void 0:y.value)!=null?String(f.attrs.value):""},g)}return X(f,g,!1)}function Z(f){var g={},E=p()(f.split(";")),h;try{for(E.s();!(h=E.n()).done;){var x=h.value,y=x.trim();if(y){var A=y.indexOf(":");if(A!==-1){var M=y.slice(0,A).trim(),k=y.slice(A+1).trim(),H=M.replace(/-([a-z])/g,function(b,R){return R.toUpperCase()});g[H]=k}}}}catch(b){E.e(b)}finally{E.f()}return g}function U(f){return f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function X(f,g,E){var h=f.name,x=f.attrs,y=f.children,A=f.animate,M=(h||"div").toLowerCase();if(M==="text"){var k=(x==null?void 0:x.value)!=null?String(x.value):"";if(E)return(0,C.jsx)(t,{value:k},g);var H=/<|>|"|'/.test(k)?U(k):k;return v.createElement("span",{key:g,dangerouslySetInnerHTML:{__html:H}})}if(f.header&&f.header.length>0){var b=M==="table",R=b?"md-tableblock":"md-codeblock",W=b?"md-tableblock-bar":"md-codeblock-bar",O=(0,C.jsx)("div",{className:W,children:f.header.map(function(ne,_){return J(ne,_)})}),S=X(n()(n()({},f),{},{header:void 0}),"el",E);return(0,C.jsxs)("div",{className:R,children:[O,S]},g)}var s=[];ee[M]&&s.push(ee[M]),A&&s.push("md-animate-block");var D={key:g};if(x)for(var F=0,Y=Object.entries(x);F<Y.length;F++){var I=r()(Y[F],2),z=I[0],K=I[1];z==="class"?s.length>0?(D.className="".concat(K," ").concat(s.join(" ")),s.length=0):D.className=K:z==="style"&&typeof K=="string"?D.style=Z(K):K===!0?D[z]=!0:K!==!1&&K!=null&&(D[z]=String(K))}if(s.length>0&&(D.className=D.className?"".concat(D.className," ").concat(s.join(" ")):s.join(" ")),ae.has(M))return v.createElement(M,D);var G=x&&typeof x.class=="string"?x.class:"",V=M==="pre"||/(^|\s)katex/.test(G),Q=E&&!V;if(M==="table"&&y&&y.length>0){var T=[],L=[],te=function(_){L.length&&(T.push(v.createElement.apply(v,["tbody",{key:_}].concat(o()(L)))),L=[])};return y.forEach(function(ne,_){(ne.name||"").toLowerCase()==="tr"?L.push(X(ne,"tr-".concat(_),Q)):(te("tb-".concat(_)),T.push(X(ne,_,Q)))}),te("tb-last"),v.createElement.apply(v,[M,D].concat(T))}var oe=y==null?void 0:y.map(function(ne,_){return X(ne,_,Q)});return oe&&oe.length>0?v.createElement.apply(v,[M,D].concat(o()(oe))):v.createElement(M,D)}function q(f){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return f.map(function(E,h){return X(E,h,g)})}},7037:function(){}}]);
