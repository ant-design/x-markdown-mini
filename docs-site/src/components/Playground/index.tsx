import React, { useMemo, useState } from 'react';
import {
  getPlatformRenderer,
  renderNodes,
  type MiniNode,
} from '@ant-design/x-markdown-mini';
import { nodesToHTML } from '../../utils/nodesToHTML';
import './index.less';

type DemoPlatform = 'alipay' | 'wechat';

const PLATFORM_LABEL: Record<DemoPlatform, string> = {
  alipay: '支付宝',
  wechat: '微信',
};

const PLATFORMS: DemoPlatform[] = ['alipay', 'wechat'];

const DEFAULT_MARKDOWN = `# x-markdown-mini

多小程序场景下的 **Markdown** 渲染器。

## 特性

- 统一 \`rich-text\` 节点，多端薄适配
- 支持流式、动画、可选文本
- 微信 / 支付宝 等

## 代码示例

\`\`\`js
const nodes = renderNodes({ content: md, platform: 'wechat' });
// <rich-text nodes="{{nodes}}" />
\`\`\`
`;

interface DegradeIssue {
  kind: string;
  label: string;
}

function detectIssues(nodes: MiniNode[], platform: DemoPlatform): DegradeIssue[] {
  const caps = getPlatformRenderer(platform).capabilities;
  let olStartDropped = 0;
  let httpImg = 0;
  let anchorRewritten = 0;

  const walk = (node: MiniNode) => {
    const { name, attrs, children } = node;
    if (
      name === 'ol' &&
      attrs &&
      attrs.start != null &&
      Number(attrs.start) !== 1 &&
      !caps.supportsOlStart
    ) {
      olStartDropped += 1;
    }
    if (
      name === 'img' &&
      attrs &&
      typeof attrs.src === 'string' &&
      /^http:\/\//i.test(attrs.src) &&
      caps.requiresHttpsImage
    ) {
      httpImg += 1;
    }
    if (name === 'a' && attrs && 'data-href' in attrs && platform === 'wechat') {
      anchorRewritten += 1;
    }
    for (const c of children ?? []) walk(c);
  };
  for (const n of nodes) walk(n);

  const issues: DegradeIssue[] = [];
  if (olStartDropped) issues.push({ kind: 'ol-start', label: '<ol start> 不支持，序号从 1 开始' });
  if (httpImg) issues.push({ kind: 'http-image', label: `${httpImg} 张 http 图片改写为 https` });
  if (anchorRewritten) issues.push({ kind: 'anchor', label: '<a href> → data-href，需消费方拦截 tap' });
  return issues;
}

function escapeHtml(s: string): string {
  if (typeof document === 'undefined') return s;
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export interface PlaygroundProps {
  initialMarkdown?: string;
}

export const Playground: React.FC<PlaygroundProps> = ({ initialMarkdown = DEFAULT_MARKDOWN }) => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [platform, setPlatform] = useState<DemoPlatform>('alipay');

  const { html, issues } = useMemo(() => {
    try {
      const nodes = renderNodes({ content: markdown, platform, selectable: true });
      return {
        html: nodesToHTML(nodes as any),
        issues: detectIssues(nodes, platform),
      };
    } catch (e) {
      return {
        html: `<p class="xmd-preview-error">渲染失败：${escapeHtml(String(e))}</p>`,
        issues: [] as DegradeIssue[],
      };
    }
  }, [markdown, platform]);

  return (
    <div className="xmd-pg">
      <aside className="xmd-pg-editor-wrap">
        <label className="xmd-pg-label" htmlFor="xmd-pg-input">
          Markdown
        </label>
        <textarea
          id="xmd-pg-input"
          className="xmd-pg-input"
          spellCheck={false}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="输入 Markdown，右侧实时预览…"
        />
      </aside>

      <div className="xmd-pg-preview-wrap">
        <div className="xmd-pg-platform-switch" role="tablist" aria-label="切换预览平台">
          {PLATFORMS.map((p) => (
            <button
              type="button"
              key={p}
              className={`xmd-pg-platform-btn ${p === platform ? 'is-active' : ''}`}
              onClick={() => setPlatform(p)}
              role="tab"
              aria-selected={p === platform}
            >
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>

        <div className={`xmd-phone xmd-phone--${platform}`} data-platform={platform}>
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
                <span className="xmd-nav-title">{PLATFORM_LABEL[platform]}</span>
                <span className="xmd-nav-more" aria-hidden>
                  ···
                </span>
              </div>
              <div
                className="xmd-phone-screen"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <div className="xmd-phone-home-indicator" aria-hidden />
            </div>
          </div>
        </div>

        {issues.length > 0 && (
          <div className="xmd-pg-degrade">
            <span className="xmd-pg-degrade-title">真机降级</span>
            {issues.map((it) => (
              <span key={it.kind} className="xmd-pg-degrade-chip">
                {it.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
