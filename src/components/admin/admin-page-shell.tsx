import type { LucideIcon } from 'lucide-react';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import {
  adminContentStackClass,
  adminPageHeaderStackClass,
  adminSubtitleClass,
} from '@/lib/admin-dashboard-theme';
import { cn } from '@/components/ui/utils';

export function AdminPageShell({
  title,
  subtitle,
  children,
  actions,
  className,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <div className={cn(adminContentStackClass, className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                iconClassName ?? 'bg-[#E88A5F]/10 text-[#E88A5F]',
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
          <div className={adminPageHeaderStackClass}>
            <DashboardPageTitle className="text-[#1F2A24]">{title}</DashboardPageTitle>
            {subtitle ? <p className={adminSubtitleClass}>{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
