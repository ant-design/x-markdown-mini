export interface TableShadowState {
  left: boolean;
  right: boolean;
}

/** Derive edge-shadow visibility from scroll geometry with a small rounding tolerance. */
export function getTableShadowState(
  scrollLeft: number,
  scrollWidth: number,
  viewportWidth: number,
): TableShadowState {
  const left = Math.max(0, scrollLeft);
  const content = Math.max(0, scrollWidth);
  const viewport = Math.max(0, viewportWidth);
  const overflow = content > viewport + 1;
  return {
    left: overflow && left > 1,
    right: overflow && left + viewport < content - 1,
  };
}
