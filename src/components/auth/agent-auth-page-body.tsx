import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AGENT_ACTIONS_STACK, AGENT_GO_BACK_CLASS, AGENT_SECONDARY_BTN } from '@/components/auth/agent-auth-styles';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

export type AgentAuthFooterMode = 'inline' | 'pinned';

/**
 * Mobile body + actions — hashp patterns:
 * - inline: register/login (scroll includes buttons, mt-5)
 * - pinned: forgot/reset/onboarding (footer px-5 pb-8)
 */
export function AgentAuthScreen({
  children,
  actions,
  footerMode = 'pinned',
  actionsClassName,
  compactLayout = false,
  className,
}: {
  children: ReactNode;
  actions: ReactNode;
  footerMode?: AgentAuthFooterMode;
  actionsClassName?: string;
  /** Keeps actions directly under content with no stretched middle gap (status pages). */
  compactLayout?: boolean;
  className?: string;
}) {
  if (footerMode === 'inline') {
    return (
      <div
        className={cn(
          compactLayout ? 'flex flex-col' : 'flex min-h-0 flex-1 flex-col overflow-y-auto',
          className,
        )}
      >
        {children}
        <div
          className={cn(
            AGENT_ACTIONS_STACK,
            actionsClassName ?? 'mt-5',
            'pb-[max(2rem,env(safe-area-inset-bottom))] lg:hidden',
          )}
        >
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <div className={cn(AGENT_ACTIONS_STACK, 'pb-8 pt-2 lg:hidden')}>{actions}</div>
    </div>
  );
}

/** Desktop-only actions slot (lg+), matches hashp pt-6 separation. */
export function AgentAuthDesktopActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(AGENT_ACTIONS_STACK, 'hidden pt-6 lg:block', className)}>{children}</div>;
}

export function AgentGoBackLink({ href, label = 'Go back' }: { href: string; label?: string }) {
  return (
    <Link href={href} className={AGENT_GO_BACK_CLASS}>
      <ArrowLeft className="h-[18px] w-[18px]" />
      <span>{label}</span>
    </Link>
  );
}

export function AgentAuthBackArrow({ href, label = 'Go back' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="mb-2 -ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </Link>
  );
}

export function AgentBackButton({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
