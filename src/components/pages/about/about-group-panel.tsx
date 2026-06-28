'use client';

import Image from 'next/image';
import { cn } from '@/components/ui/utils';

export function AboutGroupPanel({
  src,
  caption,
  className,
}: {
  src: string;
  caption: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'relative w-[min(88vw,1180px)] shrink-0 overflow-hidden rounded-[28px] border border-[#F0EDE6] bg-[#FFFDF9] shadow-[0_24px_60px_rgba(31,42,36,0.08)] lg:bg-[#1F2A24]',
        className,
      )}
    >
      {/* Mobile: tall frame, full uncropped photo. Desktop: wide frame, top-anchored crop. */}
      <div className="relative aspect-[3/4] w-full lg:aspect-[16/9]">
        <Image
          src={src}
          alt={caption}
          fill
          className="object-contain object-center lg:object-cover lg:object-top"
          sizes="(max-width: 1024px) 88vw, 1180px"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2A24]/70 via-[#1F2A24]/10 to-transparent lg:from-[#1F2A24]/70" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/75">Charis team</p>
          <h3 className="mt-2 max-w-xl text-2xl font-light text-white sm:text-3xl">{caption}</h3>
        </div>
      </div>
    </article>
  );
}
