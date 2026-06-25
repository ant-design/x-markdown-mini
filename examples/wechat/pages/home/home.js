Page({
  data: {
    entries: [
      {
        id: 'component',
        title: '组件接入',
        desc: '一行 usingComponents 引入 <markdown>，开 latex / highlight 即可',
        url: '/pages/component/component',
      },
      {
        id: 'js',
        title: 'JS 接入',
        desc: 'renderNodes() 直出节点 + MiniNodeRenderer，精细控制渲染',
        url: '/pages/js/js',
      },
      {
        id: 'benchmark',
        title: '性能对比',
        desc: '与 towxml、mp-html、wxParse/wemark 等业内方案做本机基准测试',
        url: '/pages/benchmark/benchmark',
      },
    ],
  },
  onTapEntry(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  },
});
