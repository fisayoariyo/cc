import { AGENT_STATUS_SECTION_GAP } from '@/components/auth/agent-auth-styles';
import { AgentStatusBadge, type AgentStatusBadgeVariant } from '@/components/auth/agent-status-badge';
import { cn } from '@/components/ui/utils';

export type { AgentStatusBadgeVariant };
export { agentStatusBadgeVariant } from '@/components/auth/agent-status-badge';

type AgentStatusOutcomeProps = {
  variant: AgentStatusBadgeVariant;
  fullName?: string | null;
  title: string;
  description: string;
};

export function AgentStatusOutcome({ variant, fullName, title, description }: AgentStatusOutcomeProps) {
  return (
    <div className={cn('flex w-full flex-col', AGENT_STATUS_SECTION_GAP)}>
      <div className="flex w-full justify-center">
        <AgentStatusBadge variant={variant} size={160} />
      </div>

      <div className="w-full space-y-3 text-left">
        <h2 className="font-sans text-xl font-semibold leading-snug text-[#101828]">{title}</h2>
        <p className="font-sans text-base leading-relaxed text-slate-500">
          {fullName ? `${fullName}, ` : ''}
          {description}
        </p>
      </div>
    </div>
  );
}

export function agentStatusOutcomeCopy(
  variant: AgentStatusBadgeVariant,
): { shellTitle: string; shellDescription: string; title: string; description: string } {
  if (variant === 'verified') {
    return {
      shellTitle: 'Account verified',
      shellDescription: 'Your Charis Consult agent account is approved and ready to use.',
      title: 'Your account has been verified',
      description: 'you can now access your agent dashboard and start publishing properties.',
    };
  }

  if (variant === 'rejected') {
    return {
      shellTitle: 'Verification failed',
      shellDescription: 'We could not verify your account with the details provided.',
      title: 'Your application was not approved',
      description:
        'please review your details or contact support if you believe this is an error. You may resubmit after correcting your information.',
    };
  }

  return {
    shellTitle: 'Account Under Review',
    shellDescription: 'Your details have been submitted successfully and are currently being reviewed.',
    title: 'You will be able to start publishing properties once your account is verified.',
    description: 'this usually takes a short while. We will notify you once your account is approved.',
  };
}
