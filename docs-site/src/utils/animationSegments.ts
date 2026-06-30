/**
 * 打字机逐字渐显的纯分段算法（与 React 解耦，便于单测）。
 *
 * 流式渲染时，每个文本叶子拿到的是「累计文本」。把已渲染部分切成若干稳定
 * 片段（segment），每个片段一个稳定 id —— 只有「真正新增的尾部」才会作为
 * 新片段淡入，已存在片段保持 id 不变，CSS 动画不会重播。
 *
 * 关键修复：流式中间态会把未闭合的 Markdown 标记（如 `**`、`*`、`` ` ``）当成
 * 字面文本临时追加到前一个文本叶子上（`"aaa "` → `"aaa *"` → `"aaa **"`），
 * 等粗体闭合后又把标记吸收掉，文本叶子缩回 `"aaa "`。此时新值不是旧值的前缀
 * 扩展，旧实现会整体重置 → 已显示的 `"aaa "` 重新淡入（动画重复）。
 *
 * 这里改用「最长公共前缀」对账：公共前缀部分复用原有片段（id 不变，不重播），
 * 多出来的标记被裁掉，只有公共前缀之后真正新增的尾部才分配新 id 淡入。
 */

export interface Segment {
  id: number;
  text: string;
}

export interface SegmentState {
  segments: Segment[];
  prev: string;
  nextId: number;
}

export function initSegmentState(): SegmentState {
  return { segments: [], prev: '', nextId: 0 };
}

function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) i++;
  return i;
}

/**
 * 推进一帧：给定累计文本 `decoded`，返回新的分段状态。
 * 幂等 —— 相同 `decoded` 不产生新片段（StrictMode 双调用安全）。
 */
export function advanceSegments(state: SegmentState, decoded: string): SegmentState {
  if (decoded === state.prev) return state;

  const commonLen = commonPrefixLength(state.prev, decoded);

  // 复用覆盖在公共前缀内的片段（保持稳定 id → 不重播动画）；
  // 跨越边界的片段裁剪到公共前缀处；公共前缀之后的旧内容（被吸收的标记）丢弃。
  const kept: Segment[] = [];
  let consumed = 0;
  for (const seg of state.segments) {
    if (consumed >= commonLen) break;
    const end = consumed + seg.text.length;
    if (end <= commonLen) {
      kept.push(seg);
    } else {
      kept.push({ id: seg.id, text: seg.text.slice(0, commonLen - consumed) });
    }
    consumed = end;
  }

  let nextId = state.nextId;
  const tail = decoded.slice(commonLen);
  if (tail) kept.push({ id: nextId++, text: tail });

  return { segments: kept, prev: decoded, nextId };
}
