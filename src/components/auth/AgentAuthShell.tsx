import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { AgentAuthHeroAside } from '@/components/auth/agent-auth-hero-aside';
import {
  AgentAuthDesktopActions,
  AgentAuthScreen,
  type AgentAuthFooterMode,
} from '@/components/auth/agent-auth-page-body';
import {
  AGENT_AUTH_DESCRIPTION_CLASS,
  AGENT_AUTH_DESCRIPTION_DESKTOP_CLASS,
  AGENT_AUTH_TITLE_CLASS,
  AGENT_AUTH_TITLE_MOBILE_MB,
} from '@/components/auth/agent-auth-styles';
import { AuthPageTitle } from '@/components/auth/auth-page-title';
import { cn } from '@/components/ui/utils';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80';

export type AuthShellVariant = 'admin' | 'agent' | 'travel' | 'real_estate' | 'construction' | 'generic';

const SHELL_VISUALS: Record<
  AuthShellVariant,
  { title: string; copy: string; imageUrl: string; imageClassName?: string }
> = {
  admin: {
    title: 'Manage operations across Charis Consult',
    copy: 'Access the admin dashboard to oversee agent verifications, moderate listings, and keep the platform running smoothly.',
    imageUrl: '/images/agent-auth-hero.webp',
    imageClassName: 'object-cover object-[center_42%]',
  },
  agent: {
    title: 'Digitally onboard property agents',
    copy: 'Create verified agent profiles, complete onboarding, and activate listing access across Charis Consult.',
    imageUrl: '/images/agent-auth-hero.webp',
    imageClassName: 'object-cover object-[center_52%]',
  },
  travel: {
    title: 'Travel smarter with Charis Consult',
    copy: 'Manage visa applications, destination planning, and every milestone of your travel journey from one place.',
    imageUrl: '/images/travel-auth-hero.webp',
    imageClassName: 'object-cover object-center',
  },
  real_estate: {
    title: 'Find property with confidence',
    copy: 'Track saved properties, compare listings, and move through your real-estate journey with one guided account.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
    imageClassName: 'object-cover object-center',
  },
  construction: {
    title: 'Build with structure and clarity',
    copy: 'Start a construction request, book consultation, and follow BOQ, milestone, and handover updates from one workspace.',
    imageUrl: '/images/construction-hero-bk.jpg',
    imageClassName: 'object-cover object-center',
  },
  generic: {
    title: 'Move forward with Charis Consult',
    copy: 'Access the next step in your account journey with one clear, secure sign-in flow.',
    imageUrl: DEFAULT_IMAGE,
    imageClassName: 'object-cover object-center',
  },
};

export function getAuthShellVisuals(variant: AuthShellVariant) {
  return SHELL_VISUALS[variant];
}

export const CLIENT_AUTH_CONTENT_WIDTH =
  'w-full max-w-lg sm:max-w-xl lg:max-w-[36rem] xl:max-w-[42rem]';

export const AGENT_AUTH_CONTENT_WIDTH = 'mx-auto w-full max-w-[440px] lg:max-w-[480px]';

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
  leading?: ReactNode;
  actions?: ReactNode;
  footerMode?: AgentAuthFooterMode;
  actionsClassName?: string;
  compactLayout?: boolean;
  rightClassName?: string;
  contentWidthClass?: string;
  titleClassName?: string;
  visualTitleClassName?: string;
  agentAuthMobile?: boolean;
  headerAlign?: 'left' | 'center';
  showMobileLogo?: boolean;
  heroLogoOnDark?: boolean;
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
  leading,
  actions,
  footerMode = 'pinned',
  actionsClassName,
  compactLayout = false,
  rightClassName,
  contentWidthClass = CLIENT_AUTH_CONTENT_WIDTH,
  titleClassName,
  visualTitleClassName,
  agentAuthMobile = false,
  headerAlign = 'left',
  showMobileLogo = true,
  heroLogoOnDark = false,
}: AgentAuthShellProps) {
  const shellVisuals = getAuthShellVisuals(variant);

  const body =
    actions && agentAuthMobile ? (
      <>
        <AgentAuthScreen
          footerMode={footerMode}
          actions={actions}
          actionsClassName={actionsClassName}
          compactLayout={compactLayout}
        >
          {children}
        </AgentAuthScreen>
        <AgentAuthDesktopActions className={actionsClassName}>{actions}</AgentAuthDesktopActions>
      </>
    ) : (
      children
    );

  return (
    <div className="charis-app-theme min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <div className="grid min-h-screen w-full bg-white lg:h-[100dvh] lg:min-h-0 lg:grid-cols-2 lg:gap-6 lg:px-6 lg:py-6 xl:gap-8 xl:px-8 xl:py-8">
        <AgentAuthHeroAside
          imageUrl={visualImageUrl ?? shellVisuals.imageUrl}
          imageClassName={shellVisuals.imageClassName}
          title={visualTitle ?? shellVisuals.title}
          copy={visualCopy ?? shellVisuals.copy}
          titleClassName={visualTitleClassName}
          logoOnDark={heroLogoOnDark || variant === 'admin'}
        />

        <section
          className={cn(
            'flex min-h-[100dvh] flex-col px-5 pt-5 pb-6 lg:min-h-0 lg:justify-center lg:overflow-y-auto lg:px-2 lg:py-6 xl:px-6',
            agentAuthMobile ? 'items-stretch' : 'items-center justify-center',
            rightClassName,
          )}
        >
          <div
            className={cn(
              'flex w-full flex-col',
              agentAuthMobile && 'min-h-0 flex-1',
              contentWidthClass,
            )}
          >
            {leading}
            {backHref && backLabel ? (
              <Link
                href={backHref}
                className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-[#6b7280]"
              >
                <span aria-hidden>&larr;</span>
                {backLabel}
              </Link>
            ) : null}

            <div
              className={cn(
                headerAlign === 'center' ? 'text-center' : agentAuthMobile ? 'text-left' : 'space-y-3 text-center lg:text-left',
              )}
            >
              {showMobileLogo && !agentAuthMobile ? (
                <Image
                  src={logoLockupColor}
                  alt="Charis Consult"
                  className="mx-auto h-11 w-auto lg:hidden"
                />
              ) : null}
              {agentAuthMobile || headerAlign === 'center' ? (
                <h1
                  className={cn(
                    AGENT_AUTH_TITLE_CLASS,
                    headerAlign === 'center' ? 'mb-0 text-center' : AGENT_AUTH_TITLE_MOBILE_MB,
                    headerAlign !== 'center' && 'lg:mb-3',
                    titleClassName,
                  )}
                >
                  {title}
                </h1>
              ) : (
                <AuthPageTitle className={titleClassName}>{title}</AuthPageTitle>
              )}
              {description ? (
                agentAuthMobile ? (
                  <>
                    <p className={AGENT_AUTH_DESCRIPTION_CLASS}>{description}</p>
                    <p className={AGENT_AUTH_DESCRIPTION_DESKTOP_CLASS}>{description}</p>
                  </>
                ) : (
                  <p className="text-sm leading-6 text-slate-500 sm:text-[15px] lg:text-left">{description}</p>
                )
              ) : null}
            </div>

            <div
              className={cn(
                agentAuthMobile &&
                  (compactLayout ? 'flex flex-col' : 'flex min-h-0 flex-1 flex-col'),
              )}
            >
              {body}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
