import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

type DemoPlatform = 'alipay' | 'wechat';

// Alipay demo mini-program entry. Encoded into the QR so a phone scan opens the
// preview on-device. Swap this for the final Alipay schema / short-link once the
// demo mini-program ships; the QR regenerates automatically.
const ALIPAY_DEMO_URL = 'https://render.alipay.com/p/s/x-markdown-mini-demo';

interface Copy {
  alipayHint: string;
  wechatComingSoon: string;
  wechatHint: string;
}

const COPY: Record<'zh' | 'en', Copy> = {
  zh: {
    alipayHint: '用支付宝扫一扫，真机预览',
    wechatComingSoon: '申请中',
    wechatHint: '微信 AppID 审核中，即将开放',
  },
  en: {
    alipayHint: 'Scan with Alipay to preview on device',
    wechatComingSoon: 'Coming soon',
    wechatHint: 'WeChat AppID under review — opening soon',
  },
};

export interface ScanPopoverProps {
  platform: DemoPlatform;
  isEn?: boolean;
}

/**
 * QR revealed on hover / keyboard-focus of a Playground platform tab. Alipay is
 * live (a real QR to the demo mini-program); WeChat is a deliberate placeholder
 * — the AppID is still under review, so it renders locked with a "Coming soon"
 * state rather than a dead QR. The state is announced via aria text (role
 * `tooltip` + `aria-label`), never by color alone, per the AA target.
 */
export default function ScanPopover({ platform, isEn }: ScanPopoverProps) {
  const t = COPY[isEn ? 'en' : 'zh'];

  if (platform === 'wechat') {
    return (
      <div className="xmd-scan-pop is-locked" role="tooltip" aria-label={t.wechatHint}>
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
          <span className="xmd-scan-badge">{t.wechatComingSoon}</span>
        </div>
        <p className="xmd-scan-hint">{t.wechatHint}</p>
      </div>
    );
  }

  return (
    <div className="xmd-scan-pop" role="tooltip" aria-label={t.alipayHint}>
      <div className="xmd-scan-qr">
        <QRCodeSVG
          value={ALIPAY_DEMO_URL}
          size={120}
          level="M"
          bgColor="#ffffff"
          fgColor="#171717"
          marginSize={0}
        />
      </div>
      <p className="xmd-scan-hint">{t.alipayHint}</p>
    </div>
  );
}
