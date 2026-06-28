'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NIGERIA_STATES, lgasForState } from '@/lib/nigeria-locations';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import { useOnboardingSubmit } from '@/components/auth/use-onboarding-submit';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
  AGENT_SELECT_CLASS,
} from '@/components/auth/agent-auth-styles';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveAgentLocation } from '../actions';

type Profile = { agent_state: string | null; agent_lga: string | null };

export function LocationView({ profile }: { profile: Profile }) {
  const [state, setState] = useState(profile.agent_state ?? '');
  const [lga, setLga] = useState(profile.agent_lga ?? '');
  const { isSubmitting, notice, submit } = useOnboardingSubmit('/agent/onboarding/details');
  const lgaOptions = useMemo(() => lgasForState(state), [state]);

  const actions = (
    <>
      {notice ? <AgentFormFeedback>{notice}</AgentFormFeedback> : null}
      <Button type="submit" form="location-form" className={AGENT_PRIMARY_BTN} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
      <AgentBackButton href="/agent/onboarding/identity" label="Back" />
    </>
  );

  return (
    <AgentAuthShell
      title="Select your assigned location"
      description="Select the location you were assigned to"
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      footerMode="pinned"
      actions={actions}
    >
      <form
        id="location-form"
        className={AGENT_FORM_STACK}
        onSubmit={(e) => {
          e.preventDefault();
          void submit(() => saveAgentLocation(null, new FormData(e.currentTarget)));
        }}
      >
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="agent_state" className={AGENT_LABEL_CLASS}>
            State
          </Label>
          <div className="relative">
            <select
              id="agent_state"
              name="agent_state"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setLga('');
              }}
              className={AGENT_SELECT_CLASS}
              required
            >
              <option value="" disabled>
                Select state
              </option>
              {NIGERIA_STATES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          </div>
        </div>
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="agent_lga" className={AGENT_LABEL_CLASS}>
            Local government
          </Label>
          <div className="relative">
            <select
              id="agent_lga"
              name="agent_lga"
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              className={AGENT_SELECT_CLASS}
              required
              disabled={!state}
            >
              <option value="" disabled>
                {state ? 'Select local government' : 'Select state first'}
              </option>
              {lgaOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          </div>
        </div>
      </form>
    </AgentAuthShell>
  );
}
