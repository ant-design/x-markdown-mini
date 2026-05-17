import { describe, it, expect } from 'vitest';
import { toWechatNodes } from '../adapters/wechat.js';
import { toAlipayNodes } from '../adapters/alipay.js';
import { adaptToPlatform } from '../adapters/index.js';
import { PLATFORM_CAPABILITIES } from '../adapters/capabilities.js';
import type { UnifiedNode, Platform } from '../types.js';

// --- Helpers ---

/** Collect all nodes in tree (BFS) */
function flattenNodes(nodes: UnifiedNode[]): UnifiedNode[] {
  const result: UnifiedNode[] = [];
  const queue = [...nodes];
  while (queue.length) {
    const n = queue.shift()!;
    result.push(n);
    if (n.children) queue.push(...n.children);
  }
  return result;
}

/** Check no node in array has an attribute */
function noneHasAttr(nodes: UnifiedNode[], attr: string): boolean {
  return flattenNodes(nodes).every((n) => !(attr in (n.attrs ?? {})));
}

// --- WeChat ---

describe('toWechatNodes', () => {
  it('removes selectable from all nodes', () => {
    const input: UnifiedNode[] = [
      {
        name: 'p',
        attrs: { selectable: true, class: 'md-paragraph' },
        children: [{ name: 'text', attrs: { value: 'hello', selectable: true } }],
      },
    ];
    const result = toWechatNodes(input);
    expect(noneHasAttr(result, 'selectable')).toBe(true);
  });

  it('removes class from all nodes except links', () => {
    const input: UnifiedNode[] = [
      {
        name: 'p',
        attrs: { class: 'md-paragraph' },
        children: [{ name: 'text', attrs: { value: 'hello', class: 'md-text' } }],
      },
    ];
    const result = toWechatNodes(input);
    expect(noneHasAttr(result, 'class')).toBe(true);
  });

  it('converts <a href> to <a data-href> with md-link class', () => {
    const input: UnifiedNode[] = [
      {
        name: 'p',
        attrs: {},
        children: [
          { name: 'a', attrs: { href: 'https://example.com' }, children: [{ name: 'text', attrs: { value: 'link' } }] },
        ],
      },
    ];
    const result = toWechatNodes(input);
    const aNode = flattenNodes(result).find((n) => n.name === 'a')!;
    expect(aNode).toBeDefined();
    expect(aNode.attrs?.['data-href']).toBe('https://example.com');
    expect(aNode.attrs?.href).toBeUndefined();
    expect(aNode.attrs?.['class']).toBe('md-link');
  });

  it('preserves pre, table, blockquote, ol start (WeChat supports them)', () => {
    const input: UnifiedNode[] = [
      { name: 'pre', attrs: { class: 'md-code-block' }, children: [{ name: 'code', attrs: {}, children: [{ name: 'text', attrs: { value: 'code' } }] }] },
      { name: 'table', attrs: { class: 'md-table' }, children: [{ name: 'thead', attrs: {}, children: [{ name: 'tr', attrs: {}, children: [{ name: 'th', attrs: {}, children: [] }] }] }] },
      { name: 'blockquote', attrs: { class: 'md-blockquote' }, children: [] },
      { name: 'ol', attrs: { start: 3, class: 'md-list' }, children: [] },
    ];
    const result = toWechatNodes(input);
    const flat = flattenNodes(result);
    expect(flat.some((n) => n.name === 'pre')).toBe(true);
    expect(flat.some((n) => n.name === 'table')).toBe(true);
    expect(flat.some((n) => n.name === 'blockquote')).toBe(true);
    const ol = flat.find((n) => n.name === 'ol')!;
    expect(ol.attrs?.start).toBe(3);
  });
});

// --- Alipay ---

describe('toAlipayNodes', () => {
  it('removes selectable and class from all nodes', () => {
    const input: UnifiedNode[] = [
      {
        name: 'p',
        attrs: { selectable: true, class: 'md-paragraph' },
        children: [{ name: 'text', attrs: { value: 'hello', class: 'md-text' } }],
      },
    ];
    const result = toAlipayNodes(input);
    expect(noneHasAttr(result, 'selectable')).toBe(true);
    expect(noneHasAttr(result, 'class')).toBe(true);
  });

  it('removes start attribute from <ol>', () => {
    const input: UnifiedNode[] = [
      { name: 'ol', attrs: { start: 5, class: 'md-list' }, children: [] },
    ];
    const result = toAlipayNodes(input);
    const ol = result[0];
    expect(ol.attrs?.start).toBeUndefined();
  });

  it('converts http image src to https', () => {
    const input: UnifiedNode[] = [
      { name: 'img', attrs: { src: 'http://example.com/img.png', alt: 'img' }, children: [] },
    ];
    const result = toAlipayNodes(input);
    expect(result[0].attrs?.src).toBe('https://example.com/img.png');
  });

  it('keeps https image src unchanged', () => {
    const input: UnifiedNode[] = [
      { name: 'img', attrs: { src: 'https://example.com/img.png', alt: 'img' }, children: [] },
    ];
    const result = toAlipayNodes(input);
    expect(result[0].attrs?.src).toBe('https://example.com/img.png');
  });
});

// --- Platform routing ---

describe('adaptToPlatform', () => {
  it('routes wechat to WeChat adapter', () => {
    const input: UnifiedNode[] = [
      { name: 'a', attrs: { href: 'https://example.com' }, children: [] },
    ];
    const result = adaptToPlatform(input, 'wechat');
    expect(result[0].attrs?.['data-href']).toBe('https://example.com');
    expect(result[0].attrs?.href).toBeUndefined();
  });

  it('routes alipay to Alipay adapter', () => {
    const input: UnifiedNode[] = [
      { name: 'ol', attrs: { start: 3 }, children: [] },
    ];
    const result = adaptToPlatform(input, 'alipay');
    expect(result[0].attrs?.start).toBeUndefined();
  });
});

// --- Capabilities data ---

describe('PLATFORM_CAPABILITIES', () => {
  it('covers all Platform types', () => {
    const platforms: Platform[] = ['wechat', 'alipay'];
    for (const p of platforms) {
      expect(PLATFORM_CAPABILITIES[p]).toBeDefined();
    }
  });

  it('has correct values for key platforms', () => {
    expect(PLATFORM_CAPABILITIES.wechat.preSupported).toBe(true);
    expect(PLATFORM_CAPABILITIES.alipay.olStartSupported).toBe(false);
    expect(PLATFORM_CAPABILITIES.alipay.httpsOnlyImages).toBe(true);
  });
});