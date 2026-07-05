import React from 'react';

interface PipelineDiagramProps {
  title: string;
  desc: string;
  labels: {
    markdown: string;
    lexer: string;
    lexerNote: string;
    token: string;
    tokenNote: string;
    platformRenderer: string;
    wechat: string;
    alipay: string;
    node: string;
    nodeNote: string;
    streaming: string;
    chunk: string;
    chunkNote: string;
    streamingProcessor: string;
    stable: string;
    tail: string;
    extensions: string;
    extNote: string;
  };
}

/**
 * The architecture pipeline, drawn once and shared by both locales. Motion lives
 * here and only here on this section: accent "token" dots pulse left-to-right
 * through the connectors (data flowing through the pipeline) and the reuse curve
 * marches with a dashed stroke. This is the design register's sanctioned motion —
 * it demonstrates the streaming mechanism rather than decorating. All of it is
 * stilled to the static diagram under prefers-reduced-motion (see site.css).
 *
 * The class names + PlatformRenderer/StreamingProcessor labels are load-bearing
 * for the check:home contract.
 */
export default function PipelineDiagram({ title, desc, labels }: PipelineDiagramProps) {
  return (
    <svg
      className="xmd-arch-svg"
      viewBox="0 0 960 400"
      role="img"
      aria-labelledby="xmd-arch-title xmd-arch-desc"
    >
      <title id="xmd-arch-title">{title}</title>
      <desc id="xmd-arch-desc">{desc}</desc>
      <defs>
        <marker
          id="xmd-flow-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#a3a3a3" />
        </marker>
        <marker
          id="xmd-accent-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7.5"
          markerHeight="7.5"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#2563eb" />
        </marker>
        <marker
          id="xmd-amber-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#c99a1f" />
        </marker>
      </defs>

      <path className="xmd-arch-flow" d="M148 82 H184" markerEnd="url(#xmd-flow-arrow)" />
      <path className="xmd-arch-flow" d="M338 82 H374" markerEnd="url(#xmd-flow-arrow)" />
      <path className="xmd-arch-flow" d="M482 82 H520" markerEnd="url(#xmd-flow-arrow)" />
      <path className="xmd-arch-flow" d="M738 82 H780" markerEnd="url(#xmd-flow-arrow)" />
      <path className="xmd-arch-flow" d="M338 290 H374" markerEnd="url(#xmd-flow-arrow)" />
      <path
        className="xmd-arch-line"
        d="M503 248 C 540 210 631 226 631 190"
        markerEnd="url(#xmd-accent-arrow)"
      />
      <path
        className="xmd-arch-ext-line"
        d="M760 262 C 760 224 706 226 700 190"
        markerEnd="url(#xmd-amber-arrow)"
      />

      <rect className="xmd-arch-box xmd-arch-box-in" x="24" y="50" width="124" height="64" rx="10" />
      <text className="xmd-arch-label" x="86" y="80" textAnchor="middle">
        {labels.markdown}
      </text>
      <text className="xmd-arch-note" x="86" y="99" textAnchor="middle">
        string
      </text>

      <rect className="xmd-arch-box xmd-arch-box-in" x="188" y="50" width="150" height="64" rx="10" />
      <text className="xmd-arch-label" x="263" y="80" textAnchor="middle">
        {labels.lexer}
      </text>
      <text className="xmd-arch-note" x="263" y="99" textAnchor="middle">
        {labels.lexerNote}
      </text>

      <rect className="xmd-arch-box xmd-arch-box-in" x="378" y="50" width="104" height="64" rx="10" />
      <text className="xmd-arch-label" x="430" y="80" textAnchor="middle">
        {labels.token}
      </text>
      <text className="xmd-arch-note" x="430" y="99" textAnchor="middle">
        {labels.tokenNote}
      </text>

      <rect className="xmd-arch-group" x="524" y="36" width="214" height="152" rx="12" />
      <text className="xmd-arch-group-title" x="631" y="58" textAnchor="middle">
        PlatformRenderer
      </text>
      <rect className="xmd-arch-plat-chip" x="544" y="74" width="174" height="44" rx="8" />
      <text className="xmd-arch-chip-label" x="631" y="101" textAnchor="middle">
        {labels.wechat}
      </text>
      <rect className="xmd-arch-plat-chip" x="544" y="126" width="174" height="44" rx="8" />
      <text className="xmd-arch-chip-label" x="631" y="153" textAnchor="middle">
        {labels.alipay}
      </text>

      <rect
        className="xmd-arch-box xmd-arch-box-node"
        x="784"
        y="50"
        width="148"
        height="64"
        rx="10"
      />
      <text className="xmd-arch-label" x="858" y="80" textAnchor="middle">
        {labels.node}
      </text>
      <text className="xmd-arch-note" x="858" y="99" textAnchor="middle">
        {labels.nodeNote}
      </text>

      <text className="xmd-arch-lane-title" x="24" y="244">
        {labels.streaming}
      </text>
      <rect className="xmd-arch-platform" x="188" y="262" width="150" height="56" rx="10" />
      <text className="xmd-arch-label" x="263" y="291" textAnchor="middle">
        {labels.chunk}
      </text>
      <text className="xmd-arch-note" x="263" y="309" textAnchor="middle">
        {labels.chunkNote}
      </text>

      <rect className="xmd-arch-group" x="378" y="248" width="250" height="110" rx="12" />
      <text className="xmd-arch-group-title" x="503" y="270" textAnchor="middle">
        StreamingProcessor
      </text>
      <rect className="xmd-arch-sp-chip" x="396" y="284" width="214" height="28" rx="7" />
      <text className="xmd-arch-chip-note" x="503" y="303" textAnchor="middle">
        {labels.stable}
      </text>
      <rect className="xmd-arch-sp-chip" x="396" y="320" width="214" height="28" rx="7" />
      <text className="xmd-arch-chip-note" x="503" y="339" textAnchor="middle">
        {labels.tail}
      </text>

      <rect className="xmd-arch-ext" x="690" y="262" width="210" height="72" rx="10" />
      <text className="xmd-arch-group-title" x="795" y="290" textAnchor="middle">
        {labels.extensions}
      </text>
      <text className="xmd-arch-note" x="795" y="311" textAnchor="middle">
        {labels.extNote}
      </text>

      <g className="xmd-arch-pulses" aria-hidden="true">
        <circle className="xmd-arch-pulse" cx="148" cy="82" r="3.4" style={{ animationDelay: '0s', ['--tx' as any]: '36px' }} />
        <circle className="xmd-arch-pulse" cx="338" cy="82" r="3.4" style={{ animationDelay: '.35s', ['--tx' as any]: '36px' }} />
        <circle className="xmd-arch-pulse" cx="482" cy="82" r="3.4" style={{ animationDelay: '.7s', ['--tx' as any]: '38px' }} />
        <circle className="xmd-arch-pulse" cx="738" cy="82" r="3.4" style={{ animationDelay: '1.05s', ['--tx' as any]: '42px' }} />
        <circle className="xmd-arch-pulse" cx="338" cy="290" r="3.4" style={{ animationDelay: '.55s', ['--tx' as any]: '36px' }} />
      </g>
    </svg>
  );
}
