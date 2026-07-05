import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  XMarkdownMini,
  type MarkedExtension,
  type MiniNode,
  type XMarkdownExtension,
} from '@ant-design/x-markdown-mini';
import { PhoneShell, type PreviewPlatform } from '../PhonePreview';
import { renderMiniNodes } from '../../utils/nodesToReact';

// 变速打字机节奏（与 Playground / 首页 hero 一致）：随已渲染块序号加速。
const RAMP_CHAR_DELAYS = [50, 30, 20, 10, 50];
const RAMP_CHUNK_DELAYS = [300, 200, 100, 0];
const FIRST_PLAY_DELAY = 700;
const LOOP_PAUSE = 2600;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface AutoStreamPhoneProps {
  content: string;
  platform: PreviewPlatform;
  navTitle?: string;
  backHref?: string;
  moreHref?: string;
  extensions?: (XMarkdownExtension | MarkedExtension)[];
}

/**
 * Auto-looping streaming preview for doc demos. Reuses the same renderNodes
 * streaming pipeline + `renderMiniNodes` typewriter as the homepage hero /
 * Playground, but parameterized on `content` and rendered inside the standard
 * doc PhoneShell. Loads → shows the full static render → types it out → loops.
 * A play/pause control gates the loop; reduced-motion users get the static
 * render and never auto-play.
 */
export default function AutoStreamPhone({
  content,
  platform,
  navTitle,
  backHref,
  moreHref,
  extensions,
}: AutoStreamPhoneProps) {
  const instanceRef = useRef<XMarkdownMini | null>(null);

  const getInstance = useCallback((): XMarkdownMini => {
    if (!instanceRef.current) {
      instanceRef.current = new XMarkdownMini({ gfm: true, extensions });
    }
    return instanceRef.current;
  }, [extensions]);

  // 同步派生的静态渲染：首屏 + reduced-motion / 暂停兜底，避免空白闪烁。
  const staticNodes = useMemo<MiniNode[]>(() => {
    try {
      return getInstance().renderNodes({ content, platform, selectable: true });
    } catch {
      return [];
    }
  }, [content, platform, getInstance]);

  const [nodes, setNodes] = useState<MiniNode[]>(staticNodes);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const runId = useRef(0);
  const loopTimer = useRef<ReturnType<typeof setTimeout>>();
  const startTimer = useRef<ReturnType<typeof setTimeout>>();

  const play = useCallback(() => {
    const instance = getInstance();
    const id = runId.current + 1;
    runId.current = id;
    instance.reset();
    setNodes([]);
    setAnimating(true);
    try {
      instance.renderNodes({
        content,
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
  }, [content, platform, getInstance, staticNodes]);

  useEffect(() => {
    if (prefersReducedMotion() || paused) {
      setNodes(staticNodes);
      setAnimating(false);
      return;
    }
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
      className="xmd-autostream-play"
      aria-pressed={!paused}
      aria-label={paused ? '播放流式演示' : '暂停流式演示'}
      title={paused ? '播放' : '暂停'}
      onClick={() => setPaused((p) => !p)}
    >
      {paused ? (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      )}
    </button>
  );

  return (
    <PhoneShell
      platform={platform}
      navTitle={navTitle}
      backHref={backHref}
      moreHref={moreHref}
      navRight={playButton}
    >
      {reactNodes}
    </PhoneShell>
  );
}
