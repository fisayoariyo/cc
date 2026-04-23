import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { cn } from '@/components/ui/utils';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80';

export type AuthShellVariant = 'agent' | 'travel' | 'real_estate' | 'generic';

const SHELL_VISUALS: Record<
  AuthShellVariant,
  { title: string; copy: string; imageUrl: string }
> = {
  agent: {
    title: 'Digitally onboard property agents',
    copy: 'Create verified agent profiles, complete onboarding, and activate listing access across Charis Consult.',
    imageUrl: DEFAULT_IMAGE,
  },
  travel: {
    title: 'Travel smarter with Charis Consult',
    copy: 'Manage visa applications, destination planning, and every milestone of your travel journey from one place.',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600&q=80',
  },
  real_estate: {
    title: 'Find property with confidence',
    copy: 'Track saved properties, compare listings, and move through your real-estate journey with one guided account.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
  },
  generic: {
    title: 'Move forward with Charis Consult',
    copy: 'Access the next step in your account journey with one clear, secure sign-in flow.',
    imageUrl: DEFAULT_IMAGE,
  },
};

export function getAuthShellVisuals(variant: AuthShellVariant) {
  return SHELL_VISUALS[variant];
}

type AgentAuthShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  variant?: AuthShellVariant;
  visualTitle?: string;
  visualCopy?: string;
  visualImageUrl?: string;
  backHref?: string;
  backLabel?: string;
  rightClassName?: string;
  contentWidthClass?: string;
  titleClassName?: string;
  visualTitleClassName?: string;
};

export function AgentAuthShell({
  children,
  title,
  description,
  variant = 'agent',
  visualTitle,
  visualCopy,
  visualImageUrl,
  backHref,
  backLabel,
  rightClassName,
  contentWidthClass = 'max-w-[360px]',
  titleClassName,
  visualTitleClassName,
}: AgentAuthShellProps) {
  const shellVisuals = getAuthShellVisuals(variant);

  return (
    <div className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <div className="grid min-h-screen w-full bg-white lg:h-[100dvh] lg:grid-cols-2">
        <aside className="relative hidden p-4 lg:block">
          <div
            className="relative h-full min-h-[100dvh] overflow-hidden rounded-[24px] bg-cover bg-center lg:min-h-0"
            style={{ backgroundImage: `url(${visualImageUrl ?? shellVisuals.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,18,19,0.04)_0%,rgba(8,18,17,0.10)_36%,rgba(6,16,15,0.78)_100%)]" />
            <div className="absolute inset-x-8 bottom-8">
              <div className="max-w-[640px] space-y-5 text-white">
                <Image src={logoLockupColor} alt="Charis Consult" className="h-12 w-auto" priority />
                <h2
                  className={cn(
                    'max-w-[620px] text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] xl:text-[38px]',
                    visualTitleClassName,
                  )}
                >
                  {visualTitle ?? shellVisuals.title}
                </h2>
                <p className="max-w-[620px] text-[19px] leading-8 text-white/92">
                  {visualCopy ?? shellVisuals.copy}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section
          className={cn(
            'flex min-h-[100dvh] items-center justify-center px-6 py-6 sm:px-10 sm:py-8 lg:min-h-0 lg:px-12 lg:py-6 xl:px-16',
            rightClassName,
          )}
        >
          <div className={cn('w-full space-y-8', contentWidthClass)}>
            {backHref && backLabel ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
              >
                <span aria-hidden>&larr;</span>
                {backLabel}
              </Link>
            ) : null}

            <div className="space-y-3 text-center lg:text-left">
              <Image
                src={logoLockupColor}
                alt="Charis Consult"
                className="mx-auto h-10 w-auto lg:hidden"
                priority
              />
              <h1
                className={cn(
                  'text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#101828] xl:text-[48px]',
                  titleClassName,
                )}
              >
                {title}
              </h1>
              {description ? <p className="text-[16px] leading-8 text-slate-500">{description}</p> : null}
            </div>

            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
