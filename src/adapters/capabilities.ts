import type { Platform } from '../platform.js';

export interface PlatformCapabilities {
  /** <pre> 标签是否被 rich-text 支持 */
  preSupported: boolean;
  /** <table> 标签是否被 rich-text 支持 */
  tableSupported: boolean;
  /** <blockquote> 标签是否被 rich-text 支持 */
  blockquoteSupported: boolean;
  /** <ol start="N"> 的 start 属性是否支持 */
  olStartSupported: boolean;
  /** 图片 src 是否强制 HTTPS */
  httpsOnlyImages: boolean;
  /** <video> 标签是否被 rich-text 支持 */
  videoSupported: boolean;
}

/** 平台适配配置：能力矩阵 + 平台特殊处理。 */
export interface PlatformAdapterConfig {
  caps: PlatformCapabilities;
  /**
   * 内部节点 class 处理：
   * - 'strip': 删除全部 class（多数小程序 rich-text 忽略内部 class）
   * - 'preserve': 保留 class
   * 默认 'strip'。
   */
  classMode?: 'strip' | 'preserve';
  /**
   * 是否将 <a href> 重写为 <a data-href>。
   * 微信 rich-text 不会自动响应 <a> 跳转，需要消费方拦截 tap 事件。
   */
  rewriteAnchorHref?: boolean;
}

export const PLATFORM_CAPABILITIES: Record<Platform, PlatformCapabilities> = {
  wechat: {
    preSupported: true,
    tableSupported: true,
    blockquoteSupported: true,
    olStartSupported: true,
    httpsOnlyImages: false,
    videoSupported: false,
  },
  alipay: {
    preSupported: true,
    tableSupported: true,
    blockquoteSupported: true,
    olStartSupported: false,
    httpsOnlyImages: true,
    videoSupported: false,
  },
};

export const PLATFORM_ADAPTER_CONFIG: Record<Platform, PlatformAdapterConfig> = {
  wechat: { caps: PLATFORM_CAPABILITIES.wechat, classMode: 'strip', rewriteAnchorHref: true },
  alipay: { caps: PLATFORM_CAPABILITIES.alipay, classMode: 'strip' },
};
