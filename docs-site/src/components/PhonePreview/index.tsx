import React, { useMemo } from 'react';
import { runPipeline, adaptToPlatform } from '@ant-design/x-markdown-mini';
import { nodesToHTML } from '../../utils/nodesToHTML';
import './index.less';

export type PreviewPlatform = 'wechat' | 'alipay';

const PLATFORM_LABEL: Record<PreviewPlatform, string> = {
  wechat: '微信',
  alipay: '支付宝',
};

export interface PhoneSection {
  title?: string;
  markdown: string;
  animation?: boolean;
}

export interface PhonePreviewProps {
  platform: PreviewPlatform;
  /** 单段 markdown：等价于 sections=[{ markdown }] */
  markdown?: string;
  /** 多段：每段一个标题 + 一段 md */
  sections?: PhoneSection[];
  /** 顶部状态栏标题，默认显示当前平台名 */
  navTitle?: string;
  className?: string;
}

function renderMarkdown(markdown: string, platform: PreviewPlatform, animation = false): string {
  try {
    const ir = runPipeline(markdown, { animation, selectable: true });
    const adapted = adaptToPlatform(ir, platform);
    return nodesToHTML(adapted as any);
  } catch (e) {
    return `<p class="xmd-preview-error">渲染失败：${String(e)}</p>`;
  }
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  platform,
  markdown,
  sections,
  navTitle,
  className,
}) => {
  const innerHTML = useMemo(() => {
    if (sections && sections.length > 0) {
      return sections
        .map((s) => {
          const body = renderMarkdown(s.markdown, platform, s.animation);
          if (!s.title) return `<div class="xmd-phone-section-body">${body}</div>`;
          return `<section class="xmd-phone-section">
            <h4 class="xmd-phone-section-title">${s.title}</h4>
            <div class="xmd-phone-section-body">${body}</div>
          </section>`;
        })
        .join('');
    }
    if (markdown) return renderMarkdown(markdown, platform);
    return '';
  }, [platform, markdown, sections]);

  return (
    <div className={`xmd-phone xmd-phone--${platform} ${className ?? ''}`} data-platform={platform}>
      <div className="xmd-phone-bezel">
        <div className="xmd-phone-notch" aria-hidden />
        <div className="xmd-phone-frame">
          <div className="xmd-phone-statusbar" aria-hidden>
            <span className="xmd-sb-time">9:41</span>
            <span className="xmd-sb-icons">
              <span className="xmd-sb-signal" />
              <span className="xmd-sb-wifi" />
              <span className="xmd-sb-battery" />
            </span>
          </div>
          <div className="xmd-phone-navbar">
            <span className="xmd-nav-back" aria-hidden>
              ‹
            </span>
            <span className="xmd-nav-title">{navTitle ?? PLATFORM_LABEL[platform]}</span>
            <span className="xmd-nav-more" aria-hidden>
              ···
            </span>
          </div>
          <div
            className="xmd-phone-screen"
            dangerouslySetInnerHTML={{ __html: innerHTML }}
          />
          <div className="xmd-phone-home-indicator" aria-hidden />
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
