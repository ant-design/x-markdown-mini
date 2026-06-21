// 组件接入：页面只把内容塞给 <markdown>，latex / highlight 由组件内部 bake，
// 插件与样式都随 usingComponents 自动带上 —— 页面不 require 任何插件、不 @import 任何样式。
const { SAMPLE } = require('../sample.js');

Page({
  data: {
    sample: SAMPLE,
  },
});
