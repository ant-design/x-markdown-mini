import { useEffect, useRef } from 'react';

/**
 * One-shot entrance reveal for a landing section.
 *
 * Design register: motion on the homepage is restrained and purposeful. This is
 * NOT fade-on-every-scroll — each element reveals exactly once when it first
 * enters the viewport (opacity + a small translateY), then the observer detaches.
 *
 * SSR-safe: the returned ref simply stays untouched on the server, and the CSS
 * default (`.xmd-reveal`) already renders the element in its final position with
 * `is-in` toggled client-side. Under `prefers-reduced-motion` we skip the
 * transition entirely and mark it visible immediately, so keyboard/AT users and
 * motion-sensitive visitors get the fully-rendered page with no animation.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    // Already in view on mount (above the fold): reveal on the next frame so the
    // transition still plays from the initial state.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
