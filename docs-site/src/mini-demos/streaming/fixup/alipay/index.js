const FENCE = '```';

Page({
  data: {
    content: `**正在生成的要点

${FENCE}ts
const value = '代码还没写完`,
    streaming: {
      hasNextChunk: true,
      semantic: { chunkDelay: 0, charDelay: 0 },
    },
  },
});
