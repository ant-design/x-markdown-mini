import React from 'react';
import PipelineDiagram from './PipelineDiagram';
import { useReveal } from './useReveal';
import type { ArchProof, HomeCopy } from './copy';

const ICONS: Record<ArchProof['icon'], React.ReactNode> = {
  math: (
    <svg className="xmd-arch-proof-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4h9l-4.5 6L13 16H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ext: (
    <svg className="xmd-arch-proof-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 6h12M4 10h12M4 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15.5" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  commonmark: (
    <svg className="xmd-arch-proof-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m4 10 3 3 9-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  stream: (
    <svg className="xmd-arch-proof-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 7h6M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4l4 6-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface ArchitectureProps {
  copy: HomeCopy;
  /** Localized SVG diagram labels + a11y strings. */
  diagram: React.ComponentProps<typeof PipelineDiagram>;
}

/**
 * Screen 2 of the homepage: the short native pipeline + the streaming story.
 * Keeps the .xmd-architecture / .xmd-arch-board / .xmd-arch-svg / .xmd-arch-proof
 * structure the contract requires. The proof row now uses proper icon+title+desc
 * cells (the icon styles already shipped in site.css).
 */
export default function Architecture({ copy, diagram }: ArchitectureProps) {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="xmd-landing-section xmd-architecture xmd-reveal" ref={revealRef}>
      <div className="xmd-section-copy">
        <h2>{copy.arch.title}</h2>
        <p>{copy.arch.body}</p>
      </div>
      <div className="xmd-arch-board" aria-label={diagram.title}>
        <PipelineDiagram {...diagram} />
        <div className="xmd-arch-proof">
          {copy.arch.proof.map((p, i) => (
            <div key={i}>
              <div className="xmd-arch-proof-head">
                {ICONS[p.icon]}
                <strong>{p.title}</strong>
              </div>
              <span>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
