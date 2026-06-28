'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registerCharisGsap } from '@/lib/gsap/register-client';
import { charisMatchMedia } from '@/lib/gsap/reduced-motion';
import { ABOUT_GROUP_PHOTOS, ABOUT_TEAM_MEMBERS } from '@/lib/about-team-data';
import { AboutGroupPanel } from './about-group-panel';
import { AboutTeamMemberCard } from './about-team-member-card';
import { cn } from '@/components/ui/utils';

registerCharisGsap();

const NAV_OFFSET_PX = 80;

function createHorizontalScroll(
  pinSection: HTMLElement,
  track: HTMLElement,
  start: string,
) {
  const tween = gsap.to(track, {
    x: () => {
      const amount = track.scrollWidth - window.innerWidth;
      return amount > 0 ? -amount : 0;
    },
    ease: 'none',
    scrollTrigger: {
      trigger: pinSection,
      start,
      end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, window.innerHeight)}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(track, { clearProps: 'transform' });
  };
}

export function AboutTeamGallery() {
  const pinRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pinSection = pinRef.current;
      const track = trackRef.current;
      if (!pinSection || !track) return;

      charisMatchMedia(pinSection, () => {
        const mm = gsap.matchMedia();

        mm.add('(max-width: 1023px)', () =>
          createHorizontalScroll(pinSection, track, `top top+=${NAV_OFFSET_PX}`),
        );

        mm.add('(min-width: 1024px)', () => createHorizontalScroll(pinSection, track, 'top top'));
      });
    },
    { scope: pinRef },
  );

  return (
    <div className="bg-[#FEFAF4]">
      <section className="border-t border-[#F0EDE6] px-6 pb-10 pt-16 lg:px-8 lg:pb-12 lg:pt-20">
        <div className="mx-auto max-w-7xl text-center lg:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#E88A5F]">Our people</p>
          <h2 className="mt-2 text-3xl font-light text-[#1F2A24] md:text-4xl lg:text-5xl">
            Meet the team behind Charis
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#3F4A44] lg:mx-0">
            Scroll down — the gallery moves horizontally as you go.
          </p>
        </div>
      </section>

      <section ref={pinRef} className="relative overflow-hidden bg-[#FEFAF4]">
        <div
          className={cn(
            'flex min-h-[calc(100dvh-5rem)] items-start gap-5 px-5 pb-8 pt-3',
            'lg:min-h-screen lg:items-center lg:gap-8 lg:px-8 lg:pb-0 lg:pt-0',
          )}
          ref={trackRef}
          data-chapter-content
        >
          {ABOUT_GROUP_PHOTOS.map((group, index) => (
            <AboutGroupPanel
              key={group.id}
              src={group.src}
              caption={group.caption}
              className={index === 1 ? 'hidden lg:block' : undefined}
            />
          ))}

          {ABOUT_TEAM_MEMBERS.map((member) => (
            <AboutTeamMemberCard key={member.id} member={member} />
          ))}

          <div className="w-5 shrink-0 lg:w-8" aria-hidden />
        </div>
      </section>
    </div>
  );
}
