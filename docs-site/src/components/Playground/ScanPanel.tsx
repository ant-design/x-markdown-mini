import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

type DemoPlatform = 'alipay' | 'wechat';

// Alipay demo mini-program entry. Encoded into the QR so a phone scan opens the
// preview on-device. Swap this for the final Alipay schema / short-link once the
// demo mini-program ships; the QR regenerates automatically.
const ALIPAY_DEMO_URL = 'https://render.alipay.com/p/s/x-markdown-mini-demo';

interface Copy {
  heading: string;
  alipayLabel: string;
  alipayHint: string;
  wechatLabel: string;
  wechatComingSoon: string;
  wechatHint: string;
}

const COPY: Record<'zh' | 'en', Copy> = {
  zh: {
    heading: '扫码真机预览',
    alipayLabel: '支付宝',
    alipayHint: '用支付宝扫一扫，在真机查看渲染效果',
    wechatLabel: '微信',
    wechatComingSoon: '申请中',
    wechatHint: '微信 AppID 审核中，即将开放',
  },
  en: {
    heading: 'Scan to preview on device',
    alipayLabel: 'Alipay',
    alipayHint: 'Scan with Alipay to view rendering on a real device',
    wechatLabel: 'WeChat',
    wechatComingSoon: 'Coming soon',
    wechatHint: 'WeChat AppID under review — opening soon',
  },
};

interface ScanPanelProps {
  platform: DemoPlatform;
}

/**
 * Scan-to-device entry for the Playground. Alipay is live (a real QR to the demo
 * mini-program). WeChat is a deliberate placeholder: the AppID is still under
 * review, so its tile renders locked with a "Coming soon" state rather than a
 * dead QR. The lock is keyboard-reachable and announced via aria (not color
 * alone), per the AA target.
 *
 * The panel reflects the currently-selected preview platform: the active one is
 * emphasized, the other is dimmed — so the QR you see matches the phone above.
 */
export default function ScanPanel({ platform }: ScanPanelProps) {
  const [isEn, setIsEn] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') setIsEn(window.location.pathname.includes('-en'));
  }, []);
  const t = COPY[isEn ? 'en' : 'zh'];

  return (
    <div className="xmd-scan" role="group" aria-label={t.heading}>
      <span className="xmd-scan-heading">{t.heading}</span>
      <div className="xmd-scan-codes">
        {/* Alipay — live */}
        <figure
          className={`xmd-scan-code ${platform === 'alipay' ? 'is-active' : ''}`}
          data-platform="alipay"
        >
          <div className="xmd-scan-qr">
            <QRCodeSVG
              value={ALIPAY_DEMO_URL}
              size={112}
              level="M"
              bgColor="#ffffff"
              fgColor="#171717"
              marginSize={0}
            />
          </div>
          <figcaption className="xmd-scan-caption">
            <img
              className="xmd-scan-icon"
              src="/brand/alipay-icon.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            <span className="xmd-scan-name">{t.alipayLabel}</span>
          </figcaption>
          <p className="xmd-scan-hint">{t.alipayHint}</p>
        </figure>

        {/* WeChat — placeholder (AppID under review) */}
        <figure
          className={`xmd-scan-code is-locked ${platform === 'wechat' ? 'is-active' : ''}`}
          data-platform="wechat"
          aria-disabled="true"
        >
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
          <figcaption className="xmd-scan-caption">
            <img
              className="xmd-scan-icon"
              src="/brand/wechat-icon.png"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
            <span className="xmd-scan-name">{t.wechatLabel}</span>
          </figcaption>
          <p className="xmd-scan-hint">{t.wechatHint}</p>
        </figure>
      </div>
    </div>
  );
}
