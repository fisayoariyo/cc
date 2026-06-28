import Image from 'next/image';
import { cn } from '@/components/ui/utils';

export type AgentStatusBadgeVariant = 'pending' | 'verified' | 'rejected';

const BADGE_SRC: Record<AgentStatusBadgeVariant, string> = {
  pending: '/images/agent/status-badges/badge-pending.png',
  verified: '/images/agent/status-badges/badge-verified.png',
  rejected: '/images/agent/status-badges/badge-rejected.png',
};

const BADGE_ALT: Record<AgentStatusBadgeVariant, string> = {
  pending: 'Account under review',
  verified: 'Account verified',
  rejected: 'Verification failed',
};

export function AgentStatusBadge({
  variant = 'pending',
  size = 160,
  className,
}: {
  variant?: AgentStatusBadgeVariant;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex shrink-0 items-center justify-center', className)} aria-hidden>
      <Image
        src={BADGE_SRC[variant]}
        alt={BADGE_ALT[variant]}
        width={size}
        height={size}
        className="h-auto w-auto"
        style={{ width: size, height: size }}
        priority
      />
    </div>
  );
}

export function agentStatusBadgeVariant(
  status: string | null | undefined,
): AgentStatusBadgeVariant {
  if (status === 'verified') return 'verified';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}
