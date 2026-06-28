'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { cn } from '@/components/ui/utils';

export function AgentSettingsPanel({
  title,
  subtitle,
  backHref,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full max-w-2xl flex-col', className)}>
      <div className={footer ? 'flex-1' : undefined}>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-5 inline-flex items-center gap-2 font-sans text-sm text-[#1F2A24] hover:text-[#4b2e6f] lg:mb-6 lg:text-[#6b7280] lg:hover:text-[#1F2A24]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Link>
        ) : null}

        <div className="space-y-1.5">
          <DashboardPageTitle className="text-[#1F2A24]">{title}</DashboardPageTitle>
          {subtitle ? (
            <p className="font-sans text-sm leading-relaxed text-[#6b7280]">{subtitle}</p>
          ) : null}
        </div>

        <div className="mt-6 lg:mt-8">{children}</div>
      </div>

      {footer ? <div className="mt-8 shrink-0 pb-2 lg:pb-0">{footer}</div> : null}
    </div>
  );
}

export function AgentSettingsMenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#ece8f2] bg-white shadow-sm lg:mt-8 lg:rounded-none lg:border-x-0 lg:border-b lg:border-t lg:bg-transparent lg:shadow-none">
      {children}
    </div>
  );
}

export function AgentSettingsContactCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#ece8f2] bg-white p-4 shadow-sm sm:p-5">{children}</div>
  );
}
