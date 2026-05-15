import type { UnifiedNode } from '../types.js';
import type { PlatformAdapterConfig } from './capabilities.js';

/**
 * 通用平台适配器：根据 PlatformAdapterConfig（能力矩阵 + 行为开关）将统一节点
 * 转换为目标小程序 rich-text 可消费的节点结构。
 *
 * 核心步骤：
 * 1. 永远移除 selectable（属于组件级属性，不应出现在内部节点上）
 * 2. classMode='strip' 时移除 class（多数小程序 rich-text 忽略内部 class）
 * 3. 根据 caps 做属性级降级：httpsOnlyImages、olStartSupported
 * 4. 根据 caps 做标签级降级：preSupported、blockquoteSupported、tableSupported、videoSupported
 * 5. rewriteAnchorHref=true 时将 <a href> → <a data-href class="md-link">
 */
export function adaptNodes(nodes: UnifiedNode[], config: PlatformAdapterConfig): UnifiedNode[] {
  const out: UnifiedNode[] = [];
  for (const n of nodes) {
    const mapped = mapNode(n, config);
    if (mapped) out.push(mapped);
  }
  return out;
}

function mapNode(node: UnifiedNode, config: PlatformAdapterConfig): UnifiedNode | null {
  const { caps, classMode = 'strip', rewriteAnchorHref } = config;
  const { name, attrs = {}, children } = node;

  // 不支持的 <video>：直接丢弃
  if (name === 'video' && !caps.videoSupported) return null;

  // 标签级降级
  if (name === 'pre' && !caps.preSupported) {
    return downgradeWrapper(node, config, 'md-code-block');
  }
  if (name === 'blockquote' && !caps.blockquoteSupported) {
    return downgradeWrapper(node, config, 'md-blockquote');
  }
  if (name === 'table' && !caps.tableSupported) {
    return flattenTable(node, config);
  }

  // 属性映射
  const newAttrs: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'selectable') continue;
    if (k === 'class' && classMode === 'strip') continue;
    if (name === 'ol' && k === 'start' && !caps.olStartSupported) continue;
    if (name === 'img' && k === 'src' && caps.httpsOnlyImages && typeof v === 'string') {
      newAttrs.src = v.replace(/^http:\/\//, 'https://');
      continue;
    }
    newAttrs[k] = v;
  }

  // WeChat 风格的 <a> 重写
  if (name === 'a' && rewriteAnchorHref && 'href' in newAttrs) {
    newAttrs['data-href'] = String(newAttrs.href);
    delete newAttrs.href;
    newAttrs.class = 'md-link';
  }

  const result: UnifiedNode = { name, attrs: newAttrs };
  if (node.animate) result.animate = node.animate;
  if (children?.length) {
    const mapped: UnifiedNode[] = [];
    for (const c of children) {
      const m = mapNode(c, config);
      if (m) mapped.push(m);
    }
    if (mapped.length) result.children = mapped;
  }
  return result;
}

/**
 * 把 <pre> / <blockquote> 这类容器降级为 <div class="...">。
 * 注：降级容器自身保留 class 作为标识用途，即使 classMode='strip' 也保留，
 * 这样消费方仍能用 .md-code-block / .md-blockquote 做样式区分。
 */
function downgradeWrapper(
  node: UnifiedNode,
  config: PlatformAdapterConfig,
  cls: string
): UnifiedNode {
  const mappedChildren: UnifiedNode[] = [];
  for (const c of node.children ?? []) {
    const m = mapNode(c, config);
    if (m) mappedChildren.push(m);
  }
  const result: UnifiedNode = { name: 'div', attrs: { class: cls } };
  if (mappedChildren.length) result.children = mappedChildren;
  if (node.animate) result.animate = node.animate;
  return result;
}

/**
 * 不支持 <table> 的平台：把表格扁平化为 div 结构。
 *   <table>  → <div class="md-table">
 *     <thead> → <div class="md-thead">
 *       <tr>   → <div class="md-tr">
 *         <th>  → <div class="md-th">
 *     <tbody> → <div class="md-tbody">
 *       <tr>   → <div class="md-tr">
 *         <td>  → <div class="md-td">
 */
function flattenTable(table: UnifiedNode, config: PlatformAdapterConfig): UnifiedNode {
  const sections: UnifiedNode[] = [];

  for (const section of table.children ?? []) {
    const sectionClass =
      section.name === 'thead' ? 'md-thead' : section.name === 'tbody' ? 'md-tbody' : 'md-table-body';
    const rows: UnifiedNode[] = [];
    for (const row of section.children ?? []) {
      if (row.name !== 'tr') continue;
      const cells: UnifiedNode[] = [];
      for (const cell of row.children ?? []) {
        const cellClass = cell.name === 'th' ? 'md-th' : 'md-td';
        const innerChildren: UnifiedNode[] = [];
        for (const c of cell.children ?? []) {
          const m = mapNode(c, config);
          if (m) innerChildren.push(m);
        }
        const cellNode: UnifiedNode = { name: 'div', attrs: { class: cellClass } };
        if (innerChildren.length) cellNode.children = innerChildren;
        cells.push(cellNode);
      }
      rows.push({ name: 'div', attrs: { class: 'md-tr' }, children: cells });
    }
    if (rows.length) {
      sections.push({ name: 'div', attrs: { class: sectionClass }, children: rows });
    }
  }

  return { name: 'div', attrs: { class: 'md-table' }, children: sections };
}
