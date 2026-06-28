import type { ComponentType } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';
import {
  dashboardHeaderCtaClass,
  dashboardHeaderCtaCompactClass,
} from '@/lib/dashboard-theme';
import { Badge } from '@/components/ui/badge';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { cn } from '@/components/ui/utils';

export function DashboardShellHeader({
  title,
  subtitle,
  primaryActionHref,
  primaryActionLabel,
  primaryActionIcon: PrimaryActionIcon = Plus,
  compact = false,
  accentButtonClassName,
}: {
  title: string;
  subtitle: string;
  primaryActionHref?: string;
  primaryActionLabel?: string;
  primaryActionIcon?: ComponentType<{ size?: string | number; strokeWidth?: string | number; className?: string }>;
  compact?: boolean;
  accentButtonClassName?: string;
}) {
  const ctaClass = cn(
    compact ? dashboardHeaderCtaCompactClass : dashboardHeaderCtaClass,
    accentButtonClassName,
  );
  const showPrimaryAction = Boolean(primaryActionHref && primaryActionLabel);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <DashboardPageTitle className="truncate">{title}</DashboardPageTitle>
        <p className={compact ? 'mt-1 text-sm text-muted-foreground' : 'mt-1 text-[15px] text-muted-foreground'}>
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className={
            compact
              ? 'rounded-lg bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]'
              : 'inline-flex items-center gap-1 rounded-lg bg-[#efe8f7] px-[10px] py-1.5 text-[12px] font-bold text-[#4b2e6f] hover:bg-[#efe8f7]'
          }
        >
          Online
          {!compact ? <ChevronDown size={10} strokeWidth={2.4} /> : null}
        </Badge>
        {showPrimaryAction ? (
          <Link href={primaryActionHref!} className={ctaClass}>
            <PrimaryActionIcon size={compact ? 14 : 16} strokeWidth={2.4} />
            {primaryActionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
