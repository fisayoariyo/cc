'use client';

import { agentNoticeClass } from '@/lib/agent-dashboard-theme';
import { agentOnboardingPaymentNoticeText } from '@/lib/agent-onboarding-payment';
import { cn } from '@/components/ui/utils';

export function AgentOnboardingPaymentNotice({ className }: { className?: string }) {
  return (
    <p role="status" className={cn(agentNoticeClass, className)}>
      {agentOnboardingPaymentNoticeText()}
    </p>
  );
}
