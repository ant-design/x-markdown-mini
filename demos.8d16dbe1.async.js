"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[433],{79563:function(O,c,e){e.r(c),e.d(c,{default:function(){return p}});var m=e(67294),o=e(14649),f=e(85893),u=`## \u7EC4\u4EF6\u6E32\u67D3

\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 \`content\`\uFF0C\u7EC4\u4EF6\u5185\u90E8\u5B8C\u6210\u89E3\u6790\u548C\u6E32\u67D3\u3002

- \u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u4E92\u4E0D\u5E72\u6270
- \u5378\u8F7D\u65F6\u81EA\u52A8\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001
- [\u67E5\u770B API](https://github.com/ant-design/x-markdown-mini)
`,i=`Page({
  data: {
    content: '## \u7EC4\u4EF6\u6E32\u67D3\\n\\n\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 content\u2026',
  },
  onComplete() {
    console.log('render complete');
  },
});`,t=`.page {
  padding: 16px;
}`,a=[{key:"markdown",title:"Markdown \u7EC4\u4EF6",description:"\u4E1A\u52A1\u9875\u4F18\u5148\u63A5\u5165 Markdown \u7EC4\u4EF6\u3002\u7EC4\u4EF6\u5185\u90E8\u521B\u5EFA\u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u5E76\u5728\u751F\u547D\u5468\u671F\u7ED3\u675F\u65F6\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001\u3002",navTitle:"Markdown \u7EC4\u4EF6",markdown:u,alipay:{template:`<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    onRenderComplete="onComplete"
  />
</view>`,script:i,style:t,json:`{
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
</view>`,script:i,style:t,json:`{
  "navigationBarTitleText": "Markdown \u7EC4\u4EF6",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}}];function p(){return(0,f.jsx)(o.O,{demos:a,codeMinHeight:560})}},44928:function(O,c,e){e.r(c),e.d(c,{default:function(){return r}});var m=e(67294),o=e(14649),f=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,u=`.page {
  padding: 16px;
}
`,i=`const { renderNodes } = require('@ant-design/x-markdown-mini');

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
`,t=`{
  "defaultTitle": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,a=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,p=`.page {
  padding: 16px;
}
`,y=`const { renderNodes } = require('@ant-design/x-markdown-mini');

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
`,b=`{
  "navigationBarTitleText": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,w=e(85893),k=`# Hello

**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002

- \u65E0\u9700 WebView
- \u65E0\u9700 HTML \u767D\u540D\u5355
`,F=[{key:"render-nodes",title:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",description:"\u63A8\u8350\u5148\u7528 renderNodes \u751F\u6210 MiniNode[]\uFF0C\u518D\u4EA4\u7ED9 MiniNodeRenderer \u6216\u81EA\u5B9A\u4E49\u6E32\u67D3\u7EC4\u4EF6\u63A5\u7BA1\u3002",navTitle:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",previewTitle:"\u771F\u5B9E\u9875\u9762\u6587\u4EF6",platformNotes:{alipay:"index.axml / dist components",wechat:"index.wxml / components"},markdown:k,alipay:{template:f,script:i,style:u,json:t},wechat:{template:a,script:y,style:p,json:b}}];function r(){return(0,w.jsx)(o.O,{demos:F,codeMinHeight:560})}},4015:function(O,c,e){e.r(c),e.d(c,{default:function(){return x}});var m=e(67294),o=e(19632),f=e.n(o),u=e(5574),i=e.n(u),t=e(10744),a=e(9579),p=e(21483),y=e(21650),b=e(83478),w=e(38116),k=e(5114),F=e(7037),r=e(85893),n=k._B,V=[50,30,20,10,50],Z=[300,200,100,0],Q=900,X=2800;function ee(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ne(){var h=(0,b.useDocPlatform)(),j=i()(h,1),d=j[0],l=(0,m.useRef)(null),s=(0,m.useCallback)(function(){return l.current||(l.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,a.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),l.current},[]),v=(0,m.useMemo)(function(){try{return s().renderNodes({content:n,platform:d,selectable:!0})}catch(P){return[]}},[d,s]),C=(0,m.useState)(v),N=i()(C,2),W=N[0],A=N[1],H=(0,m.useState)(!1),G=i()(H,2),Y=G[0],R=G[1],M=(0,m.useState)(!1),S=i()(M,2),D=S[0],$=S[1],B=(0,m.useRef)(0),U=(0,m.useRef)(),I=(0,m.useRef)(),z=(0,m.useCallback)(function(){var P=s(),T=B.current+1;B.current=T,P.reset(),A([]),R(!0);try{P.renderNodes({content:n,platform:d,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:Z,charDelay:V}},onPatch:function(se){B.current===T&&A(f()(se))},onRenderComplete:function(){B.current===T&&(R(!1),U.current=setTimeout(z,X))}})}catch(q){B.current===T&&(A(v),R(!1))}},[d,s,v]);(0,m.useEffect)(function(){if(ee()||D){A(v),R(!1);return}return A(v),R(!1),I.current=setTimeout(z,Q),function(){var P;B.current+=1,I.current&&clearTimeout(I.current),U.current&&clearTimeout(U.current),(P=l.current)===null||P===void 0||P.reset()}},[d,z,v,D]);var ue=(0,m.useMemo)(function(){return(0,w.a)(W,Y)},[W,Y]),re=(0,r.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!D,"aria-label":D?"Play streaming demo":"Pause streaming demo",title:D?"Play":"Pause",onClick:function(){return $(function(T){return!T})},children:D?(0,r.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,r.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,r.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,r.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,r.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,r.jsx)(y.PhoneShell,{platform:d,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:re,children:ue})})}var te=e(18181),J=e(49682),L={eyebrow:"Mini-programs \xB7 Streaming Markdown",heroTitle:"Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer",heroSubtitle:(0,r.jsxs)(r.Fragment,{children:["Native WeChat and Alipay rendering: Markdown parses straight into per-platform"," ",(0,r.jsx)("code",{children:"MiniNode[]"}),", streamed token by token, with no WebView and no Web HTML pushed into a mini program."]}),facts:[{term:"Token \u2192 Node",desc:"marked lexer output flows straight into platform renderers"},{term:"Streaming",desc:"Stable blocks are cached while the open tail updates"},{term:"WeChat / Alipay",desc:"Platform quirks stay inside the transformer layer"}],install:{copyLabel:"Copy",copySuccessText:"Copied",playgroundHref:"/playground-en",playgroundLabel:"Playground"},scrollCue:"Architecture & streaming",arch:{title:"Native mini-program rendering",body:(0,r.jsxs)(r.Fragment,{children:["Mini programs have no DOM, and ",(0,r.jsx)("code",{children:"rich-text"})," brings its own whitelist. x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer, no adapter matrix, and platform differences stay explicit in the two transformers."]}),proof:[{icon:"math",title:"Math",desc:(0,r.jsx)(r.Fragment,{children:"LaTeX plugin on demand"})},{icon:"ext",title:"Custom extensions",desc:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("code",{children:"miniRenderer"})," emits nodes"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,r.jsx)(r.Fragment,{children:"Inherited from marked parsing"})},{icon:"stream",title:"Streaming-friendly",desc:(0,r.jsx)(r.Fragment,{children:"Stable-block cache, tail-only rerender"})}]}},ae={title:"x-markdown-mini architecture",desc:"Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function x(){return(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("main",{className:"xmd-landing",children:[(0,r.jsx)(te.Z,{copy:L,media:(0,r.jsx)(ne,{})}),(0,r.jsx)(J.Z,{copy:L,diagram:ae})]})})}},41540:function(O,c,e){e.r(c),e.d(c,{default:function(){return x}});var m=e(67294),o=e(19632),f=e.n(o),u=e(5574),i=e.n(u),t=e(10744),a=e(9579),p=e(21483),y=e(21650),b=e(83478),w=e(38116),k=e(5114),F=e(7037),r=e(85893),n=k._B,V=[50,30,20,10,50],Z=[300,200,100,0],Q=900,X=2800;function ee(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ne(){var h=(0,b.useDocPlatform)(),j=i()(h,1),d=j[0],l=(0,m.useRef)(null),s=(0,m.useCallback)(function(){return l.current||(l.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,a.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),l.current},[]),v=(0,m.useMemo)(function(){try{return s().renderNodes({content:n,platform:d,selectable:!0})}catch(P){return[]}},[d,s]),C=(0,m.useState)(v),N=i()(C,2),W=N[0],A=N[1],H=(0,m.useState)(!1),G=i()(H,2),Y=G[0],R=G[1],M=(0,m.useState)(!1),S=i()(M,2),D=S[0],$=S[1],B=(0,m.useRef)(0),U=(0,m.useRef)(),I=(0,m.useRef)(),z=(0,m.useCallback)(function(){var P=s(),T=B.current+1;B.current=T,P.reset(),A([]),R(!0);try{P.renderNodes({content:n,platform:d,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:Z,charDelay:V}},onPatch:function(se){B.current===T&&A(f()(se))},onRenderComplete:function(){B.current===T&&(R(!1),U.current=setTimeout(z,X))}})}catch(q){B.current===T&&(A(v),R(!1))}},[d,s,v]);(0,m.useEffect)(function(){if(ee()||D){A(v),R(!1);return}return A(v),R(!1),I.current=setTimeout(z,Q),function(){var P;B.current+=1,I.current&&clearTimeout(I.current),U.current&&clearTimeout(U.current),(P=l.current)===null||P===void 0||P.reset()}},[d,z,v,D]);var ue=(0,m.useMemo)(function(){return(0,w.a)(W,Y)},[W,Y]),re=(0,r.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!D,"aria-label":D?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:D?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return $(function(T){return!T})},children:D?(0,r.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,r.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,r.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,r.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,r.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,r.jsx)(y.PhoneShell,{platform:d,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:re,children:ue})})}var te=e(18181),J=e(49682),L={eyebrow:"\u5C0F\u7A0B\u5E8F \xB7 \u6D41\u5F0F Markdown",heroTitle:"\u591A\u7AEF\uFF0C\u6D41\u5F0F\u53CB\u597D\uFF0C\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668",heroSubtitle:(0,r.jsxs)(r.Fragment,{children:["\u539F\u751F\u7684\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u6E32\u67D3\uFF1AMarkdown \u76F4\u63A5\u89E3\u6790\u4E3A\u5404\u7AEF\u7684 ",(0,r.jsx)("code",{children:"MiniNode[]"}),"\uFF0Ctoken \u7EA7\u6D41\u5F0F\u76F4\u51FA\uFF0C\u4E0D\u7ECF\u8FC7 WebView\uFF0C\u4E5F\u4E0D\u628A Web HTML \u585E\u8FDB\u5C0F\u7A0B\u5E8F\u3002"]}),facts:[{term:"Token \u2192 Node",desc:"marked \u8BCD\u6CD5\u7ED3\u679C\u76F4\u63A5\u8FDB\u5165\u5E73\u53F0 renderer"},{term:"Streaming",desc:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u7B97\u672A\u5B8C\u6210\u5C3E\u90E8"},{term:"WeChat / Alipay",desc:"\u5E73\u53F0\u5DEE\u5F02\u5728 transformer \u5185\u6536\u655B"}],install:{copyLabel:"\u590D\u5236",copySuccessText:"\u5DF2\u590D\u5236",playgroundHref:"/playground",playgroundLabel:"\u5728\u7EBF\u4F53\u9A8C"},scrollCue:"\u67B6\u6784\u4E0E\u6D41\u5F0F\u539F\u7406",arch:{title:"\u539F\u751F\u5C0F\u7A0B\u5E8F\u6E32\u67D3",body:(0,r.jsxs)(r.Fragment,{children:["\u5C0F\u7A0B\u5E8F\u6CA1\u6709 DOM\uFF0C",(0,r.jsx)("code",{children:"rich-text"})," \u53C8\u4F1A\u91CD\u65B0\u5957\u767D\u540D\u5355\u3002x-markdown-mini \u76F4\u63A5\u4EA7\u51FA\u53EF\u6E32\u67D3\u7684\u8282\u70B9\u6811\uFF1Alexer \u4E4B\u540E\u6CA1\u6709\u4E2D\u95F4 IR\uFF0C\u6CA1\u6709\u9002\u914D\u5668\u77E9\u9635\uFF0C\u5E73\u53F0\u5DEE\u5F02\u5728\u4E24\u4E2A transformer \u91CC\u660E\u8BF4\u3002"]}),proof:[{icon:"math",title:"\u516C\u5F0F",desc:(0,r.jsx)(r.Fragment,{children:"LaTeX \u63D2\u4EF6\u6309\u9700\u5F15\u5165"})},{icon:"ext",title:"\u81EA\u5B9A\u4E49\u62D3\u5C55",desc:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("code",{children:"miniRenderer"})," \u76F4\u51FA\u8282\u70B9"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,r.jsx)(r.Fragment,{children:"\u7EE7\u627F marked \u89E3\u6790\u80FD\u529B"})},{icon:"stream",title:"\u6D41\u5F0F\u53CB\u597D",desc:(0,r.jsx)(r.Fragment,{children:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u8DD1\u5C3E\u90E8"})}]}},ae={title:"x-markdown-mini \u67B6\u6784\u56FE",desc:"Markdown \u7ECF marked lexer\u3001Token \u5230\u5E73\u53F0 renderer \u8F93\u51FA MiniNode\uFF1B\u6D41\u5F0F\u7ECF StreamingProcessor \u590D\u7528\u540C\u4E00 transform\u3002",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function x(){return(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("main",{className:"xmd-landing",children:[(0,r.jsx)(te.Z,{copy:L,media:(0,r.jsx)(ne,{})}),(0,r.jsx)(J.Z,{copy:L,diagram:ae})]})})}},82175:function(O,c,e){e.r(c);var m=e(67294),o=e(45960),f=e(85893),u=`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \`inline code\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)

> \u5F15\u7528\u5757\uFF1A\u7528\u4E8E\u6F14\u793A blockquote \u7684\u6E32\u67D3\u964D\u7EA7\u3002
`,i=`.page { padding: 24rpx; }
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}`,t=`Page({
  data: {
    content: \`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \\\`inline code\\\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)
\`,
  },
});`;c.default=function(){return(0,f.jsx)(o.DemoCard,{markdown:u,alipay:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:i,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`},wechat:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:i,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}})}},16337:function(O,c,e){e.r(c);var m=e(67294),o=e(45960),f=e(85893),u="## \u56F4\u680F\u4EE3\u7801\u5757\n\n```js\nconst greet = (name) => `Hello ${name}`;\ngreet('mini');\n```\n",i="Page({\n  data: {\n    content: '\\`\\`\\`js\\nconst greet = (name) => \\`Hello \\${name}\\`;\\n\\`\\`\\`',\n  },\n});";c.default=function(){return(0,f.jsx)(o.DemoCard,{markdown:u,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:i},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:i}})}},22389:function(O,c,e){e.r(c);var m=e(67294),o=e(45960),f=e(85893),u=`## GFM \u8868\u683C

| \u5E73\u53F0   | platform   |
|--------|------------|
| \u5FAE\u4FE1   | \`wechat\`  |
| \u652F\u4ED8\u5B9D | \`alipay\`  |
| \u6296\u97F3   | \`douyin\`  |
`,i=`Page({
  data: {
    content: \`| \u5E73\u53F0 | platform |
|------|----------|
| \u5FAE\u4FE1 | wechat   |
| \u652F\u4ED8\u5B9D | alipay |\`,
  },
});`;c.default=function(){return(0,f.jsx)(o.DemoCard,{markdown:u,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:i},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:i}})}},1248:function(O,c,e){e.r(c);var m=e(67294),o=e(5114),f=e(85893);c.default=function(){return(0,f.jsx)(o.XQ,{})}},64558:function(O,c,e){e.r(c);var m=e(67294),o=e(21483),f=e(45960),u=e(85893),i="```",t="\u9AD8\u4EAE\u7531 `highlight.js` \u5B8C\u6210\uFF1A\n\n".concat(i,`ts
function greet(name: string): string {
  // \u6A21\u677F\u5B57\u7B26\u4E32 + \u7C7B\u578B\u6807\u6CE8
  return \`Hello, \${name}\`;
}
`).concat(i,`

\u672A\u77E5\u8BED\u8A00\u4F1A\u56DE\u9000\u5230\u666E\u901A\u4EE3\u7801\u5757\u3002
`),a=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,p=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`,y=[(0,o.default)()];c.default=function(){return(0,u.jsx)(f.DemoCard,{markdown:t,extensions:y,files:[{name:"usage.ts",lang:"ts",code:a},{name:"style",lang:"css",code:p},{name:"input.md",lang:"md",code:t}]})}},59659:function(O,c,e){e.r(c),e.d(c,{default:function(){return y}});var m=e(67294),o=`import type {
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
`,f=e(45960),u=e(84629),i=e(85893),t=`Markdown[^1:\u4E00\u79CD\u8F7B\u91CF\u6807\u8BB0\u8BED\u8A00] \u5F88\u9002\u5408\u79FB\u52A8\u7AEF\u9605\u8BFB\uFF0C
\u4E5F\u65B9\u4FBF\u6A21\u578B\u6D41\u5F0F\u8F93\u51FA[^2:LLM \u9010 token \u8FD4\u56DE\u6587\u672C]\u3002
`,a=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createFootnoteExtension } from './footnoteExtension';

const md = new XMarkdownMini({
  extensions: [createFootnoteExtension()],
});

// \u4EA7\u51FA name: 'footnote' \u7684 MiniNode\uFF0C
// marker \u4E0E\u5F39\u5C42\u7531\u5BBF\u4E3B\u9875\u9762\u6E32\u67D3\uFF08\u7EC4\u4EF6\u5C42\u8D70 slot / \u62BD\u8C61\u8282\u70B9\uFF09
const nodes = md.renderNodes({ content, platform: 'auto' });`,p=[(0,u.createFootnoteExtension)()],y=function(){return(0,i.jsx)(f.DemoCard,{markdown:t,extensions:p,files:[{name:"footnoteExtension.ts",lang:"ts",code:o},{name:"usage.ts",lang:"ts",code:a},{name:"input.md",lang:"md",code:t}]})}},39666:function(O,c,e){e.r(c);var m=e(67294),o=e(9579),f=e(45960),u=e(85893),i=`\u8D28\u80FD\u65B9\u7A0B\uFF1A$E=mc^2$

\u5757\u7EA7\u516C\u5F0F\uFF1A

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

\u4E5F\u652F\u6301 \\( a^2 + b^2 = c^2 \\) \u4E0E \\[ x = y + z \\]
`,t=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';

const md = new XMarkdownMini({
  extensions: [Latex({ katexOptions: { throwOnError: false } })],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,a=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`,p=[(0,o.default)({katexOptions:{throwOnError:!1}})];c.default=function(){return(0,u.jsx)(f.DemoCard,{markdown:i,extensions:p,files:[{name:"usage.ts",lang:"ts",code:t},{name:"style",lang:"css",code:a},{name:"input.md",lang:"md",code:i}]})}},5065:function(O,c,e){e.r(c);var m=e(67294),o=e(45960),f=e(85893),u=`# \u5757\u7EA7\u52A8\u753B

\u65B0\u5757\u6DE1\u5165\uFF1B\u5DF2 commit \u7684\u5757\u5F15\u7528\u7A33\u5B9A\uFF0C\u4E0D\u91CD\u653E\u3002
`,i=`.md-animate-block {
  animation: md-fade-in 320ms cubic-bezier(.2,.7,.2,1) both;
}
@keyframes md-fade-in {
  from { opacity: 0; transform: translateY(8rpx); }
  to   { opacity: 1; transform: none; }
}`,t=`Page({
  data: {
    content: '# \u52A8\u753B\\n\u770B\u6BCF\u4E2A\u6BB5\u843D\u8FDB\u5165\u65F6\u7684\u6DE1\u5165\u3002',
    streaming: { hasNextChunk: false, enableAnimation: true },
  },
});`;c.default=function(){return(0,f.jsx)(o.DemoCard,{markdown:u,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:i},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:i}})}},8386:function(O,c,e){e.r(c),e.d(c,{default:function(){return F}});var m=e(67294),o=e(14649),f=`<view class="page">
  <button class="primary" onTap="startStream">\u5F00\u59CB\u6D41\u5F0F\u8F93\u51FA</button>
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    onRenderComplete="onComplete"
  />
</view>
`,u=`.page {
  padding: 16px;
}

.primary {
  margin-bottom: 12px;
  color: #fff;
  background: #1677ff;
  border-radius: 8px;
}
`,i=`let timer = null;

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
`,t=`{
  "defaultTitle": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/es/Markdown/index"
  }
}
`,a=`<view class="page">
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
`,y=`let timer = null;

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
`,b=`{
  "navigationBarTitleText": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
`,w=e(85893),k=[{key:"basic",title:"\u57FA\u7840\u6D41\u5F0F",description:"\u6BCF\u8F6E\u4F20\u5165\u7D2F\u8BA1 Markdown\uFF0C\u6700\u540E\u4E00\u8F6E\u628A hasNextChunk \u7F6E\u4E3A false\uFF0C\u5185\u90E8\u4F1A flush \u5269\u4F59 tail\u3002",navTitle:"\u6D41\u5F0F\u8F93\u51FA",markdown:`# \u6D41\u5F0F\u8F93\u51FA

\u8FB9\u5582\u6570\u636E\u8FB9\u6E32\u67D3\u3002\u5DF2\u7A33\u5B9A\u7684\u5757\u53EA\u89E3\u6790\u4E00\u6B21\u3002`,animation:!0,alipay:{template:f,script:i,style:u,json:t},wechat:{template:a,script:y,style:p,json:b}}];function F(){return(0,w.jsx)(o.O,{demos:k,codeMinHeight:560})}},83538:function(O,c,e){e.r(c);var m=e(67294),o=e(45960),f=e(85893),u=`# \u6253\u5B57\u673A\u6A21\u5F0F

\u6309\u53E5\u53F7\u3001\u95EE\u53F7\u3001\u6362\u884C\u5207\u5757\uFF1B\u6BCF\u5757\u518D\u6309 charDelay \u9010\u5B57\u63A8\u8FDB\u3002\u8D85\u957F\u53E5\u6309 maxChunkSize \u515C\u5E95\u5207\u3002
`,i=`Page({
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
});`;c.default=function(){return(0,f.jsx)(o.DemoCard,{markdown:u,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:i},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:i}})}},14649:function(O,c,e){e.d(c,{O:function(){return y}});var m=e(5574),o=e.n(m),f=e(67294),u=e(21650),i=e(75892),t=e(83478),a=e(85893),p={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},y=function(k){var F,r,n,V,Z,Q,X=k.demos,ee=k.codeMinHeight,ne=k.codeMaxHeight,te=(0,t.useDocPlatform)(),J=o()(te,1),L=J[0],ae=(0,f.useState)((F=(r=X[0])===null||r===void 0?void 0:r.key)!==null&&F!==void 0?F:""),x=o()(ae,2),h=x[0],j=x[1],d=typeof window!="undefined"&&(window.location.pathname.endsWith("-en")||document.documentElement.lang.toLowerCase().startsWith("en")),l={tablist:d?"Switch demo":"\u5207\u6362\u793A\u4F8B",preview:d?"Mini-program preview":"\u5C0F\u7A0B\u5E8F\u9884\u89C8",previewFallback:d?"Live preview":"\u771F\u673A\u9884\u89C8",introduce:d?"Introduce":"\u5F15\u5165",codeSample:d?"Code sample":"\u4EE3\u7801\u793A\u4F8B",register:d?(0,a.jsxs)(a.Fragment,{children:["Register the component in ",(0,a.jsx)("code",{children:"index.json"}),":"]}):(0,a.jsxs)(a.Fragment,{children:["\u5728 ",(0,a.jsx)("code",{children:"index.json"})," \u4E2D\u6CE8\u518C\u7EC4\u4EF6\uFF1A"]}),demoCode:"Demo Code"},s=(0,f.useMemo)(function(){var v;return(v=X.find(function(C){return C.key===h}))!==null&&v!==void 0?v:X[0]},[h,X]);return s?(0,a.jsxs)("div",{className:"xmd-doc-demo",children:[(0,a.jsxs)("div",{className:"xmd-doc-demo-main",children:[X.length>1?(0,a.jsx)("div",{className:"xmd-doc-demo-tabs",role:"tablist","aria-label":l.tablist,children:X.map(function(v){return(0,a.jsx)("button",{type:"button",className:"xmd-doc-demo-tab ".concat(v.key===s.key?"is-active":""),onClick:function(){return j(v.key)},role:"tab","aria-selected":v.key===s.key,children:v.title},v.key)})}):null,s.alipay||s.wechat?(0,a.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,a.jsx)("h2",{className:"xmd-doc-demo-section-label",children:l.introduce}),(0,a.jsx)("p",{className:"xmd-doc-demo-desc",children:l.register}),(0,a.jsx)(i.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["json"],collapsible:!1},"intro-".concat(s.key,"-").concat(L))]}):null,s.alipay||s.wechat?(0,a.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,a.jsx)("h2",{className:"xmd-doc-demo-section-label",children:l.codeSample}),s.description?(0,a.jsx)("p",{className:"xmd-doc-demo-desc",children:s.description}):null,(0,a.jsx)(i.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["template","script"],collapsible:!1},"usage-".concat(s.key,"-").concat(L)),(0,a.jsx)(i.DemoCode,{alipay:s.alipay,wechat:s.wechat,files:s.files,defaultFile:s.defaultFile,title:l.demoCode,defaultCollapsed:!0,minHeight:ee,maxHeight:ne},"full-".concat(s.key,"-").concat(L))]}):null]}),(0,a.jsxs)("aside",{className:"xmd-doc-demo-preview","aria-label":l.preview,children:[(0,a.jsxs)("div",{className:"xmd-doc-demo-preview-head",children:[(0,a.jsx)("span",{className:"xmd-doc-demo-preview-title",children:(n=(V=s.previewTitle)!==null&&V!==void 0?V:s.navTitle)!==null&&n!==void 0?n:l.previewFallback}),(0,a.jsx)("span",{className:"xmd-doc-demo-preview-platform","data-platform":L,children:p[L]})]}),(Z=s.platformNotes)!==null&&Z!==void 0&&Z[L]?(0,a.jsx)("span",{className:"xmd-doc-demo-preview-note",children:s.platformNotes[L]}):null,(0,a.jsx)(u.PhonePreview,{platform:L,navTitle:s.navTitle,markdown:s.sections?void 0:s.markdown,sections:(Q=s.sections)!==null&&Q!==void 0?Q:s.markdown?[{markdown:s.markdown,animation:s.animation}]:void 0,extensions:s.extensions,components:s.components,gfm:s.gfm,breaks:s.breaks,streamingTail:s.streamingTail})]})]}):null},b=null},5114:function(O,c,e){e.d(c,{XQ:function(){return ae},_B:function(){return J}});var m=e(19632),o=e.n(m),f=e(5574),u=e.n(f),i=e(64599),t=e.n(i),a=e(67294),p=e(10744),y=e(9579),b=e(21483),w=e(38116),k=e(21650),F=e(83478),r=e(71508),n=e(85893),V="https://render.alipay.com/p/s/x-markdown-mini-demo",Z={zh:{heading:"\u626B\u7801\u771F\u673A\u9884\u89C8",alipayLabel:"\u652F\u4ED8\u5B9D",alipayHint:"\u7528\u652F\u4ED8\u5B9D\u626B\u4E00\u626B\uFF0C\u5728\u771F\u673A\u67E5\u770B\u6E32\u67D3\u6548\u679C",wechatLabel:"\u5FAE\u4FE1",wechatComingSoon:"\u7533\u8BF7\u4E2D",wechatHint:"\u5FAE\u4FE1 AppID \u5BA1\u6838\u4E2D\uFF0C\u5373\u5C06\u5F00\u653E"},en:{heading:"Scan to preview on device",alipayLabel:"Alipay",alipayHint:"Scan with Alipay to view rendering on a real device",wechatLabel:"WeChat",wechatComingSoon:"Coming soon",wechatHint:"WeChat AppID under review \u2014 opening soon"}};function Q(h){var j=h.platform,d=(0,a.useState)(!1),l=u()(d,2),s=l[0],v=l[1];(0,a.useEffect)(function(){typeof window!="undefined"&&v(window.location.pathname.includes("-en"))},[]);var C=Z[s?"en":"zh"];return(0,n.jsxs)("div",{className:"xmd-scan",role:"group","aria-label":C.heading,children:[(0,n.jsx)("span",{className:"xmd-scan-heading",children:C.heading}),(0,n.jsxs)("div",{className:"xmd-scan-codes",children:[(0,n.jsxs)("figure",{className:"xmd-scan-code ".concat(j==="alipay"?"is-active":""),"data-platform":"alipay",children:[(0,n.jsx)("div",{className:"xmd-scan-qr",children:(0,n.jsx)(r.t,{value:V,size:112,level:"M",bgColor:"#ffffff",fgColor:"#171717",marginSize:0})}),(0,n.jsxs)("figcaption",{className:"xmd-scan-caption",children:[(0,n.jsx)("img",{className:"xmd-scan-icon",src:"/brand/alipay-icon.png",alt:"","aria-hidden":"true",width:16,height:16}),(0,n.jsx)("span",{className:"xmd-scan-name",children:C.alipayLabel})]}),(0,n.jsx)("p",{className:"xmd-scan-hint",children:C.alipayHint})]}),(0,n.jsxs)("figure",{className:"xmd-scan-code is-locked ".concat(j==="wechat"?"is-active":""),"data-platform":"wechat","aria-disabled":"true",children:[(0,n.jsxs)("div",{className:"xmd-scan-qr",children:[(0,n.jsx)("div",{className:"xmd-scan-placeholder","aria-hidden":"true",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none","aria-hidden":"true",children:[(0,n.jsx)("rect",{x:"5",y:"10.5",width:"14",height:"9.5",rx:"2",stroke:"currentColor",strokeWidth:"1.6"}),(0,n.jsx)("path",{d:"M8 10.5V8a4 4 0 0 1 8 0v2.5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]})}),(0,n.jsx)("span",{className:"xmd-scan-badge",children:C.wechatComingSoon})]}),(0,n.jsxs)("figcaption",{className:"xmd-scan-caption",children:[(0,n.jsx)("img",{className:"xmd-scan-icon",src:"/brand/wechat-icon.png",alt:"","aria-hidden":"true",width:16,height:16}),(0,n.jsx)("span",{className:"xmd-scan-name",children:C.wechatLabel})]}),(0,n.jsx)("p",{className:"xmd-scan-hint",children:C.wechatHint})]})]})]})}var X={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},ee=["alipay","wechat"],ne=[50,30,20,10,50],te=[300,200,100,0],J=`\u4F60\u597D\uFF01\u6211\u662F AI \u52A9\u624B\uFF0C\u4E0B\u9762\u4E3A\u4F60\u6F14\u793A x-markdown-mini \u7684\u6D41\u5F0F\u6E32\u67D3\u80FD\u529B\u3002

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

*x-markdown-mini \u2014 \u591A\u7AEF\u3001\u6D41\u5F0F\u53CB\u597D\u3001\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668*`;function L(h,j){var d=(0,p.getPlatformRenderer)(j).capabilities,l=0,s=0,v=0,C=function G(Y){var R=Y.name,M=Y.attrs,S=Y.children;R==="ol"&&M&&M.start!=null&&Number(M.start)!==1&&!d.supportsOlStart&&(l+=1),R==="img"&&M&&typeof M.src=="string"&&/^http:\/\//i.test(M.src)&&d.requiresHttpsImage&&(s+=1),R==="a"&&M&&"data-href"in M&&j==="wechat"&&(v+=1);var D=t()(S!=null?S:[]),$;try{for(D.s();!($=D.n()).done;){var B=$.value;G(B)}}catch(U){D.e(U)}finally{D.f()}},N=t()(h),W;try{for(N.s();!(W=N.n()).done;){var A=W.value;C(A)}}catch(G){N.e(G)}finally{N.f()}var H=[];return l&&H.push({kind:"ol-start",label:"<ol start> \u4E0D\u652F\u6301\uFF0C\u5E8F\u53F7\u4ECE 1 \u5F00\u59CB"}),s&&H.push({kind:"http-image",label:"".concat(s," \u5F20 http \u56FE\u7247\u6539\u5199\u4E3A https")}),v&&H.push({kind:"anchor",label:"<a href> \u2192 data-href\uFF0C\u9700\u6D88\u8D39\u65B9\u62E6\u622A tap"}),H}var ae=function(j){var d=j.initialMarkdown,l=d===void 0?J:d,s=(0,a.useState)(l),v=u()(s,2),C=v[0],N=v[1],W=(0,F.useDocPlatform)(),A=u()(W,1),H=A[0],G=(0,a.useState)(H),Y=u()(G,2),R=Y[0],M=Y[1],S=(0,a.useState)(!1),D=u()(S,2),$=D[0],B=D[1],U=(0,a.useState)(!0),I=u()(U,2),z=I[0],ue=I[1],re=(0,a.useState)(!1),P=u()(re,2),T=P[0],q=P[1],se=(0,a.useState)(!0),_=u()(se,2),K=_[0],Ye=_[1],$e=(0,a.useState)(!0),Ae=u()($e,2),xe=Ae[0],ze=Ae[1],Ge=(0,a.useState)(!0),Me=u()(Ge,2),he=Me[0],Ve=Me[1],Ze=(0,a.useState)(!0),Se=u()(Ze,2),fe=Se[0],Qe=Se[1],Je=(0,a.useState)(!0),Pe=u()(Je,2),pe=Pe[0],_e=Pe[1],qe=(0,a.useState)(!0),be=u()(qe,2),me=be[0],en=be[1],nn=(0,a.useState)(!0),Le=u()(nn,2),Ce=Le[0],tn=Le[1],an=(0,a.useState)(!0),Te=u()(an,2),de=Te[0],rn=Te[1],sn=(0,a.useState)(18),Be=u()(sn,2),je=Be[0],on=Be[1],un=(0,a.useState)(120),Oe=u()(un,2),ye=Oe[0],cn=Oe[1],dn=(0,a.useState)(24),Re=u()(dn,2),Fe=Re[0],ln=Re[1],mn=(0,a.useState)(!1),Ie=u()(mn,2),oe=Ie[0],ve=Ie[1],xn=(0,a.useState)([]),He=u()(xn,2),We=He[0],we=He[1],ce=(0,a.useRef)(0);(0,a.useEffect)(function(){M(H)},[H]);var ie=R,hn=(0,a.useCallback)(function(g){M(g),window.localStorage.setItem("xmd-doc-platform",g),window.dispatchEvent(new CustomEvent("xmd-platform-change",{detail:{platform:g}}))},[]),le=(0,a.useRef)(null),Ue=(0,a.useRef)(""),ge=(0,a.useCallback)(function(){var g="".concat(z,"|").concat(T,"|").concat(xe,"|").concat(he,"|").concat(fe,"|").concat(pe);if(le.current&&Ue.current===g)return le.current;var E=[];return he&&E.push((0,y.default)({katexOptions:{throwOnError:!1}})),fe&&E.push((0,b.default)()),le.current=new p.XMarkdownMini({escapeText:xe,streamingFixup:pe?"remend":!1,gfm:z,breaks:T,extensions:E}),Ue.current=g,le.current},[z,T,xe,he,fe,pe]);(0,a.useEffect)(function(){return function(){var g;(g=le.current)===null||g===void 0||g.reset(),ce.current+=1}},[]);var Ke=(0,a.useMemo)(function(){if(oe)return{reactNodes:(0,w.a)(We,me),issues:[]};try{var g=ge(),E=g.renderNodes({content:C,platform:ie,selectable:K});return{reactNodes:(0,w.a)(E),issues:L(E,ie)}}catch(Ee){return{reactNodes:[(0,n.jsxs)("p",{className:"xmd-preview-error",children:["\u6E32\u67D3\u5931\u8D25\uFF1A",String(Ee)]},"error")],issues:[]}}},[C,ie,K,oe,We,me,ge]),fn=Ke.reactNodes,wn=Ke.issues,pn=(0,a.useCallback)(function(){var g=ge(),E=ce.current+1;ce.current=E,g.reset(),ve(!0),we([]),N("");try{var Ee=g.renderNodes({content:J,platform:ie,selectable:K,streaming:{hasNextChunk:!1,enableAnimation:me,semantic:Ce?{maxChunkSize:je,chunkDelay:de?te:ye,charDelay:de?ne:Fe}:!1},onRenderProgress:function(Ne){var Fn=Ne.markdown;ce.current===E&&N(Fn)},onPatch:function(Ne){ce.current===E&&we(o()(Ne))},onRenderComplete:function(){ce.current===E&&ve(!1)}});Ee.length>0&&we(Ee)}catch(De){ve(!1)}},[ie,K,me,Ce,de,je,ye,Fe,ge]),vn=(0,a.useCallback)(function(){var g;ce.current+=1,ve(!1),(g=le.current)===null||g===void 0||g.reset()},[]),gn=(0,a.useState)(!1),Xe=u()(gn,2),ke=Xe[0],En=Xe[1];(0,a.useEffect)(function(){typeof window!="undefined"&&En(window.location.pathname.includes("-en"))},[]);var Cn=ke?"Playground":"\u5728\u7EBF\u6F14\u793A",jn=ke?"/-en":"/",yn=ke?"/docs/code-examples-en":"/docs/code-examples";return(0,n.jsxs)("div",{className:"xmd-pg",children:[(0,n.jsxs)("section",{className:"xmd-pg-editor-wrap","aria-label":"Markdown \u8F93\u5165",children:[(0,n.jsxs)("div",{className:"xmd-pg-editor-header",children:[(0,n.jsx)("label",{className:"xmd-pg-label",htmlFor:"xmd-pg-input",children:"Markdown"}),(0,n.jsxs)("div",{className:"xmd-pg-header-actions",children:[(0,n.jsxs)("button",{type:"button",className:"xmd-pg-stream-btn ".concat(oe?"is-active":""),onClick:oe?vn:pn,"aria-label":oe?"\u505C\u6B62\u6D41\u5F0F":"\u6D41\u5F0F\u6F14\u793A",children:[(0,n.jsx)("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,n.jsx)("polygon",{points:"5 3 19 12 5 21 5 3"})}),(0,n.jsx)("span",{children:oe?"\u505C\u6B62":"\u6D41\u5F0F"})]}),(0,n.jsx)("button",{type:"button",className:"xmd-pg-config-toggle ".concat($?"is-active":""),onClick:function(){return B(!$)},"aria-expanded":$,"aria-label":"\u914D\u7F6E",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,n.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,n.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})})]})]}),$&&(0,n.jsxs)("div",{className:"xmd-pg-config",children:[(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u89E3\u6790"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:z,onChange:function(E){return ue(E.target.checked)}}),(0,n.jsx)("span",{children:"GFM"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8868\u683C/\u5220\u9664\u7EBF"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:T,onChange:function(E){return q(E.target.checked)}}),(0,n.jsx)("span",{children:"Breaks"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\\n \u2192 br"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6E32\u67D3"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:K,onChange:function(E){return Ye(E.target.checked)}}),(0,n.jsx)("span",{children:"Selectable"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u6587\u672C\u53EF\u9009"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:xe,onChange:function(E){return ze(E.target.checked)}}),(0,n.jsx)("span",{children:"Escape"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"HTML \u8F6C\u4E49"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u63D2\u4EF6"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:fe,onChange:function(E){return Qe(E.target.checked)}}),(0,n.jsx)("span",{children:"CodeHighlight"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"hljs \u8BED\u6CD5\u9AD8\u4EAE"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:he,onChange:function(E){return Ve(E.target.checked)}}),(0,n.jsx)("span",{children:"LaTeX"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"KaTeX \u516C\u5F0F"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6D41\u5F0F"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:pe,onChange:function(E){return _e(E.target.checked)}}),(0,n.jsx)("span",{children:"Fixup"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8865\u5168\u672A\u95ED\u5408\u8BED\u6CD5"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:me,onChange:function(E){return en(E.target.checked)}}),(0,n.jsx)("span",{children:"Animation"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u5757\u52A8\u753B"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:Ce,onChange:function(E){return tn(E.target.checked)}}),(0,n.jsx)("span",{children:"Semantic"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8BED\u4E49\u5206\u5757"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:de,onChange:function(E){return rn(E.target.checked)}}),(0,n.jsx)("span",{children:"\u53D8\u901F"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u968F\u5757\u52A0\u901F\u6253\u5B57\u673A"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Max"}),(0,n.jsx)("input",{type:"number",min:8,max:400,value:je,onChange:function(E){return on(Number(E.target.value)||80)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Chunk"}),(0,n.jsx)("input",{type:"number",min:0,max:2e3,disabled:de,value:ye,onChange:function(E){return cn(Number(E.target.value)||0)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Char"}),(0,n.jsx)("input",{type:"number",min:0,max:200,disabled:de,value:Fe,onChange:function(E){return ln(Number(E.target.value)||0)}})]})]})]}),(0,n.jsx)("textarea",{id:"xmd-pg-input",className:"xmd-pg-input",spellCheck:!1,value:C,onChange:function(E){oe||N(E.target.value)},placeholder:"\u8F93\u5165 Markdown\uFF0C\u53F3\u4FA7\u5B9E\u65F6\u9884\u89C8\u2026",readOnly:oe})]}),(0,n.jsxs)("section",{className:"xmd-pg-preview-wrap","aria-label":"\u9884\u89C8",children:[(0,n.jsx)("div",{className:"xmd-pg-platform-switch",role:"tablist","aria-label":"\u5207\u6362\u9884\u89C8\u5E73\u53F0",children:ee.map(function(g){return(0,n.jsx)("button",{type:"button",className:"xmd-pg-platform-btn ".concat(g===ie?"is-active":""),onClick:function(){return hn(g)},role:"tab","aria-selected":g===ie,children:X[g]},g)})}),(0,n.jsx)(k.PhoneShell,{platform:ie,navTitle:Cn,backHref:jn,moreHref:yn,autoScroll:oe,children:fn}),(0,n.jsx)(Q,{platform:ie})]})]})},x=null},49682:function(O,c,e){e.d(c,{Z:function(){return b}});var m=e(97857),o=e.n(m),f=e(67294),u=e(9783),i=e.n(u),t=e(85893);function a(w){var k=w.title,F=w.desc,r=w.labels;return(0,t.jsxs)("svg",{className:"xmd-arch-svg",viewBox:"0 0 960 400",role:"img","aria-labelledby":"xmd-arch-title xmd-arch-desc",children:[(0,t.jsx)("title",{id:"xmd-arch-title",children:k}),(0,t.jsx)("desc",{id:"xmd-arch-desc",children:F}),(0,t.jsxs)("defs",{children:[(0,t.jsx)("marker",{id:"xmd-flow-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#a3a3a3"})}),(0,t.jsx)("marker",{id:"xmd-accent-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7.5",markerHeight:"7.5",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#2563eb"})}),(0,t.jsx)("marker",{id:"xmd-amber-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#c99a1f"})})]}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M148 82 H184",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 82 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M482 82 H520",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M738 82 H780",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 290 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-line",d:"M503 248 C 540 210 631 226 631 190",markerEnd:"url(#xmd-accent-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-ext-line",d:"M760 262 C 760 224 706 226 700 190",markerEnd:"url(#xmd-amber-arrow)"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"24",y:"50",width:"124",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"86",y:"80",textAnchor:"middle",children:r.markdown}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"86",y:"99",textAnchor:"middle",children:"string"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"188",y:"50",width:"150",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"80",textAnchor:"middle",children:r.lexer}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"99",textAnchor:"middle",children:r.lexerNote}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"378",y:"50",width:"104",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"430",y:"80",textAnchor:"middle",children:r.token}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"430",y:"99",textAnchor:"middle",children:r.tokenNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"524",y:"36",width:"214",height:"152",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"631",y:"58",textAnchor:"middle",children:"PlatformRenderer"}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"74",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"101",textAnchor:"middle",children:r.wechat}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"126",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"153",textAnchor:"middle",children:r.alipay}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-node",x:"784",y:"50",width:"148",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"858",y:"80",textAnchor:"middle",children:r.node}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"858",y:"99",textAnchor:"middle",children:r.nodeNote}),(0,t.jsx)("text",{className:"xmd-arch-lane-title",x:"24",y:"244",children:r.streaming}),(0,t.jsx)("rect",{className:"xmd-arch-platform",x:"188",y:"262",width:"150",height:"56",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"291",textAnchor:"middle",children:r.chunk}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"309",textAnchor:"middle",children:r.chunkNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"378",y:"248",width:"250",height:"110",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"503",y:"270",textAnchor:"middle",children:"StreamingProcessor"}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"284",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"303",textAnchor:"middle",children:r.stable}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"320",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"339",textAnchor:"middle",children:r.tail}),(0,t.jsx)("rect",{className:"xmd-arch-ext",x:"690",y:"262",width:"210",height:"72",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"795",y:"290",textAnchor:"middle",children:r.extensions}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"795",y:"311",textAnchor:"middle",children:r.extNote}),(0,t.jsxs)("g",{className:"xmd-arch-pulses","aria-hidden":"true",children:[(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"148",cy:"82",r:"3.4",style:i()({animationDelay:"0s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"82",r:"3.4",style:i()({animationDelay:".35s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"482",cy:"82",r:"3.4",style:i()({animationDelay:".7s"},"--tx","38px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"738",cy:"82",r:"3.4",style:i()({animationDelay:"1.05s"},"--tx","42px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"290",r:"3.4",style:i()({animationDelay:".55s"},"--tx","36px")})]})]})}var p=e(24849),y={math:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M4 4h9l-4.5 6L13 16H4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),ext:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M4 6h12M4 10h12M4 14h7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("circle",{cx:"15.5",cy:"14",r:"2",stroke:"currentColor",strokeWidth:"1.5"})]}),commonmark:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"m4 10 3 3 9-9",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),stream:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M3 7h6M3 13h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("path",{d:"M12 4l4 6-4 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})};function b(w){var k=w.copy,F=w.diagram,r=(0,p.v)();return(0,t.jsxs)("section",{className:"xmd-landing-section xmd-architecture xmd-reveal",ref:r,children:[(0,t.jsxs)("div",{className:"xmd-section-copy",children:[(0,t.jsx)("h2",{children:k.arch.title}),(0,t.jsx)("p",{children:k.arch.body})]}),(0,t.jsxs)("div",{className:"xmd-arch-board","aria-label":F.title,children:[(0,t.jsx)(a,o()({},F)),(0,t.jsx)("div",{className:"xmd-arch-proof",children:k.arch.proof.map(function(n,V){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"xmd-arch-proof-head",children:[y[n.icon],(0,t.jsx)("strong",{children:n.title})]}),(0,t.jsx)("span",{children:n.desc})]},V)})})]})]})}},18181:function(O,c,e){e.d(c,{Z:function(){return t}});var m=e(67294),o=e(85893),f="npm i @ant-design/x-markdown-mini";function u(a){var p=a.copyLabel,y=a.copySuccessText,b=a.playgroundHref,w=a.playgroundLabel;return(0,o.jsxs)("div",{className:"xmd-hero-actions",children:[(0,o.jsxs)("button",{type:"button",className:"xmd-install-command","data-xmd-copy":f,"data-xmd-copy-success":y,"aria-label":p,children:[(0,o.jsx)("span",{className:"xmd-install-prompt","aria-hidden":"true",children:"$"}),(0,o.jsx)("code",{children:f}),(0,o.jsxs)("span",{className:"xmd-copy-control","aria-hidden":"true",children:[(0,o.jsxs)("svg",{className:"xmd-copy-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:[(0,o.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:"1.4"}),(0,o.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]}),(0,o.jsx)("svg",{className:"xmd-check-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:(0,o.jsx)("path",{d:"m3 8.2 3 3L13 4",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,o.jsx)("span",{"data-xmd-copy-status":!0})]})]}),(0,o.jsx)("a",{className:"xmd-secondary-link xmd-playground-link",href:b,children:w})]})}var i=e(24849);function t(a){var p=a.copy,y=a.media,b=(0,i.v)();return(0,o.jsxs)("section",{className:"xmd-hero",children:[(0,o.jsxs)("div",{className:"xmd-hero-copy xmd-reveal",ref:b,children:[(0,o.jsx)("span",{className:"xmd-hero-eyebrow",children:p.eyebrow}),(0,o.jsx)("h1",{children:p.heroTitle}),(0,o.jsx)("p",{className:"xmd-hero-subtitle",children:p.heroSubtitle}),(0,o.jsx)(u,{copyLabel:p.install.copyLabel,copySuccessText:p.install.copySuccessText,playgroundHref:p.install.playgroundHref,playgroundLabel:p.install.playgroundLabel}),(0,o.jsx)("dl",{className:"xmd-hero-facts","aria-label":p.eyebrow,children:p.facts.map(function(w){return(0,o.jsxs)("div",{children:[(0,o.jsx)("dt",{children:w.term}),(0,o.jsx)("dd",{children:w.desc})]},w.term)})})]}),y]})}},24849:function(O,c,e){e.d(c,{v:function(){return u}});var m=e(64599),o=e.n(m),f=e(67294);function u(){var i=(0,f.useRef)(null);return(0,f.useEffect)(function(){var t=i.current;if(t){var a=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(a||typeof IntersectionObserver=="undefined"){t.classList.add("is-in");return}var p=new IntersectionObserver(function(y){var b=o()(y),w;try{for(b.s();!(w=b.n()).done;){var k=w.value;k.isIntersecting&&(k.target.classList.add("is-in"),p.unobserve(k.target))}}catch(F){b.e(F)}finally{b.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return p.observe(t),function(){return p.disconnect()}}},[]),i}},38116:function(O,c,e){e.d(c,{a:function(){return ae}});var m=e(19632),o=e.n(m),f=e(5574),u=e.n(f),i=e(97857),t=e.n(i),a=e(64599),p=e.n(a),y=e(67294);function b(){return{segments:[],prev:"",nextId:0}}function w(x,h){for(var j=Math.min(x.length,h.length),d=0;d<j&&x[d]===h[d];)d++;return d}function k(x,h){if(h===x.prev)return x;var j=w(x.prev,h),d=[],l=0,s=p()(x.segments),v;try{for(s.s();!(v=s.n()).done;){var C=v.value;if(l>=j)break;var N=l+C.text.length;N<=j?d.push(C):d.push({id:C.id,text:C.text.slice(0,j-l)}),l=N}}catch(H){s.e(H)}finally{s.f()}var W=x.nextId,A=h.slice(j);return A&&d.push({id:W++,text:A}),{segments:d,prev:h,nextId:W}}var F=e(85893);function r(x){if(typeof document=="undefined")return x;var h=document.createElement("textarea");return h.innerHTML=x,h.value}var n=function(h){var j=h.value,d=r(j),l=(0,y.useRef)(b());return l.current=k(l.current,d),(0,F.jsx)(F.Fragment,{children:l.current.segments.map(function(s){return(0,F.jsx)("span",{className:"animation-text-char",children:s.text},s.id)})})},V=null,Z={h1:"md-h1",h2:"md-h2",h3:"md-h3",pre:"md-code-block",blockquote:"md-blockquote",a:"md-link",ul:"md-list",ol:"md-list",table:"md-table"},Q=new Set(["br","img","hr","input"]);function X(x){var h;x&&(h=navigator.clipboard)!==null&&h!==void 0&&h.writeText&&navigator.clipboard.writeText(x).catch(function(){})}var ee=(0,F.jsxs)("svg",{viewBox:"0 0 16 16",width:14,height:14,fill:"none","aria-hidden":"true",children:[(0,F.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:1.4}),(0,F.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round"})]});function ne(x,h){if(x.name==="copy-button"){var j,d=((j=x.attrs)===null||j===void 0?void 0:j["data-copy"])!=null?String(x.attrs["data-copy"]):"";return(0,F.jsx)("button",{type:"button",className:"md-copy-btn","aria-label":"\u590D\u5236",onClick:function(){return X(d)},children:ee},h)}if(x.name==="text"){var l,s;return(0,F.jsx)("span",{className:(l=x.attrs)!==null&&l!==void 0&&l.class?String(x.attrs.class):void 0,children:((s=x.attrs)===null||s===void 0?void 0:s.value)!=null?String(x.attrs.value):""},h)}return L(x,h,!1)}function te(x){var h={},j=p()(x.split(";")),d;try{for(j.s();!(d=j.n()).done;){var l=d.value,s=l.trim();if(s){var v=s.indexOf(":");if(v!==-1){var C=s.slice(0,v).trim(),N=s.slice(v+1).trim(),W=C.replace(/-([a-z])/g,function(A,H){return H.toUpperCase()});h[W]=N}}}}catch(A){j.e(A)}finally{j.f()}return h}function J(x){return x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function L(x,h,j){var d=x.name,l=x.attrs,s=x.children,v=x.animate,C=(d||"div").toLowerCase();if(C==="text"){var N=(l==null?void 0:l.value)!=null?String(l.value):"";if(j)return(0,F.jsx)(n,{value:N},h);var W=/<|>|"|'/.test(N)?J(N):N;return y.createElement("span",{key:h,dangerouslySetInnerHTML:{__html:W}})}if(x.header&&x.header.length>0){var A=C==="table",H=A?"md-tableblock":"md-codeblock",G=A?"md-tableblock-bar":"md-codeblock-bar",Y=(0,F.jsx)("div",{className:G,children:x.header.map(function(_,K){return ne(_,K)})}),R=L(t()(t()({},x),{},{header:void 0}),"el",j);return(0,F.jsxs)("div",{className:H,children:[Y,R]},h)}var M=[];Z[C]&&M.push(Z[C]),v&&M.push("md-animate-block");var S={key:h};if(l)for(var D=0,$=Object.entries(l);D<$.length;D++){var B=u()($[D],2),U=B[0],I=B[1];U==="class"?M.length>0?(S.className="".concat(I," ").concat(M.join(" ")),M.length=0):S.className=I:U==="style"&&typeof I=="string"?S.style=te(I):I===!0?S[U]=!0:I!==!1&&I!=null&&(S[U]=String(I))}if(M.length>0&&(S.className=S.className?"".concat(S.className," ").concat(M.join(" ")):M.join(" ")),Q.has(C))return y.createElement(C,S);var z=l&&typeof l.class=="string"?l.class:"",ue=C==="pre"||/(^|\s)katex/.test(z),re=j&&!ue;if(C==="table"&&s&&s.length>0){var P=[],T=[],q=function(K){T.length&&(P.push(y.createElement.apply(y,["tbody",{key:K}].concat(o()(T)))),T=[])};return s.forEach(function(_,K){(_.name||"").toLowerCase()==="tr"?T.push(L(_,"tr-".concat(K),re)):(q("tb-".concat(K)),P.push(L(_,K,re)))}),q("tb-last"),y.createElement.apply(y,[C,S].concat(P))}var se=s==null?void 0:s.map(function(_,K){return L(_,K,re)});return se&&se.length>0?y.createElement.apply(y,[C,S].concat(o()(se))):y.createElement(C,S)}function ae(x){var h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return x.map(function(j,d){return L(j,d,h)})}},7037:function(){}}]);
