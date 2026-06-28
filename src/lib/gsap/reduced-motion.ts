'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerCharisGsap } from './register-client';

registerCharisGsap();

type MatchMediaCleanup = gsap.MatchMedia;

/**
 * Run scroll narrative setup only when reduced motion is off.
 * On reduce: clear transform props and kill ScrollTriggers in scope.
 */
export function charisMatchMedia(
  scope: HTMLElement | null,
  setup: (context: gsap.Context) => void,
): MatchMediaCleanup | null {
  if (!scope) return null;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    scope.querySelectorAll('[data-chapter-content]').forEach((el) => {
      gsap.set(el, { clearProps: 'transform,opacity' });
    });
    ScrollTrigger.getAll().forEach((st) => {
      if (scope.contains(st.trigger as Node)) st.kill();
    });
  });

  return mm;
}

/** Standard pin/scrub options for desktop narrative chapters. */
export function charisDesktopScrub() {
  return {
    scrub: 1 as const,
    anticipatePin: 1 as const,
    invalidateOnRefresh: true as const,
  };
}

/** True when user prefers reduced motion. */
export function charisPrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
