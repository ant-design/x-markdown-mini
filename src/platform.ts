/**
 * 平台类型与运行时识别。
 *
 * 当前仅支持支付宝（alipay）与微信（wechat）小程序，未识别时回退到 alipay。
 * 拓展新平台时按以下步骤：
 *   1. 在下方 {@link Platform} 联合类型中追加新值；
 *   2. 在 {@link DETECTORS} 中追加一项 `{ name, read, platform }`；
 *   3. 在 `adapters/capabilities.ts` 中补充能力矩阵与适配配置；
 *   4. （可选）在 `adapters/` 下提供专门的转换器。
 *
 * 注意：检测使用 `typeof X` 而非读取 `globalThis[X]`，因为旧版支付宝基础库
 * 没有 `globalThis`；而 `typeof` 对未声明的标识符不会抛 ReferenceError。
 */

export type Platform = 'wechat' | 'alipay';

export type PlatformInput = Platform | 'auto';

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
const LOG_PREFIX = '[x-markdown-mini/platform]';

function isRuntimeObject(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const target = obj as Record<string, unknown>;
  return (
    typeof target.getSystemInfo === 'function' ||
    typeof target.getSystemInfoSync === 'function'
  );
}

function detectPlatformRuntime(): Platform {
  for (const { name, read, platform } of DETECTORS) {
    let obj: unknown;
    try {
      obj = read();
    } catch {
      continue;
    }
    if (isRuntimeObject(obj)) {
      console.log(`${LOG_PREFIX} detected: ${platform} (runtime: ${name})`);
      return platform;
    }
  }
  console.log(
    `${LOG_PREFIX} no runtime detected, fallback: ${DEFAULT_PLATFORM}`,
  );
  return DEFAULT_PLATFORM;
}

export function resolvePlatform(platform?: PlatformInput): Platform {
  if (!platform || platform === 'auto') return detectPlatformRuntime();
  return platform;
}
