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

export interface PhoneShellProps {
  platform: PreviewPlatform;
  /** 顶部导航标题，默认显示当前平台名 */
  navTitle?: string;
  className?: string;
  /** 屏幕区域的 React 内容（Playground / 首页自动播放走这条路径） */
  children?: React.ReactNode;
  /** 屏幕区域的原始 HTML（PhonePreview 注入渲染结果走这条路径）。children 存在时忽略。 */
  screenHTML?: string;
  onScreenClick?: React.MouseEventHandler<HTMLDivElement>;
  /** 左上「‹」返回的链接；传入后渲染为可点击链接（回到首页），否则为装饰。 */
  backHref?: string;
  /** 右上「···」的链接；传入后渲染为可点击链接（查看其他文档 demo），否则为装饰。 */
  moreHref?: string;
  /** 标题居中展示（首页用）；默认左对齐（Playground / 文档内嵌 demo 用）。 */
  centerTitle?: boolean;
  /** 标题前的图标图片地址；传入后用该 logo 取代默认的平台徽标（支/微）。 */
  titleLogo?: string;
}

/**
 * 纯展示型「手机外壳」：iPhone 刘海机型边框 + 状态栏 + 导航栏 + 可滚动屏幕。
 * PhonePreview（注入 HTML）、Playground 与首页自动播放（注入 React 节点）共用同一套外壳，
 * 状态栏对齐刘海「耳朵」的几何也只在这里维护一次。
 */
export const PhoneShell: React.FC<PhoneShellProps> = ({
  platform,
  navTitle,
  className,
  backHref,
  moreHref,
  centerTitle,
  titleLogo,
  children,
  screenHTML,
  onScreenClick,
}) => {
  const useHTML = screenHTML != null && children == null;
  return (
    <div className={`xmd-phone xmd-phone--${platform} ${className ?? ''}`} data-platform={platform}>
      <div className="xmd-phone-bezel">
        <div className="xmd-phone-notch" aria-hidden />
        <div className="xmd-phone-frame">
          <div className="xmd-phone-statusbar" aria-hidden>
            <span className="xmd-sb-time">9:41</span>
            <span className="xmd-sb-icons">
              <span className="xmd-sb-battery-pct">100%</span>
              <span className="xmd-sb-battery">
                <span className="xmd-sb-battery-level" />
              </span>
            </span>
          </div>
          <div className={`xmd-phone-navbar${centerTitle ? ' is-center' : ''}`}>
            {/* 首页（centerTitle）是纯品牌头，去掉左 ‹ / 右 ··· 装饰图标 */}
            {!centerTitle &&
              (backHref ? (
                <a className="xmd-nav-back" href={backHref} aria-label="返回首页">
                  ‹
                </a>
              ) : (
                <span className="xmd-nav-back" aria-hidden>
                  ‹
                </span>
              ))}
            <span className={`xmd-nav-title${titleLogo ? ' xmd-nav-title--logo' : ''}`}>
              {titleLogo ? (
                <img className="xmd-nav-logo" src={titleLogo} alt="" aria-hidden />
              ) : null}
              {navTitle ?? PLATFORM_LABEL[platform]}
            </span>
            {!centerTitle &&
              (moreHref ? (
                <a className="xmd-nav-more" href={moreHref} aria-label="查看更多示例">
                  ···
                </a>
              ) : (
                <span className="xmd-nav-more" aria-hidden>
                  ···
                </span>
              ))}
          </div>
          {useHTML ? (
            <div
              className="xmd-phone-screen"
              onClick={onScreenClick}
              dangerouslySetInnerHTML={{ __html: screenHTML as string }}
            />
          ) : (
            <div className="xmd-phone-screen" onClick={onScreenClick}>
              {children}
            </div>
          )}
          <div className="xmd-phone-home-indicator" aria-hidden />
        </div>
      </div>
    </div>
  );
};

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

  // The screen is injected via dangerouslySetInnerHTML, so the copy buttons in
  // node.header have no React handler — delegate clicks here and copy data-copy.
  const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as HTMLElement).closest('.md-copy-btn');
    if (!btn) return;
    const payload = btn.getAttribute('data-copy') || '';
    if (!payload) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(payload).catch(() => {
        /* clipboard can be blocked in embedded previews */
      });
    }
    btn.setAttribute('data-copied', 'true');
    window.setTimeout(() => btn.removeAttribute('data-copied'), 1200);
  };

  return (
    <PhoneShell
      platform={platform}
      navTitle={navTitle ?? PLATFORM_LABEL[platform]}
      className={className}
      screenHTML={innerHTML}
      onScreenClick={handleCopyClick}
    />
  );
};

export default PhonePreview;
