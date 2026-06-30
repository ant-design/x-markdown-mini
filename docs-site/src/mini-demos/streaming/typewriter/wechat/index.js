Page({
  data: {
    content: '# 打字机模式\n\n按标点和换行切块，每块再按字符推进。',
    streaming: {
      hasNextChunk: true,
      semantic: {
        delimiters: /[。！？\n]/,
        maxChunkSize: 60,
        chunkDelay: 50,
        charDelay: 20,
      },
      enableAnimation: true,
    },
  },
});
