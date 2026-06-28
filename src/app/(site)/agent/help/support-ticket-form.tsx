'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Smartphone } from 'lucide-react';
import { submitSupportTicket, type SubmitSupportTicketState } from './actions';
import { AGENT_SUPPORT_ISSUE_TYPES, CHARIS_SUPPORT_PHONES } from '@/lib/support-tickets';
import {
  AGENT_FORM_FIELD_CLASS,
  AGENT_FORM_LABEL_CLASS,
  AGENT_FORM_SELECT_CLASS,
  AGENT_FORM_TEXTAREA_CLASS,
} from '@/lib/agent-dashboard-theme';
import { AGENT_SETTINGS_PRIMARY_BTN } from '@/lib/agent-settings-theme';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { AGENT_FIELD_BLOCK } from '@/components/auth/agent-auth-styles';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';

export function SupportTicketForm() {
  const [state, formAction, isPending] = useActionState<SubmitSupportTicketState, FormData>(
    submitSupportTicket,
    null,
  );

  return (
    <div className="flex min-h-[calc(100dvh-88px-env(safe-area-inset-bottom,0px))] w-full max-w-2xl flex-col lg:min-h-0">
      <div className="flex-1 space-y-6">
        <Link
          href="/agent/settings"
          className="inline-flex items-center gap-2 font-sans text-sm text-[#1F2A24] hover:text-[#4b2e6f] lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </Link>

        <div className="space-y-2">
          <DashboardPageTitle className="text-[#1F2A24]">Help &amp; Support</DashboardPageTitle>
          <p className="font-sans text-sm leading-relaxed text-[#6b7280]">
            Having issues in the field? Reach out to the Charis Consult support team for help with
            listings, your profile, verification, or any other concerns.
          </p>
        </div>

        <div className="border-l-4 border-[#FFBB3C] py-0.5 pl-4">
          <p className="font-sans text-sm font-semibold leading-relaxed text-[#1F2A24]">
            If you experience network issues, contact Charis Consult support directly using the details
            below.
          </p>
          <div className="mt-4 space-y-3">
            {CHARIS_SUPPORT_PHONES.map((phone) => (
              <p key={phone} className="flex items-center gap-2 font-sans text-sm text-[#1F2A24]">
                <Smartphone className="h-4 w-4 shrink-0 text-[#4b2e6f]" />
                <span className="text-[#6b7280]">Phone number:</span>
                <span className="font-semibold">{phone}</span>
              </p>
            ))}
          </div>
        </div>

        <form id="agent-support-form" action={formAction} className="space-y-5 pb-4">
          <div className={AGENT_FIELD_BLOCK}>
            <Label htmlFor="issue_type" className={AGENT_FORM_LABEL_CLASS}>
              Type of issue
            </Label>
            <select
              id="issue_type"
              name="issue_type"
              required
              defaultValue=""
              className={AGENT_FORM_SELECT_CLASS}
            >
              <option value="" disabled>
                Select issue type
              </option>
              {AGENT_SUPPORT_ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={AGENT_FIELD_BLOCK}>
            <Label htmlFor="listing_reference" className={AGENT_FORM_LABEL_CLASS}>
              Listing ID
            </Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="listing_reference"
                name="listing_reference"
                type="text"
                placeholder="Enter listing ID (optional)"
                className={cn(AGENT_FORM_FIELD_CLASS, 'pl-10')}
              />
            </div>
          </div>

          <div className={AGENT_FIELD_BLOCK}>
            <Label htmlFor="description" className={AGENT_FORM_LABEL_CLASS}>
              Issue description
            </Label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Description of the issue"
              className={AGENT_FORM_TEXTAREA_CLASS}
            />
          </div>

          {state && 'success' in state ? (
            <p className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm font-medium text-[#15803d]">
              Your support ticket was submitted. The team will review it shortly.
            </p>
          ) : null}

          {state && 'error' in state ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}
        </form>
      </div>

      <div className="mt-auto shrink-0 pt-4 pb-2 lg:mt-8 lg:pb-0">
        <button
          type="submit"
          form="agent-support-form"
          disabled={isPending}
          className={AGENT_SETTINGS_PRIMARY_BTN}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
