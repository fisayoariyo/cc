'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export function AgentSettingsMenuLink({
  href,
  icon: Icon,
  label,
  showChevron = true,
  onClick,
  className,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const inner = (
    <>
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#4b2e6f]" strokeWidth={1.8} />
        <span>{label}</span>
      </span>
      {showChevron ? <ChevronRight className="h-5 w-5 text-[#9ca3af]" /> : null}
    </>
  );

  const rowClass = cn(
    'flex w-full items-center justify-between px-4 py-4 font-sans text-[15px] font-medium text-[#1F2A24] transition hover:text-[#4b2e6f] lg:px-0',
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href ?? '#'} className={rowClass}>
      {inner}
    </Link>
  );
}
