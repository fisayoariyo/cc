'use client';

import Image from 'next/image';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import {
  AGENT_HERO_COPY_CLASS,
  AGENT_HERO_LOGO_CLASS,
  AGENT_HERO_TITLE_CLASS,
} from '@/components/auth/agent-auth-styles';
import { cn } from '@/components/ui/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

type AgentAuthHeroAsideProps = {
  imageUrl: string;
  imageClassName?: string;
  title: string;
  copy: string;
  titleClassName?: string;
  logoOnDark?: boolean;
};

/** Desktop-only hero — skipped on mobile so the large image is not downloaded. */
export function AgentAuthHeroAside({
  imageUrl,
  imageClassName,
  title,
  copy,
  titleClassName,
  logoOnDark = false,
}: AgentAuthHeroAsideProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!isDesktop) return null;

  return (
    <aside className="relative h-full min-h-0">
      <div className="relative h-full overflow-hidden rounded-3xl border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
        {/* Plain img like hashp — small WebP in /public, no priority preload on mobile */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className={cn('absolute inset-0 h-full w-full', imageClassName ?? 'object-cover object-center')}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/[0.18] to-transparent" />
        <div className="absolute inset-x-6 bottom-6 lg:inset-x-8 lg:bottom-8">
          <Image
            src={logoLockupColor}
            alt="Charis Consult"
            className={cn(AGENT_HERO_LOGO_CLASS, logoOnDark && 'brightness-0 invert')}
          />
          <h2 className={cn(AGENT_HERO_TITLE_CLASS, titleClassName)}>{title}</h2>
          <p className={cn(AGENT_HERO_COPY_CLASS, 'mt-2')}>{copy}</p>
        </div>
      </div>
    </aside>
  );
}
