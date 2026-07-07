// 用累积内容模拟 AI/SSE 流：每次回调都是「截至当前的完整 Markdown」，
// 与真实聊天接口的前端消费方式一致。页面卸载或关闭开关时必须取消定时器。
function createStreamPlayer(options) {
  const content = options.content;
  const chunkSize = options.chunkSize == null ? 4 : options.chunkSize;
  const interval = options.interval == null ? 30 : options.interval;
  const chars = Array.from(content);
  const chunks = [];
  for (let i = 0; i < chars.length; i += chunkSize) {
    chunks.push(chars.slice(i, i + chunkSize).join(''));
  }

  let timer = null;
  let runId = 0;

  function delayAfter(chunk) {
    if (/\n\s*$/.test(chunk)) return interval + 40;
    if (/[。！？；：.!?]\s*$/.test(chunk)) return interval + 20;
    return interval;
  }

  function stop() {
    runId += 1;
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function showAll() {
    stop();
    options.onFrame(content, false, 'idle');
  }

  function play() {
    stop();
    const currentRun = runId;
    let index = 0;
    let output = '';
    options.onFrame('', true, 'streaming');

    function tick() {
      if (currentRun !== runId) return;
      output += chunks[index] || '';
      index += 1;
      const done = index >= chunks.length;
      options.onFrame(output, !done, done ? 'done' : 'streaming');
      timer = done ? null : setTimeout(tick, delayAfter(chunks[index - 1]));
    }

    timer = setTimeout(tick, interval);
  }

  return { play, showAll, dispose: stop };
}

module.exports = { createStreamPlayer };
