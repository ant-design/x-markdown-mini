"use strict";(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[433],{8267:function(L,c,e){e.r(c),e.d(c,{default:function(){return d}});var l=e(67294),i=e(87534),m=e(61344),o=e(85893);function d(){return(0,o.jsx)(i.Z,{copy:m.EN})}},72565:function(L,c,e){e.r(c),e.d(c,{default:function(){return d}});var l=e(67294),i=e(87534),m=e(61344),o=e(85893);function d(){return(0,o.jsx)(i.Z,{copy:m.ZH})}},79563:function(L,c,e){e.r(c),e.d(c,{default:function(){return h}});var l=e(67294),i=e(14649),m=e(85893),o=`## \u7EC4\u4EF6\u6E32\u67D3

\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 \`content\`\uFF0C\u7EC4\u4EF6\u5185\u90E8\u5B8C\u6210\u89E3\u6790\u548C\u6E32\u67D3\u3002

- \u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u4E92\u4E0D\u5E72\u6270
- \u5378\u8F7D\u65F6\u81EA\u52A8\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001
- [\u67E5\u770B API](https://github.com/ant-design/x-markdown-mini)
`,d=`Page({
  data: {
    content: '## \u7EC4\u4EF6\u6E32\u67D3\\n\\n\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 content\u2026',
  },
  onComplete() {
    console.log('render complete');
  },
});`,t=`.page {
  padding: 16px;
}`,a=[{key:"markdown",title:"Markdown \u7EC4\u4EF6",description:"\u4E1A\u52A1\u9875\u4F18\u5148\u63A5\u5165 Markdown \u7EC4\u4EF6\u3002\u7EC4\u4EF6\u5185\u90E8\u521B\u5EFA\u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u5E76\u5728\u751F\u547D\u5468\u671F\u7ED3\u675F\u65F6\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001\u3002",navTitle:"Markdown \u7EC4\u4EF6",markdown:o,alipay:{template:`<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    onRenderComplete="onComplete"
  />
</view>`,script:d,style:t,json:`{
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
</view>`,script:d,style:t,json:`{
  "navigationBarTitleText": "Markdown \u7EC4\u4EF6",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}}];function h(){return(0,m.jsx)(i.O,{demos:a,codeMinHeight:560})}},44928:function(L,c,e){e.r(c),e.d(c,{default:function(){return r}});var l=e(67294),i=e(14649),m=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,o=`.page {
  padding: 16px;
}
`,d=`const { renderNodes } = require('@ant-design/x-markdown-mini');

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
`,h=`.page {
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
`,F=`{
  "navigationBarTitleText": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,D=e(85893),j=`# Hello

**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002

- \u65E0\u9700 WebView
- \u65E0\u9700 HTML \u767D\u540D\u5355
`,k=[{key:"render-nodes",title:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",description:"\u63A8\u8350\u5148\u7528 renderNodes \u751F\u6210 MiniNode[]\uFF0C\u518D\u4EA4\u7ED9 MiniNodeRenderer \u6216\u81EA\u5B9A\u4E49\u6E32\u67D3\u7EC4\u4EF6\u63A5\u7BA1\u3002",navTitle:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",previewTitle:"\u771F\u5B9E\u9875\u9762\u6587\u4EF6",platformNotes:{alipay:"index.axml / dist components",wechat:"index.wxml / components"},markdown:j,alipay:{template:m,script:d,style:o,json:t},wechat:{template:a,script:v,style:h,json:F}}];function r(){return(0,D.jsx)(i.O,{demos:k,codeMinHeight:560})}},4015:function(L,c,e){e.r(c),e.d(c,{default:function(){return f}});var l=e(67294),i=e(19632),m=e.n(i),o=e(5574),d=e.n(o),t=e(10744),a=e(9579),h=e(21483),v=e(87397),F=e(83478),D=e(38116),j=e(5114),k=e(7037),r=e(85893),n=j._B,X=[50,30,20,10,50],V=[300,200,100,0],Q=900,z=2800;function ee(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ne(){var p=(0,F.useDocPlatform)(),w=d()(p,1),u=w[0],x=(0,l.useRef)(null),s=(0,l.useCallback)(function(){return x.current||(x.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,a.default)({katexOptions:{throwOnError:!1}}),(0,h.default)()]})),x.current},[]),g=(0,l.useMemo)(function(){try{return s().renderNodes({content:n,platform:u,selectable:!0})}catch(S){return[]}},[u,s]),C=(0,l.useState)(g),A=d()(C,2),W=A[0],M=A[1],H=(0,l.useState)(!1),G=d()(H,2),Y=G[0],R=G[1],b=(0,l.useState)(!1),P=d()(b,2),N=P[0],$=P[1],O=(0,l.useRef)(0),K=(0,l.useRef)(),I=(0,l.useRef)(),Z=(0,l.useCallback)(function(){var S=s(),B=O.current+1;O.current=B,S.reset(),M([]),R(!0);try{S.renderNodes({content:n,platform:u,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:V,charDelay:X}},onPatch:function(oe){O.current===B&&M(m()(oe))},onRenderComplete:function(){O.current===B&&(R(!1),K.current=setTimeout(Z,z))}})}catch(q){O.current===B&&(M(g),R(!1))}},[u,s,g]);(0,l.useEffect)(function(){if(ee()||N){M(g),R(!1);return}return M(g),R(!1),I.current=setTimeout(Z,Q),function(){var S;O.current+=1,I.current&&clearTimeout(I.current),K.current&&clearTimeout(K.current),(S=x.current)===null||S===void 0||S.reset()}},[u,Z,g,N]);var de=(0,l.useMemo)(function(){return(0,D.a)(W,Y)},[W,Y]),re=(0,r.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!N,"aria-label":N?"Play streaming demo":"Pause streaming demo",title:N?"Play":"Pause",onClick:function(){return $(function(B){return!B})},children:N?(0,r.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,r.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,r.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,r.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,r.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,r.jsx)(v.PhoneShell,{platform:u,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:re,children:de})})}var te=e(18181),J=e(49682),T={eyebrow:"Mini-programs \xB7 Streaming Markdown",heroTitle:"Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer",heroSubtitle:(0,r.jsxs)(r.Fragment,{children:["Native WeChat and Alipay rendering: Markdown parses straight into per-platform"," ",(0,r.jsx)("code",{children:"MiniNode[]"}),", streamed token by token, with no WebView and no Web HTML pushed into a mini program."]}),facts:[{term:"Token \u2192 Node",desc:"marked lexer output flows straight into platform renderers"},{term:"Streaming",desc:"Stable blocks are cached while the open tail updates"},{term:"WeChat / Alipay",desc:"Platform quirks stay inside the transformer layer"}],install:{copyLabel:"Copy",copySuccessText:"Copied",playgroundHref:"/playground-en",playgroundLabel:"Playground"},scrollCue:"Architecture & streaming",arch:{title:"Native mini-program rendering",body:(0,r.jsxs)(r.Fragment,{children:["Mini programs have no DOM, and ",(0,r.jsx)("code",{children:"rich-text"})," brings its own whitelist. x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer, no adapter matrix, and platform differences stay explicit in the two transformers."]}),proof:[{icon:"math",title:"Math",desc:(0,r.jsx)(r.Fragment,{children:"LaTeX plugin on demand"})},{icon:"ext",title:"Custom extensions",desc:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("code",{children:"miniRenderer"})," emits nodes"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,r.jsx)(r.Fragment,{children:"Inherited from marked parsing"})},{icon:"stream",title:"Streaming-friendly",desc:(0,r.jsx)(r.Fragment,{children:"Stable-block cache, tail-only rerender"})}]}},ae={title:"x-markdown-mini architecture",desc:"Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function f(){return(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("main",{className:"xmd-landing",children:[(0,r.jsx)(te.Z,{copy:T,media:(0,r.jsx)(ne,{})}),(0,r.jsx)(J.Z,{copy:T,diagram:ae})]})})}},41540:function(L,c,e){e.r(c),e.d(c,{default:function(){return f}});var l=e(67294),i=e(19632),m=e.n(i),o=e(5574),d=e.n(o),t=e(10744),a=e(9579),h=e(21483),v=e(87397),F=e(83478),D=e(38116),j=e(5114),k=e(7037),r=e(85893),n=j._B,X=[50,30,20,10,50],V=[300,200,100,0],Q=900,z=2800;function ee(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ne(){var p=(0,F.useDocPlatform)(),w=d()(p,1),u=w[0],x=(0,l.useRef)(null),s=(0,l.useCallback)(function(){return x.current||(x.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,a.default)({katexOptions:{throwOnError:!1}}),(0,h.default)()]})),x.current},[]),g=(0,l.useMemo)(function(){try{return s().renderNodes({content:n,platform:u,selectable:!0})}catch(S){return[]}},[u,s]),C=(0,l.useState)(g),A=d()(C,2),W=A[0],M=A[1],H=(0,l.useState)(!1),G=d()(H,2),Y=G[0],R=G[1],b=(0,l.useState)(!1),P=d()(b,2),N=P[0],$=P[1],O=(0,l.useRef)(0),K=(0,l.useRef)(),I=(0,l.useRef)(),Z=(0,l.useCallback)(function(){var S=s(),B=O.current+1;O.current=B,S.reset(),M([]),R(!0);try{S.renderNodes({content:n,platform:u,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:V,charDelay:X}},onPatch:function(oe){O.current===B&&M(m()(oe))},onRenderComplete:function(){O.current===B&&(R(!1),K.current=setTimeout(Z,z))}})}catch(q){O.current===B&&(M(g),R(!1))}},[u,s,g]);(0,l.useEffect)(function(){if(ee()||N){M(g),R(!1);return}return M(g),R(!1),I.current=setTimeout(Z,Q),function(){var S;O.current+=1,I.current&&clearTimeout(I.current),K.current&&clearTimeout(K.current),(S=x.current)===null||S===void 0||S.reset()}},[u,Z,g,N]);var de=(0,l.useMemo)(function(){return(0,D.a)(W,Y)},[W,Y]),re=(0,r.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!N,"aria-label":N?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:N?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return $(function(B){return!B})},children:N?(0,r.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,r.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,r.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,r.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,r.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,r.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,r.jsx)(v.PhoneShell,{platform:u,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:re,children:de})})}var te=e(18181),J=e(49682),T={eyebrow:"\u5C0F\u7A0B\u5E8F \xB7 \u6D41\u5F0F Markdown",heroTitle:"\u591A\u7AEF\uFF0C\u6D41\u5F0F\u53CB\u597D\uFF0C\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668",heroSubtitle:(0,r.jsxs)(r.Fragment,{children:["\u539F\u751F\u7684\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u6E32\u67D3\uFF1AMarkdown \u76F4\u63A5\u89E3\u6790\u4E3A\u5404\u7AEF\u7684 ",(0,r.jsx)("code",{children:"MiniNode[]"}),"\uFF0Ctoken \u7EA7\u6D41\u5F0F\u76F4\u51FA\uFF0C\u4E0D\u7ECF\u8FC7 WebView\uFF0C\u4E5F\u4E0D\u628A Web HTML \u585E\u8FDB\u5C0F\u7A0B\u5E8F\u3002"]}),facts:[{term:"Token \u2192 Node",desc:"marked \u8BCD\u6CD5\u7ED3\u679C\u76F4\u63A5\u8FDB\u5165\u5E73\u53F0 renderer"},{term:"Streaming",desc:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u7B97\u672A\u5B8C\u6210\u5C3E\u90E8"},{term:"WeChat / Alipay",desc:"\u5E73\u53F0\u5DEE\u5F02\u5728 transformer \u5185\u6536\u655B"}],install:{copyLabel:"\u590D\u5236",copySuccessText:"\u5DF2\u590D\u5236",playgroundHref:"/playground",playgroundLabel:"\u5728\u7EBF\u4F53\u9A8C"},scrollCue:"\u67B6\u6784\u4E0E\u6D41\u5F0F\u539F\u7406",arch:{title:"\u539F\u751F\u5C0F\u7A0B\u5E8F\u6E32\u67D3",body:(0,r.jsxs)(r.Fragment,{children:["\u5C0F\u7A0B\u5E8F\u6CA1\u6709 DOM\uFF0C",(0,r.jsx)("code",{children:"rich-text"})," \u53C8\u4F1A\u91CD\u65B0\u5957\u767D\u540D\u5355\u3002x-markdown-mini \u76F4\u63A5\u4EA7\u51FA\u53EF\u6E32\u67D3\u7684\u8282\u70B9\u6811\uFF1Alexer \u4E4B\u540E\u6CA1\u6709\u4E2D\u95F4 IR\uFF0C\u6CA1\u6709\u9002\u914D\u5668\u77E9\u9635\uFF0C\u5E73\u53F0\u5DEE\u5F02\u5728\u4E24\u4E2A transformer \u91CC\u660E\u8BF4\u3002"]}),proof:[{icon:"math",title:"\u516C\u5F0F",desc:(0,r.jsx)(r.Fragment,{children:"LaTeX \u63D2\u4EF6\u6309\u9700\u5F15\u5165"})},{icon:"ext",title:"\u81EA\u5B9A\u4E49\u62D3\u5C55",desc:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("code",{children:"miniRenderer"})," \u76F4\u51FA\u8282\u70B9"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,r.jsx)(r.Fragment,{children:"\u7EE7\u627F marked \u89E3\u6790\u80FD\u529B"})},{icon:"stream",title:"\u6D41\u5F0F\u53CB\u597D",desc:(0,r.jsx)(r.Fragment,{children:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u8DD1\u5C3E\u90E8"})}]}},ae={title:"x-markdown-mini \u67B6\u6784\u56FE",desc:"Markdown \u7ECF marked lexer\u3001Token \u5230\u5E73\u53F0 renderer \u8F93\u51FA MiniNode\uFF1B\u6D41\u5F0F\u7ECF StreamingProcessor \u590D\u7528\u540C\u4E00 transform\u3002",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function f(){return(0,r.jsx)("div",{className:"markdown",children:(0,r.jsxs)("main",{className:"xmd-landing",children:[(0,r.jsx)(te.Z,{copy:T,media:(0,r.jsx)(ne,{})}),(0,r.jsx)(J.Z,{copy:T,diagram:ae})]})})}},82175:function(L,c,e){e.r(c);var l=e(67294),i=e(45960),m=e(85893),o=`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \`inline code\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)

> \u5F15\u7528\u5757\uFF1A\u7528\u4E8E\u6F14\u793A blockquote \u7684\u6E32\u67D3\u964D\u7EA7\u3002
`,d=`.page { padding: 24rpx; }
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
});`;c.default=function(){return(0,m.jsx)(i.DemoCard,{markdown:o,alipay:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:d,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`},wechat:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:d,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}})}},16337:function(L,c,e){e.r(c);var l=e(67294),i=e(45960),m=e(85893),o="## \u56F4\u680F\u4EE3\u7801\u5757\n\n```js\nconst greet = (name) => `Hello ${name}`;\ngreet('mini');\n```\n",d="Page({\n  data: {\n    content: '\\`\\`\\`js\\nconst greet = (name) => \\`Hello \\${name}\\`;\\n\\`\\`\\`',\n  },\n});";c.default=function(){return(0,m.jsx)(i.DemoCard,{markdown:o,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:d},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:d}})}},22389:function(L,c,e){e.r(c);var l=e(67294),i=e(45960),m=e(85893),o=`## GFM \u8868\u683C

| \u5E73\u53F0   | platform   |
|--------|------------|
| \u5FAE\u4FE1   | \`wechat\`  |
| \u652F\u4ED8\u5B9D | \`alipay\`  |
| \u6296\u97F3   | \`douyin\`  |
`,d=`Page({
  data: {
    content: \`| \u5E73\u53F0 | platform |
|------|----------|
| \u5FAE\u4FE1 | wechat   |
| \u652F\u4ED8\u5B9D | alipay |\`,
  },
});`;c.default=function(){return(0,m.jsx)(i.DemoCard,{markdown:o,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:d},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:d}})}},1248:function(L,c,e){e.r(c);var l=e(67294),i=e(5114),m=e(85893);c.default=function(){return(0,m.jsx)(i.XQ,{})}},64558:function(L,c,e){e.r(c);var l=e(67294),i=e(21483),m=e(45960),o=e(85893),d="```",t="\u9AD8\u4EAE\u7531 `highlight.js` \u5B8C\u6210\uFF1A\n\n".concat(d,`ts
function greet(name: string): string {
  // \u6A21\u677F\u5B57\u7B26\u4E32 + \u7C7B\u578B\u6807\u6CE8
  return \`Hello, \${name}\`;
}
`).concat(d,`

\u672A\u77E5\u8BED\u8A00\u4F1A\u56DE\u9000\u5230\u666E\u901A\u4EE3\u7801\u5757\u3002
`),a=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,h=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`,v=[(0,i.default)()];c.default=function(){return(0,o.jsx)(m.DemoCard,{markdown:t,extensions:v,files:[{name:"usage.ts",lang:"ts",code:a},{name:"style",lang:"css",code:h},{name:"input.md",lang:"md",code:t}]})}},59659:function(L,c,e){e.r(c),e.d(c,{default:function(){return v}});var l=e(67294),i=`import type {
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
`,m=e(45960),o=e(84629),d=e(85893),t=`Markdown[^1:\u4E00\u79CD\u8F7B\u91CF\u6807\u8BB0\u8BED\u8A00] \u5F88\u9002\u5408\u79FB\u52A8\u7AEF\u9605\u8BFB\uFF0C
\u4E5F\u65B9\u4FBF\u6A21\u578B\u6D41\u5F0F\u8F93\u51FA[^2:LLM \u9010 token \u8FD4\u56DE\u6587\u672C]\u3002
`,a=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createFootnoteExtension } from './footnoteExtension';

const md = new XMarkdownMini({
  extensions: [createFootnoteExtension()],
});

// \u4EA7\u51FA name: 'footnote' \u7684 MiniNode\uFF0C
// marker \u4E0E\u5F39\u5C42\u7531\u5BBF\u4E3B\u9875\u9762\u6E32\u67D3\uFF08\u7EC4\u4EF6\u5C42\u8D70 slot / \u62BD\u8C61\u8282\u70B9\uFF09
const nodes = md.renderNodes({ content, platform: 'auto' });`,h=[(0,o.createFootnoteExtension)()],v=function(){return(0,d.jsx)(m.DemoCard,{markdown:t,extensions:h,files:[{name:"footnoteExtension.ts",lang:"ts",code:i},{name:"usage.ts",lang:"ts",code:a},{name:"input.md",lang:"md",code:t}]})}},39666:function(L,c,e){e.r(c);var l=e(67294),i=e(9579),m=e(45960),o=e(85893),d=`\u8D28\u80FD\u65B9\u7A0B\uFF1A$E=mc^2$

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
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`,h=[(0,i.default)({katexOptions:{throwOnError:!1}})];c.default=function(){return(0,o.jsx)(m.DemoCard,{markdown:d,extensions:h,files:[{name:"usage.ts",lang:"ts",code:t},{name:"style",lang:"css",code:a},{name:"input.md",lang:"md",code:d}]})}},5065:function(L,c,e){e.r(c);var l=e(67294),i=e(45960),m=e(85893),o=`# \u5757\u7EA7\u52A8\u753B

\u65B0\u5757\u6DE1\u5165\uFF1B\u5DF2 commit \u7684\u5757\u5F15\u7528\u7A33\u5B9A\uFF0C\u4E0D\u91CD\u653E\u3002
`,d=`.md-animate-block {
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
});`;c.default=function(){return(0,m.jsx)(i.DemoCard,{markdown:o,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:d},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:d}})}},8386:function(L,c,e){e.r(c),e.d(c,{default:function(){return k}});var l=e(67294),i=e(14649),m=`<view class="page">
  <button class="primary" onTap="startStream">\u5F00\u59CB\u6D41\u5F0F\u8F93\u51FA</button>
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    onRenderComplete="onComplete"
  />
</view>
`,o=`.page {
  padding: 16px;
}

.primary {
  margin-bottom: 12px;
  color: #fff;
  background: #1677ff;
  border-radius: 8px;
}
`,d=`let timer = null;

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
`,h=`.page {
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
`,F=`{
  "navigationBarTitleText": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
`,D=e(85893),j=[{key:"basic",title:"\u57FA\u7840\u6D41\u5F0F",description:"\u6BCF\u8F6E\u4F20\u5165\u7D2F\u8BA1 Markdown\uFF0C\u6700\u540E\u4E00\u8F6E\u628A hasNextChunk \u7F6E\u4E3A false\uFF0C\u5185\u90E8\u4F1A flush \u5269\u4F59 tail\u3002",navTitle:"\u6D41\u5F0F\u8F93\u51FA",markdown:`# \u6D41\u5F0F\u8F93\u51FA

\u8FB9\u5582\u6570\u636E\u8FB9\u6E32\u67D3\u3002\u5DF2\u7A33\u5B9A\u7684\u5757\u53EA\u89E3\u6790\u4E00\u6B21\u3002`,animation:!0,alipay:{template:m,script:d,style:o,json:t},wechat:{template:a,script:v,style:h,json:F}}];function k(){return(0,D.jsx)(i.O,{demos:j,codeMinHeight:560})}},83538:function(L,c,e){e.r(c);var l=e(67294),i=e(45960),m=e(85893),o=`# \u6253\u5B57\u673A\u6A21\u5F0F

\u6309\u53E5\u53F7\u3001\u95EE\u53F7\u3001\u6362\u884C\u5207\u5757\uFF1B\u6BCF\u5757\u518D\u6309 charDelay \u9010\u5B57\u63A8\u8FDB\u3002\u8D85\u957F\u53E5\u6309 maxChunkSize \u515C\u5E95\u5207\u3002
`,d=`Page({
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
});`;c.default=function(){return(0,m.jsx)(i.DemoCard,{markdown:o,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:d},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:d}})}},14649:function(L,c,e){e.d(c,{O:function(){return v}});var l=e(5574),i=e.n(l),m=e(67294),o=e(87397),d=e(75892),t=e(83478),a=e(85893),h={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},v=function(j){var k,r,n,X,V,Q,z=j.demos,ee=j.codeMinHeight,ne=j.codeMaxHeight,te=(0,t.useDocPlatform)(),J=i()(te,1),T=J[0],ae=(0,m.useState)((k=(r=z[0])===null||r===void 0?void 0:r.key)!==null&&k!==void 0?k:""),f=i()(ae,2),p=f[0],w=f[1],u=typeof window!="undefined"&&(window.location.pathname.endsWith("-en")||document.documentElement.lang.toLowerCase().startsWith("en")),x={tablist:u?"Switch demo":"\u5207\u6362\u793A\u4F8B",preview:u?"Mini-program preview":"\u5C0F\u7A0B\u5E8F\u9884\u89C8",previewFallback:u?"Live preview":"\u771F\u673A\u9884\u89C8",introduce:u?"Introduce":"\u5F15\u5165",codeSample:u?"Code sample":"\u4EE3\u7801\u793A\u4F8B",register:u?(0,a.jsxs)(a.Fragment,{children:["Register the component in ",(0,a.jsx)("code",{children:"index.json"}),":"]}):(0,a.jsxs)(a.Fragment,{children:["\u5728 ",(0,a.jsx)("code",{children:"index.json"})," \u4E2D\u6CE8\u518C\u7EC4\u4EF6\uFF1A"]}),demoCode:"Demo Code"},s=(0,m.useMemo)(function(){var g;return(g=z.find(function(C){return C.key===p}))!==null&&g!==void 0?g:z[0]},[p,z]);return s?(0,a.jsxs)("div",{className:"xmd-doc-demo",children:[(0,a.jsxs)("div",{className:"xmd-doc-demo-main",children:[z.length>1?(0,a.jsx)("div",{className:"xmd-doc-demo-tabs",role:"tablist","aria-label":x.tablist,children:z.map(function(g){return(0,a.jsx)("button",{type:"button",className:"xmd-doc-demo-tab ".concat(g.key===s.key?"is-active":""),onClick:function(){return w(g.key)},role:"tab","aria-selected":g.key===s.key,children:g.title},g.key)})}):null,s.alipay||s.wechat?(0,a.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,a.jsx)("h2",{className:"xmd-doc-demo-section-label",children:x.introduce}),(0,a.jsx)("p",{className:"xmd-doc-demo-desc",children:x.register}),(0,a.jsx)(d.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["json"],collapsible:!1},"intro-".concat(s.key,"-").concat(T))]}):null,s.alipay||s.wechat?(0,a.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,a.jsx)("h2",{className:"xmd-doc-demo-section-label",children:x.codeSample}),s.description?(0,a.jsx)("p",{className:"xmd-doc-demo-desc",children:s.description}):null,(0,a.jsx)(d.DemoCode,{alipay:s.alipay,wechat:s.wechat,pick:["template","script"],collapsible:!1},"usage-".concat(s.key,"-").concat(T)),(0,a.jsx)(d.DemoCode,{alipay:s.alipay,wechat:s.wechat,files:s.files,defaultFile:s.defaultFile,title:x.demoCode,defaultCollapsed:!0,minHeight:ee,maxHeight:ne},"full-".concat(s.key,"-").concat(T))]}):null]}),(0,a.jsxs)("aside",{className:"xmd-doc-demo-preview","aria-label":x.preview,children:[(0,a.jsxs)("div",{className:"xmd-doc-demo-preview-head",children:[(0,a.jsx)("span",{className:"xmd-doc-demo-preview-title",children:(n=(X=s.previewTitle)!==null&&X!==void 0?X:s.navTitle)!==null&&n!==void 0?n:x.previewFallback}),(0,a.jsx)("span",{className:"xmd-doc-demo-preview-platform","data-platform":T,children:h[T]})]}),(V=s.platformNotes)!==null&&V!==void 0&&V[T]?(0,a.jsx)("span",{className:"xmd-doc-demo-preview-note",children:s.platformNotes[T]}):null,(0,a.jsx)(o.PhonePreview,{platform:T,navTitle:s.navTitle,markdown:s.sections?void 0:s.markdown,sections:(Q=s.sections)!==null&&Q!==void 0?Q:s.markdown?[{markdown:s.markdown,animation:s.animation}]:void 0,extensions:s.extensions,components:s.components,gfm:s.gfm,breaks:s.breaks,streamingTail:s.streamingTail})]})]}):null},F=null},5114:function(L,c,e){e.d(c,{XQ:function(){return ae},_B:function(){return J}});var l=e(19632),i=e.n(l),m=e(5574),o=e.n(m),d=e(64599),t=e.n(d),a=e(67294),h=e(10744),v=e(9579),F=e(21483),D=e(38116),j=e(87397),k=e(83478),r=e(71508),n=e(85893),X="https://render.alipay.com/p/s/x-markdown-mini-demo",V={zh:{heading:"\u626B\u7801\u771F\u673A\u9884\u89C8",alipayLabel:"\u652F\u4ED8\u5B9D",alipayHint:"\u7528\u652F\u4ED8\u5B9D\u626B\u4E00\u626B\uFF0C\u5728\u771F\u673A\u67E5\u770B\u6E32\u67D3\u6548\u679C",wechatLabel:"\u5FAE\u4FE1",wechatComingSoon:"\u7533\u8BF7\u4E2D",wechatHint:"\u5FAE\u4FE1 AppID \u5BA1\u6838\u4E2D\uFF0C\u5373\u5C06\u5F00\u653E"},en:{heading:"Scan to preview on device",alipayLabel:"Alipay",alipayHint:"Scan with Alipay to view rendering on a real device",wechatLabel:"WeChat",wechatComingSoon:"Coming soon",wechatHint:"WeChat AppID under review \u2014 opening soon"}};function Q(p){var w=p.platform,u=(0,a.useState)(!1),x=o()(u,2),s=x[0],g=x[1];(0,a.useEffect)(function(){typeof window!="undefined"&&g(window.location.pathname.includes("-en"))},[]);var C=V[s?"en":"zh"];return(0,n.jsxs)("div",{className:"xmd-scan",role:"group","aria-label":C.heading,children:[(0,n.jsx)("span",{className:"xmd-scan-heading",children:C.heading}),(0,n.jsxs)("div",{className:"xmd-scan-codes",children:[(0,n.jsxs)("figure",{className:"xmd-scan-code ".concat(w==="alipay"?"is-active":""),"data-platform":"alipay",children:[(0,n.jsx)("div",{className:"xmd-scan-qr",children:(0,n.jsx)(r.t,{value:X,size:112,level:"M",bgColor:"#ffffff",fgColor:"#171717",marginSize:0})}),(0,n.jsxs)("figcaption",{className:"xmd-scan-caption",children:[(0,n.jsx)("img",{className:"xmd-scan-icon",src:"/brand/alipay-icon.png",alt:"","aria-hidden":"true",width:16,height:16}),(0,n.jsx)("span",{className:"xmd-scan-name",children:C.alipayLabel})]}),(0,n.jsx)("p",{className:"xmd-scan-hint",children:C.alipayHint})]}),(0,n.jsxs)("figure",{className:"xmd-scan-code is-locked ".concat(w==="wechat"?"is-active":""),"data-platform":"wechat","aria-disabled":"true",children:[(0,n.jsxs)("div",{className:"xmd-scan-qr",children:[(0,n.jsx)("div",{className:"xmd-scan-placeholder","aria-hidden":"true",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none","aria-hidden":"true",children:[(0,n.jsx)("rect",{x:"5",y:"10.5",width:"14",height:"9.5",rx:"2",stroke:"currentColor",strokeWidth:"1.6"}),(0,n.jsx)("path",{d:"M8 10.5V8a4 4 0 0 1 8 0v2.5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]})}),(0,n.jsx)("span",{className:"xmd-scan-badge",children:C.wechatComingSoon})]}),(0,n.jsxs)("figcaption",{className:"xmd-scan-caption",children:[(0,n.jsx)("img",{className:"xmd-scan-icon",src:"/brand/wechat-icon.png",alt:"","aria-hidden":"true",width:16,height:16}),(0,n.jsx)("span",{className:"xmd-scan-name",children:C.wechatLabel})]}),(0,n.jsx)("p",{className:"xmd-scan-hint",children:C.wechatHint})]})]})]})}var z={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},ee=["alipay","wechat"],ne=[50,30,20,10,50],te=[300,200,100,0],J=`\u4F60\u597D\uFF01\u6211\u662F AI \u52A9\u624B\uFF0C\u4E0B\u9762\u4E3A\u4F60\u6F14\u793A x-markdown-mini \u7684\u6D41\u5F0F\u6E32\u67D3\u80FD\u529B\u3002

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

*x-markdown-mini \u2014 \u591A\u7AEF\u3001\u6D41\u5F0F\u53CB\u597D\u3001\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668*`;function T(p,w){var u=(0,h.getPlatformRenderer)(w).capabilities,x=0,s=0,g=0,C=function G(Y){var R=Y.name,b=Y.attrs,P=Y.children;R==="ol"&&b&&b.start!=null&&Number(b.start)!==1&&!u.supportsOlStart&&(x+=1),R==="img"&&b&&typeof b.src=="string"&&/^http:\/\//i.test(b.src)&&u.requiresHttpsImage&&(s+=1),R==="a"&&b&&"data-href"in b&&w==="wechat"&&(g+=1);var N=t()(P!=null?P:[]),$;try{for(N.s();!($=N.n()).done;){var O=$.value;G(O)}}catch(K){N.e(K)}finally{N.f()}},A=t()(p),W;try{for(A.s();!(W=A.n()).done;){var M=W.value;C(M)}}catch(G){A.e(G)}finally{A.f()}var H=[];return x&&H.push({kind:"ol-start",label:"<ol start> \u4E0D\u652F\u6301\uFF0C\u5E8F\u53F7\u4ECE 1 \u5F00\u59CB"}),s&&H.push({kind:"http-image",label:"".concat(s," \u5F20 http \u56FE\u7247\u6539\u5199\u4E3A https")}),g&&H.push({kind:"anchor",label:"<a href> \u2192 data-href\uFF0C\u9700\u6D88\u8D39\u65B9\u62E6\u622A tap"}),H}var ae=function(w){var u=w.initialMarkdown,x=u===void 0?J:u,s=(0,a.useState)(x),g=o()(s,2),C=g[0],A=g[1],W=(0,k.useDocPlatform)(),M=o()(W,1),H=M[0],G=(0,a.useState)(H),Y=o()(G,2),R=Y[0],b=Y[1],P=(0,a.useState)(!1),N=o()(P,2),$=N[0],O=N[1],K=(0,a.useState)(!0),I=o()(K,2),Z=I[0],de=I[1],re=(0,a.useState)(!1),S=o()(re,2),B=S[0],q=S[1],oe=(0,a.useState)(!0),_=o()(oe,2),U=_[0],ze=_[1],Ye=(0,a.useState)(!0),Ae=o()(Ye,2),he=Ae[0],$e=Ae[1],Ze=(0,a.useState)(!0),Me=o()(Ze,2),xe=Me[0],Ge=Me[1],Ve=(0,a.useState)(!0),be=o()(Ve,2),fe=be[0],Qe=be[1],Je=(0,a.useState)(!0),Pe=o()(Je,2),pe=Pe[0],_e=Pe[1],qe=(0,a.useState)(!0),Se=o()(qe,2),me=Se[0],en=Se[1],nn=(0,a.useState)(!0),Le=o()(nn,2),ye=Le[0],tn=Le[1],an=(0,a.useState)(!0),Te=o()(an,2),le=Te[0],rn=Te[1],on=(0,a.useState)(18),Be=o()(on,2),Ce=Be[0],sn=Be[1],dn=(0,a.useState)(120),Oe=o()(dn,2),je=Oe[0],cn=Oe[1],ln=(0,a.useState)(24),Re=o()(ln,2),ke=Re[0],un=Re[1],mn=(0,a.useState)(!1),Ie=o()(mn,2),se=Ie[0],ge=Ie[1],hn=(0,a.useState)([]),He=o()(hn,2),We=He[0],we=He[1],ce=(0,a.useRef)(0);(0,a.useEffect)(function(){b(H)},[H]);var ie=R,xn=(0,a.useCallback)(function(E){b(E),window.localStorage.setItem("xmd-doc-platform",E),window.dispatchEvent(new CustomEvent("xmd-platform-change",{detail:{platform:E}}))},[]),ue=(0,a.useRef)(null),Ke=(0,a.useRef)(""),ve=(0,a.useCallback)(function(){var E="".concat(Z,"|").concat(B,"|").concat(he,"|").concat(xe,"|").concat(fe,"|").concat(pe);if(ue.current&&Ke.current===E)return ue.current;var y=[];return xe&&y.push((0,v.default)({katexOptions:{throwOnError:!1}})),fe&&y.push((0,F.default)()),ue.current=new h.XMarkdownMini({escapeText:he,streamingFixup:pe?"remend":!1,gfm:Z,breaks:B,extensions:y}),Ke.current=E,ue.current},[Z,B,he,xe,fe,pe]);(0,a.useEffect)(function(){return function(){var E;(E=ue.current)===null||E===void 0||E.reset(),ce.current+=1}},[]);var Ue=(0,a.useMemo)(function(){if(se)return{reactNodes:(0,D.a)(We,me),issues:[]};try{var E=ve(),y=E.renderNodes({content:C,platform:ie,selectable:U});return{reactNodes:(0,D.a)(y),issues:T(y,ie)}}catch(Ee){return{reactNodes:[(0,n.jsxs)("p",{className:"xmd-preview-error",children:["\u6E32\u67D3\u5931\u8D25\uFF1A",String(Ee)]},"error")],issues:[]}}},[C,ie,U,se,We,me,ve]),fn=Ue.reactNodes,wn=Ue.issues,pn=(0,a.useCallback)(function(){var E=ve(),y=ce.current+1;ce.current=y,E.reset(),ge(!0),we([]),A("");try{var Ee=E.renderNodes({content:J,platform:ie,selectable:U,streaming:{hasNextChunk:!1,enableAnimation:me,semantic:ye?{maxChunkSize:Ce,chunkDelay:le?te:je,charDelay:le?ne:ke}:!1},onRenderProgress:function(Ne){var kn=Ne.markdown;ce.current===y&&A(kn)},onPatch:function(Ne){ce.current===y&&we(i()(Ne))},onRenderComplete:function(){ce.current===y&&ge(!1)}});Ee.length>0&&we(Ee)}catch(Fe){ge(!1)}},[ie,U,me,ye,le,Ce,je,ke,ve]),gn=(0,a.useCallback)(function(){var E;ce.current+=1,ge(!1),(E=ue.current)===null||E===void 0||E.reset()},[]),vn=(0,a.useState)(!1),Xe=o()(vn,2),De=Xe[0],En=Xe[1];(0,a.useEffect)(function(){typeof window!="undefined"&&En(window.location.pathname.includes("-en"))},[]);var yn=De?"Playground":"\u5728\u7EBF\u6F14\u793A",Cn=De?"/-en":"/",jn=De?"/docs/code-examples-en":"/docs/code-examples";return(0,n.jsxs)("div",{className:"xmd-pg",children:[(0,n.jsxs)("section",{className:"xmd-pg-editor-wrap","aria-label":"Markdown \u8F93\u5165",children:[(0,n.jsxs)("div",{className:"xmd-pg-editor-header",children:[(0,n.jsx)("label",{className:"xmd-pg-label",htmlFor:"xmd-pg-input",children:"Markdown"}),(0,n.jsxs)("div",{className:"xmd-pg-header-actions",children:[(0,n.jsxs)("button",{type:"button",className:"xmd-pg-stream-btn ".concat(se?"is-active":""),onClick:se?gn:pn,"aria-label":se?"\u505C\u6B62\u6D41\u5F0F":"\u6D41\u5F0F\u6F14\u793A",children:[(0,n.jsx)("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,n.jsx)("polygon",{points:"5 3 19 12 5 21 5 3"})}),(0,n.jsx)("span",{children:se?"\u505C\u6B62":"\u6D41\u5F0F"})]}),(0,n.jsx)("button",{type:"button",className:"xmd-pg-config-toggle ".concat($?"is-active":""),onClick:function(){return O(!$)},"aria-expanded":$,"aria-label":"\u914D\u7F6E",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,n.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,n.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})})]})]}),$&&(0,n.jsxs)("div",{className:"xmd-pg-config",children:[(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u89E3\u6790"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:Z,onChange:function(y){return de(y.target.checked)}}),(0,n.jsx)("span",{children:"GFM"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8868\u683C/\u5220\u9664\u7EBF"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:B,onChange:function(y){return q(y.target.checked)}}),(0,n.jsx)("span",{children:"Breaks"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\\n \u2192 br"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6E32\u67D3"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:U,onChange:function(y){return ze(y.target.checked)}}),(0,n.jsx)("span",{children:"Selectable"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u6587\u672C\u53EF\u9009"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:he,onChange:function(y){return $e(y.target.checked)}}),(0,n.jsx)("span",{children:"Escape"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"HTML \u8F6C\u4E49"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u63D2\u4EF6"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:fe,onChange:function(y){return Qe(y.target.checked)}}),(0,n.jsx)("span",{children:"CodeHighlight"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"hljs \u8BED\u6CD5\u9AD8\u4EAE"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:xe,onChange:function(y){return Ge(y.target.checked)}}),(0,n.jsx)("span",{children:"LaTeX"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"KaTeX \u516C\u5F0F"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6D41\u5F0F"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:pe,onChange:function(y){return _e(y.target.checked)}}),(0,n.jsx)("span",{children:"Fixup"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8865\u5168\u672A\u95ED\u5408\u8BED\u6CD5"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:me,onChange:function(y){return en(y.target.checked)}}),(0,n.jsx)("span",{children:"Animation"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u5757\u52A8\u753B"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:ye,onChange:function(y){return tn(y.target.checked)}}),(0,n.jsx)("span",{children:"Semantic"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8BED\u4E49\u5206\u5757"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:le,onChange:function(y){return rn(y.target.checked)}}),(0,n.jsx)("span",{children:"\u53D8\u901F"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u968F\u5757\u52A0\u901F\u6253\u5B57\u673A"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Max"}),(0,n.jsx)("input",{type:"number",min:8,max:400,value:Ce,onChange:function(y){return sn(Number(y.target.value)||80)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Chunk"}),(0,n.jsx)("input",{type:"number",min:0,max:2e3,disabled:le,value:je,onChange:function(y){return cn(Number(y.target.value)||0)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Char"}),(0,n.jsx)("input",{type:"number",min:0,max:200,disabled:le,value:ke,onChange:function(y){return un(Number(y.target.value)||0)}})]})]})]}),(0,n.jsx)("textarea",{id:"xmd-pg-input",className:"xmd-pg-input",spellCheck:!1,value:C,onChange:function(y){se||A(y.target.value)},placeholder:"\u8F93\u5165 Markdown\uFF0C\u53F3\u4FA7\u5B9E\u65F6\u9884\u89C8\u2026",readOnly:se})]}),(0,n.jsxs)("section",{className:"xmd-pg-preview-wrap","aria-label":"\u9884\u89C8",children:[(0,n.jsx)("div",{className:"xmd-pg-platform-switch",role:"tablist","aria-label":"\u5207\u6362\u9884\u89C8\u5E73\u53F0",children:ee.map(function(E){return(0,n.jsx)("button",{type:"button",className:"xmd-pg-platform-btn ".concat(E===ie?"is-active":""),onClick:function(){return xn(E)},role:"tab","aria-selected":E===ie,children:z[E]},E)})}),(0,n.jsx)(j.PhoneShell,{platform:ie,navTitle:yn,backHref:Cn,moreHref:jn,autoScroll:se,children:fn}),(0,n.jsx)(Q,{platform:ie})]})]})},f=null},87534:function(L,c,e){e.d(c,{Z:function(){return t}});var l=e(64599),i=e.n(l),m=e(67294),o=e(85893);function d(){var a=(0,m.useRef)(null);return(0,m.useEffect)(function(){var h=a.current;if(h){var v=Array.from(h.querySelectorAll(".xmd-cl-entry"));if(v.length!==0){var F=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(F||typeof IntersectionObserver=="undefined"){v.forEach(function(j){return j.classList.add("is-in")});return}var D=new IntersectionObserver(function(j){var k=i()(j),r;try{for(k.s();!(r=k.n()).done;){var n=r.value;n.isIntersecting&&(n.target.classList.add("is-in"),D.unobserve(n.target))}}catch(X){k.e(X)}finally{k.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return v.forEach(function(j){return D.observe(j)}),function(){return D.disconnect()}}}},[]),a}function t(a){var h=a.copy,v=d();return(0,o.jsx)("div",{className:"markdown",children:(0,o.jsxs)("main",{className:"xmd-changelog",children:[(0,o.jsxs)("header",{className:"xmd-cl-hero",children:[(0,o.jsx)("h1",{children:h.title}),(0,o.jsx)("p",{className:"xmd-cl-subtitle",children:h.subtitle})]}),(0,o.jsx)("ol",{className:"xmd-cl-list",ref:v,children:h.releases.map(function(F,D){return(0,o.jsxs)("li",{className:"xmd-cl-entry xmd-reveal",children:[(0,o.jsx)("span",{className:"xmd-cl-marker","aria-hidden":"true",children:(0,o.jsx)("span",{className:"xmd-cl-dot"})}),(0,o.jsxs)("div",{className:"xmd-cl-content",children:[(0,o.jsxs)("div",{className:"xmd-cl-meta",children:[(0,o.jsxs)("h2",{className:"xmd-cl-version",children:[F.version,D===0&&(0,o.jsx)("span",{className:"xmd-cl-latest",children:h.latest})]}),(0,o.jsx)("time",{className:"xmd-cl-date",children:F.date})]}),(0,o.jsx)("ul",{className:"xmd-cl-changes",children:F.items.map(function(j,k){return(0,o.jsxs)("li",{className:"xmd-cl-change",children:[(0,o.jsx)("span",{className:"xmd-cl-tag xmd-cl-tag--".concat(j.type),children:h.types[j.type]}),(0,o.jsxs)("div",{className:"xmd-cl-text",children:[(0,o.jsx)("p",{dangerouslySetInnerHTML:{__html:j.html}}),j.notes.length>0&&(0,o.jsx)("ul",{className:"xmd-cl-notes",children:j.notes.map(function(r,n){return(0,o.jsx)("li",{dangerouslySetInnerHTML:{__html:r}},n)})})]})]},k)})})]})]},F.version)})})]})})}},61344:function(L,c,e){e.d(c,{EN:function(){return o},ZH:function(){return m}});var l=[{version:"1.0.1",date:"2026-07-04",items:[{type:"fix",html:"\u6D41\u5F0F\u6E32\u67D3\u65F6\u884C\u5185\u4EE3\u7801 <code>code</code> \u4E2D\u95F4\u51FA\u73B0\u591A\u4F59\u7A7A\u683C\u3002\u9010\u5B57 / \u9010\u6BB5\u5165\u573A\u52A8\u753B\u4F1A\u628A\u884C\u5185\u4EE3\u7801\u6587\u672C\u62C6\u6210\u591A\u4E2A\u53F6\u5B50 <code>&lt;text&gt;</code>\uFF0C\u800C\u6BCF\u4E2A\u53F6\u5B50\u90FD\u5E26 <code>md-inline-code</code> \u836F\u4E38\u7684\u5185\u5916\u8FB9\u8DDD\u4E0E\u5E95\u8272\uFF0C\u62FC\u63A5\u540E\u5C31\u51FA\u73B0\u4E86\u7F1D\u9699\uFF08\u652F\u4ED8\u5B9D\u9010\u5B57\u62C6\u5206\u6700\u660E\u663E\uFF09\u3002",notes:["\u836F\u4E38\u76D2\u6A21\u578B\uFF08\u80CC\u666F / \u5185\u5916\u8FB9\u8DDD / \u5706\u89D2\uFF09\u6539\u4E3A\u53EA\u753B\u5728\u5916\u5C42\u6574\u6BB5\u5BB9\u5668\u4E0A\uFF1B\u62C6\u51FA\u6765\u7684\u5B57\u7B26\u53F6\u5B50\u6539\u7528\u7EAF\u7B49\u5BBD\u5B57\u4F53\u7C7B <code>md-inline-code-txt</code>\uFF08\u652F\u4ED8\u5B9D <code>&lt;text&gt;</code> \u4E0D\u7EE7\u627F font-family\uFF0C\u5B57\u4F53\u5FC5\u987B\u7559\u5728\u53F6\u5B50\uFF09\u3002\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u4E24\u7AEF\u4E00\u5E76\u4FEE\u590D\u3002"]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> \u91CD\u6574\u3002<code>lexerOptions</code> / \u9876\u5C42 <code>extensions</code> / <code>plugins</code> \u4E09\u4E2A\u5B57\u6BB5\u5408\u5E76\u4E3A\u5355\u4E00\u7684 <code>options: { gfm?, breaks?, extensions? }</code>\uFF0C\u540C\u6B65\u79FB\u9664 <code>Plugin</code> \u7C7B\u578B\u5BFC\u51FA\u3002",notes:["\u8FC1\u79FB\uFF1A<code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>\uFF1B<code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>\uFF1B<code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>\u3002"]},{type:"breaking",html:"\u5185\u7F6E\u7EC4\u4EF6 <code>&lt;markdown /&gt;</code> \u7684 <code>plugins</code> prop \u6539\u540D <code>extensions</code>\u3002",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> \u7C7B\u578B\u5BFC\u51FA\uFF0C\u7EDF\u4E00\u63CF\u8FF0\u6784\u9020\u5668\u7684 marked \u914D\u7F6E\u5757\u3002",notes:[]},{type:"feature",html:"\u5185\u7F6E <code>marked</code> lexer \u5E76\u5728\u6784\u5EFA\u65F6\u6253\u8FDB\u4EA7\u7269\uFF1B\u6574\u5E93 ESM \u7EA6 103KB / gzip \u7EA6 25KB\u3002",notes:[]},{type:"feature",html:"\u6D41\u5F0F\u589E\u91CF\u89E3\u6790\u2014\u2014\u5DF2\u7A33\u5B9A\u5757\u7F13\u5B58\u4E3A <code>stableNodes</code>\uFF0C\u4EC5 tail \u91CD\u65B0 lex\u3002",notes:[]},{type:"feature",html:"\u5FAE\u4FE1 / \u652F\u4ED8\u5B9D <code>PlatformRenderer</code>\uFF0C\u66B4\u9732\u5E73\u53F0\u80FD\u529B\u4E0E token \u5230\u8282\u70B9\u7684\u8F6C\u6362\u5165\u53E3\u3002",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> \u63A5\u53E3\uFF0C\u628A tokenizer \u4E0E <code>miniRenderer</code> \u5199\u5728\u540C\u4E00\u4E2A\u5BF9\u8C61\u4E0A\uFF1B\u4FDD\u7559 <code>tokenRenderers</code> \u4F5C\u4E3A fallback\u3002",notes:[]},{type:"fix",html:"\u52A8\u753B\u7C7B\u5408\u5E76 bug\u2014\u2014\u5F00\u542F <code>animation</code> \u65F6\u5757\u7EA7\u8282\u70B9\u4E0D\u518D\u4E22\u5931\u8BED\u4E49 class\u3002",notes:[]},{type:"perf",html:"<code>chunkDelay = charDelay = 0</code> \u65F6\u8DF3\u8FC7 setTimeout \u94FE\uFF0C\u540C\u6B65\u63A8\u56DE\u3002",notes:[]},{type:"perf",html:"<code>&lt;b&gt;</code> / <code>&lt;i&gt;</code> \u6539\u4E3A\u8BED\u4E49\u5316 <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code>\u3002",notes:[]}]}],i=[{version:"1.0.1",date:"2026-07-04",items:[{type:"fix",html:"inline code <code>code</code> showed spurious gaps mid-word while streaming. The per-character / per-segment entrance animation splits the inline-code text into several leaf <code>&lt;text&gt;</code> nodes, and each leaf carried the <code>md-inline-code</code> pill's padding, margin and background \u2014 so the pills tiled with visible gaps (worst on Alipay, which splits per character).",notes:["The pill box (background / padding / radius) now paints only on the outer container; the split character leaves use a font-only <code>md-inline-code-txt</code> class instead (Alipay <code>&lt;text&gt;</code> does not inherit font-family, so the monospace font must stay on the leaf). Fixed on both WeChat and Alipay."]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> collapsed. <code>lexerOptions</code> / top-level <code>extensions</code> / <code>plugins</code> are gone, replaced by a single <code>options: { gfm?, breaks?, extensions? }</code> bag. The <code>Plugin</code> type is removed.",notes:["Migration: <code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>; <code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>; <code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>."]},{type:"breaking",html:"the bundled <code>&lt;markdown /&gt;</code> component renames its <code>plugins</code> prop to <code>extensions</code>.",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> exported, describing the constructor's marked-side configuration bag.",notes:[]},{type:"feature",html:"bundle marked's lexer into the build. Full ESM bundle around 103 KB / ~25 KB gzip.",notes:[]},{type:"feature",html:"streaming incremental parsing \u2014 committed blocks are cached as <code>stableNodes</code>, only the tail is re-lexed.",notes:[]},{type:"feature",html:"WeChat / Alipay <code>PlatformRenderer</code>, exposing platform capabilities and the token-to-node entry point.",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> interface \u2014 colocates the tokenizer and its <code>miniRenderer</code> on a single object. <code>tokenRenderers</code> is retained as a fallback.",notes:[]},{type:"fix",html:"animation-class merge bug \u2014 with <code>animation</code> enabled, block-level nodes no longer drop their semantic class.",notes:[]},{type:"perf",html:"when <code>chunkDelay = charDelay = 0</code>, skip the setTimeout chain and push synchronously.",notes:[]},{type:"perf",html:"emit semantic <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code> instead of <code>&lt;b&gt;</code> / <code>&lt;i&gt;</code>.",notes:[]}]}],m={title:"\u66F4\u65B0\u65E5\u5FD7",subtitle:"\u9762\u5411\u4F7F\u7528\u8005\u7684 API\u3001\u6784\u5EFA\u4EA7\u7269\u4E0E\u884C\u4E3A\u53D8\u5316\u90FD\u8BB0\u5F55\u5728\u8FD9\u91CC\u3002\u8FC1\u79FB\u8BF4\u660E\u5199\u5728\u5BF9\u5E94\u7248\u672C\u4E0B\uFF0C\u65B9\u4FBF\u5347\u7EA7\u65F6\u6309\u7248\u672C\u9010\u6761\u6838\u5BF9\u3002",latest:"\u6700\u65B0",types:{breaking:"\u7834\u574F\u6027",feature:"\u65B0\u589E",fix:"\u4FEE\u590D",perf:"\u4F18\u5316"},releases:l},o={title:"Changelog",subtitle:"User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.",latest:"Latest",types:{breaking:"Breaking",feature:"Added",fix:"Fixed",perf:"Improved"},releases:i}},49682:function(L,c,e){e.d(c,{Z:function(){return F}});var l=e(97857),i=e.n(l),m=e(67294),o=e(9783),d=e.n(o),t=e(85893);function a(D){var j=D.title,k=D.desc,r=D.labels;return(0,t.jsxs)("svg",{className:"xmd-arch-svg",viewBox:"0 0 960 400",role:"img","aria-labelledby":"xmd-arch-title xmd-arch-desc",children:[(0,t.jsx)("title",{id:"xmd-arch-title",children:j}),(0,t.jsx)("desc",{id:"xmd-arch-desc",children:k}),(0,t.jsxs)("defs",{children:[(0,t.jsx)("marker",{id:"xmd-flow-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#a3a3a3"})}),(0,t.jsx)("marker",{id:"xmd-accent-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7.5",markerHeight:"7.5",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#2563eb"})}),(0,t.jsx)("marker",{id:"xmd-amber-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#c99a1f"})})]}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M148 82 H184",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 82 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M482 82 H520",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M738 82 H780",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 290 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-line",d:"M503 248 C 540 210 631 226 631 190",markerEnd:"url(#xmd-accent-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-ext-line",d:"M760 262 C 760 224 706 226 700 190",markerEnd:"url(#xmd-amber-arrow)"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"24",y:"50",width:"124",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"86",y:"80",textAnchor:"middle",children:r.markdown}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"86",y:"99",textAnchor:"middle",children:"string"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"188",y:"50",width:"150",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"80",textAnchor:"middle",children:r.lexer}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"99",textAnchor:"middle",children:r.lexerNote}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"378",y:"50",width:"104",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"430",y:"80",textAnchor:"middle",children:r.token}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"430",y:"99",textAnchor:"middle",children:r.tokenNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"524",y:"36",width:"214",height:"152",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"631",y:"58",textAnchor:"middle",children:"PlatformRenderer"}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"74",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"101",textAnchor:"middle",children:r.wechat}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"126",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"153",textAnchor:"middle",children:r.alipay}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-node",x:"784",y:"50",width:"148",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"858",y:"80",textAnchor:"middle",children:r.node}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"858",y:"99",textAnchor:"middle",children:r.nodeNote}),(0,t.jsx)("text",{className:"xmd-arch-lane-title",x:"24",y:"244",children:r.streaming}),(0,t.jsx)("rect",{className:"xmd-arch-platform",x:"188",y:"262",width:"150",height:"56",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"291",textAnchor:"middle",children:r.chunk}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"309",textAnchor:"middle",children:r.chunkNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"378",y:"248",width:"250",height:"110",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"503",y:"270",textAnchor:"middle",children:"StreamingProcessor"}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"284",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"303",textAnchor:"middle",children:r.stable}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"320",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"339",textAnchor:"middle",children:r.tail}),(0,t.jsx)("rect",{className:"xmd-arch-ext",x:"690",y:"262",width:"210",height:"72",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"795",y:"290",textAnchor:"middle",children:r.extensions}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"795",y:"311",textAnchor:"middle",children:r.extNote}),(0,t.jsxs)("g",{className:"xmd-arch-pulses","aria-hidden":"true",children:[(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"148",cy:"82",r:"3.4",style:d()({animationDelay:"0s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"82",r:"3.4",style:d()({animationDelay:".35s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"482",cy:"82",r:"3.4",style:d()({animationDelay:".7s"},"--tx","38px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"738",cy:"82",r:"3.4",style:d()({animationDelay:"1.05s"},"--tx","42px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"290",r:"3.4",style:d()({animationDelay:".55s"},"--tx","36px")})]})]})}var h=e(24849),v={math:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M4 4h9l-4.5 6L13 16H4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),ext:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M4 6h12M4 10h12M4 14h7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("circle",{cx:"15.5",cy:"14",r:"2",stroke:"currentColor",strokeWidth:"1.5"})]}),commonmark:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"m4 10 3 3 9-9",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),stream:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M3 7h6M3 13h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("path",{d:"M12 4l4 6-4 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})};function F(D){var j=D.copy,k=D.diagram,r=(0,h.v)();return(0,t.jsxs)("section",{className:"xmd-landing-section xmd-architecture xmd-reveal",ref:r,children:[(0,t.jsxs)("div",{className:"xmd-section-copy",children:[(0,t.jsx)("h2",{children:j.arch.title}),(0,t.jsx)("p",{children:j.arch.body})]}),(0,t.jsxs)("div",{className:"xmd-arch-board","aria-label":k.title,children:[(0,t.jsx)(a,i()({},k)),(0,t.jsx)("div",{className:"xmd-arch-proof",children:j.arch.proof.map(function(n,X){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"xmd-arch-proof-head",children:[v[n.icon],(0,t.jsx)("strong",{children:n.title})]}),(0,t.jsx)("span",{children:n.desc})]},X)})})]})]})}},18181:function(L,c,e){e.d(c,{Z:function(){return t}});var l=e(67294),i=e(85893),m="npm i @ant-design/x-markdown-mini";function o(a){var h=a.copyLabel,v=a.copySuccessText,F=a.playgroundHref,D=a.playgroundLabel;return(0,i.jsxs)("div",{className:"xmd-hero-actions",children:[(0,i.jsxs)("button",{type:"button",className:"xmd-install-command","data-xmd-copy":m,"data-xmd-copy-success":v,"aria-label":h,children:[(0,i.jsx)("span",{className:"xmd-install-prompt","aria-hidden":"true",children:"$"}),(0,i.jsx)("code",{children:m}),(0,i.jsxs)("span",{className:"xmd-copy-control","aria-hidden":"true",children:[(0,i.jsxs)("svg",{className:"xmd-copy-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:[(0,i.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:"1.4"}),(0,i.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]}),(0,i.jsx)("svg",{className:"xmd-check-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:(0,i.jsx)("path",{d:"m3 8.2 3 3L13 4",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,i.jsx)("span",{"data-xmd-copy-status":!0})]})]}),(0,i.jsx)("a",{className:"xmd-secondary-link xmd-playground-link",href:F,children:D})]})}var d=e(24849);function t(a){var h=a.copy,v=a.media,F=(0,d.v)();return(0,i.jsxs)("section",{className:"xmd-hero",children:[(0,i.jsxs)("div",{className:"xmd-hero-copy xmd-reveal",ref:F,children:[(0,i.jsx)("span",{className:"xmd-hero-eyebrow",children:h.eyebrow}),(0,i.jsx)("h1",{children:h.heroTitle}),(0,i.jsx)("p",{className:"xmd-hero-subtitle",children:h.heroSubtitle}),(0,i.jsx)(o,{copyLabel:h.install.copyLabel,copySuccessText:h.install.copySuccessText,playgroundHref:h.install.playgroundHref,playgroundLabel:h.install.playgroundLabel}),(0,i.jsx)("dl",{className:"xmd-hero-facts","aria-label":h.eyebrow,children:h.facts.map(function(D){return(0,i.jsxs)("div",{children:[(0,i.jsx)("dt",{children:D.term}),(0,i.jsx)("dd",{children:D.desc})]},D.term)})})]}),v]})}},24849:function(L,c,e){e.d(c,{v:function(){return o}});var l=e(64599),i=e.n(l),m=e(67294);function o(){var d=(0,m.useRef)(null);return(0,m.useEffect)(function(){var t=d.current;if(t){var a=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(a||typeof IntersectionObserver=="undefined"){t.classList.add("is-in");return}var h=new IntersectionObserver(function(v){var F=i()(v),D;try{for(F.s();!(D=F.n()).done;){var j=D.value;j.isIntersecting&&(j.target.classList.add("is-in"),h.unobserve(j.target))}}catch(k){F.e(k)}finally{F.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return h.observe(t),function(){return h.disconnect()}}},[]),d}},38116:function(L,c,e){e.d(c,{a:function(){return ae}});var l=e(19632),i=e.n(l),m=e(5574),o=e.n(m),d=e(97857),t=e.n(d),a=e(64599),h=e.n(a),v=e(67294);function F(){return{segments:[],prev:"",nextId:0}}function D(f,p){for(var w=Math.min(f.length,p.length),u=0;u<w&&f[u]===p[u];)u++;return u}function j(f,p){if(p===f.prev)return f;var w=D(f.prev,p),u=[],x=0,s=h()(f.segments),g;try{for(s.s();!(g=s.n()).done;){var C=g.value;if(x>=w)break;var A=x+C.text.length;A<=w?u.push(C):u.push({id:C.id,text:C.text.slice(0,w-x)}),x=A}}catch(H){s.e(H)}finally{s.f()}var W=f.nextId,M=p.slice(w);return M&&u.push({id:W++,text:M}),{segments:u,prev:p,nextId:W}}var k=e(85893);function r(f){if(typeof document=="undefined")return f;var p=document.createElement("textarea");return p.innerHTML=f,p.value}var n=function(p){var w=p.value,u=r(w),x=(0,v.useRef)(F());return x.current=j(x.current,u),(0,k.jsx)(k.Fragment,{children:x.current.segments.map(function(s){return(0,k.jsx)("span",{className:"animation-text-char",children:s.text},s.id)})})},X=null,V={h1:"md-h1",h2:"md-h2",h3:"md-h3",pre:"md-code-block",blockquote:"md-blockquote",a:"md-link",ul:"md-list",ol:"md-list",table:"md-table"},Q=new Set(["br","img","hr","input"]);function z(f){var p;f&&(p=navigator.clipboard)!==null&&p!==void 0&&p.writeText&&navigator.clipboard.writeText(f).catch(function(){})}var ee=(0,k.jsxs)("svg",{viewBox:"0 0 16 16",width:14,height:14,fill:"none","aria-hidden":"true",children:[(0,k.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:1.4}),(0,k.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round"})]});function ne(f,p){if(f.name==="copy-button"){var w,u=((w=f.attrs)===null||w===void 0?void 0:w["data-copy"])!=null?String(f.attrs["data-copy"]):"";return(0,k.jsx)("button",{type:"button",className:"md-copy-btn","aria-label":"\u590D\u5236",onClick:function(){return z(u)},children:ee},p)}if(f.name==="text"){var x,s;return(0,k.jsx)("span",{className:(x=f.attrs)!==null&&x!==void 0&&x.class?String(f.attrs.class):void 0,children:((s=f.attrs)===null||s===void 0?void 0:s.value)!=null?String(f.attrs.value):""},p)}return T(f,p,!1)}function te(f){var p={},w=h()(f.split(";")),u;try{for(w.s();!(u=w.n()).done;){var x=u.value,s=x.trim();if(s){var g=s.indexOf(":");if(g!==-1){var C=s.slice(0,g).trim(),A=s.slice(g+1).trim(),W=C.replace(/-([a-z])/g,function(M,H){return H.toUpperCase()});p[W]=A}}}}catch(M){w.e(M)}finally{w.f()}return p}function J(f){return f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function T(f,p,w){var u=f.name,x=f.attrs,s=f.children,g=f.animate,C=(u||"div").toLowerCase();if(C==="text"){var A=(x==null?void 0:x.value)!=null?String(x.value):"";if(w)return(0,k.jsx)(n,{value:A},p);var W=/<|>|"|'/.test(A)?J(A):A;return v.createElement("span",{key:p,dangerouslySetInnerHTML:{__html:W}})}if(f.header&&f.header.length>0){var M=C==="table",H=M?"md-tableblock":"md-codeblock",G=M?"md-tableblock-bar":"md-codeblock-bar",Y=(0,k.jsx)("div",{className:G,children:f.header.map(function(_,U){return ne(_,U)})}),R=T(t()(t()({},f),{},{header:void 0}),"el",w);return(0,k.jsxs)("div",{className:H,children:[Y,R]},p)}var b=[];V[C]&&b.push(V[C]),g&&b.push("md-animate-block");var P={key:p};if(x)for(var N=0,$=Object.entries(x);N<$.length;N++){var O=o()($[N],2),K=O[0],I=O[1];K==="class"?b.length>0?(P.className="".concat(I," ").concat(b.join(" ")),b.length=0):P.className=I:K==="style"&&typeof I=="string"?P.style=te(I):I===!0?P[K]=!0:I!==!1&&I!=null&&(P[K]=String(I))}if(b.length>0&&(P.className=P.className?"".concat(P.className," ").concat(b.join(" ")):b.join(" ")),Q.has(C))return v.createElement(C,P);var Z=x&&typeof x.class=="string"?x.class:"",de=C==="pre"||/(^|\s)katex/.test(Z),re=w&&!de;if(C==="table"&&s&&s.length>0){var S=[],B=[],q=function(U){B.length&&(S.push(v.createElement.apply(v,["tbody",{key:U}].concat(i()(B)))),B=[])};return s.forEach(function(_,U){(_.name||"").toLowerCase()==="tr"?B.push(T(_,"tr-".concat(U),re)):(q("tb-".concat(U)),S.push(T(_,U,re)))}),q("tb-last"),v.createElement.apply(v,[C,P].concat(S))}var oe=s==null?void 0:s.map(function(_,U){return T(_,U,re)});return oe&&oe.length>0?v.createElement.apply(v,[C,P].concat(i()(oe))):v.createElement(C,P)}function ae(f){var p=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return f.map(function(w,u){return T(w,u,p)})}},7037:function(){}}]);
