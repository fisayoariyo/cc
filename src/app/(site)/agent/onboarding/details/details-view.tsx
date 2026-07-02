'use client';

import { useEffect, useRef, useState } from 'react';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import { useOnboardingSubmit } from '@/components/auth/use-onboarding-submit';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FIELD_ERROR,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { validateFirstLastName } from '@/lib/auth/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { saveAgentDetails, submitAgentOnboarding } from '../actions';

type Profile = {
  agent_address: string | null;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  next_of_kin_relationship: string | null;
};

export function DetailsView({ profile }: { profile: Profile }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [kinFirstName, setKinFirstName] = useState('');
  const [kinLastName, setKinLastName] = useState('');
  const [kinFirstError, setKinFirstError] = useState<string | null>(null);
  const [kinLastError, setKinLastError] = useState<string | null>(null);
  const { isSubmitting, notice: submitNotice, submit } = useOnboardingSubmit();
  const displayNotice = submitNotice;

  useEffect(() => {
    if (profile.next_of_kin_name) {
      const parts = profile.next_of_kin_name.trim().split(/\s+/);
      setKinFirstName(parts[0] ?? '');
      setKinLastName(parts.slice(1).join(' '));
    }
  }, [profile.next_of_kin_name]);

  const actions = (
    <>
      {displayNotice ? <AgentFormFeedback>{displayNotice}</AgentFormFeedback> : null}
      <Button type="submit" form="details-form" className={AGENT_PRIMARY_BTN} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit for review'}
      </Button>
      <AgentBackButton href="/agent/onboarding/location" label="Back" />
    </>
  );

  return (
    <AgentAuthShell
      title="Next of kin & address"
      description="Add your residential address and next of kin details."
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      footerMode="pinned"
      actions={actions}
    >
      <form
        ref={formRef}
        id="details-form"
        className={AGENT_FORM_STACK}
        onSubmit={(e) => {
          e.preventDefault();
          const form = formRef.current ?? e.currentTarget;
          const kinCheck = validateFirstLastName(kinFirstName, kinLastName);
          if (!kinCheck.ok) {
            if (kinCheck.field === 'first') {
              setKinFirstError(kinCheck.message);
              setKinLastError(null);
            } else {
              setKinLastError(kinCheck.message);
              setKinFirstError(null);
            }
            return;
          }
          setKinFirstError(null);
          setKinLastError(null);
          void submit(async () => {
            const fd = new FormData(form);
            fd.set('next_of_kin_name', `${kinFirstName.trim()} ${kinLastName.trim()}`);
            const saveRes = await saveAgentDetails(null, fd);
            if (saveRes && 'error' in saveRes) return saveRes;
            return submitAgentOnboarding();
          });
        }}
      >
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="agent_address" className={AGENT_LABEL_CLASS}>
            Address
          </Label>
          <Input
            id="agent_address"
            name="agent_address"
            defaultValue={profile.agent_address ?? ''}
            placeholder="Enter your residential address"
            className={AGENT_FIELD_CLASS}
            required
          />
        </div>
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="kin_first_name" className={AGENT_LABEL_CLASS}>
            Next of kin first name
          </Label>
          <Input
            id="kin_first_name"
            value={kinFirstName}
            onChange={(e) => {
              setKinFirstName(e.target.value);
              setKinFirstError(null);
            }}
            placeholder="First name"
            className={cn(AGENT_FIELD_CLASS, kinFirstError && 'border-red-400')}
            required
          />
          {kinFirstError ? <p className={AGENT_FIELD_ERROR}>{kinFirstError}</p> : null}
        </div>
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="kin_last_name" className={AGENT_LABEL_CLASS}>
            Next of kin last name
          </Label>
          <Input
            id="kin_last_name"
            value={kinLastName}
            onChange={(e) => {
              setKinLastName(e.target.value);
              setKinLastError(null);
            }}
            placeholder="Last name"
            className={cn(AGENT_FIELD_CLASS, kinLastError && 'border-red-400')}
            required
          />
          {kinLastError ? <p className={AGENT_FIELD_ERROR}>{kinLastError}</p> : null}
        </div>
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="next_of_kin_phone" className={AGENT_LABEL_CLASS}>
            Next of kin phone
          </Label>
          <Input
            id="next_of_kin_phone"
            name="next_of_kin_phone"
            type="tel"
            defaultValue={profile.next_of_kin_phone ?? ''}
            placeholder="+234..."
            className={AGENT_FIELD_CLASS}
            required
          />
        </div>
        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="next_of_kin_relationship" className={AGENT_LABEL_CLASS}>
            Relationship
          </Label>
          <Input
            id="next_of_kin_relationship"
            name="next_of_kin_relationship"
            defaultValue={profile.next_of_kin_relationship ?? ''}
            placeholder="e.g. Spouse, Parent, Sibling"
            className={AGENT_FIELD_CLASS}
            required
          />
        </div>
      </form>
    </AgentAuthShell>
  );
}
