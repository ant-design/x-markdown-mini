import React from 'react';
import InstallPanel from '../InstallPanel';
import { useReveal } from './useReveal';
import type { HomeCopy } from './copy';

interface HeroProps {
  copy: HomeCopy;
  /** Locale-specific streaming phone preview (HeroPhonePreview / .en-US). */
  media: React.ReactNode;
}

/**
 * Screen 1 of the homepage: intro + install on the left, live streaming device
 * preview on the right. Keeps every class the check:home contract keys off
 * (xmd-hero, xmd-hero-copy, xmd-hero-media via the injected media, the install
 * copy button, xmd-hero-facts).
 *
 * "有意思" here is restrained: an eyebrow in the one accent, a one-shot reveal on
 * the copy column, and the real streaming demo doing the actual persuading. No
 * decorative gradients, no scroll-jacking.
 */
export default function Hero({ copy, media }: HeroProps) {
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <section className="xmd-hero">
      <div className="xmd-hero-copy xmd-reveal" ref={revealRef}>
        <span className="xmd-hero-eyebrow">{copy.eyebrow}</span>
        <h1>{copy.heroTitle}</h1>
        <p className="xmd-hero-subtitle">{copy.heroSubtitle}</p>
        <InstallPanel
          copyLabel={copy.install.copyLabel}
          copySuccessText={copy.install.copySuccessText}
          playgroundHref={copy.install.playgroundHref}
          playgroundLabel={copy.install.playgroundLabel}
        />
        <dl className="xmd-hero-facts" aria-label={copy.eyebrow}>
          {copy.facts.map((fact) => (
            <div key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
      {media}
    </section>
  );
}
