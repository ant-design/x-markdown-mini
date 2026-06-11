import React, { useMemo } from 'react';
import {
  XMarkdownMini,
  renderNodes,
  type MarkedExtension,
  type MiniNode,
  type XMarkdownExtension,
} from '@ant-design/x-markdown-mini';
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

/** 控制预览渲染行为的可选项，与库的真实 API 一一对应 */
export interface PhoneRenderOptions {
  /** 插件列表（CodeHighlight / Latex / Footnote / 自定义） */
  extensions?: (XMarkdownExtension | MarkedExtension)[];
  /** 自定义组件标签白名单（构造级选项，会创建独立实例） */
  components?: string[];
  gfm?: boolean;
  breaks?: boolean;
  /**
   * 把 content 当作「正在流式输出的 tail」渲染：
   * 走 streaming + fixup（remend）路径，未闭合的语法会被临时补全。
   */
  streamingTail?: boolean;
}

export interface PhonePreviewProps extends PhoneRenderOptions {
  platform: PreviewPlatform;
  /** 单段 markdown：等价于 sections=[{ markdown }] */
  markdown?: string;
  /** 多段：每段一个标题 + 一段 md */
  sections?: PhoneSection[];
  /** 顶部状态栏标题，默认显示当前平台名 */
  navTitle?: string;
  className?: string;
}

function renderMarkdown(
  markdown: string,
  platform: PreviewPlatform,
  opts: PhoneRenderOptions,
): string {
  try {
    let nodes: MiniNode[];
    if (opts.streamingTail || opts.components) {
      // 构造级选项 / 流式状态需要独立实例，避免污染共享单例
      const md = new XMarkdownMini({
        extensions: opts.extensions,
        components: opts.components,
      });
      if (opts.streamingTail) {
        let captured: MiniNode[] = [];
        md.renderNodes({
          content: markdown,
          platform,
          selectable: true,
          gfm: opts.gfm,
          breaks: opts.breaks,
          // chunkDelay / charDelay 为 0 时 onPatch 同步触发
          streaming: { hasNextChunk: true, semantic: { chunkDelay: 0, charDelay: 0 } },
          onPatch: (n) => {
            captured = n;
          },
        });
        md.reset();
        nodes = captured;
      } else {
        nodes = md.renderNodes({
          content: markdown,
          platform,
          selectable: true,
          gfm: opts.gfm,
          breaks: opts.breaks,
          streaming: false,
        });
      }
    } else {
      nodes = renderNodes({
        content: markdown,
        platform,
        selectable: true,
        gfm: opts.gfm,
        breaks: opts.breaks,
        extensions: opts.extensions,
        streaming: false,
      });
    }
    return nodesToHTML(nodes as any);
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
  extensions,
  components,
  gfm,
  breaks,
  streamingTail,
}) => {
  const innerHTML = useMemo(() => {
    const opts: PhoneRenderOptions = { extensions, components, gfm, breaks, streamingTail };
    if (sections && sections.length > 0) {
      return sections
        .map((s) => {
          const body = renderMarkdown(s.markdown, platform, opts);
          if (!s.title) return `<div class="xmd-phone-section-body">${body}</div>`;
          return `<section class="xmd-phone-section">
            <h4 class="xmd-phone-section-title">${s.title}</h4>
            <div class="xmd-phone-section-body">${body}</div>
          </section>`;
        })
        .join('');
    }
    if (markdown) return renderMarkdown(markdown, platform, opts);
    return '';
  }, [platform, markdown, sections, extensions, components, gfm, breaks, streamingTail]);

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
