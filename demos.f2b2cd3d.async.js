(self.webpackChunkx_markdown_mini_docs=self.webpackChunkx_markdown_mini_docs||[]).push([[433],{8267:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return s}});var u=e(67294),r=e(87534),o=e(61344),a=e(85893);function s(){return(0,a.jsx)(r.Z,{copy:o.EN})}},72565:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return s}});var u=e(67294),r=e(87534),o=e(61344),a=e(85893);function s(){return(0,a.jsx)(r.Z,{copy:o.ZH})}},79563:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return p}});var u=e(67294),r=e(15335),o=e(85893),a=`## \u7EC4\u4EF6\u6E32\u67D3

\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 \`content\`\uFF0C\u7EC4\u4EF6\u5185\u90E8\u5B8C\u6210\u89E3\u6790\u548C\u6E32\u67D3\u3002

- \u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u4E92\u4E0D\u5E72\u6270
- \u5378\u8F7D\u65F6\u81EA\u52A8\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001
- [\u67E5\u770B API](https://github.com/ant-design/x-markdown-mini)
`,s=`Page({
  data: {
    content: '## \u7EC4\u4EF6\u6E32\u67D3\\n\\n\u628A Markdown \u5B57\u7B26\u4E32\u7ED1\u5B9A\u5230 content\u2026',
  },
  onComplete() {
    console.log('render complete');
  },
});`,t=`.page {
  padding: 16px;
}`,l=[{key:"markdown",title:"Markdown \u7EC4\u4EF6",description:"\u4E1A\u52A1\u9875\u4F18\u5148\u63A5\u5165 Markdown \u7EC4\u4EF6\u3002\u7EC4\u4EF6\u5185\u90E8\u521B\u5EFA\u72EC\u7ACB\u5B9E\u4F8B\uFF0C\u5E76\u5728\u751F\u547D\u5468\u671F\u7ED3\u675F\u65F6\u91CD\u7F6E\u6D41\u5F0F\u72B6\u6001\u3002",navTitle:"Markdown \u7EC4\u4EF6",markdown:a,alipay:{template:`<view class="page">
  <x-markdown
    content="{{content}}"
    selectable="{{true}}"
    onRenderComplete="onComplete"
  />
</view>`,script:s,style:t,json:`{
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
</view>`,script:s,style:t,json:`{
  "navigationBarTitleText": "Markdown \u7EC4\u4EF6",
  "usingComponents": {
    "x-markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}}];function p(){return(0,o.jsx)(r.O,{demos:l,codeMinHeight:560})}},44928:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return n}});var u=e(67294),r=e(15335),o=`<view class="page">
  <mini-node-renderer nodes="{{nodes}}" selectable="{{true}}" />
</view>
`,a=`.page {
  padding: 16px;
}
`,s=`const { renderNodes } = require('@ant-design/x-markdown-mini');

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
`,b=`{
  "navigationBarTitleText": "\u76F4\u63A5\u751F\u6210\u8282\u70B9",
  "usingComponents": {
    "mini-node-renderer": "@ant-design/x-markdown-mini/components/MiniNodeRenderer/index"
  }
}
`,i=e(85893),D=`# Hello

**x-markdown-mini** \u628A Markdown \u76F4\u63A5\u8F6C\u6362\u6210\u7AEF\u4FA7\u8282\u70B9\u3002

- \u65E0\u9700 WebView
- \u65E0\u9700 HTML \u767D\u540D\u5355
`,k=[{key:"render-nodes",title:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",description:"\u63A8\u8350\u5148\u7528 renderNodes \u751F\u6210 MiniNode[]\uFF0C\u518D\u4EA4\u7ED9 MiniNodeRenderer \u6216\u81EA\u5B9A\u4E49\u6E32\u67D3\u7EC4\u4EF6\u63A5\u7BA1\u3002",navTitle:"\u76F4\u63A5\u751F\u6210\u8282\u70B9",previewTitle:"\u771F\u5B9E\u9875\u9762\u6587\u4EF6",platformNotes:{alipay:"index.axml / dist components",wechat:"index.wxml / components"},markdown:D,alipay:{template:o,script:s,style:a,json:t},wechat:{template:l,script:v,style:p,json:b}}];function n(){return(0,i.jsx)(r.O,{demos:k,codeMinHeight:560})}},4015:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return m}});var u=e(67294),r=e(19632),o=e.n(r),a=e(5574),s=e.n(a),t=e(10744),l=e(9579),p=e(21483),v=e(87397),b=e(83478),i=e(38116),D=e(5114),k=e(7037),n=e(85893),K=D._B,V=[50,30,20,10,50],ee=[300,200,100,0],re=900,oe=2800;function ie(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function $(){var g=(0,b.useDocPlatform)(),y=s()(g,1),h=y[0],x=(0,u.useRef)(null),E=(0,u.useCallback)(function(){return x.current||(x.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,l.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),x.current},[]),F=(0,u.useMemo)(function(){try{return E().renderNodes({content:K,platform:h,selectable:!0})}catch(B){return[]}},[h,E]),M=(0,u.useState)(F),A=s()(M,2),R=A[0],N=A[1],O=(0,u.useState)(!1),H=s()(O,2),T=H[0],P=H[1],c=(0,u.useState)(!1),w=s()(c,2),S=w[0],J=w[1],L=(0,u.useRef)(0),W=(0,u.useRef)(),U=(0,u.useRef)(),_=(0,u.useCallback)(function(){var B=E(),I=L.current+1;L.current=I,B.reset(),N([]),P(!0);try{B.renderNodes({content:K,platform:h,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:ee,charDelay:V}},onPatch:function(q){L.current===I&&N(o()(q))},onRenderComplete:function(){L.current===I&&(P(!1),W.current=setTimeout(_,oe))}})}catch(ne){L.current===I&&(N(F),P(!1))}},[h,E,F]);(0,u.useEffect)(function(){if(ie()||S){N(F),P(!1);return}return N(F),P(!1),U.current=setTimeout(_,re),function(){var B;L.current+=1,U.current&&clearTimeout(U.current),W.current&&clearTimeout(W.current),(B=x.current)===null||B===void 0||B.reset()}},[h,_,F,S]);var G=(0,u.useMemo)(function(){return(0,i.a)(R,T)},[R,T]),z=(0,n.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!S,"aria-label":S?"Play streaming demo":"Pause streaming demo",title:S?"Play":"Pause",onClick:function(){return J(function(I){return!I})},children:S?(0,n.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,n.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,n.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,n.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,n.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,n.jsx)(v.PhoneShell,{platform:h,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:z,children:G})})}var Q=e(18181),Y=e(49682),X={eyebrow:"Mini-programs \xB7 Streaming Markdown",heroTitle:"Multi-platform, streaming-friendly, high-performance mini-program Markdown renderer",heroSubtitle:(0,n.jsxs)(n.Fragment,{children:["Native WeChat and Alipay rendering: Markdown parses straight into per-platform"," ",(0,n.jsx)("code",{children:"MiniNode[]"}),", streamed token by token, with no WebView and no Web HTML pushed into a mini program."]}),facts:[{term:"Token \u2192 Node",desc:"marked lexer output flows straight into platform renderers"},{term:"Streaming",desc:"Stable blocks are cached while the open tail updates"},{term:"WeChat / Alipay",desc:"Platform quirks stay inside the transformer layer"}],install:{copyLabel:"Copy",copySuccessText:"Copied",playgroundHref:"/playground-en",playgroundLabel:"Playground"},scrollCue:"Architecture & streaming",arch:{title:"Native mini-program rendering",body:(0,n.jsxs)(n.Fragment,{children:["Mini programs have no DOM, and ",(0,n.jsx)("code",{children:"rich-text"})," brings its own whitelist. x-markdown-mini emits the renderable node tree directly: no intermediate IR after the lexer, no adapter matrix, and platform differences stay explicit in the two transformers."]}),proof:[{icon:"math",title:"Math",desc:(0,n.jsx)(n.Fragment,{children:"LaTeX plugin on demand"})},{icon:"ext",title:"Custom extensions",desc:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("code",{children:"miniRenderer"})," emits nodes"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,n.jsx)(n.Fragment,{children:"Inherited from marked parsing"})},{icon:"stream",title:"Streaming-friendly",desc:(0,n.jsx)(n.Fragment,{children:"Stable-block cache, tail-only rerender"})}]}},Z={title:"x-markdown-mini architecture",desc:"Markdown flows through marked lexer, Token, and the platform renderer to MiniNode output; streaming reuses the same transform via StreamingProcessor.",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function m(){return(0,n.jsx)("div",{className:"markdown",children:(0,n.jsxs)("main",{className:"xmd-landing",children:[(0,n.jsx)(Q.Z,{copy:X,media:(0,n.jsx)($,{})}),(0,n.jsx)(Y.Z,{copy:X,diagram:Z})]})})}},41540:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return m}});var u=e(67294),r=e(19632),o=e.n(r),a=e(5574),s=e.n(a),t=e(10744),l=e(9579),p=e(21483),v=e(87397),b=e(83478),i=e(38116),D=e(5114),k=e(7037),n=e(85893),K=D._B,V=[50,30,20,10,50],ee=[300,200,100,0],re=900,oe=2800;function ie(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function $(){var g=(0,b.useDocPlatform)(),y=s()(g,1),h=y[0],x=(0,u.useRef)(null),E=(0,u.useCallback)(function(){return x.current||(x.current=new t.XMarkdownMini({gfm:!0,extensions:[(0,l.default)({katexOptions:{throwOnError:!1}}),(0,p.default)()]})),x.current},[]),F=(0,u.useMemo)(function(){try{return E().renderNodes({content:K,platform:h,selectable:!0})}catch(B){return[]}},[h,E]),M=(0,u.useState)(F),A=s()(M,2),R=A[0],N=A[1],O=(0,u.useState)(!1),H=s()(O,2),T=H[0],P=H[1],c=(0,u.useState)(!1),w=s()(c,2),S=w[0],J=w[1],L=(0,u.useRef)(0),W=(0,u.useRef)(),U=(0,u.useRef)(),_=(0,u.useCallback)(function(){var B=E(),I=L.current+1;L.current=I,B.reset(),N([]),P(!0);try{B.renderNodes({content:K,platform:h,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:ee,charDelay:V}},onPatch:function(q){L.current===I&&N(o()(q))},onRenderComplete:function(){L.current===I&&(P(!1),W.current=setTimeout(_,oe))}})}catch(ne){L.current===I&&(N(F),P(!1))}},[h,E,F]);(0,u.useEffect)(function(){if(ie()||S){N(F),P(!1);return}return N(F),P(!1),U.current=setTimeout(_,re),function(){var B;L.current+=1,U.current&&clearTimeout(U.current),W.current&&clearTimeout(W.current),(B=x.current)===null||B===void 0||B.reset()}},[h,_,F,S]);var G=(0,u.useMemo)(function(){return(0,i.a)(R,T)},[R,T]),z=(0,n.jsx)("button",{type:"button",className:"xmd-hero-play","aria-pressed":!S,"aria-label":S?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:S?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return J(function(I){return!I})},children:S?(0,n.jsx)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:(0,n.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"currentColor","aria-hidden":"true",children:[(0,n.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,n.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,n.jsx)("figure",{className:"xmd-hero-media xmd-hero-phone-preview",children:(0,n.jsx)(v.PhoneShell,{platform:h,navTitle:"x-markdown-mini",titleLogo:"/brand/x-markdown-mark.png",centerTitle:!0,className:"xmd-hero-phone",navRight:z,children:G})})}var Q=e(18181),Y=e(49682),X={eyebrow:"\u5C0F\u7A0B\u5E8F \xB7 \u6D41\u5F0F Markdown",heroTitle:"\u591A\u7AEF\uFF0C\u6D41\u5F0F\u53CB\u597D\uFF0C\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668",heroSubtitle:(0,n.jsxs)(n.Fragment,{children:["\u539F\u751F\u7684\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u6E32\u67D3\uFF1AMarkdown \u76F4\u63A5\u89E3\u6790\u4E3A\u5404\u7AEF\u7684 ",(0,n.jsx)("code",{children:"MiniNode[]"}),"\uFF0Ctoken \u7EA7\u6D41\u5F0F\u76F4\u51FA\uFF0C\u4E0D\u7ECF\u8FC7 WebView\uFF0C\u4E5F\u4E0D\u628A Web HTML \u585E\u8FDB\u5C0F\u7A0B\u5E8F\u3002"]}),facts:[{term:"Token \u2192 Node",desc:"marked \u8BCD\u6CD5\u7ED3\u679C\u76F4\u63A5\u8FDB\u5165\u5E73\u53F0 renderer"},{term:"Streaming",desc:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u7B97\u672A\u5B8C\u6210\u5C3E\u90E8"},{term:"WeChat / Alipay",desc:"\u5E73\u53F0\u5DEE\u5F02\u5728 transformer \u5185\u6536\u655B"}],install:{copyLabel:"\u590D\u5236",copySuccessText:"\u5DF2\u590D\u5236",playgroundHref:"/playground",playgroundLabel:"\u5728\u7EBF\u4F53\u9A8C"},scrollCue:"\u67B6\u6784\u4E0E\u6D41\u5F0F\u539F\u7406",arch:{title:"\u539F\u751F\u5C0F\u7A0B\u5E8F\u6E32\u67D3",body:(0,n.jsxs)(n.Fragment,{children:["\u5C0F\u7A0B\u5E8F\u6CA1\u6709 DOM\uFF0C",(0,n.jsx)("code",{children:"rich-text"})," \u53C8\u4F1A\u91CD\u65B0\u5957\u767D\u540D\u5355\u3002x-markdown-mini \u76F4\u63A5\u4EA7\u51FA\u53EF\u6E32\u67D3\u7684\u8282\u70B9\u6811\uFF1Alexer \u4E4B\u540E\u6CA1\u6709\u4E2D\u95F4 IR\uFF0C\u6CA1\u6709\u9002\u914D\u5668\u77E9\u9635\uFF0C\u5E73\u53F0\u5DEE\u5F02\u5728\u4E24\u4E2A transformer \u91CC\u660E\u8BF4\u3002"]}),proof:[{icon:"math",title:"\u516C\u5F0F",desc:(0,n.jsx)(n.Fragment,{children:"LaTeX \u63D2\u4EF6\u6309\u9700\u5F15\u5165"})},{icon:"ext",title:"\u81EA\u5B9A\u4E49\u62D3\u5C55",desc:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("code",{children:"miniRenderer"})," \u76F4\u51FA\u8282\u70B9"]})},{icon:"commonmark",title:"100% CommonMark",desc:(0,n.jsx)(n.Fragment,{children:"\u7EE7\u627F marked \u89E3\u6790\u80FD\u529B"})},{icon:"stream",title:"\u6D41\u5F0F\u53CB\u597D",desc:(0,n.jsx)(n.Fragment,{children:"\u7A33\u5B9A\u5757\u7F13\u5B58\uFF0C\u53EA\u91CD\u8DD1\u5C3E\u90E8"})}]}},Z={title:"x-markdown-mini \u67B6\u6784\u56FE",desc:"Markdown \u7ECF marked lexer\u3001Token \u5230\u5E73\u53F0 renderer \u8F93\u51FA MiniNode\uFF1B\u6D41\u5F0F\u7ECF StreamingProcessor \u590D\u7528\u540C\u4E00 transform\u3002",labels:{markdown:"Markdown",lexer:"marked lexer",lexerNote:"lexer + extensions",token:"Token[]",tokenNote:"marked tokens",platformRenderer:"PlatformRenderer",wechat:"wechat renderer",alipay:"alipay renderer",node:"MiniNode[]",nodeNote:"native nodes",streaming:"streaming",chunk:"chunk",chunkNote:"hasNextChunk",streamingProcessor:"StreamingProcessor",stable:"stable blocks cached",tail:"tail re-parsed + fixup",extensions:"extensions",extNote:"LaTeX / highlight / @mention"}};function m(){return(0,n.jsx)("div",{className:"markdown",children:(0,n.jsxs)("main",{className:"xmd-landing",children:[(0,n.jsx)(Q.Z,{copy:X,media:(0,n.jsx)($,{})}),(0,n.jsx)(Y.Z,{copy:X,diagram:Z})]})})}},82175:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(45960),o=e(85893),a=`# x-markdown-mini

\u652F\u6301 **\u52A0\u7C97**\u3001*\u659C\u4F53* \u4E0E \`inline code\`\u3002

- \u5217\u8868\u9879\u4E00
- \u5217\u8868\u9879\u4E8C
- [Ant Design](https://ant.design)

> \u5F15\u7528\u5757\uFF1A\u7528\u4E8E\u6F14\u793A blockquote \u7684\u6E32\u67D3\u964D\u7EA7\u3002
`,s=`.page { padding: 24rpx; }
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
});`;d.default=function(){return(0,o.jsx)(r.DemoCard,{markdown:a,alipay:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:s,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`},wechat:{template:`<view class="page">
  <view class="card">
    <markdown content="{{content}}" />
  </view>
</view>`,script:t,style:s,json:`{
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}`}})}},16337:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(45960),o=e(85893),a="## \u56F4\u680F\u4EE3\u7801\u5757\n\n```js\nconst greet = (name) => `Hello ${name}`;\ngreet('mini');\n```\n",s="Page({\n  data: {\n    content: '\\`\\`\\`js\\nconst greet = (name) => \\`Hello \\${name}\\`;\\n\\`\\`\\`',\n  },\n});";d.default=function(){return(0,o.jsx)(r.DemoCard,{markdown:a,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:s},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:s}})}},22389:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(45960),o=e(85893),a=`## GFM \u8868\u683C

| \u5E73\u53F0   | platform   |
|--------|------------|
| \u5FAE\u4FE1   | \`wechat\`  |
| \u652F\u4ED8\u5B9D | \`alipay\`  |
| \u6296\u97F3   | \`douyin\`  |
`,s=`Page({
  data: {
    content: \`| \u5E73\u53F0 | platform |
|------|----------|
| \u5FAE\u4FE1 | wechat   |
| \u652F\u4ED8\u5B9D | alipay |\`,
  },
});`;d.default=function(){return(0,o.jsx)(r.DemoCard,{markdown:a,alipay:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:s},wechat:{template:`<view class="card">
  <markdown content="{{content}}" />
</view>`,script:s}})}},1248:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(5114),o=e(85893);d.default=function(){return(0,o.jsx)(r.XQ,{})}},64558:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(21483),o=e(45960),a=e(85893),s="```",t="\u9AD8\u4EAE\u7531 `highlight.js` \u5B8C\u6210\uFF1A\n\n".concat(s,`ts
function greet(name: string): string {
  // \u6A21\u677F\u5B57\u7B26\u4E32 + \u7C7B\u578B\u6807\u6CE8
  return \`Hello, \${name}\`;
}
`).concat(s,`

\u672A\u77E5\u8BED\u8A00\u4F1A\u56DE\u9000\u5230\u666E\u901A\u4EE3\u7801\u5757\u3002
`),l=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';

const md = new XMarkdownMini({
  extensions: [CodeHighlight()],
});

const nodes = md.renderNodes({ content, platform: 'auto' });`,p=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/CodeHighlight/style.wxss";`,v=[(0,r.default)()];d.default=function(){return(0,a.jsx)(o.DemoCard,{markdown:t,extensions:v,files:[{name:"usage.ts",lang:"ts",code:l},{name:"style",lang:"css",code:p},{name:"input.md",lang:"md",code:t}]})}},31792:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return v}});var u=e(67294),r=`import type { MiniNode, Tokens, XMarkdownExtension } from '@ant-design/x-markdown-mini';

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
`,o=e(45960),a=e(66579),s=e(85893),t=`| \u5E73\u53F0 | \u72B6\u6001 | \u8BF4\u660E |
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

const nodes = md.renderNodes({ content, platform: 'auto' });`,p=[(0,a.createCustomTableExtension)()],v=function(){return(0,s.jsx)(o.DemoCard,{markdown:t,extensions:p,files:[{name:"customTableExtension.ts",lang:"ts",code:r},{name:"usage.ts",lang:"ts",code:l},{name:"input.md",lang:"md",code:t}]})}},59659:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return v}});var u=e(67294),r=`import type {
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
`,o=e(45960),a=e(84629),s=e(85893),t=`Markdown[^1:\u4E00\u79CD\u8F7B\u91CF\u6807\u8BB0\u8BED\u8A00] \u5F88\u9002\u5408\u79FB\u52A8\u7AEF\u9605\u8BFB\uFF0C
\u4E5F\u65B9\u4FBF\u6A21\u578B\u6D41\u5F0F\u8F93\u51FA[^2:LLM \u9010 token \u8FD4\u56DE\u6587\u672C]\u3002
`,l=`import { XMarkdownMini } from '@ant-design/x-markdown-mini';
import { createFootnoteExtension } from './footnoteExtension';

const md = new XMarkdownMini({
  extensions: [createFootnoteExtension()],
});

// \u4EA7\u51FA name: 'footnote' \u7684 MiniNode\uFF0C
// marker \u4E0E\u5F39\u5C42\u7531\u5BBF\u4E3B\u9875\u9762\u6E32\u67D3\uFF08\u7EC4\u4EF6\u5C42\u8D70 slot / \u62BD\u8C61\u8282\u70B9\uFF09
const nodes = md.renderNodes({ content, platform: 'auto' });`,p=[(0,a.createFootnoteExtension)()],v=function(){return(0,s.jsx)(o.DemoCard,{markdown:t,extensions:p,files:[{name:"footnoteExtension.ts",lang:"ts",code:r},{name:"usage.ts",lang:"ts",code:l},{name:"input.md",lang:"md",code:t}]})}},39666:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(9579),o=e(45960),a=e(85893),s=`\u8D28\u80FD\u65B9\u7A0B\uFF1A$E=mc^2$

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

const nodes = md.renderNodes({ content, platform: 'auto' });`,l=`/* \u652F\u4ED8\u5B9D .acss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.acss";

/* \u5FAE\u4FE1 .wxss */
@import "@ant-design/x-markdown-mini/plugins/Latex/style.wxss";`,p=[(0,r.default)({katexOptions:{throwOnError:!1}})];d.default=function(){return(0,a.jsx)(o.DemoCard,{markdown:s,extensions:p,files:[{name:"usage.ts",lang:"ts",code:t},{name:"style",lang:"css",code:l},{name:"input.md",lang:"md",code:s}]})}},5065:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(45960),o=e(85893),a=`# \u5757\u7EA7\u52A8\u753B

\u65B0\u5757\u6DE1\u5165\uFF1B\u5DF2 commit \u7684\u5757\u5F15\u7528\u7A33\u5B9A\uFF0C\u4E0D\u91CD\u653E\u3002
`,s=`.md-animate-block {
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
});`;d.default=function(){return(0,o.jsx)(r.DemoCard,{markdown:a,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:s},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:t,style:s}})}},8386:function(f,d,e){"use strict";e.r(d),e.d(d,{default:function(){return k}});var u=e(67294),r=e(15335),o=`<view class="page">
  <button class="primary" onTap="startStream">\u5F00\u59CB\u6D41\u5F0F\u8F93\u51FA</button>
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    onRenderComplete="onComplete"
  />
</view>
`,a=`.page {
  padding: 16px;
}

.primary {
  margin-bottom: 12px;
  color: #fff;
  background: #1677ff;
  border-radius: 8px;
}
`,s=`let timer = null;

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
`,b=`{
  "navigationBarTitleText": "\u6D41\u5F0F\u8F93\u51FA",
  "usingComponents": {
    "markdown": "@ant-design/x-markdown-mini/components/Markdown/index"
  }
}
`,i=e(85893),D=[{key:"basic",title:"\u57FA\u7840\u6D41\u5F0F",description:"\u6BCF\u8F6E\u4F20\u5165\u7D2F\u8BA1 Markdown\uFF0C\u6700\u540E\u4E00\u8F6E\u628A hasNextChunk \u7F6E\u4E3A false\uFF0C\u5185\u90E8\u4F1A flush \u5269\u4F59 tail\u3002",navTitle:"\u6D41\u5F0F\u8F93\u51FA",markdown:`# \u6D41\u5F0F\u8F93\u51FA

\u6A21\u578B\u8FB9\u751F\u6210\uFF0CUI \u8FB9\u6E32\u67D3\uFF0C\u50CF\u6253\u5B57\u673A\u4E00\u6837\u9010\u5B57\u5448\u73B0\u3002

- \u53CC\u7A7A\u884C\u5916\u7684\u7A33\u5B9A\u5757\u53EA\u89E3\u6790\u4E00\u6B21
- \u6BCF\u8F6E\u53EA\u91CD\u89E3\u6790 tail
- **\u672A\u95ED\u5408\u7684\u7C97\u4F53**\u3001\`\u672A\u95ED\u5408\u884C\u5185\u4EE3\u7801\` \u4F1A\u5728 tail \u81EA\u52A8\u8865\u5168

\u53F3\u4E0A\u89D2\u53EF\u6682\u505C / \u91CD\u64AD\u8FD9\u6BB5\u6D41\u5F0F\u6F14\u793A\u3002`,animation:!0,autoStream:!0,alipay:{template:o,script:s,style:a,json:t},wechat:{template:l,script:v,style:p,json:b}}];function k(){return(0,i.jsx)(r.O,{demos:D,codeMinHeight:560})}},83538:function(f,d,e){"use strict";e.r(d);var u=e(67294),r=e(45960),o=e(85893),a=`# \u6253\u5B57\u673A\u6A21\u5F0F

\u6309\u53E5\u53F7\u3001\u95EE\u53F7\u3001\u6362\u884C\u5207\u5757\uFF1B\u6BCF\u5757\u518D\u6309 charDelay \u9010\u5B57\u63A8\u8FDB\u3002\u8D85\u957F\u53E5\u6309 maxChunkSize \u515C\u5E95\u5207\u3002
`,s=`Page({
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
});`;d.default=function(){return(0,o.jsx)(r.DemoCard,{markdown:a,animation:!0,alipay:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:s},wechat:{template:`<view class="card">
  <markdown content="{{content}}" streaming="{{streaming}}" />
</view>`,script:s}})}},15335:function(f,d,e){"use strict";e.d(d,{O:function(){return oe}});var u=e(5574),r=e.n(u),o=e(67294),a=e(87397),s=e(75892),t=e(83478),l=e(19632),p=e.n(l),v=e(10744),b=e(38116),i=e(85893),D=[50,30,20,10,50],k=[300,200,100,0],n=700,K=2600;function V(){return typeof window!="undefined"&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ee($){var Q=$.content,Y=$.platform,X=$.navTitle,Z=$.backHref,m=$.moreHref,g=$.extensions,y=(0,o.useRef)(null),h=(0,o.useCallback)(function(){return y.current||(y.current=new v.XMarkdownMini({gfm:!0,extensions:g})),y.current},[g]),x=(0,o.useMemo)(function(){try{return h().renderNodes({content:Q,platform:Y,selectable:!0})}catch(G){return[]}},[Q,Y,h]),E=(0,o.useState)(x),F=r()(E,2),M=F[0],A=F[1],R=(0,o.useState)(!1),N=r()(R,2),O=N[0],H=N[1],T=(0,o.useState)(!1),P=r()(T,2),c=P[0],w=P[1],S=(0,o.useRef)(0),J=(0,o.useRef)(),L=(0,o.useRef)(),W=(0,o.useCallback)(function(){var G=h(),z=S.current+1;S.current=z,G.reset(),A([]),H(!0);try{G.renderNodes({content:Q,platform:Y,selectable:!0,streaming:{hasNextChunk:!1,enableAnimation:!0,semantic:{maxChunkSize:18,chunkDelay:k,charDelay:D}},onPatch:function(I){S.current===z&&A(p()(I))},onRenderComplete:function(){S.current===z&&(H(!1),J.current=setTimeout(W,K))}})}catch(B){S.current===z&&(A(x),H(!1))}},[Q,Y,h,x]);(0,o.useEffect)(function(){if(V()||c){A(x),H(!1);return}return A(x),H(!1),L.current=setTimeout(W,n),function(){var G;S.current+=1,L.current&&clearTimeout(L.current),J.current&&clearTimeout(J.current),(G=y.current)===null||G===void 0||G.reset()}},[Y,W,x,c]);var U=(0,o.useMemo)(function(){return(0,b.a)(M,O)},[M,O]),_=(0,i.jsx)("button",{type:"button",className:"xmd-autostream-play","aria-pressed":!c,"aria-label":c?"\u64AD\u653E\u6D41\u5F0F\u6F14\u793A":"\u6682\u505C\u6D41\u5F0F\u6F14\u793A",title:c?"\u64AD\u653E":"\u6682\u505C",onClick:function(){return w(function(z){return!z})},children:c?(0,i.jsx)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"currentColor","aria-hidden":"true",children:(0,i.jsx)("path",{d:"M8 5v14l11-7z"})}):(0,i.jsxs)("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"currentColor","aria-hidden":"true",children:[(0,i.jsx)("rect",{x:"6",y:"5",width:"4",height:"14",rx:"1"}),(0,i.jsx)("rect",{x:"14",y:"5",width:"4",height:"14",rx:"1"})]})});return(0,i.jsx)(a.PhoneShell,{platform:Y,navTitle:X,backHref:Z,moreHref:m,navRight:_,children:U})}var re={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},oe=function(Q){var Y,X,Z,m,g,y,h=Q.demos,x=Q.codeMinHeight,E=Q.codeMaxHeight,F=(0,t.useDocPlatform)(),M=r()(F,1),A=M[0],R=(0,o.useState)((Y=(X=h[0])===null||X===void 0?void 0:X.key)!==null&&Y!==void 0?Y:""),N=r()(R,2),O=N[0],H=N[1],T=typeof window!="undefined"&&(window.location.pathname.endsWith("-en")||document.documentElement.lang.toLowerCase().startsWith("en")),P={tablist:T?"Switch demo":"\u5207\u6362\u793A\u4F8B",preview:T?"Mini-program preview":"\u5C0F\u7A0B\u5E8F\u9884\u89C8",previewFallback:T?"Live preview":"\u771F\u673A\u9884\u89C8",introduce:T?"Introduce":"\u5F15\u5165",codeSample:T?"Code sample":"\u4EE3\u7801\u793A\u4F8B",register:T?(0,i.jsxs)(i.Fragment,{children:["Register the component in ",(0,i.jsx)("code",{children:"index.json"}),":"]}):(0,i.jsxs)(i.Fragment,{children:["\u5728 ",(0,i.jsx)("code",{children:"index.json"})," \u4E2D\u6CE8\u518C\u7EC4\u4EF6\uFF1A"]}),demoCode:"Demo Code"},c=(0,o.useMemo)(function(){var w;return(w=h.find(function(S){return S.key===O}))!==null&&w!==void 0?w:h[0]},[O,h]);return c?(0,i.jsxs)("div",{className:"xmd-doc-demo",children:[(0,i.jsxs)("div",{className:"xmd-doc-demo-main",children:[h.length>1?(0,i.jsx)("div",{className:"xmd-doc-demo-tabs",role:"tablist","aria-label":P.tablist,children:h.map(function(w){return(0,i.jsx)("button",{type:"button",className:"xmd-doc-demo-tab ".concat(w.key===c.key?"is-active":""),onClick:function(){return H(w.key)},role:"tab","aria-selected":w.key===c.key,children:w.title},w.key)})}):null,c.alipay||c.wechat?(0,i.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,i.jsx)("h2",{className:"xmd-doc-demo-section-label",children:P.introduce}),(0,i.jsx)("p",{className:"xmd-doc-demo-desc",children:P.register}),(0,i.jsx)(s.DemoCode,{alipay:c.alipay,wechat:c.wechat,pick:["json"],collapsible:!1},"intro-".concat(c.key,"-").concat(A))]}):null,c.alipay||c.wechat?(0,i.jsxs)("section",{className:"xmd-doc-demo-section",children:[(0,i.jsx)("h2",{className:"xmd-doc-demo-section-label",children:P.codeSample}),c.description?(0,i.jsx)("p",{className:"xmd-doc-demo-desc",children:c.description}):null,(0,i.jsx)(s.DemoCode,{alipay:c.alipay,wechat:c.wechat,pick:["template","script"],collapsible:!1},"usage-".concat(c.key,"-").concat(A)),(0,i.jsx)(s.DemoCode,{alipay:c.alipay,wechat:c.wechat,files:c.files,defaultFile:c.defaultFile,title:P.demoCode,defaultCollapsed:!0,minHeight:x,maxHeight:E},"full-".concat(c.key,"-").concat(A))]}):null]}),(0,i.jsxs)("aside",{className:"xmd-doc-demo-preview","aria-label":P.preview,children:[(0,i.jsxs)("div",{className:"xmd-doc-demo-preview-head",children:[(0,i.jsx)("span",{className:"xmd-doc-demo-preview-title",children:(Z=(m=c.previewTitle)!==null&&m!==void 0?m:c.navTitle)!==null&&Z!==void 0?Z:P.previewFallback}),(0,i.jsx)("span",{className:"xmd-doc-demo-preview-platform","data-platform":A,children:re[A]})]}),(g=c.platformNotes)!==null&&g!==void 0&&g[A]?(0,i.jsx)("span",{className:"xmd-doc-demo-preview-note",children:c.platformNotes[A]}):null,c.autoStream&&c.markdown?(0,i.jsx)(ee,{content:c.markdown,platform:A,navTitle:c.navTitle,extensions:c.extensions},"stream-".concat(c.key,"-").concat(A)):(0,i.jsx)(a.PhonePreview,{platform:A,navTitle:c.navTitle,markdown:c.sections?void 0:c.markdown,sections:(y=c.sections)!==null&&y!==void 0?y:c.markdown?[{markdown:c.markdown,animation:c.animation}]:void 0,extensions:c.extensions,components:c.components,gfm:c.gfm,breaks:c.breaks,streamingTail:c.streamingTail})]})]}):null},ie=null},5114:function(f,d,e){"use strict";e.d(d,{XQ:function(){return Y},_B:function(){return $}});var u=e(19632),r=e.n(u),o=e(5574),a=e.n(o),s=e(64599),t=e.n(s),l=e(67294),p=e(10744),v=e(9579),b=e(21483),i=e(38116),D=e(87397),k=e(83478),n=e(85893),K={zh:{alipayUnavailable:"\u7EF4\u62A4\u4E2D",alipayHint:"\u652F\u4ED8\u5B9D\u771F\u673A\u9884\u89C8\u6682\u4E0D\u53EF\u7528",wechatComingSoon:"\u7533\u8BF7\u4E2D",wechatHint:"\u5FAE\u4FE1 AppID \u5BA1\u6838\u4E2D\uFF0C\u5373\u5C06\u5F00\u653E"},en:{alipayUnavailable:"Unavailable",alipayHint:"Alipay on-device preview is temporarily unavailable",wechatComingSoon:"Coming soon",wechatHint:"WeChat AppID under review \u2014 opening soon"}};function V(Z){var m=Z.platform,g=Z.isEn,y=K[g?"en":"zh"],h=m==="wechat",x=h?y.wechatHint:y.alipayHint,E=h?y.wechatComingSoon:y.alipayUnavailable;return(0,n.jsxs)("div",{className:"xmd-scan-pop is-locked",role:"tooltip","aria-label":x,children:[(0,n.jsxs)("div",{className:"xmd-scan-qr",children:[(0,n.jsx)("div",{className:"xmd-scan-placeholder","aria-hidden":"true",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"26",height:"26",fill:"none","aria-hidden":"true",children:[(0,n.jsx)("rect",{x:"5",y:"10.5",width:"14",height:"9.5",rx:"2",stroke:"currentColor",strokeWidth:"1.6"}),(0,n.jsx)("path",{d:"M8 10.5V8a4 4 0 0 1 8 0v2.5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]})}),(0,n.jsx)("span",{className:"xmd-scan-badge",children:E})]}),(0,n.jsx)("p",{className:"xmd-scan-hint",children:x})]})}var ee={alipay:"\u652F\u4ED8\u5B9D",wechat:"\u5FAE\u4FE1"},re=["alipay","wechat"],oe=[50,30,20,10,50],ie=[300,200,100,0],$=`\u4F60\u597D\uFF01\u6211\u662F AI \u52A9\u624B\uFF0C\u4E0B\u9762\u4E3A\u4F60\u6F14\u793A x-markdown-mini \u7684\u6D41\u5F0F\u6E32\u67D3\u80FD\u529B\u3002

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

*x-markdown-mini \u2014 \u591A\u7AEF\u3001\u6D41\u5F0F\u53CB\u597D\u3001\u9AD8\u6027\u80FD\u7684\u5C0F\u7A0B\u5E8F Markdown \u6E32\u67D3\u5668*`;function Q(Z,m){var g=(0,p.getPlatformRenderer)(m).capabilities,y=0,h=0,x=0,E=function N(O){var H=O.name,T=O.attrs,P=O.children;H==="ol"&&T&&T.start!=null&&Number(T.start)!==1&&!g.supportsOlStart&&(y+=1),H==="img"&&T&&typeof T.src=="string"&&/^http:\/\//i.test(T.src)&&g.requiresHttpsImage&&(h+=1),H==="a"&&T&&"data-href"in T&&m==="wechat"&&(x+=1);var c=t()(P!=null?P:[]),w;try{for(c.s();!(w=c.n()).done;){var S=w.value;N(S)}}catch(J){c.e(J)}finally{c.f()}},F=t()(Z),M;try{for(F.s();!(M=F.n()).done;){var A=M.value;E(A)}}catch(N){F.e(N)}finally{F.f()}var R=[];return y&&R.push({kind:"ol-start",label:"<ol start> \u4E0D\u652F\u6301\uFF0C\u5E8F\u53F7\u4ECE 1 \u5F00\u59CB"}),h&&R.push({kind:"http-image",label:"".concat(h," \u5F20 http \u56FE\u7247\u6539\u5199\u4E3A https")}),x&&R.push({kind:"anchor",label:"<a href> \u2192 data-href\uFF0C\u9700\u6D88\u8D39\u65B9\u62E6\u622A tap"}),R}var Y=function(m){var g=m.initialMarkdown,y=g===void 0?$:g,h=(0,l.useState)(y),x=a()(h,2),E=x[0],F=x[1],M=(0,k.useDocPlatform)(),A=a()(M,1),R=A[0],N=(0,l.useState)(R),O=a()(N,2),H=O[0],T=O[1],P=(0,l.useState)(!1),c=a()(P,2),w=c[0],S=c[1],J=(0,l.useState)(!0),L=a()(J,2),W=L[0],U=L[1],_=(0,l.useState)(!1),G=a()(_,2),z=G[0],B=G[1],I=(0,l.useState)(!0),ne=a()(I,2),q=ne[0],ae=ne[1],te=(0,l.useState)(!0),be=a()(te,2),he=be[0],ze=be[1],Ye=(0,l.useState)(!0),Me=a()(Ye,2),xe=Me[0],$e=Me[1],Ze=(0,l.useState)(!0),Ne=a()(Ze,2),pe=Ne[0],Ge=Ne[1],Ve=(0,l.useState)(!0),Se=a()(Ve,2),fe=Se[0],Qe=Se[1],Je=(0,l.useState)(!0),Pe=a()(Je,2),me=Pe[0],_e=Pe[1],qe=(0,l.useState)(!0),Te=a()(qe,2),ke=Te[0],en=Te[1],nn=(0,l.useState)(!0),Be=a()(nn,2),le=Be[0],tn=Be[1],an=(0,l.useState)(18),Re=a()(an,2),Ce=Re[0],rn=Re[1],on=(0,l.useState)(120),Le=a()(on,2),je=Le[0],sn=Le[1],dn=(0,l.useState)(24),Oe=a()(dn,2),we=Oe[0],cn=Oe[1],ln=(0,l.useState)(!1),Ie=a()(ln,2),se=Ie[0],ge=Ie[1],un=(0,l.useState)([]),He=a()(un,2),We=He[0],Fe=He[1],ce=(0,l.useRef)(0);(0,l.useEffect)(function(){T(R)},[R]);var de=H,mn=(0,l.useCallback)(function(C){T(C),window.localStorage.setItem("xmd-doc-platform",C),window.dispatchEvent(new CustomEvent("xmd-platform-change",{detail:{platform:C}}))},[]),ue=(0,l.useRef)(null),Ke=(0,l.useRef)(""),ve=(0,l.useCallback)(function(){var C="".concat(W,"|").concat(z,"|").concat(he,"|").concat(xe,"|").concat(pe,"|").concat(fe);if(ue.current&&Ke.current===C)return ue.current;var j=[];return xe&&j.push((0,v.default)({katexOptions:{throwOnError:!1}})),pe&&j.push((0,b.default)()),ue.current=new p.XMarkdownMini({escapeText:he,streamingFixup:fe?"remend":!1,gfm:W,breaks:z,extensions:j}),Ke.current=C,ue.current},[W,z,he,xe,pe,fe]);(0,l.useEffect)(function(){return function(){var C;(C=ue.current)===null||C===void 0||C.reset(),ce.current+=1}},[]);var Ue=(0,l.useMemo)(function(){if(se)return{reactNodes:(0,i.a)(We,me),issues:[]};try{var C=ve(),j=C.renderNodes({content:E,platform:de,selectable:q});return{reactNodes:(0,i.a)(j),issues:Q(j,de)}}catch(Ee){return{reactNodes:[(0,n.jsxs)("p",{className:"xmd-preview-error",children:["\u6E32\u67D3\u5931\u8D25\uFF1A",String(Ee)]},"error")],issues:[]}}},[E,de,q,se,We,me,ve]),hn=Ue.reactNodes,Cn=Ue.issues,xn=(0,l.useCallback)(function(){var C=ve(),j=ce.current+1;ce.current=j,C.reset(),ge(!0),Fe([]),F("");try{var Ee=C.renderNodes({content:$,platform:de,selectable:q,streaming:{hasNextChunk:!1,enableAnimation:me,semantic:ke?{maxChunkSize:Ce,chunkDelay:le?ie:je,charDelay:le?oe:we}:!1},onRenderProgress:function(Ae){var kn=Ae.markdown;ce.current===j&&F(kn)},onPatch:function(Ae){ce.current===j&&Fe(r()(Ae))},onRenderComplete:function(){ce.current===j&&ge(!1)}});Ee.length>0&&Fe(Ee)}catch(De){ge(!1)}},[de,q,me,ke,le,Ce,je,we,ve]),pn=(0,l.useCallback)(function(){var C;ce.current+=1,ge(!1),(C=ue.current)===null||C===void 0||C.reset()},[]),fn=(0,l.useState)(!1),Xe=a()(fn,2),ye=Xe[0],gn=Xe[1];(0,l.useEffect)(function(){typeof window!="undefined"&&gn(window.location.pathname.includes("-en"))},[]);var vn=ye?"Playground":"\u5728\u7EBF\u6F14\u793A",yn=ye?"/-en":"/",En=ye?"/docs/code-examples-en":"/docs/code-examples";return(0,n.jsxs)("div",{className:"xmd-pg",children:[(0,n.jsxs)("section",{className:"xmd-pg-editor-wrap","aria-label":"Markdown \u8F93\u5165",children:[(0,n.jsxs)("div",{className:"xmd-pg-editor-header",children:[(0,n.jsx)("label",{className:"xmd-pg-label",htmlFor:"xmd-pg-input",children:"Markdown"}),(0,n.jsxs)("div",{className:"xmd-pg-header-actions",children:[(0,n.jsxs)("button",{type:"button",className:"xmd-pg-stream-btn ".concat(se?"is-active":""),onClick:se?pn:xn,"aria-label":se?"\u505C\u6B62\u6D41\u5F0F":"\u6D41\u5F0F\u6F14\u793A",children:[(0,n.jsx)("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,n.jsx)("polygon",{points:"5 3 19 12 5 21 5 3"})}),(0,n.jsx)("span",{children:se?"\u505C\u6B62":"\u6D41\u5F0F"})]}),(0,n.jsx)("button",{type:"button",className:"xmd-pg-config-toggle ".concat(w?"is-active":""),onClick:function(){return S(!w)},"aria-expanded":w,"aria-label":"\u914D\u7F6E",children:(0,n.jsxs)("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,n.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,n.jsx)("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})})]})]}),w&&(0,n.jsxs)("div",{className:"xmd-pg-config",children:[(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u89E3\u6790"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:W,onChange:function(j){return U(j.target.checked)}}),(0,n.jsx)("span",{children:"GFM"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8868\u683C/\u5220\u9664\u7EBF"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:z,onChange:function(j){return B(j.target.checked)}}),(0,n.jsx)("span",{children:"Breaks"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\\n \u2192 br"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6E32\u67D3"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:q,onChange:function(j){return ae(j.target.checked)}}),(0,n.jsx)("span",{children:"Selectable"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u6587\u672C\u53EF\u9009"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:he,onChange:function(j){return ze(j.target.checked)}}),(0,n.jsx)("span",{children:"Escape"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"HTML \u8F6C\u4E49"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u63D2\u4EF6"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:pe,onChange:function(j){return Ge(j.target.checked)}}),(0,n.jsx)("span",{children:"CodeHighlight"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"hljs \u8BED\u6CD5\u9AD8\u4EAE"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:xe,onChange:function(j){return $e(j.target.checked)}}),(0,n.jsx)("span",{children:"LaTeX"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"KaTeX \u516C\u5F0F"})]})]}),(0,n.jsxs)("div",{className:"xmd-pg-config-group",children:[(0,n.jsx)("span",{className:"xmd-pg-config-group-title",children:"\u6D41\u5F0F"}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:fe,onChange:function(j){return Qe(j.target.checked)}}),(0,n.jsx)("span",{children:"Fixup"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8865\u5168\u672A\u95ED\u5408\u8BED\u6CD5"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:me,onChange:function(j){return _e(j.target.checked)}}),(0,n.jsx)("span",{children:"Animation"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u5757\u52A8\u753B"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:ke,onChange:function(j){return en(j.target.checked)}}),(0,n.jsx)("span",{children:"Semantic"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u8BED\u4E49\u5206\u5757"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item",children:[(0,n.jsx)("input",{type:"checkbox",checked:le,onChange:function(j){return tn(j.target.checked)}}),(0,n.jsx)("span",{children:"\u53D8\u901F"}),(0,n.jsx)("span",{className:"xmd-pg-config-desc",children:"\u968F\u5757\u52A0\u901F\u6253\u5B57\u673A"})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Max"}),(0,n.jsx)("input",{type:"number",min:8,max:400,value:Ce,onChange:function(j){return rn(Number(j.target.value)||80)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Chunk"}),(0,n.jsx)("input",{type:"number",min:0,max:2e3,disabled:le,value:je,onChange:function(j){return sn(Number(j.target.value)||0)}})]}),(0,n.jsxs)("label",{className:"xmd-pg-config-item xmd-pg-config-number",children:[(0,n.jsx)("span",{children:"Char"}),(0,n.jsx)("input",{type:"number",min:0,max:200,disabled:le,value:we,onChange:function(j){return cn(Number(j.target.value)||0)}})]})]})]}),(0,n.jsx)("textarea",{id:"xmd-pg-input",className:"xmd-pg-input",spellCheck:!1,value:E,onChange:function(j){se||F(j.target.value)},placeholder:"\u8F93\u5165 Markdown\uFF0C\u53F3\u4FA7\u5B9E\u65F6\u9884\u89C8\u2026",readOnly:se})]}),(0,n.jsxs)("section",{className:"xmd-pg-preview-wrap","aria-label":"\u9884\u89C8",children:[(0,n.jsx)("div",{className:"xmd-pg-platform-switch",role:"tablist","aria-label":"\u5207\u6362\u9884\u89C8\u5E73\u53F0",children:re.map(function(C){return(0,n.jsxs)("div",{className:"xmd-pg-platform-tab",children:[(0,n.jsxs)("button",{type:"button",className:"xmd-pg-platform-btn ".concat(C===de?"is-active":""),onClick:function(){return mn(C)},role:"tab","aria-selected":C===de,children:[ee[C],(0,n.jsx)("svg",{className:"xmd-pg-platform-scanhint",viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:(0,n.jsx)("path",{d:"M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18"})})]}),(0,n.jsx)(V,{platform:C,isEn:ye})]},C)})}),(0,n.jsx)(D.PhoneShell,{platform:de,navTitle:vn,backHref:yn,moreHref:En,autoScroll:se,children:hn})]})]})},X=null},87534:function(f,d,e){"use strict";e.d(d,{Z:function(){return l}});var u=e(64599),r=e.n(u),o=e(67294),a=e(85893),s={breaking:"\u{1F4A5}",feature:"\u{1F195}",fix:"\u{1F41B}",perf:"\u26A1\uFE0F"};function t(){var p=(0,o.useRef)(null);return(0,o.useEffect)(function(){var v=p.current;if(v){var b=Array.from(v.querySelectorAll(".xmd-cl-entry"));if(b.length!==0){var i=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(i||typeof IntersectionObserver=="undefined"){b.forEach(function(k){return k.classList.add("is-in")});return}var D=new IntersectionObserver(function(k){var n=r()(k),K;try{for(n.s();!(K=n.n()).done;){var V=K.value;V.isIntersecting&&(V.target.classList.add("is-in"),D.unobserve(V.target))}}catch(ee){n.e(ee)}finally{n.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return b.forEach(function(k){return D.observe(k)}),function(){return D.disconnect()}}}},[]),p}function l(p){var v=p.copy,b=t();return(0,a.jsx)("div",{className:"markdown",children:(0,a.jsxs)("main",{className:"xmd-changelog",children:[(0,a.jsxs)("header",{className:"xmd-cl-hero",children:[(0,a.jsx)("h1",{children:v.title}),(0,a.jsx)("p",{className:"xmd-cl-subtitle",children:v.subtitle})]}),(0,a.jsx)("ol",{className:"xmd-cl-list",ref:b,children:v.releases.map(function(i,D){return(0,a.jsxs)("li",{className:"xmd-cl-entry xmd-reveal",children:[(0,a.jsx)("span",{className:"xmd-cl-marker","aria-hidden":"true",children:(0,a.jsx)("span",{className:"xmd-cl-dot"})}),(0,a.jsxs)("div",{className:"xmd-cl-content",children:[(0,a.jsxs)("div",{className:"xmd-cl-meta",children:[(0,a.jsxs)("h2",{className:"xmd-cl-version",children:[i.version,D===0&&(0,a.jsx)("span",{className:"xmd-cl-latest",children:v.latest})]}),(0,a.jsx)("time",{className:"xmd-cl-date",children:i.date})]}),(0,a.jsx)("ul",{className:"xmd-cl-changes",children:i.items.map(function(k,n){return(0,a.jsxs)("li",{className:"xmd-cl-change",children:[(0,a.jsxs)("span",{className:"xmd-cl-tag xmd-cl-tag--".concat(k.type),children:[(0,a.jsx)("span",{className:"xmd-cl-tag-emoji","aria-hidden":"true",children:s[k.type]}),v.types[k.type]]}),(0,a.jsxs)("div",{className:"xmd-cl-text",children:[(0,a.jsx)("p",{dangerouslySetInnerHTML:{__html:k.html}}),k.notes.length>0&&(0,a.jsx)("ul",{className:"xmd-cl-notes",children:k.notes.map(function(K,V){return(0,a.jsx)("li",{dangerouslySetInnerHTML:{__html:K}},V)})})]})]},n)})})]})]},i.version)})})]})})}},61344:function(f,d,e){"use strict";e.d(d,{EN:function(){return a},ZH:function(){return o}});var u=[{version:"1.1.0",date:"2026-08-31",items:[{type:"feature",html:"\u5185\u7F6E <code>&lt;details&gt;</code> \u6298\u53E0\u5757\u652F\u6301\u3002\u6B64\u524D <code>&lt;details&gt;&lt;summary&gt;\u2026&lt;/summary&gt;\u2026&lt;/details&gt;</code> \u4F1A\u6E32\u67D3\u6210\u539F\u59CB\u6587\u672C\u2014\u2014marked \u7684 html \u5206\u8BCD\u5668\u5728\u7A7A\u884C\u5904\u628A\u8FD9\u6BB5\u5207\u6210\u4E92\u4E0D\u76F8\u5173\u7684\u591A\u4E2A token\uFF0C\u5F00\u95ED\u6807\u7B7E\u56E0\u800C\u6CC4\u6F0F\u5230\u5DF2\u6E32\u67D3\u5185\u5BB9\u7684\u524D\u540E\u3002\u73B0\u7531\u5185\u7F6E\u5757\u7EA7\u5206\u8BCD\u5668\u6574\u5757\u6355\u83B7\uFF1A<code>&lt;summary&gt;</code> \u53D6\u7EAF\u6587\u672C\u4F5C\u6807\u9898\uFF08\u6807\u7B7E\u88AB\u5265\u79BB\uFF09\uFF0C\u6B63\u6587\u6309\u666E\u901A\u5757\u7EA7 markdown \u89E3\u6790\uFF08\u542B\u7A7A\u884C\u5206\u9694\u7684\u6BB5\u843D\u4E0E\u5217\u8868\uFF09\uFF0C<code>&lt;details open&gt;</code> \u9ED8\u8BA4\u5C55\u5F00\u3002\u5185\u7F6E <code>MiniNodeRenderer</code>\uFF08\u5FAE\u4FE1 / \u652F\u4ED8\u5B9D\uFF09\u6E32\u67D3\u4E3A\u53EF\u6298\u53E0\u533A\u5757\uFF0C\u70B9\u51FB\u6807\u9898\u884C\u5C55\u5F00\u6536\u8D77\uFF0C\u9ED8\u8BA4\u6298\u53E0\u3002<strong>\u884C\u4E3A\u53D8\u5316\uFF1A</strong> <code>parse()</code> / <code>render()</code> \u73B0\u5728\u4F1A\u4EA7\u51FA\u65B0\u7684 <code>details</code> token \u7C7B\u578B\uFF0C\u8FD9\u6BB5 markdown \u4E0D\u518D\u8D70\u539F <code>html</code> \u539F\u59CB\u6587\u672C\u8DEF\u5F84\uFF1B\u6CE8\u518C <code>name: 'details'</code> \u7684\u6269\u5C55\u4ECD\u53EF\u5B8C\u5168\u8986\u76D6\u5185\u7F6E\u884C\u4E3A\u3002",notes:[]},{type:"fix",html:"<code>render(props)</code> / <code>renderNodes(props)</code> \u7684\u5355\u6B21\u8C03\u7528\u6269\u5C55\u4F1A\u6CC4\u6F0F\u5230\u540E\u7EED\u8C03\u7528\u3002<code>applyPerCallExtensions</code> \u7528\u6D45\u5C55\u5F00\u5FEB\u7167 <code>marked.defaults</code>\uFF0C\u800C marked \u7684 <code>use()</code> \u662F<strong>\u539F\u5730</strong>\u6539\u5199\u65E2\u6709\u7684 <code>defaults.extensions</code> \u5BB9\u5668\u53CA <code>renderer</code> / <code>tokenizer</code> \u5B9E\u4F8B\uFF0C\u5FEB\u7167\u4E0E\u88AB\u6539\u5199\u5BF9\u8C61\u5171\u4EAB\u540C\u4E00\u5F15\u7528\uFF0C\u8FD8\u539F\u7B49\u4E8E\u6CA1\u8FD8\u539F\u3002\u6B64\u524D\u53EA\u5728\u5B9E\u4F8B\u5DF2\u914D\u7F6E <code>extensions</code> \u65F6\u89E6\u53D1\uFF08\u5BB9\u5668\u5DF2\u5B58\u5728\uFF09\uFF0C\u73B0\u6309\u539F\u578B\u514B\u9686\u8FD9\u4E09\u8005\u3002",notes:[]},{type:"perf",html:"\u4E3B\u5E93\u4F53\u79EF\u56E0\u5185\u7F6E <code>&lt;details&gt;</code> \u5206\u8BCD\u5668\u589E\u52A0\u7EA6 1.3 KB\uFF08gzip \u7EA6 0.4 KB\uFF09\uFF0C<code>check-bundle</code> \u4F53\u79EF\u9884\u7B97\u5DF2\u540C\u6B65\u4E0A\u8C03\u3002",notes:[]}]},{version:"1.0.2",date:"2026-07-07",items:[{type:"fix",html:"\u652F\u4ED8\u5B9D\u771F\u673A\u4E0A KaTeX \u516C\u5F0F\u56DE\u9000\u6210\u7CFB\u7EDF\u5B57\u4F53\u3002\u771F\u673A <code>my.loadFontFace</code> \u53EA\u8BA4\u300C\u5DF2\u52A0\u5165\u4E0B\u8F7D\u5408\u6CD5\u57DF\u540D\u767D\u540D\u5355\u7684 https \u7F51\u7EDC\u5B57\u4F53\u300D\uFF0C\u5305\u5185\u672C\u5730 ttf \u8DEF\u5F84\u4E0E base64 data URI \u4EC5\u5728\u6A21\u62DF\u5668\u751F\u6548\uFF08\u6B64\u524D\u5B83\u4EEC\u80FD\u5728\u672C\u4ED3\u5E93\u81EA\u5E26 examples \u91CC\u5DE5\u4F5C\uFF0C\u662F\u56E0\u4E3A examples \u628A\u5B57\u4F53\u540C\u6B65\u5230\u4E86\u5DE5\u7A0B\u6839\u76EE\u5F55\uFF09\u3002\u73B0\u6539\u4E3A\u4ECE\u767D\u540D\u5355 CDN \u52A0\u8F7D KaTeX \u5B57\u4F53\uFF08<code>mdn.alipayobjects.com</code>\uFF0C20 \u4E2A ttf\uFF09\u3002<strong>\u4F7F\u7528\u65B9\u9700\u5C06\u8BE5\u5B57\u4F53 CDN \u57DF\u540D\u52A0\u5165\u5C0F\u7A0B\u5E8F\u300C\u4E0B\u8F7D\u5408\u6CD5\u57DF\u540D\u300D\u767D\u540D\u5355\u3002</strong> \u5FAE\u4FE1\u4ECD\u4FDD\u7559\u53EF\u89E3\u6790\u7684\u672C\u5730 <code>miniprogram_npm</code> ttf\uFF08\u4F18\u5148\uFF09+ \u5171\u4EAB CDN\uFF08\u515C\u5E95\uFF09\u3002",notes:[]},{type:"fix",html:"\u6D41\u5F0F\u6E32\u67D3\u516C\u5F0F\u65F6\u6574\u9875\u53CD\u590D\u95EA\u52A8\u3002\u6B64\u524D <code>MiniNodeRenderer</code> \u6BCF\u6536\u5230\u4E00\u4E2A chunk \u90FD\u4F1A\u91CD\u65B0\u6CE8\u518C\u5B57\u4F53\u5C31\u7EEA\u56DE\u8C03\uFF0C\u5B57\u4F53\u7F13\u5B58\u540E\u56DE\u8C03\u53C8\u540C\u6B65\u89E6\u53D1\uFF0C\u5BFC\u81F4\u6574\u68F5\u6E32\u67D3\u6811\u53CD\u590D\u300C\u5378\u8F7D-\u91CD\u6302\u300D\u3002\u73B0\u6BCF\u4E2A\u7EC4\u4EF6\u5B9E\u4F8B\u81F3\u591A\u91CD\u6392\u4E00\u6B21\uFF0C\u4E14\u4EC5\u5728\u300C\u6709\u516C\u5F0F + \u5B57\u4F53\u5C1A\u672A\u5C31\u7EEA + \u975E\u6D41\u5F0F\u8FDB\u884C\u4E2D\u300D\u65F6\u89E6\u53D1\u3002",notes:[]},{type:"fix",html:"\u6D41\u5F0F\u65F6\u6709\u5E8F\u5217\u8868\u5E8F\u53F7\uFF08\u5982 <code>1.</code>\uFF09\u6362\u884C\u3002\u9010\u5B57\u5165\u573A\u52A8\u753B\u628A marker \u62C6\u6210\u591A\u4E2A <code>&lt;text&gt;</code>\uFF0C\u5728\u4EC5 28rpx \u5BBD\u7684 marker \u5217\u91CC <code>1</code> \u548C <code>.</code> \u5206\u884C\u3002marker \u73B0\u6574\u4F53\u6E32\u67D3\u4E3A\u5355\u4E2A <code>&lt;text&gt;</code>\uFF0C\u4E0E\u5FAE\u4FE1\u4E00\u81F4\u3002",notes:[]},{type:"fix",html:"\u5C0A\u91CD <code>package.json#exports</code> \u7684\u6784\u5EFA\u5DE5\u5177\uFF08\u5982 Minifish 2.0\uFF09\u65E0\u6CD5\u89E3\u6790\u3001\u52A0\u8F7D\u4E0D\u51FA <code>&lt;markdown&gt;</code> \u7EC4\u4EF6\u3002\u65B0\u589E <code>./es/Markdown/index</code> \u4E0E <code>./es/MiniNodeRenderer/index</code> \u65E0\u6269\u5C55\u540D\u5B50\u8DEF\u5F84\u5BFC\u51FA\u6620\u5C04\uFF08Node \u7684 <code>*</code> \u901A\u914D\u4E0D\u4F1A\u81EA\u52A8\u8865\u6269\u5C55\u540D\uFF09\u3002",notes:[]},{type:"perf",html:"\u79FB\u9664\u5185\u8054 base64 \u5B57\u4F53\u6570\u636E\u6A21\u5757\uFF08<code>katex-font-data.js</code>\uFF09\u4E0E\u652F\u4ED8\u5B9D\u5305\u6839 ttf\uFF1B\u5B57\u4F53 loader \u62BD\u4E3A\u6BCF\u4E2A\u5305\u6839\u4EC5\u53D1\u4E00\u4EFD\u7684 <code>shared/loadKatexFonts.js</code>\uFF08\u4E0D\u518D\u5185\u8054\u8FDB\u6BCF\u4E2A\u7EC4\u4EF6 wrapper\uFF09\u3002\u5305\u4F53\u51CF\u5C0F\u3002",notes:[]}]},{version:"1.0.1",date:"2026-07-05",items:[{type:"feature",html:"\u6269\u5C55\u53EF\u8986\u76D6\u5185\u7F6E\u5143\u7D20\u7684\u6E32\u67D3\u3002\u6269\u5C55\u7684 <code>name</code> \u547D\u4E2D\u5185\u7F6E token \u7C7B\u578B\uFF08\u5982 <code>table</code>\u3001<code>code</code>\uFF09\u65F6\uFF0C\u5176 <code>miniRenderer</code> \u4F1A\u5B8C\u5168\u63A5\u7BA1\u8BE5 token \u7684\u6E32\u67D3\u3002\u6B64\u524D\u4EC5 <code>code</code> \u652F\u6301\uFF0C\u73B0 <code>table</code> \u540C\u6837\u53EF\u8986\u76D6\uFF1B\u53EA\u63D0\u4F9B <code>miniRenderer</code>\u3001\u4E0D\u63D0\u4F9B <code>tokenizer</code> \u65F6\u89E3\u6790\u4ECD\u8D70\u5185\u7F6E\u5206\u8BCD\u5668\uFF0C\u8FD4\u56DE <code>null</code> \u56DE\u9000\u5230\u5185\u7F6E\u6E32\u67D3\u3002",notes:[]},{type:"fix",html:"<code>\\[ \u2026 \\]</code> \u5757\u7EA7\u516C\u5F0F\u7D27\u8DDF\u6587\u672C\u884C\uFF08\u65E0\u7A7A\u884C\u5206\u9694\uFF09\u65F6\u4E0D\u88AB\u8BC6\u522B\u3002<code>blockKatex</code> \u7F3A\u5C11 <code>start</code>\uFF0C\u8BE5\u884C\u88AB\u5E76\u5165\u6BB5\u843D\u3001<code>\\[</code> <code>\\]</code> \u9000\u5316\u6210\u8F6C\u4E49\u5B57\u7B26\uFF1B\u8865\u4E0A\u5757\u7EA7 <code>start</code> \u540E\u53EF\u6B63\u786E\u4E2D\u65AD\u6BB5\u843D\uFF0C\u8BC6\u522B\u4E3A\u5757\u7EA7\u516C\u5F0F\u3002",notes:[]},{type:"fix",html:"iOS &lt; 15.4 / \u65E7\u57FA\u7840\u5E93\u4E0A\u6574\u5305\u767D\u5C4F\u3002\u5185\u8054\u7684 <code>marked</code> \u8BCD\u6CD5\u5668\u8C03\u7528\u4E86 <code>Array.prototype.at</code>\uFF08<code>.at(-1)</code>\uFF09\uFF0C\u8FD9\u4E9B\u5F15\u64CE\u4E0D\u652F\u6301\uFF0C\u8FD0\u884C\u65F6\u629B <code>x.at is not a function</code>\u2014\u2014<code>tsup</code> \u53EA\u964D\u8BED\u6CD5\u4E0D polyfill \u5185\u5EFA\u65B9\u6CD5\uFF0C<code>es-check</code> \u53EA\u67E5\u8BED\u6CD5\u4E5F\u7167\u4E0D\u5230\u3002\u65B0\u589E\u5B88\u536B\u5F0F\u3001\u4E0D\u53EF\u679A\u4E3E\u7684 <code>Array/String#at</code> polyfill\uFF08\u5728\u4EFB\u4F55\u8BCD\u6CD5\u5668\u4EE3\u7801\u524D\u52A0\u8F7D\uFF09\uFF0C\u5E76\u52A0 <code>check-bundle</code> \u5361\u53E3\u9632\u6B62\u5176\u5B83\u672A polyfill \u7684\u8FD0\u884C\u65F6\u65B9\u6CD5\u56DE\u5F52\u3002",notes:[]},{type:"fix",html:"\u6D41\u5F0F\u6E32\u67D3\u65F6\u884C\u5185\u4EE3\u7801 <code>code</code> \u4E2D\u95F4\u51FA\u73B0\u591A\u4F59\u7A7A\u683C\u3002\u9010\u5B57 / \u9010\u6BB5\u5165\u573A\u52A8\u753B\u4F1A\u628A\u884C\u5185\u4EE3\u7801\u6587\u672C\u62C6\u6210\u591A\u4E2A\u53F6\u5B50 <code>&lt;text&gt;</code>\uFF0C\u800C\u6BCF\u4E2A\u53F6\u5B50\u90FD\u5E26 <code>md-inline-code</code> \u836F\u4E38\u7684\u5185\u5916\u8FB9\u8DDD\u4E0E\u5E95\u8272\uFF0C\u62FC\u63A5\u540E\u5C31\u51FA\u73B0\u4E86\u7F1D\u9699\uFF08\u652F\u4ED8\u5B9D\u9010\u5B57\u62C6\u5206\u6700\u660E\u663E\uFF09\u3002",notes:["\u836F\u4E38\u76D2\u6A21\u578B\uFF08\u80CC\u666F / \u5185\u5916\u8FB9\u8DDD / \u5706\u89D2\uFF09\u6539\u4E3A\u53EA\u753B\u5728\u5916\u5C42\u6574\u6BB5\u5BB9\u5668\u4E0A\uFF1B\u62C6\u51FA\u6765\u7684\u5B57\u7B26\u53F6\u5B50\u6539\u7528\u7EAF\u7B49\u5BBD\u5B57\u4F53\u7C7B <code>md-inline-code-txt</code>\uFF08\u652F\u4ED8\u5B9D <code>&lt;text&gt;</code> \u4E0D\u7EE7\u627F font-family\uFF0C\u5B57\u4F53\u5FC5\u987B\u7559\u5728\u53F6\u5B50\uFF09\u3002\u5FAE\u4FE1\u3001\u652F\u4ED8\u5B9D\u4E24\u7AEF\u4E00\u5E76\u4FEE\u590D\u3002"]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> \u91CD\u6574\u3002<code>lexerOptions</code> / \u9876\u5C42 <code>extensions</code> / <code>plugins</code> \u4E09\u4E2A\u5B57\u6BB5\u5408\u5E76\u4E3A\u5355\u4E00\u7684 <code>options: { gfm?, breaks?, extensions? }</code>\uFF0C\u540C\u6B65\u79FB\u9664 <code>Plugin</code> \u7C7B\u578B\u5BFC\u51FA\u3002",notes:["\u8FC1\u79FB\uFF1A<code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>\uFF1B<code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>\uFF1B<code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>\u3002"]},{type:"breaking",html:"\u5185\u7F6E\u7EC4\u4EF6 <code>&lt;markdown /&gt;</code> \u7684 <code>plugins</code> prop \u6539\u540D <code>extensions</code>\u3002",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> \u7C7B\u578B\u5BFC\u51FA\uFF0C\u7EDF\u4E00\u63CF\u8FF0\u6784\u9020\u5668\u7684 marked \u914D\u7F6E\u5757\u3002",notes:[]},{type:"feature",html:"\u5185\u7F6E <code>marked</code> lexer \u5E76\u5728\u6784\u5EFA\u65F6\u6253\u8FDB\u4EA7\u7269\uFF1B\u6574\u5E93 ESM \u7EA6 103KB / gzip \u7EA6 25KB\u3002",notes:[]},{type:"feature",html:"\u6D41\u5F0F\u589E\u91CF\u89E3\u6790\u2014\u2014\u5DF2\u7A33\u5B9A\u5757\u7F13\u5B58\u4E3A <code>stableNodes</code>\uFF0C\u4EC5 tail \u91CD\u65B0 lex\u3002",notes:[]},{type:"feature",html:"\u5FAE\u4FE1 / \u652F\u4ED8\u5B9D <code>PlatformRenderer</code>\uFF0C\u66B4\u9732\u5E73\u53F0\u80FD\u529B\u4E0E token \u5230\u8282\u70B9\u7684\u8F6C\u6362\u5165\u53E3\u3002",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> \u63A5\u53E3\uFF0C\u628A tokenizer \u4E0E <code>miniRenderer</code> \u5199\u5728\u540C\u4E00\u4E2A\u5BF9\u8C61\u4E0A\uFF1B\u4FDD\u7559 <code>tokenRenderers</code> \u4F5C\u4E3A fallback\u3002",notes:[]},{type:"fix",html:"\u52A8\u753B\u7C7B\u5408\u5E76 bug\u2014\u2014\u5F00\u542F <code>animation</code> \u65F6\u5757\u7EA7\u8282\u70B9\u4E0D\u518D\u4E22\u5931\u8BED\u4E49 class\u3002",notes:[]},{type:"perf",html:"<code>chunkDelay = charDelay = 0</code> \u65F6\u8DF3\u8FC7 setTimeout \u94FE\uFF0C\u540C\u6B65\u63A8\u56DE\u3002",notes:[]},{type:"perf",html:"<code>&lt;b&gt;</code> / <code>&lt;i&gt;</code> \u6539\u4E3A\u8BED\u4E49\u5316 <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code>\u3002",notes:[]}]}],r=[{version:"1.1.0",date:"2026-08-31",items:[{type:"feature",html:"built-in <code>&lt;details&gt;</code> support. <code>&lt;details&gt;&lt;summary&gt;\u2026&lt;/summary&gt;\u2026&lt;/details&gt;</code> previously rendered as raw text \u2014 marked's html tokenizer splits the region at blank lines into several unrelated tokens, so the opening and closing tags leaked around otherwise-rendered content. A built-in block tokenizer now captures the whole region: <code>&lt;summary&gt;</code> becomes a plain-text title (tags stripped), the body is lexed as regular block markdown (including blank-line-separated paragraphs and lists), and <code>&lt;details open&gt;</code> starts expanded. The bundled <code>MiniNodeRenderer</code> (WeChat / Alipay) renders it as a collapsible section \u2014 tapping the summary row toggles it, collapsed by default. <strong>Behavior change:</strong> <code>parse()</code> / <code>render()</code> now emit a new <code>details</code> token type and this markdown no longer takes the raw <code>html</code> text path; an extension registered as <code>name: 'details'</code> still overrides the built-in entirely.",notes:[]},{type:"fix",html:"per-call extensions passed to <code>render(props)</code> / <code>renderNodes(props)</code> leaked into later calls. <code>applyPerCallExtensions</code> snapshotted <code>marked.defaults</code> with a shallow spread, but marked's <code>use()</code> mutates the existing <code>defaults.extensions</code> container and the <code>renderer</code> / <code>tokenizer</code> instances <strong>in place</strong>, so the snapshot aliased the very objects it was meant to restore. This previously only triggered when the instance already had <code>extensions</code> configured (container already present). All three are now cloned preserving their prototypes.",notes:[]},{type:"perf",html:"the built-in <code>&lt;details&gt;</code> tokenizer adds roughly 1.3 KB raw (~0.4 KB gzip) to the main library; <code>check-bundle</code> size budgets were raised to match.",notes:[]}]},{version:"1.0.2",date:"2026-07-07",items:[{type:"fix",html:"KaTeX formulas fell back to the system font on the Alipay real device. On device <code>my.loadFontFace</code> only accepts an https network font whose domain is on the download allowlist; package-local ttf paths and base64 data URIs work only in the simulator (they appeared to work in this repo's own examples only because the examples sync the fonts to the project root). KaTeX fonts now load from a whitelisted CDN (<code>mdn.alipayobjects.com</code>, 20 ttf). <strong>Consumers must add the font CDN domain to their mini-program download allowlist.</strong> WeChat keeps its resolvable local <code>miniprogram_npm</code> ttf (first) + shared CDN (fallback).",notes:[]},{type:"fix",html:"whole-page flicker while streaming formulas. <code>MiniNodeRenderer</code> re-registered a font-ready callback on every chunk, and the callback fired synchronously once fonts were cached, unmounting/remounting the entire render tree each chunk. Each component instance now reflows at most once, and only when there is a formula, fonts aren't ready yet, and streaming is not in progress.",notes:[]},{type:"fix",html:"ordered-list markers (e.g. <code>1.</code>) wrapped across lines while streaming. The per-character entrance animation split the marker into separate <code>&lt;text&gt;</code> boxes, so <code>1</code> and <code>.</code> broke onto different lines inside the 28rpx-wide marker column. Markers now render as a single <code>&lt;text&gt;</code>, matching WeChat.",notes:[]},{type:"fix",html:"bundlers that honor <code>package.json#exports</code> (e.g. Minifish 2.0) couldn't resolve and failed to load the <code>&lt;markdown&gt;</code> component. Added <code>./es/Markdown/index</code> and <code>./es/MiniNodeRenderer/index</code> no-extension subpath export maps (Node's <code>*</code> glob does not auto-append extensions).",notes:[]},{type:"perf",html:"removed the inlined base64 font data module (<code>katex-font-data.js</code>) and the Alipay-root ttf; the font loader is now shipped once per package root (<code>shared/loadKatexFonts.js</code>) instead of inlined into every component wrapper. Smaller package.",notes:[]}]},{version:"1.0.1",date:"2026-07-05",items:[{type:"feature",html:"extensions can override built-in element rendering. When an extension's <code>name</code> matches a built-in token type (e.g. <code>table</code>, <code>code</code>), its <code>miniRenderer</code> fully takes over that token's rendering. Previously only <code>code</code> supported this; now <code>table</code> can be overridden too. Providing only a <code>miniRenderer</code> (no <code>tokenizer</code>) keeps marked's built-in parsing; returning <code>null</code> falls back to the built-in rendering.",notes:[]},{type:"fix",html:"<code>\\[ \u2026 \\]</code> display math was not recognized when it immediately followed a text line (no blank separator). <code>blockKatex</code> had no <code>start</code>, so the line was absorbed into the paragraph and its <code>\\[</code>/<code>\\]</code> degraded to escape tokens; a block <code>start</code> now interrupts the paragraph and recognizes the display math.",notes:[]},{type:"fix",html:"the whole bundle blanked on iOS &lt; 15.4 / older base libraries. The bundled <code>marked</code> lexer calls <code>Array.prototype.at</code> (<code>.at(-1)</code>), which those engines lack, throwing <code>x.at is not a function</code> \u2014 <code>tsup</code> only lowers syntax (not built-in methods) and <code>es-check</code> (syntax-only) couldn't catch it. Ships a guarded, non-enumerable <code>Array/String#at</code> polyfill loaded before any lexer code, plus a <code>check-bundle</code> gate against other un-polyfilled runtime methods.",notes:[]},{type:"fix",html:"inline code <code>code</code> showed spurious gaps mid-word while streaming. The per-character / per-segment entrance animation splits the inline-code text into several leaf <code>&lt;text&gt;</code> nodes, and each leaf carried the <code>md-inline-code</code> pill's padding, margin and background \u2014 so the pills tiled with visible gaps (worst on Alipay, which splits per character).",notes:["The pill box (background / padding / radius) now paints only on the outer container; the split character leaves use a font-only <code>md-inline-code-txt</code> class instead (Alipay <code>&lt;text&gt;</code> does not inherit font-family, so the monospace font must stay on the leaf). Fixed on both WeChat and Alipay."]}]},{version:"1.0.0",date:"2026-07-03",items:[{type:"breaking",html:"<code>XMarkdownMiniOptions</code> collapsed. <code>lexerOptions</code> / top-level <code>extensions</code> / <code>plugins</code> are gone, replaced by a single <code>options: { gfm?, breaks?, extensions? }</code> bag. The <code>Plugin</code> type is removed.",notes:["Migration: <code>{ extensions: [...] }</code> \u2192 <code>{ options: { extensions: [...] } }</code>; <code>{ plugins: [Latex(), CodeHighlight()] }</code> \u2192 <code>{ options: { extensions: [Latex(), CodeHighlight()] } }</code>; <code>{ lexerOptions: { gfm } }</code> \u2192 <code>{ options: { gfm } }</code>."]},{type:"breaking",html:"the bundled <code>&lt;markdown /&gt;</code> component renames its <code>plugins</code> prop to <code>extensions</code>.",notes:[]},{type:"feature",html:"<code>MarkedConfig</code> exported, describing the constructor's marked-side configuration bag.",notes:[]},{type:"feature",html:"bundle marked's lexer into the build. Full ESM bundle around 103 KB / ~25 KB gzip.",notes:[]},{type:"feature",html:"streaming incremental parsing \u2014 committed blocks are cached as <code>stableNodes</code>, only the tail is re-lexed.",notes:[]},{type:"feature",html:"WeChat / Alipay <code>PlatformRenderer</code>, exposing platform capabilities and the token-to-node entry point.",notes:[]},{type:"feature",html:"<code>XMarkdownExtension</code> interface \u2014 colocates the tokenizer and its <code>miniRenderer</code> on a single object. <code>tokenRenderers</code> is retained as a fallback.",notes:[]},{type:"fix",html:"animation-class merge bug \u2014 with <code>animation</code> enabled, block-level nodes no longer drop their semantic class.",notes:[]},{type:"perf",html:"when <code>chunkDelay = charDelay = 0</code>, skip the setTimeout chain and push synchronously.",notes:[]},{type:"perf",html:"emit semantic <code>&lt;strong&gt;</code> / <code>&lt;em&gt;</code> instead of <code>&lt;b&gt;</code> / <code>&lt;i&gt;</code>.",notes:[]}]}],o={title:"\u66F4\u65B0\u65E5\u5FD7",subtitle:"\u9762\u5411\u4F7F\u7528\u8005\u7684 API\u3001\u6784\u5EFA\u4EA7\u7269\u4E0E\u884C\u4E3A\u53D8\u5316\u90FD\u8BB0\u5F55\u5728\u8FD9\u91CC\u3002\u8FC1\u79FB\u8BF4\u660E\u5199\u5728\u5BF9\u5E94\u7248\u672C\u4E0B\uFF0C\u65B9\u4FBF\u5347\u7EA7\u65F6\u6309\u7248\u672C\u9010\u6761\u6838\u5BF9\u3002",latest:"\u6700\u65B0",types:{breaking:"\u7834\u574F\u6027",feature:"\u65B0\u589E",fix:"\u4FEE\u590D",perf:"\u4F18\u5316"},releases:u},a={title:"Changelog",subtitle:"User-facing API, build-output, and behavior changes are tracked here. Migration notes stay under the affected version so upgrades can be checked version by version.",latest:"Latest",types:{breaking:"Breaking",feature:"Added",fix:"Fixed",perf:"Improved"},releases:r}},49682:function(f,d,e){"use strict";e.d(d,{Z:function(){return b}});var u=e(97857),r=e.n(u),o=e(67294),a=e(9783),s=e.n(a),t=e(85893);function l(i){var D=i.title,k=i.desc,n=i.labels;return(0,t.jsxs)("svg",{className:"xmd-arch-svg",viewBox:"0 0 960 400",role:"img","aria-labelledby":"xmd-arch-title xmd-arch-desc",children:[(0,t.jsx)("title",{id:"xmd-arch-title",children:D}),(0,t.jsx)("desc",{id:"xmd-arch-desc",children:k}),(0,t.jsxs)("defs",{children:[(0,t.jsx)("marker",{id:"xmd-flow-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#a3a3a3"})}),(0,t.jsx)("marker",{id:"xmd-accent-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7.5",markerHeight:"7.5",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#2563eb"})}),(0,t.jsx)("marker",{id:"xmd-amber-arrow",viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse",children:(0,t.jsx)("path",{d:"M0 0 L10 5 L0 10 z",fill:"#c99a1f"})})]}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M148 82 H184",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 82 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M482 82 H520",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M738 82 H780",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-flow",d:"M338 290 H374",markerEnd:"url(#xmd-flow-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-line",d:"M503 248 C 540 210 631 226 631 190",markerEnd:"url(#xmd-accent-arrow)"}),(0,t.jsx)("path",{className:"xmd-arch-ext-line",d:"M760 262 C 760 224 706 226 700 190",markerEnd:"url(#xmd-amber-arrow)"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"24",y:"50",width:"124",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"86",y:"80",textAnchor:"middle",children:n.markdown}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"86",y:"99",textAnchor:"middle",children:"string"}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"188",y:"50",width:"150",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"80",textAnchor:"middle",children:n.lexer}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"99",textAnchor:"middle",children:n.lexerNote}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-in",x:"378",y:"50",width:"104",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"430",y:"80",textAnchor:"middle",children:n.token}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"430",y:"99",textAnchor:"middle",children:n.tokenNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"524",y:"36",width:"214",height:"152",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"631",y:"58",textAnchor:"middle",children:"PlatformRenderer"}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"74",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"101",textAnchor:"middle",children:n.wechat}),(0,t.jsx)("rect",{className:"xmd-arch-plat-chip",x:"544",y:"126",width:"174",height:"44",rx:"8"}),(0,t.jsx)("text",{className:"xmd-arch-chip-label",x:"631",y:"153",textAnchor:"middle",children:n.alipay}),(0,t.jsx)("rect",{className:"xmd-arch-box xmd-arch-box-node",x:"784",y:"50",width:"148",height:"64",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"858",y:"80",textAnchor:"middle",children:n.node}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"858",y:"99",textAnchor:"middle",children:n.nodeNote}),(0,t.jsx)("text",{className:"xmd-arch-lane-title",x:"24",y:"244",children:n.streaming}),(0,t.jsx)("rect",{className:"xmd-arch-platform",x:"188",y:"262",width:"150",height:"56",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-label",x:"263",y:"291",textAnchor:"middle",children:n.chunk}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"263",y:"309",textAnchor:"middle",children:n.chunkNote}),(0,t.jsx)("rect",{className:"xmd-arch-group",x:"378",y:"248",width:"250",height:"110",rx:"12"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"503",y:"270",textAnchor:"middle",children:"StreamingProcessor"}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"284",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"303",textAnchor:"middle",children:n.stable}),(0,t.jsx)("rect",{className:"xmd-arch-sp-chip",x:"396",y:"320",width:"214",height:"28",rx:"7"}),(0,t.jsx)("text",{className:"xmd-arch-chip-note",x:"503",y:"339",textAnchor:"middle",children:n.tail}),(0,t.jsx)("rect",{className:"xmd-arch-ext",x:"690",y:"262",width:"210",height:"72",rx:"10"}),(0,t.jsx)("text",{className:"xmd-arch-group-title",x:"795",y:"290",textAnchor:"middle",children:n.extensions}),(0,t.jsx)("text",{className:"xmd-arch-note",x:"795",y:"311",textAnchor:"middle",children:n.extNote}),(0,t.jsxs)("g",{className:"xmd-arch-pulses","aria-hidden":"true",children:[(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"148",cy:"82",r:"3.4",style:s()({animationDelay:"0s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"82",r:"3.4",style:s()({animationDelay:".35s"},"--tx","36px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"482",cy:"82",r:"3.4",style:s()({animationDelay:".7s"},"--tx","38px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"738",cy:"82",r:"3.4",style:s()({animationDelay:"1.05s"},"--tx","42px")}),(0,t.jsx)("circle",{className:"xmd-arch-pulse",cx:"338",cy:"290",r:"3.4",style:s()({animationDelay:".55s"},"--tx","36px")})]})]})}var p=e(24849),v={math:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M4 4h9l-4.5 6L13 16H4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),ext:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M4 6h12M4 10h12M4 14h7",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("circle",{cx:"15.5",cy:"14",r:"2",stroke:"currentColor",strokeWidth:"1.5"})]}),commonmark:(0,t.jsx)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"m4 10 3 3 9-9",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})}),stream:(0,t.jsxs)("svg",{className:"xmd-arch-proof-icon",viewBox:"0 0 20 20",fill:"none","aria-hidden":"true",children:[(0,t.jsx)("path",{d:"M3 7h6M3 13h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),(0,t.jsx)("path",{d:"M12 4l4 6-4 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})};function b(i){var D=i.copy,k=i.diagram,n=(0,p.v)();return(0,t.jsxs)("section",{className:"xmd-landing-section xmd-architecture xmd-reveal",ref:n,children:[(0,t.jsxs)("div",{className:"xmd-section-copy",children:[(0,t.jsx)("h2",{children:D.arch.title}),(0,t.jsx)("p",{children:D.arch.body})]}),(0,t.jsxs)("div",{className:"xmd-arch-board","aria-label":k.title,children:[(0,t.jsx)(l,r()({},k)),(0,t.jsx)("div",{className:"xmd-arch-proof",children:D.arch.proof.map(function(K,V){return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"xmd-arch-proof-head",children:[v[K.icon],(0,t.jsx)("strong",{children:K.title})]}),(0,t.jsx)("span",{children:K.desc})]},V)})})]})]})}},18181:function(f,d,e){"use strict";e.d(d,{Z:function(){return t}});var u=e(67294),r=e(85893),o="npm i @ant-design/x-markdown-mini";function a(l){var p=l.copyLabel,v=l.copySuccessText,b=l.playgroundHref,i=l.playgroundLabel;return(0,r.jsxs)("div",{className:"xmd-hero-actions",children:[(0,r.jsxs)("button",{type:"button",className:"xmd-install-command","data-xmd-copy":o,"data-xmd-copy-success":v,"aria-label":p,children:[(0,r.jsx)("span",{className:"xmd-install-prompt","aria-hidden":"true",children:"$"}),(0,r.jsx)("code",{children:o}),(0,r.jsxs)("span",{className:"xmd-copy-control","aria-hidden":"true",children:[(0,r.jsxs)("svg",{className:"xmd-copy-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:[(0,r.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:"1.4"}),(0,r.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]}),(0,r.jsx)("svg",{className:"xmd-check-icon",viewBox:"0 0 16 16",width:"19",height:"19",fill:"none",children:(0,r.jsx)("path",{d:"m3 8.2 3 3L13 4",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,r.jsx)("span",{"data-xmd-copy-status":!0})]})]}),(0,r.jsx)("a",{className:"xmd-secondary-link xmd-playground-link",href:b,children:i})]})}var s=e(24849);function t(l){var p=l.copy,v=l.media,b=(0,s.v)();return(0,r.jsxs)("section",{className:"xmd-hero",children:[(0,r.jsxs)("div",{className:"xmd-hero-copy xmd-reveal",ref:b,children:[(0,r.jsx)("span",{className:"xmd-hero-eyebrow",children:p.eyebrow}),(0,r.jsx)("h1",{children:p.heroTitle}),(0,r.jsx)("p",{className:"xmd-hero-subtitle",children:p.heroSubtitle}),(0,r.jsx)(a,{copyLabel:p.install.copyLabel,copySuccessText:p.install.copySuccessText,playgroundHref:p.install.playgroundHref,playgroundLabel:p.install.playgroundLabel}),(0,r.jsx)("dl",{className:"xmd-hero-facts","aria-label":p.eyebrow,children:p.facts.map(function(i){return(0,r.jsxs)("div",{children:[(0,r.jsx)("dt",{children:i.term}),(0,r.jsx)("dd",{children:i.desc})]},i.term)})})]}),v]})}},24849:function(f,d,e){"use strict";e.d(d,{v:function(){return a}});var u=e(64599),r=e.n(u),o=e(67294);function a(){var s=(0,o.useRef)(null);return(0,o.useEffect)(function(){var t=s.current;if(t){var l=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(l||typeof IntersectionObserver=="undefined"){t.classList.add("is-in");return}var p=new IntersectionObserver(function(v){var b=r()(v),i;try{for(b.s();!(i=b.n()).done;){var D=i.value;D.isIntersecting&&(D.target.classList.add("is-in"),p.unobserve(D.target))}}catch(k){b.e(k)}finally{b.f()}},{threshold:.12,rootMargin:"0px 0px -8% 0px"});return p.observe(t),function(){return p.disconnect()}}},[]),s}},38116:function(f,d,e){"use strict";e.d(d,{a:function(){return Z}});var u=e(19632),r=e.n(u),o=e(5574),a=e.n(o),s=e(97857),t=e.n(s),l=e(64599),p=e.n(l),v=e(67294);function b(){return{segments:[],prev:"",nextId:0}}function i(m,g){for(var y=Math.min(m.length,g.length),h=0;h<y&&m[h]===g[h];)h++;return h}function D(m,g){if(g===m.prev)return m;var y=i(m.prev,g),h=[],x=0,E=p()(m.segments),F;try{for(E.s();!(F=E.n()).done;){var M=F.value;if(x>=y)break;var A=x+M.text.length;A<=y?h.push(M):h.push({id:M.id,text:M.text.slice(0,y-x)}),x=A}}catch(O){E.e(O)}finally{E.f()}var R=m.nextId,N=g.slice(y);return N&&h.push({id:R++,text:N}),{segments:h,prev:g,nextId:R}}var k=e(85893);function n(m){if(typeof document=="undefined")return m;var g=document.createElement("textarea");return g.innerHTML=m,g.value}var K=function(g){var y=g.value,h=n(y),x=(0,v.useRef)(b());return x.current=D(x.current,h),(0,k.jsx)(k.Fragment,{children:x.current.segments.map(function(E){return(0,k.jsx)("span",{className:"animation-text-char",children:E.text},E.id)})})},V=null,ee={h1:"md-h1",h2:"md-h2",h3:"md-h3",pre:"md-code-block",blockquote:"md-blockquote",a:"md-link",ul:"md-list",ol:"md-list",table:"md-table"},re=new Set(["br","img","hr","input"]);function oe(m){var g;m&&(g=navigator.clipboard)!==null&&g!==void 0&&g.writeText&&navigator.clipboard.writeText(m).catch(function(){})}var ie=(0,k.jsxs)("svg",{viewBox:"0 0 16 16",width:14,height:14,fill:"none","aria-hidden":"true",children:[(0,k.jsx)("path",{d:"M5 5.5c0-.83.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-6c-.83 0-1.5-.67-1.5-1.5v-6Z",stroke:"currentColor",strokeWidth:1.4}),(0,k.jsx)("path",{d:"M3 10H2.5C1.67 10 1 9.33 1 8.5v-6C1 1.67 1.67 1 2.5 1h6C9.33 1 10 1.67 10 2.5V3",stroke:"currentColor",strokeWidth:1.4,strokeLinecap:"round"})]});function $(m,g){if(m.name==="copy-button"){var y,h=((y=m.attrs)===null||y===void 0?void 0:y["data-copy"])!=null?String(m.attrs["data-copy"]):"";return(0,k.jsx)("button",{type:"button",className:"md-copy-btn","aria-label":"\u590D\u5236",onClick:function(){return oe(h)},children:ie},g)}if(m.name==="text"){var x,E;return(0,k.jsx)("span",{className:(x=m.attrs)!==null&&x!==void 0&&x.class?String(m.attrs.class):void 0,children:((E=m.attrs)===null||E===void 0?void 0:E.value)!=null?String(m.attrs.value):""},g)}return X(m,g,!1)}function Q(m){var g={},y=p()(m.split(";")),h;try{for(y.s();!(h=y.n()).done;){var x=h.value,E=x.trim();if(E){var F=E.indexOf(":");if(F!==-1){var M=E.slice(0,F).trim(),A=E.slice(F+1).trim(),R=M.replace(/-([a-z])/g,function(N,O){return O.toUpperCase()});g[R]=A}}}}catch(N){y.e(N)}finally{y.f()}return g}function Y(m){return m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function X(m,g,y){var h=m.name,x=m.attrs,E=m.children,F=m.animate,M=(h||"div").toLowerCase();if(M==="text"){var A=(x==null?void 0:x.value)!=null?String(x.value):"";if(y)return(0,k.jsx)(K,{value:A},g);var R=/<|>|"|'/.test(A)?Y(A):A;return v.createElement("span",{key:g,dangerouslySetInnerHTML:{__html:R}})}if(m.header&&m.header.length>0){var N=M==="table",O=N?"md-tableblock":"md-codeblock",H=N?"md-tableblock-bar":"md-codeblock-bar",T=(0,k.jsx)("div",{className:H,children:m.header.map(function(ae,te){return $(ae,te)})}),P=X(t()(t()({},m),{},{header:void 0}),"el",y);return(0,k.jsxs)("div",{className:O,children:[T,P]},g)}var c=[];ee[M]&&c.push(ee[M]),F&&c.push("md-animate-block");var w={key:g};if(x)for(var S=0,J=Object.entries(x);S<J.length;S++){var L=a()(J[S],2),W=L[0],U=L[1];W==="class"?c.length>0?(w.className="".concat(U," ").concat(c.join(" ")),c.length=0):w.className=U:W==="style"&&typeof U=="string"?w.style=Q(U):U===!0?w[W]=!0:U!==!1&&U!=null&&(w[W]=String(U))}if(c.length>0&&(w.className=w.className?"".concat(w.className," ").concat(c.join(" ")):c.join(" ")),re.has(M))return v.createElement(M,w);var _=x&&typeof x.class=="string"?x.class:"",G=M==="pre"||/(^|\s)katex/.test(_),z=y&&!G;if(M==="table"&&E&&E.length>0){var B=[],I=[],ne=function(te){I.length&&(B.push(v.createElement.apply(v,["tbody",{key:te}].concat(r()(I)))),I=[])};return E.forEach(function(ae,te){(ae.name||"").toLowerCase()==="tr"?I.push(X(ae,"tr-".concat(te),z)):(ne("tb-".concat(te)),B.push(X(ae,te,z)))}),ne("tb-last"),v.createElement.apply(v,[M,w].concat(B))}var q=E==null?void 0:E.map(function(ae,te){return X(ae,te,z)});return q&&q.length>0?v.createElement.apply(v,[M,w].concat(r()(q))):v.createElement(M,w)}function Z(m){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return m.map(function(y,h){return X(y,h,g)})}},7037:function(){"use strict"},96446:function(f,d,e){var u=e(37923);function r(o){if(Array.isArray(o))return u(o)}f.exports=r,f.exports.__esModule=!0,f.exports.default=f.exports},64599:function(f,d,e){var u=e(96263);function r(o,a){var s=typeof Symbol!="undefined"&&o[Symbol.iterator]||o["@@iterator"];if(!s){if(Array.isArray(o)||(s=u(o))||a&&o&&typeof o.length=="number"){s&&(o=s);var t=0,l=function(){};return{s:l,n:function(){return t>=o.length?{done:!0}:{done:!1,value:o[t++]}},e:function(D){throw D},f:l}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var p=!0,v=!1,b;return{s:function(){s=s.call(o)},n:function(){var D=s.next();return p=D.done,D},e:function(D){v=!0,b=D},f:function(){try{!p&&s.return!=null&&s.return()}finally{if(v)throw b}}}}f.exports=r,f.exports.__esModule=!0,f.exports.default=f.exports},96936:function(f){function d(e){if(typeof Symbol!="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}f.exports=d,f.exports.__esModule=!0,f.exports.default=f.exports},88619:function(f){function d(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}f.exports=d,f.exports.__esModule=!0,f.exports.default=f.exports},19632:function(f,d,e){var u=e(96446),r=e(96936),o=e(96263),a=e(88619);function s(t){return u(t)||r(t)||o(t)||a()}f.exports=s,f.exports.__esModule=!0,f.exports.default=f.exports}}]);
