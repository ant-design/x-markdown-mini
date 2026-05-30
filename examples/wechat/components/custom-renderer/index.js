// dispatcher 组件：接收 markdown 透传的 node（MiniNode），自身只负责按 tag 分发。
Component({
  properties: {
    node: { type: Object, value: {} },
  },
});
