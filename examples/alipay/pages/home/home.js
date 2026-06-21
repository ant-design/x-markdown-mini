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
    ],
  },
  onTapEntry(e) {
    my.navigateTo({ url: e.currentTarget.dataset.url });
  },
});
