import React from 'react';
import type { PreviewPlatform } from './PhonePreview';

const STORAGE_KEY = 'xmd-doc-platform';
const DEFAULT_PLATFORM: PreviewPlatform = 'alipay';
const PLATFORMS = new Set<PreviewPlatform>(['alipay', 'wechat']);

function readPlatform(): PreviewPlatform {
  if (typeof window === 'undefined') return DEFAULT_PLATFORM;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return PLATFORMS.has(value as PreviewPlatform) ? (value as PreviewPlatform) : DEFAULT_PLATFORM;
}

function writePlatform(platform: PreviewPlatform) {
  window.localStorage.setItem(STORAGE_KEY, platform);
  document.documentElement.setAttribute('data-xmd-doc-platform', platform);
  window.dispatchEvent(new CustomEvent('xmd-platform-change', {
    detail: { platform },
  }));
}

export function useDocPlatform() {
  const [platform, setPlatform] = React.useState<PreviewPlatform>(readPlatform);

  React.useEffect(() => {
    const sync = () => setPlatform(readPlatform());
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync();
    };

    window.addEventListener('xmd-platform-change', sync);
    window.addEventListener('storage', onStorage);
    sync();

    return () => {
      window.removeEventListener('xmd-platform-change', sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setDocPlatform = React.useCallback((p: PreviewPlatform) => {
    writePlatform(p);
    setPlatform(p);
  }, []);

  return [platform, setDocPlatform] as const;
}