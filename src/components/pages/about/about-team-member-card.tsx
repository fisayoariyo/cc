'use client';

import Image from 'next/image';
import { cn } from '@/components/ui/utils';
import type { AboutTeamMember } from '@/lib/about-team-data';

export function AboutTeamMemberCard({ member, className }: { member: AboutTeamMember; className?: string }) {
  return (
    <article
      className={cn(
        'group relative h-[calc(100dvh-6.5rem)] w-[min(85vw,420px)] shrink-0',
        'lg:h-[min(78vh,720px)] lg:w-[min(72vw,420px)]',
        className,
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[28px] border border-[#F0EDE6] bg-[#FFFDF9] shadow-[0_20px_50px_rgba(31,42,36,0.07)]">
        <Image
          src={member.mainImage}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] lg:object-[center_15%]"
          sizes="(max-width: 1024px) 85vw, 420px"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2A24]/70 via-[#1F2A24]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute left-4 top-4 right-20 z-10 sm:left-5 sm:top-5 sm:right-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Leadership</p>
          <h3 className="mt-1 text-xl font-light text-white sm:text-2xl">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-[#E88A5F]">{member.role}</p>
        </div>

        <div className="absolute bottom-4 right-4 z-20 w-[min(46%,168px)] sm:bottom-5 sm:right-5">
          <div className="overflow-hidden rounded-2xl border-2 border-white/90 bg-white shadow-[0_14px_30px_rgba(31,42,36,0.18)] rotate-[2deg] transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-1">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={member.subsetImage}
                alt={`${member.name} — personal`}
                fill
                className="object-cover object-top"
                sizes="168px"
              />
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-5 text-white/90 sm:text-[13px]">{member.bio}</p>
        </div>
      </div>
    </article>
  );
}
