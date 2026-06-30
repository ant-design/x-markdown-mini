import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XMarkdownMini, type MiniNode } from '@ant-design/x-markdown-mini';
import Latex from '@ant-design/x-markdown-mini/plugins/Latex';
import CodeHighlight from '@ant-design/x-markdown-mini/plugins/CodeHighlight';
import { PhoneShell } from '../../components/PhonePreview';
import { useDocPlatform } from '../../components/useDocPlatform';
import { renderMiniNodes } from '../../utils/nodesToReact';
import { STREAM_DEMO } from '../../components/Playground';
import './HeroPhonePreview.less';

// Shares the Playground demo content so the hero simulator matches the Playground.
const MARKDOWN = STREAM_DEMO;

// Variable typewriter cadence (same as Playground): speeds up per committed block.
const RAMP_CHAR_DELAYS = [50, 30, 20, 10, 50];
const RAMP_CHUNK_DELAYS = [300, 200, 100, 0];
// Show the rendered result first, then type; replay after a pause each loop.
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
 * Home hero phone preview: reuses Playground's streaming render and auto-loops a
 * typewriter on load. Shares PhoneShell, the renderNodes streaming pipeline and
 * renderMiniNodes (per-segment fade-in) with Playground, minus the editor/config.
 */
export default function HeroPhonePreviewEn() {
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

  // Synchronous static render: first paint + reduced-motion fallback, avoids blank flash.
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
  // Play/pause control over the auto-loop: paused freezes the full static render,
  // play restarts the typewriter from the top.
  const [paused, setPaused] = useState(false);
  const runId = useRef(0);
  const loopTimer = useRef<ReturnType<typeof setTimeout>>();
  const startTimer = useRef<ReturnType<typeof setTimeout>>();

  const play = useCallback(() => {
    const instance = getInstance();
    const id = runId.current + 1;
    runId.current = id;
    instance.reset();
    // Clear, then re-type so AnimationText instances remount for a clean replay.
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
    // reduced-motion or user-paused: keep the full static render, no animation.
    // (On pause, the prior run's cleanup already stopped the timers + instance.)
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
      className="xmd-hero-play"
      aria-pressed={!paused}
      aria-label={paused ? 'Play streaming demo' : 'Pause streaming demo'}
      title={paused ? 'Play' : 'Pause'}
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
