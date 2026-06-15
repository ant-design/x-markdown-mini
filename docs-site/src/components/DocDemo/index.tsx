import React, { useMemo, useState } from 'react';
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

export interface DocDemoItem extends PhoneRenderOptions {
  key: string;
  title: string;
  description?: string;
  navTitle?: string;
  previewTitle?: string;
  platformNotes?: Partial<Record<PreviewPlatform, string>>;
  markdown?: string;
  sections?: PhoneSection[];
  animation?: boolean;
  alipay?: PlatformCode;
  wechat?: PlatformCode;
  files?: DemoFile[];
  defaultFile?: string;
}

export interface DocDemoProps {
  demos: DocDemoItem[];
  codeMinHeight?: number | string;
  codeMaxHeight?: number | string;
}

export const DocDemo: React.FC<DocDemoProps> = ({ demos, codeMinHeight, codeMaxHeight }) => {
  const [platform] = useDocPlatform();
  const [activeKey, setActiveKey] = useState(demos[0]?.key ?? '');
  const isEnglish =
    typeof window !== 'undefined' &&
    (window.location.pathname.endsWith('-en') ||
      document.documentElement.lang.toLowerCase().startsWith('en'));
  const copy = {
    tablist: isEnglish ? 'Switch demo' : '切换示例',
    preview: isEnglish ? 'Mini-program preview' : '小程序预览',
    previewFallback: isEnglish ? 'Live preview' : '真机预览',
    introduce: isEnglish ? 'Introduce' : '引入',
    codeSample: isEnglish ? 'Code sample' : '代码示例',
    register: isEnglish ? (
      <>
        Register the component in <code>index.json</code>:
      </>
    ) : (
      <>
        在 <code>index.json</code> 中注册组件：
      </>
    ),
    demoCode: isEnglish ? 'Demo Code' : 'Demo Code',
  };

  const active = useMemo(
    () => demos.find((demo) => demo.key === activeKey) ?? demos[0],
    [activeKey, demos],
  );

  if (!active) return null;

  return (
    <div className="xmd-doc-demo">
      <div className="xmd-doc-demo-main">
        {demos.length > 1 ? (
          <div className="xmd-doc-demo-tabs" role="tablist" aria-label={copy.tablist}>
            {demos.map((demo) => (
              <button
                key={demo.key}
                type="button"
                className={`xmd-doc-demo-tab ${demo.key === active.key ? 'is-active' : ''}`}
                onClick={() => setActiveKey(demo.key)}
                role="tab"
                aria-selected={demo.key === active.key}
              >
                {demo.title}
              </button>
            ))}
          </div>
        ) : null}
        {active.alipay || active.wechat ? (
          <section className="xmd-doc-demo-section">
            <h2 className="xmd-doc-demo-section-label">{copy.introduce}</h2>
            <p className="xmd-doc-demo-desc">{copy.register}</p>
            <DemoCode
              key={`intro-${active.key}-${platform}`}
              alipay={active.alipay}
              wechat={active.wechat}
              pick={['json']}
              collapsible={false}
            />
          </section>
        ) : null}

        {active.alipay || active.wechat ? (
          <section className="xmd-doc-demo-section">
            <h2 className="xmd-doc-demo-section-label">{copy.codeSample}</h2>
            {active.description ? (
              <p className="xmd-doc-demo-desc">{active.description}</p>
            ) : null}
            <DemoCode
              key={`usage-${active.key}-${platform}`}
              alipay={active.alipay}
              wechat={active.wechat}
              pick={['template', 'script']}
              collapsible={false}
            />
            <DemoCode
              key={`full-${active.key}-${platform}`}
              alipay={active.alipay}
              wechat={active.wechat}
              files={active.files}
              defaultFile={active.defaultFile}
              title={copy.demoCode}
              defaultCollapsed
              minHeight={codeMinHeight}
              maxHeight={codeMaxHeight}
            />
          </section>
        ) : null}
      </div>
      <aside className="xmd-doc-demo-preview" aria-label={copy.preview}>
        <div className="xmd-doc-demo-preview-head">
          <span className="xmd-doc-demo-preview-title">
            {active.previewTitle ?? active.navTitle ?? copy.previewFallback}
          </span>
          <span className="xmd-doc-demo-preview-platform" data-platform={platform}>
            {PLATFORM_LABEL[platform]}
          </span>
        </div>
        {active.platformNotes?.[platform] ? (
          <span className="xmd-doc-demo-preview-note">{active.platformNotes[platform]}</span>
        ) : null}
        <PhonePreview
          platform={platform}
          navTitle={active.navTitle}
          markdown={active.sections ? undefined : active.markdown}
          sections={
            active.sections ??
            (active.markdown ? [{ markdown: active.markdown, animation: active.animation }] : undefined)
          }
          extensions={active.extensions}
          components={active.components}
          gfm={active.gfm}
          breaks={active.breaks}
          streamingTail={active.streamingTail}
        />
      </aside>
    </div>
  );
};

export default DocDemo;
