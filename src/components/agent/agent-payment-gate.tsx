'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useAgentViewerOptional } from '@/components/agent/agent-viewer-provider';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import {
  agentBankDetailClass,
  agentPageHeaderStackClass,
  agentPageShellClass,
  agentSubtitleClass,
  agentWhatsAppButtonClass,
} from '@/lib/agent-dashboard-theme';
import {
  AGENT_ONBOARDING_FEE_NGN,
  agentOnboardingPaymentNoticeText,
  buildAgentReceiptWhatsAppUrl,
  formatAgentOnboardingBankLine,
} from '@/lib/agent-onboarding-payment';
import { formatNaira } from '@/lib/format';

export function AgentPaymentGate({ title = 'Unlock listing tools' }: { title?: string }) {
  const viewer = useAgentViewerOptional();
  const whatsappUrl = buildAgentReceiptWhatsAppUrl(viewer?.fullName);
  const amount = formatNaira(AGENT_ONBOARDING_FEE_NGN);

  return (
    <div className={agentPageShellClass}>
      <div className={agentPageHeaderStackClass}>
        <DashboardPageTitle className="text-[#1F2A24]">{title}</DashboardPageTitle>
        <p className={agentSubtitleClass}>{agentOnboardingPaymentNoticeText()}</p>
      </div>

      <div className="space-y-4">
        <p className={agentSubtitleClass}>
          Transfer <span className="font-semibold text-[#1F2A24]">{amount}</span> to:
        </p>
        <p className={agentBankDetailClass}>{formatAgentOnboardingBankLine()}</p>
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={agentWhatsAppButtonClass}
        >
          <MessageCircle className="h-4 w-4" />
          Share receipt on WhatsApp
        </Link>
      </div>
    </div>
  );
}
