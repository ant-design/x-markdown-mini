import type { Platform } from '../platform.js';
import { alipayRenderer } from './alipay.js';
import { wechatRenderer } from './wechat.js';
import type { PlatformRenderer } from './types.js';

const RENDERERS: Record<Platform, PlatformRenderer> = {
  alipay: alipayRenderer,
  wechat: wechatRenderer,
};

export function getPlatformRenderer(platform: Platform): PlatformRenderer {
  return RENDERERS[platform];
}

export { alipayRenderer } from './alipay.js';
export { wechatRenderer } from './wechat.js';
export type { PlatformRenderer, PlatformCapabilities } from './types.js';
