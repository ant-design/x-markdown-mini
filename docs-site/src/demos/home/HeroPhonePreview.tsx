import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XMarkdownMini, type MiniNode } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import { PhoneShell } from '../../components/PhonePreview';
import { useDocPlatform } from '../../components/useDocPlatform';
import { renderMiniNodes } from '../../utils/nodesToReact';
import { STREAM_DEMO } from '../../components/Playground';
import './HeroPhonePreview.less';

// 与 Playground 共用同一份演示内容，保持首页模拟器与在线演示展示一致。
const MARKDOWN = STREAM_DEMO;

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
  // 用户用播放/暂停按钮控制自动循环：暂停时定格为完整静态渲染，播放时重头逐字播放。
  const [paused, setPaused] = useState(false);
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
    // reduced-motion 或用户暂停：保持静态完整渲染，不播放动画。
    // （切到暂停时，上一轮的 cleanup 已停掉计时器并 reset 了流式实例。）
    if (prefersReducedMotion() || paused) {
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
  }, [platform, play, staticNodes, paused]);

  const reactNodes = useMemo(() => renderMiniNodes(nodes, animating), [nodes, animating]);

  const playButton = (
    <button
      type="button"
      className="xmd-hero-play"
      aria-pressed={!paused}
      aria-label={paused ? '播放流式演示' : '暂停流式演示'}
      title={paused ? '播放' : '暂停'}
      onClick={() => setPaused((p) => !p)}
    >
      {paused ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      )}
    </button>
  );

  return (
    <figure className="xmd-hero-media xmd-hero-phone-preview">
      <PhoneShell
        platform={platform}
        navTitle="x-markdown-mini"
        titleLogo="/brand/x-markdown-mark.png"
        centerTitle
        className="xmd-hero-phone"
        navRight={playButton}
      >
        {reactNodes}
      </PhoneShell>
    </figure>
  );
}
