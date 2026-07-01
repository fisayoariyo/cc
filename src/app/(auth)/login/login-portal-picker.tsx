'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Hammer, Plane, UserRound } from 'lucide-react';
import { AgentAuthBackArrow } from '@/components/auth/agent-auth-back-arrow';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { buildPortalLoginHref } from '@/lib/auth/login-redirect';

const PORTALS = [
  {
    role: 'client' as const,
    service: 'travel' as const,
    defaultNext: '/travel/dashboard',
    label: 'Travel Client',
    description: 'Visa applications, destination planning, and travel updates.',
    icon: Plane,
  },
  {
    role: 'client' as const,
    service: 'real_estate' as const,
    defaultNext: '/real-estate/dashboard',
    label: 'Real Estate Client',
    description: 'Saved properties, compare lists, and listing updates.',
    icon: Building2,
  },
  {
    role: 'client' as const,
    service: 'construction' as const,
    defaultNext: '/real-estate/construction/dashboard',
    label: 'Construction Client',
    description: 'Project requests, BOQ milestones, and construction tracking.',
    icon: Hammer,
  },
  {
    role: 'agent' as const,
    defaultNext: '/agent',
    label: 'Real Estate Agent',
    description: 'Agent onboarding, listings, and your agent dashboard.',
    icon: UserRound,
  },
] as const;

export function LoginPortalPicker({
  nextPath,
  errorFromUrl,
  messageFromUrl,
}: {
  nextPath?: string;
  errorFromUrl?: string;
  messageFromUrl?: string;
}) {
  const preserve = { next: nextPath, error: errorFromUrl, message: messageFromUrl };

  return (
    <AgentAuthShell
      variant="generic"
      title="Sign in to Charis Consult"
      description="Choose the account type that matches how you use Charis Consult."
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      footerMode="inline"
      showMobileLogo={false}
      leading={<AgentAuthBackArrow />}
    >
      <div className="space-y-3">
        {errorFromUrl ? <AgentFormFeedback>{errorFromUrl}</AgentFormFeedback> : null}
        {messageFromUrl ? (
          <AgentFormFeedback variant="success">{messageFromUrl}</AgentFormFeedback>
        ) : null}

        {PORTALS.map((portal) => {
          const Icon = portal.icon;
          const href = buildPortalLoginHref({
            role: portal.role,
            service: 'service' in portal ? portal.service : undefined,
            defaultNext: portal.defaultNext,
            preserve,
          });

          return (
            <Link
              key={portal.label}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-4 transition hover:border-[#3B0063]/30 hover:bg-[#faf7fd]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#efe8f7] text-[#4b2e6f]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="min-w-0 flex-1">
                <span className="block font-sans text-[15px] font-semibold text-[#111827]">{portal.label}</span>
                <span className="mt-0.5 block font-sans text-sm leading-relaxed text-[#6b7280]">
                  {portal.description}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#9ca3af] transition group-hover:translate-x-0.5 group-hover:text-[#4b2e6f]" />
            </Link>
          );
        })}
      </div>
    </AgentAuthShell>
  );
}
