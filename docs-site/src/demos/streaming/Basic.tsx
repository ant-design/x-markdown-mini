import React from 'react';
import { DemoCard } from '../../components/DemoCard';

const MARKDOWN = `# 流式输出

边喂数据边渲染。已稳定的块只 parse 一次。
`;

export default () => (
  <DemoCard
    markdown={MARKDOWN}
    animation
    alipay={{
      template: `<view class="card">
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    onRenderComplete="onComplete"
  />
</view>`,
      script: `let timer = null;
const FULL = '# 流式输出\\n\\n边喂数据边渲染…';

Page({
  data: { content: '', streaming: false },
  onUnload() { if (timer) clearTimeout(timer); },
  startStream() {
    let i = 0;
    const tick = () => {
      i = Math.min(i + 4, FULL.length);
      const done = i >= FULL.length;
      this.setData({
        content: FULL.slice(0, i),
        streaming: { hasNextChunk: !done, enableAnimation: true },
      });
      if (!done) timer = setTimeout(tick, 50);
    };
    tick();
  },
  onComplete() { console.log('done'); },
});`,
    }}
    wechat={{
      template: `<view class="card">
  <markdown
    content="{{content}}"
    streaming="{{streaming}}"
    bind:rendercomplete="onComplete"
  />
</view>`,
      script: `let timer = null;
const FULL = '# 流式输出\\n\\n边喂数据边渲染…';

Page({
  data: { content: '', streaming: false },
  onUnload() { if (timer) clearTimeout(timer); },
  startStream() {
    let i = 0;
    const tick = () => {
      i = Math.min(i + 4, FULL.length);
      const done = i >= FULL.length;
      this.setData({
        content: FULL.slice(0, i),
        streaming: { hasNextChunk: !done, enableAnimation: true },
      });
      if (!done) timer = setTimeout(tick, 50);
    };
    tick();
  },
  onComplete() { console.log('done'); },
});`,
    }}
  />
);
