import React from 'react';
import {
  PhonePreview,
  type PhoneRenderOptions,
  type PhoneSection,
  type PreviewPlatform,
} from '../PhonePreview';
import { DemoCode, type DemoFile, type PlatformCode } from '../DemoCode';
import { useDocPlatform } from '../useDocPlatform';
import './index.less';

const PLATFORM_LABEL: Record<PreviewPlatform, string> = {
  alipay: '支付宝',
  wechat: '微信',
};

const PLATFORMS: PreviewPlatform[] = ['alipay', 'wechat'];

export interface DemoCardProps extends PhoneRenderOptions {
  markdown?: string;
  /** 多段预览：每段一个标题 + 一段 md */
  sections?: PhoneSection[];
  animation?: boolean;
  defaultPlatform?: PreviewPlatform;
  navTitle?: string;
  alipay?: PlatformCode;
  wechat?: PlatformCode;
  /** 平台无关代码（TS / Markdown 输入），优先于 alipay / wechat */
  files?: DemoFile[];
}

export const DemoCard: React.FC<DemoCardProps> = ({
  markdown,
  sections,
  animation,
  navTitle,
  alipay,
  wechat,
  files,
  extensions,
  components,
  gfm,
  breaks,
  streamingTail,
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
          navTitle={navTitle}
          markdown={sections ? undefined : markdown}
          sections={sections ?? (markdown ? [{ markdown, animation }] : undefined)}
          extensions={extensions}
          components={components}
          gfm={gfm}
          breaks={breaks}
          streamingTail={streamingTail}
        />
      </div>
      <div className="xmd-demo-card-code">
        <DemoCode alipay={alipay} wechat={wechat} files={files} />
      </div>
    </div>
  );
};

export default DemoCard;
