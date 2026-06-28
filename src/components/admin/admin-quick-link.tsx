import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { adminQuickLinkClass } from '@/lib/admin-dashboard-theme';

export function AdminQuickLink({
  href,
  label,
  copy,
}: {
  href: string;
  label: string;
  copy?: string;
}) {
  return (
    <Link href={href} prefetch className={adminQuickLinkClass}>
      <div className="min-w-0">
        <p className="font-sans text-[15px] font-semibold text-[#1F2A24]">{label}</p>
        {copy ? <p className="mt-1 text-sm text-[#6b7280]">{copy}</p> : null}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#4b2e6f]" />
    </Link>
  );
}
