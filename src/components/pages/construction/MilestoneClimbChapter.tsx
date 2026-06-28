'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { registerCharisGsap } from '@/lib/gsap/register-client';
import { cn } from '@/components/ui/utils';

registerCharisGsap();

export type BuildMilestone = {
  title: string;
  status: string;
  note: string;
};

type MilestoneClimbChapterProps = {
  milestones: BuildMilestone[];
};

export function MilestoneClimbChapter({ milestones }: MilestoneClimbChapterProps) {
  const chapterRef = useRef<HTMLElement>(null);
  const count = milestones.length;
  const lastIndex = Math.max(count - 1, 0);

  useGSAP(
    () => {
      const chapter = chapterRef.current;
      if (!chapter || count === 0) return;

      const fill = chapter.querySelector('[data-spine-fill]') as HTMLElement | null;
      const nodes = gsap.utils.toArray<HTMLElement>('[data-spine-node]', chapter);
      const cards = gsap.utils.toArray<HTMLElement>('[data-milestone-card]', chapter);

      if (fill) gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(nodes, {
        backgroundColor: '#FFFFFF',
        borderColor: '#CDBBD9',
        boxShadow: '0 0 0 0 rgba(59, 0, 99, 0)',
        scale: 1,
      });
      cards.forEach((card) => {
        const side = card.dataset.cardSide;
        gsap.set(card, {
          opacity: 0,
          y: 56,
          x: side === 'left' ? -28 : 28,
          scale: 0.985,
          willChange: 'transform, opacity',
        });
      });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = chapter.querySelector('[data-chapter-pin]');
        const desktopScrubDistance = Math.max(320, count * 80);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: 'top top',
            end: `+=${desktopScrubDistance}%`,
            pin,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (fill) {
          tl.to(fill, { scaleY: 1, ease: 'none', duration: 1 }, 0);
        }

        milestones.forEach((_, index, array) => {
          const at = lastIndex > 0 ? index / lastIndex : 0;
          const node = nodes[index];
          const card = cards[index];
          if (node) {
            tl.to(
              node,
              {
                backgroundColor: '#3B0063',
                borderColor: '#3B0063',
                scale: 1.3,
                boxShadow: '0 0 0 4px rgba(59, 0, 99, 0.15)',
                ease: 'none',
                duration: 0.06,
              },
              at,
            );
          }
          if (card) {
            tl.to(
              card,
              {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                ease: 'none',
                duration: 0.16,
              },
              at,
            );
          }
          if (card && index < array.length - 1) {
            tl.to(
              card,
              {
                opacity: 0.35,
                ease: 'none',
                duration: 0.16,
              },
              at + 0.18,
            );
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        if (fill) gsap.set(fill, { scaleY: 1 });
        gsap.set(nodes, { backgroundColor: '#3B0063', borderColor: '#3B0063', scale: 1.08 });
        gsap.set(cards, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'willChange' });
      });

      return () => mm.revert();
    },
    { scope: chapterRef, dependencies: [count] },
  );

  return (
    <section
      ref={chapterRef}
      data-chapter="milestone-climb"
      className="relative bg-[#FEFAF4]"
      aria-label="Construction milestone climb"
    >
      <div
        data-chapter-pin
        className="flex min-h-screen border-b border-[#E9E2F2]"
      >
        <div data-chapter-content className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base font-semibold uppercase tracking-[0.16em] text-[#3B0063]">
              Chapter 03 - Milestone Climb
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Construction progress in clear steps.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#3F4A44]">
              Scroll through each build phase with a center spine that fills as your project rises.
            </p>
          </div>

          <div className="relative mt-12">
            <div
              data-narrative-actor="building-spine"
              className="absolute bottom-0 left-5 top-0 w-[2px] bg-[#E9E2F2] md:left-1/2 md:-translate-x-1/2"
              aria-hidden
            />
            <div
              data-spine-fill
              className="absolute bottom-0 left-5 top-0 w-[2px] bg-[#3B0063] md:left-1/2 md:-translate-x-1/2"
              aria-hidden
            />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((item, index) => (
                <article
                  key={item.title}
                  className="relative grid min-h-[180px] grid-cols-[2.5rem_1fr] items-center md:min-h-[240px] md:grid-cols-[1fr_auto_1fr] md:gap-x-8"
                >
                  <div
                    className={cn(
                      'col-start-2 row-start-1 rounded-2xl border border-[#E9E2F2] bg-white px-5 py-5 shadow-sm md:px-6 md:py-6',
                      index % 2 === 0 ? 'md:col-start-3' : 'md:col-start-1',
                    )}
                    data-milestone-card={index}
                    data-card-side={index % 2 === 0 ? 'right' : 'left'}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#3B0063]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#1F2A24]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-[#6B6480]">{item.status}</p>
                    <p className="mt-3 text-base leading-7 text-[#3F4A44]">{item.note}</p>
                  </div>

                  <div className="pointer-events-none relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
                    <div
                      data-spine-node={index}
                      className="h-4 w-4 rounded-full border-2 border-[#CDBBD9] bg-white"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
