import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  XMarkdownMini,
  getPlatformRenderer,
  type MiniNode,
  type XMarkdownMiniOptions,
} from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import { nodesToHTML } from '../../utils/nodesToHTML';
import { useDocPlatform } from '../useDocPlatform';
import './index.less';

type DemoPlatform = 'alipay' | 'wechat';

const PLATFORM_LABEL: Record<DemoPlatform, string> = {
  alipay: '支付宝',
  wechat: '微信',
};
const PLATFORMS: DemoPlatform[] = ['alipay', 'wechat'];

const STREAM_DEMO = `你好！我是 AI 助手，下面为你演示 x-markdown-mini 的流式渲染能力。

## 流式补全

流式输入时，**未闭合的粗体**会被自动补全，\`未闭合的行内代码\`也会，甚至 [未完成的链接](https://example.com) 也能正确处理。

## 代码高亮

\`\`\`typescript
interface MarkdownRenderer {
  render(content: string): Token[];
  renderNodes(props: Props): MiniNode[];
}

const xmd = new XMarkdownMini({
  plugins: [Latex(), CodeHighlight()],
});
\`\`\`

## 数学公式

行内公式：$E = mc^2$，以及欧拉公式 $e^{i\\pi} + 1 = 0$。

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 表格

| 特性 | 状态 | 说明 |
|---|---|---|
| GFM | ✅ | 表格/删除线/任务列表 |
| 流式 | ✅ | 补全 + 缓存 + 动画 |
| 插件 | ✅ | LaTeX / 代码高亮 |

---

*x-markdown-mini — 多端、流式友好、高性能的小程序 Markdown 渲染器*`;

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

export const Playground: React.FC<PlaygroundProps> = ({ initialMarkdown = STREAM_DEMO }) => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [docPlatform] = useDocPlatform();
  const [localPlatform, setLocalPlatform] = useState<DemoPlatform>(docPlatform);
  const [configOpen, setConfigOpen] = useState(false);

  // Config state
  const [gfm, setGfm] = useState(true);
  const [breaks, setBreaks] = useState(false);
  const [selectable, setSelectable] = useState(true);
  const [escapeText, setEscapeText] = useState(true);
  const [latexOn, setLatexOn] = useState(true);
  const [codeHL, setCodeHL] = useState(true);

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamNodes, setStreamNodes] = useState<MiniNode[]>([]);
  const streamRaf = useRef(0);

  // Sync from global doc platform
  useEffect(() => {
    setLocalPlatform(docPlatform);
  }, [docPlatform]);

  const platform = localPlatform;
  const setPlatform = useCallback((p: DemoPlatform) => {
    setLocalPlatform(p);
    window.localStorage.setItem('xmd-doc-platform', p);
    window.dispatchEvent(new CustomEvent('xmd-platform-change', { detail: { platform: p } }));
  }, []);

  // Build XMarkdownMini instance when config changes
  const instanceRef = useRef<XMarkdownMini | null>(null);
  const lastOptsRef = useRef('');

  const getOrCreateInstance = useCallback((): XMarkdownMini => {
    const optsKey = `${gfm}|${breaks}|${escapeText}|${latexOn}|${codeHL}`;
    if (instanceRef.current && lastOptsRef.current === optsKey) return instanceRef.current;

    const plugins: XMarkdownMiniOptions['plugins'] = [];
    if (latexOn) {
      plugins.push(Latex({ katexOptions: { throwOnError: false } }));
    }
    if (codeHL) {
      plugins.push(CodeHighlight());
    }

    instanceRef.current = new XMarkdownMini({
      escapeText,
      lexerOptions: { gfm, breaks },
      plugins,
    });
    lastOptsRef.current = optsKey;
    return instanceRef.current;
  }, [gfm, breaks, escapeText, latexOn, codeHL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      instanceRef.current?.reset();
      cancelAnimationFrame(streamRaf.current);
    };
  }, []);

  // Non-streaming render
  const { html, issues } = useMemo(() => {
    if (isStreaming) return { html: nodesToHTML(streamNodes as any), issues: [] };
    try {
      const instance = getOrCreateInstance();
      const nodes = instance.renderNodes({ content: markdown, platform, selectable });
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
  }, [markdown, platform, selectable, isStreaming, streamNodes, getOrCreateInstance]);

  // Streaming demo: simulate AI chunk delivery character by character
  const startStream = useCallback(() => {
    const instance = getOrCreateInstance();
    instance.reset();
    setIsStreaming(true);
    setStreamNodes([]);
    setMarkdown('');

    const chars = STREAM_DEMO;
    let pos = 0;
    const speed = 18; // ms per character

    const tick = () => {
      if (pos >= chars.length) {
        setIsStreaming(false);
        return;
      }
      // Deliver 1-3 chars per tick for natural pacing
      const step = pos < 30 ? 1 : (chars[pos] === '\n' ? 1 : (Math.random() < 0.3 ? 2 : 1));
      pos = Math.min(pos + step, chars.length);
      const partial = chars.slice(0, pos);
      setMarkdown(partial);

      try {
        const nodes = instance.renderNodes({
          content: partial,
          platform,
          selectable,
          streaming: true,
          onPatch: (patched) => {
            setStreamNodes([...patched]);
          },
        });
        // Non-streaming fallback (onPatch won't fire for sync path)
        if (nodes.length > 0) setStreamNodes(nodes);
      } catch {
        // ignore errors during partial parse
      }

      streamRaf.current = (requestAnimationFrame(() => {
        setTimeout(tick, speed);
      }) as unknown) as number;
    };

    tick();
  }, [platform, selectable, getOrCreateInstance]);

  const stopStream = useCallback(() => {
    cancelAnimationFrame(streamRaf.current);
    setIsStreaming(false);
    // Replace markdown with the full template if stopped early
    if (!STREAM_DEMO.startsWith(markdown)) {
      setMarkdown(STREAM_DEMO);
    }
    instanceRef.current?.reset();
  }, [markdown]);

  return (
    <div className="xmd-pg">
      <section className="xmd-pg-editor-wrap" aria-label="Markdown 输入">
        <div className="xmd-pg-editor-header">
          <label className="xmd-pg-label" htmlFor="xmd-pg-input">
            Markdown
          </label>
          <div className="xmd-pg-header-actions">
            <button
              type="button"
              className={`xmd-pg-stream-btn ${isStreaming ? 'is-active' : ''}`}
              onClick={isStreaming ? stopStream : startStream}
              aria-label={isStreaming ? '停止流式' : '流式演示'}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              <span>{isStreaming ? '停止' : '流式'}</span>
            </button>
            <button
              type="button"
              className={`xmd-pg-config-toggle ${configOpen ? 'is-active' : ''}`}
              onClick={() => setConfigOpen(!configOpen)}
              aria-expanded={configOpen}
              aria-label="配置"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            </button>
          </div>
        </div>

        {configOpen && (
          <div className="xmd-pg-config">
            <div className="xmd-pg-config-group">
              <span className="xmd-pg-config-group-title">解析</span>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={gfm} onChange={(e) => setGfm(e.target.checked)} />
                <span>GFM</span>
                <span className="xmd-pg-config-desc">表格/删除线</span>
              </label>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={breaks} onChange={(e) => setBreaks(e.target.checked)} />
                <span>Breaks</span>
                <span className="xmd-pg-config-desc">\n → br</span>
              </label>
            </div>
            <div className="xmd-pg-config-group">
              <span className="xmd-pg-config-group-title">渲染</span>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={selectable} onChange={(e) => setSelectable(e.target.checked)} />
                <span>Selectable</span>
                <span className="xmd-pg-config-desc">文本可选</span>
              </label>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={escapeText} onChange={(e) => setEscapeText(e.target.checked)} />
                <span>Escape</span>
                <span className="xmd-pg-config-desc">HTML 转义</span>
              </label>
            </div>
            <div className="xmd-pg-config-group">
              <span className="xmd-pg-config-group-title">插件</span>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={codeHL} onChange={(e) => setCodeHL(e.target.checked)} />
                <span>CodeHighlight</span>
                <span className="xmd-pg-config-desc">hljs 语法高亮</span>
              </label>
              <label className="xmd-pg-config-item">
                <input type="checkbox" checked={latexOn} onChange={(e) => setLatexOn(e.target.checked)} />
                <span>LaTeX</span>
                <span className="xmd-pg-config-desc">KaTeX 公式</span>
              </label>
            </div>
          </div>
        )}

        <textarea
          id="xmd-pg-input"
          className="xmd-pg-input"
          spellCheck={false}
          value={markdown}
          onChange={(e) => { if (!isStreaming) setMarkdown(e.target.value); }}
          placeholder="输入 Markdown，右侧实时预览…"
          readOnly={isStreaming}
        />
      </section>

      <section className="xmd-pg-preview-wrap" aria-label="预览">
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
                <span className="xmd-nav-back" aria-hidden>‹</span>
                <span className="xmd-nav-title">{PLATFORM_LABEL[platform]}</span>
                <span className="xmd-nav-more" aria-hidden>···</span>
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
              <span key={it.kind} className="xmd-pg-degrade-chip">{it.label}</span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Playground;