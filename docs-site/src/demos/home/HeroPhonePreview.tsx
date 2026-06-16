import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XMarkdownMini, type MiniNode } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import { PhoneShell } from '../../components/PhonePreview';
import { useDocPlatform } from '../../components/useDocPlatform';
import { renderMiniNodes } from '../../utils/nodesToReact';
import './HeroPhonePreview.less';

const MARKDOWN = `### 原生节点输出

同一份 Markdown 直接渲染为端侧 \`MiniNode[]\`，不依赖 WebView，也不把 HTML 交给 \`rich-text\` 猜。

| 能力 | 输出 |
| --- | --- |
| 链接 | \`data-href\` |
| 图片 | HTTPS guard |
| 列表 | 平台节点 |

\`\`\`ts
renderNodes({
  platform: 'alipay',
  streaming: true,
})
\`\`\`

公式也走插件节点：$E=mc^2$

- CommonMark / GFM
- 稳定块缓存，只重跑尾部
- 微信 / 支付宝双端直出
`;

// 变速打字机节奏（与 Playground 一致）：随已渲染块序号加速。
const RAMP_CHAR_DELAYS = [50, 30, 20, 10, 50];
const RAMP_CHUNK_DELAYS = [300, 200, 100, 0];
// 首屏先静态展示渲染结果，再开始打字；每轮播放完停顿后重播。
const FIRST_PLAY_DELAY = 900;
const LOOP_PAUSE = 2800;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * 首页 hero 手机预览：复用 Playground 的流式渲染实现，加载后自动循环播放打字机效果。
 * 与 Playground 共用 PhoneShell 外壳、renderNodes 流式管线和 renderMiniNodes（逐字渐显），
 * 但去掉编辑器/配置面板，只保留自动播放的手机。
 */
export default function HeroPhonePreview() {
  const [platform] = useDocPlatform();
  const instanceRef = useRef<XMarkdownMini | null>(null);

  const getInstance = useCallback((): XMarkdownMini => {
    if (!instanceRef.current) {
      instanceRef.current = new XMarkdownMini({
        gfm: true,
        extensions: [Latex({ katexOptions: { throwOnError: false } }), CodeHighlight()],
      });
    }
    return instanceRef.current;
  }, []);

  // 同步派生的静态渲染：用于首屏与 reduced-motion 兜底，避免空白闪烁。
  const staticNodes = useMemo<MiniNode[]>(() => {
    try {
      // One-shot render (streaming default off); independent of streaming state.
      return getInstance().renderNodes({ content: MARKDOWN, platform, selectable: true });
    } catch {
      return [];
    }
  }, [platform, getInstance]);

  const [nodes, setNodes] = useState<MiniNode[]>(staticNodes);
  const [animating, setAnimating] = useState(false);
  const runId = useRef(0);
  const loopTimer = useRef<ReturnType<typeof setTimeout>>();
  const startTimer = useRef<ReturnType<typeof setTimeout>>();

  const play = useCallback(() => {
    const instance = getInstance();
    const id = runId.current + 1;
    runId.current = id;
    instance.reset();
    // 清空 → 重新逐字打入，AnimationText 实例随之重挂，得到干净的循环重播。
    setNodes([]);
    setAnimating(true);
    try {
      instance.renderNodes({
        content: MARKDOWN,
        platform,
        selectable: true,
        streaming: {
          hasNextChunk: false,
          enableAnimation: true,
          semantic: {
            maxChunkSize: 18,
            chunkDelay: RAMP_CHUNK_DELAYS,
            charDelay: RAMP_CHAR_DELAYS,
          },
        },
        onPatch: (patched) => {
          if (runId.current === id) setNodes([...patched]);
        },
        onRenderComplete: () => {
          if (runId.current !== id) return;
          setAnimating(false);
          loopTimer.current = setTimeout(play, LOOP_PAUSE);
        },
      });
    } catch {
      if (runId.current === id) {
        setNodes(staticNodes);
        setAnimating(false);
      }
    }
  }, [platform, getInstance, staticNodes]);

  useEffect(() => {
    // reduced-motion：保持静态完整渲染，不播放动画。
    if (prefersReducedMotion()) {
      setNodes(staticNodes);
      setAnimating(false);
      return;
    }
    // 先展示静态结果，再开始打字循环。
    setNodes(staticNodes);
    setAnimating(false);
    startTimer.current = setTimeout(play, FIRST_PLAY_DELAY);
    return () => {
      runId.current += 1;
      if (startTimer.current) clearTimeout(startTimer.current);
      if (loopTimer.current) clearTimeout(loopTimer.current);
      instanceRef.current?.reset();
    };
  }, [platform, play, staticNodes]);

  const reactNodes = useMemo(() => renderMiniNodes(nodes, animating), [nodes, animating]);

  return (
    <figure className="xmd-hero-media xmd-hero-phone-preview">
      <PhoneShell
        platform={platform}
        navTitle="x-markdown-mini"
        titleLogo="/brand/x-markdown-mark.png"
        centerTitle
        className="xmd-hero-phone"
      >
        {reactNodes}
      </PhoneShell>
    </figure>
  );
}
