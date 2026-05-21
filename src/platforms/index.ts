import { alipayRenderer } from './alipay/index.js';
import { wechatRenderer } from './wechat/index.js';
import type { Platform, PlatformInput, PlatformRenderer } from './types.js';

/**
 * 平台类型、运行时识别与 renderer 注册。
 *
 * 当前仅支持支付宝（alipay）与微信（wechat）小程序，未识别时回退到 alipay。
 * 拓展新平台时按以下步骤：
 *   1. 在 `src/platforms/types.ts` 的 Platform 联合类型中追加新值；
 *   2. 在下方 DETECTORS 中追加一项 `{ name, read, platform }`；
 *   3. 复制 `wechat/` 为新平台目录，按平台 quirks
 *      调整 `<a>` / `<ol start>` / `<img src>` 等几处分支；
 *   4. 在下方 RENDERERS 中注册平台 renderer。
 *
 * 注意：检测使用 `typeof X` 而非读取 `globalThis[X]`，因为旧版支付宝基础库
 * 没有 `globalThis`；而 `typeof` 对未声明的标识符不会抛 ReferenceError。
 */

declare const my: unknown;
declare const wx: unknown;

interface Detector {
  /** 运行时全局变量名，仅用于日志 */
  name: string;
  /** 读取运行时全局对象；未定义时返回 undefined（不抛错） */
  read: () => unknown;
  platform: Platform;
}

const DETECTORS: ReadonlyArray<Detector> = [
  {
    name: 'my',
    read: () => (typeof my !== 'undefined' ? my : undefined),
    platform: 'alipay',
  },
  {
    name: 'wx',
    read: () => (typeof wx !== 'undefined' ? wx : undefined),
    platform: 'wechat',
  },
];

const DEFAULT_PLATFORM: Platform = 'alipay';

const RENDERERS: Record<Platform, PlatformRenderer> = {
  alipay: alipayRenderer,
  wechat: wechatRenderer,
};

function isRuntimeObject(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const target = obj as Record<string, unknown>;
  return (
    typeof target.getSystemInfo === 'function' ||
    typeof target.getSystemInfoSync === 'function'
  );
}

function detectPlatformRuntime(): Platform {
  for (const { read, platform } of DETECTORS) {
    let obj: unknown;
    try {
      obj = read();
    } catch {
      continue;
    }
    if (isRuntimeObject(obj)) {
      return platform;
    }
  }
  return DEFAULT_PLATFORM;
}

export function resolvePlatform(platform?: PlatformInput): Platform {
  if (!platform || platform === 'auto') return detectPlatformRuntime();
  return platform;
}

export function getPlatformRenderer(platform: Platform): PlatformRenderer {
  return RENDERERS[platform];
}

export { alipayRenderer } from './alipay/index.js';
export { tokensToAlipay, tokensToAlipayNodes } from './alipay/tokensToAlipay.js';
export { tokensToWechat, tokensToWechatNodes } from './wechat/tokensToWechat.js';
export { wechatRenderer } from './wechat/index.js';
export type {
  Platform,
  PlatformCapabilities,
  PlatformInput,
  PlatformRenderer,
} from './types.js';
