import React from 'react';
import { PhonePreview, type PreviewPlatform } from '../PhonePreview';
import { DemoCode, type PlatformCode } from '../DemoCode';
import { useDocPlatform } from '../useDocPlatform';
import './index.less';

const PLATFORM_LABEL: Record<PreviewPlatform, string> = {
  alipay: '支付宝',
  wechat: '微信',
};

const PLATFORMS: PreviewPlatform[] = ['alipay', 'wechat'];

export interface DemoCardProps {
  markdown: string;
  animation?: boolean;
  defaultPlatform?: PreviewPlatform;
  alipay: PlatformCode;
  wechat: PlatformCode;
}

export const DemoCard: React.FC<DemoCardProps> = ({
  markdown,
  animation,
  defaultPlatform = 'alipay',
  alipay,
  wechat,
}) => {
  const [platform, setPlatform] = useDocPlatform();

  return (
    <div className="xmd-demo-card">
      <div className="xmd-demo-card-preview">
        <div className="xmd-demo-platform-switch" role="tablist" aria-label="切换预览平台">
          {PLATFORMS.map((p) => (
            <button
              type="button"
              key={p}
              className={`xmd-demo-platform-btn ${p === platform ? 'is-active' : ''}`}
              onClick={() => setPlatform(p)}
              role="tab"
              aria-selected={p === platform}
            >
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>
        <PhonePreview
          platform={platform}
          sections={[{ markdown, animation }]}
        />
      </div>
      <div className="xmd-demo-card-code">
        <DemoCode alipay={alipay} wechat={wechat} />
      </div>
    </div>
  );
};

export default DemoCard;