import Link from 'next/link';
import type { ComponentType } from 'react';
import { adminStatCardClass } from '@/lib/admin-dashboard-theme';
import { cn } from '@/components/ui/utils';

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  href,
  className,
}: {
  label: string;
  value: number | string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  className?: string;
}) {
  const body = (
    <div className={cn(adminStatCardClass, className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-white/80">{label}</p>
          <p className="mt-2 text-3xl font-semibold leading-none">{value}</p>
        </div>
        {Icon ? <Icon className="h-5 w-5 shrink-0 text-white/90" /> : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} prefetch className="block">
        {body}
      </Link>
    );
  }

  return body;
}
