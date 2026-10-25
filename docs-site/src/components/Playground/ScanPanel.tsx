import React from 'react';

type DemoPlatform = 'alipay' | 'wechat';

interface Copy {
  alipayUnavailable: string;
  alipayHint: string;
  wechatComingSoon: string;
  wechatHint: string;
}

const COPY: Record<'zh' | 'en', Copy> = {
  zh: {
    alipayUnavailable: '维护中',
    alipayHint: '支付宝真机预览暂不可用',
    wechatComingSoon: '申请中',
    wechatHint: '微信 AppID 审核中，即将开放',
  },
  en: {
    alipayUnavailable: 'Unavailable',
    alipayHint: 'Alipay on-device preview is temporarily unavailable',
    wechatComingSoon: 'Coming soon',
    wechatHint: 'WeChat AppID under review — opening soon',
  },
};

export interface ScanPopoverProps {
  platform: DemoPlatform;
  isEn?: boolean;
}

/**
 * Device-preview status revealed on hover / keyboard-focus of a Playground
 * platform tab. Neither platform currently has a live public mini-program
 * entry, so render an explicit locked state instead of a dead QR. The status is
 * announced via aria text (role `tooltip` + `aria-label`), never by color alone.
 */
export default function ScanPopover({ platform, isEn }: ScanPopoverProps) {
  const t = COPY[isEn ? 'en' : 'zh'];
  const isWechat = platform === 'wechat';
  const hint = isWechat ? t.wechatHint : t.alipayHint;
  const badge = isWechat ? t.wechatComingSoon : t.alipayUnavailable;

  return (
    <div className="xmd-scan-pop is-locked" role="tooltip" aria-label={hint}>
      <div className="xmd-scan-qr">
        <div className="xmd-scan-placeholder" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
            <rect
              x="5"
              y="10.5"
              width="14"
              height="9.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="xmd-scan-badge">{badge}</span>
      </div>
      <p className="xmd-scan-hint">{hint}</p>
    </div>
  );
}
