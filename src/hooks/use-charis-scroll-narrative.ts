'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registerCharisGsap } from '@/lib/gsap/register-client';
import { charisMatchMedia } from '@/lib/gsap/reduced-motion';

registerCharisGsap();

type ChapterConfig = {
  id: string;
  trigger: string;
  pinSelector?: string;
  end?: string;
  onProgress?: (progress: number) => void;
  build: (tl: gsap.core.Timeline) => void;
};

type UseCharisScrollNarrativeOptions = {
  chapters: ChapterConfig[];
};

/**
 * Reusable hook for Charis multi-chapter scroll narratives.
 * Scopes all ScrollTriggers to rootRef and respects reduced motion.
 */
export function useCharisScrollNarrative({ chapters }: UseCharisScrollNarrativeOptions) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      charisMatchMedia(root, () => {
        chapters.forEach((chapter) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: chapter.trigger,
              start: 'top top',
              end: chapter.end ?? '+=140%',
              pin: chapter.pinSelector,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: chapter.onProgress
                ? (self) => chapter.onProgress?.(self.progress)
                : undefined,
            },
          });

          chapter.build(tl);
        });
      });
    },
    { scope: rootRef, dependencies: [chapters] },
  );

  return rootRef;
}
