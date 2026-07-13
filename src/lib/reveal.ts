'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal, ported from the source components.
 *
 * Deliberately rect-based rather than IntersectionObserver — that is what the
 * originals do, and it keeps the failsafe (`revealAll` after `failsafeMs`) so
 * content can never end up stuck invisible.
 *
 * @param threshold fraction of the viewport height an element must cross (0.92 / 0.94 in the source)
 * @param failsafeMs when to force-reveal anything still hidden
 */
export function useReveal(threshold = 0.94, failsafeMs = 1600) {
  useEffect(() => {
    const revealAll = () =>
      document
        .querySelectorAll('[data-reveal]:not([data-in])')
        .forEach((n) => n.setAttribute('data-in', ''));

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      revealAll();
      return;
    }

    const check = () => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('[data-reveal]:not([data-in])').forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < vh * threshold && r.bottom > 0) n.setAttribute('data-in', '');
      });
    };

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    requestAnimationFrame(() => {
      check();
      requestAnimationFrame(check);
    });
    const failsafe = setTimeout(revealAll, failsafeMs);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(failsafe);
    };
  }, [threshold, failsafeMs]);
}

/**
 * Re-reveals nodes that a filter change has just mounted. The Reviews and
 * Articles pages call this after switching category, so newly rendered cards
 * don't sit at opacity 0 below the fold logic.
 */
export function revealNewlyMounted() {
  requestAnimationFrame(() =>
    document
      .querySelectorAll('[data-reveal]:not([data-in])')
      .forEach((n) => n.setAttribute('data-in', '')),
  );
}
