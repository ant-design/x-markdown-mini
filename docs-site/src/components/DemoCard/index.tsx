import React from 'react';
import { PhonePreview, type PreviewPlatform } from '../PhonePreview';
import { DemoCode, type PlatformCode } from '../DemoCode';
import './index.less';

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
  const [platform, setPlatform] = React.useState<PreviewPlatform>(defaultPlatform);

  return (
    <div className="xmd-demo-card">
      <div className="xmd-demo-card-preview">
        <div className="xmd-demo-card-platforms" role="tablist">
          {(['alipay', 'wechat'] as PreviewPlatform[]).map((p) => (
            <button
              key={p}
              type="button"
              className={`xmd-demo-card-platform ${p === platform ? 'is-active' : ''}`}
              onClick={() => setPlatform(p)}
            >
              {p === 'alipay' ? '支付宝' : '微信'}
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
