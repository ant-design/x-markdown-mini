import React, { useRef } from 'react';

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
 */

interface Segment {
  id: number;
  text: string;
}

function decodeEntities(s: string): string {
  if (typeof document === 'undefined') return s;
  const el = document.createElement('textarea');
  el.innerHTML = s;
  return el.value;
}

export const AnimationText: React.FC<{ value: string }> = ({ value }) => {
  const decoded = decodeEntities(value);
  const prevRef = useRef('');
  const segmentsRef = useRef<Segment[]>([]);
  const idRef = useRef(0);

  // 在 render 期同步派生新片段（幂等：相同 value 二次 render 不重复追加，
  // 因此 StrictMode 的双调用安全）。
  const prev = prevRef.current;
  if (decoded !== prev) {
    if (prev && decoded.startsWith(prev)) {
      const diff = decoded.slice(prev.length);
      if (diff) segmentsRef.current = [...segmentsRef.current, { id: idRef.current++, text: diff }];
    } else {
      // 非追加（全新内容 / 流式重排）：整体重置，作为单一片段淡入。
      segmentsRef.current = decoded ? [{ id: idRef.current++, text: decoded }] : [];
    }
    prevRef.current = decoded;
  }

  return (
    <>
      {segmentsRef.current.map((seg) => (
        <span key={seg.id} className="animation-text-char">
          {seg.text}
        </span>
      ))}
    </>
  );
};

export default AnimationText;
