import dynamic from 'next/dynamic';

/**
 * SSR is kept ON so the first hero image is in the initial HTML (it's the LCP
 * element) and `priority` can preload it. Disabling SSR previously left a blank
 * pulse until the chunk hydrated, then the image download started — hurting LCP.
 */
export const LazyCinematicHero = dynamic(() => import('@/components/CinematicHero'), {
  loading: () => <div className="h-screen w-full animate-pulse bg-muted/40" />,
});
