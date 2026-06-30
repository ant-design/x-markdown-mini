import React, { useRef } from 'react';
import { advanceSegments, initSegmentState, type SegmentState } from './animationSegments';

/**
 * 打字机逐字渐显（文档站预览专用）。
 *
 * 镜像 markdown-x-mini 的 `animation-text` 组件：每次拿到的 `value` 都是累计文本，
 * 只把「新追加的片段」包成一个独立的 <span class="animation-text-char">，靠 CSS
 * opacity 0→1 独立淡入。已存在的片段保持稳定 key，不会重播动画 —— 于是流式逐字推进
 * 时，每个新出现的字/词单独渐显，旧内容不动，形成打字机效果。
 *
 * 解码 HTML 实体后再做 diff：库在 escapeText=true 时把文本转义成实体（如 `&amp;`），
 * 在解码后的纯文本上切分可避免把单个实体劈成两段。
 *
 * 分段对账（含「标记吸收」修复）见 {@link advanceSegments}：流式中间态把未闭合的
 * Markdown 标记当字面文本临时追加，闭合后又吸收掉使文本叶子缩短，这里用最长公共
 * 前缀复用已显示片段，避免整段重新淡入。
 */

function decodeEntities(s: string): string {
  if (typeof document === 'undefined') return s;
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

export const AnimationText: React.FC<{ value: string }> = ({ value }) => {
  const decoded = decodeEntities(value);
  const stateRef = useRef<SegmentState>(initSegmentState());

  // 在 render 期同步派生新片段（幂等：相同 value 二次 render 不重复追加，
  // 因此 StrictMode 的双调用安全）。
  stateRef.current = advanceSegments(stateRef.current, decoded);

  return (
    <>
      {stateRef.current.segments.map((seg) => (
        <span key={seg.id} className="animation-text-char">
          {seg.text}
        </span>
      ))}
    </>
  );
};

export default AnimationText;
