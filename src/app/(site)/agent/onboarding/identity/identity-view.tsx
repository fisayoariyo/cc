'use client';

import { useRef, useState } from 'react';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import { useOnboardingSubmit } from '@/components/auth/use-onboarding-submit';
import {
  AgentProfilePhotoField,
  validateAgentProfilePhotoSelection,
} from '@/components/auth/agent-profile-photo-field';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FIELD_ERROR,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { validateNin } from '@/lib/auth/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { saveAgentDocuments } from '../actions';

type Profile = { nin: string | null; photo_url: string | null };

export function IdentityView({ profile }: { profile: Profile }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [nin, setNin] = useState(profile.nin ?? '');
  const [ninError, setNinError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const { isSubmitting, notice, setNotice, submit } = useOnboardingSubmit('/agent/onboarding/location');

  const actions = (
    <>
      {notice ? <AgentFormFeedback>{notice}</AgentFormFeedback> : null}
      <Button
        type="submit"
        form="identity-form"
        className={AGENT_PRIMARY_BTN}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Uploading...' : 'Continue'}
      </Button>
      <AgentBackButton href="/agent/onboarding/verify-email" label="Back" />
    </>
  );

  return (
    <AgentAuthShell
      title="Verify your identity"
      description="Upload your photo and enter your NIN to continue."
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      footerMode="pinned"
      actions={actions}
    >
      <form
        ref={formRef}
        id="identity-form"
        className={cn(AGENT_FORM_STACK, 'space-y-5 pt-1')}
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(null);

          const check = validateNin(nin);
          if (!check.ok) {
            setNinError(check.message);
            return;
          }
          setNinError(null);

          const photoCheck = validateAgentProfilePhotoSelection(selectedPhoto, Boolean(profile.photo_url));
          if (photoCheck) {
            setPhotoError(photoCheck);
            return;
          }
          setPhotoError(null);

          const fd = new FormData();
          fd.set('nin', nin.replace(/\D/g, ''));
          if (selectedPhoto) {
            fd.set('photo', selectedPhoto);
          } else if (profile.photo_url) {
            fd.set('has_existing_photo', '1');
          }

          void submit(() => saveAgentDocuments(null, fd));
        }}
      >
        <div className={AGENT_FIELD_BLOCK}>
          <AgentProfilePhotoField
            existingPhotoUrl={profile.photo_url}
            onFileChange={(file) => {
              setSelectedPhoto(file);
              setPhotoError(null);
            }}
          />
          {photoError ? (
            <p className={AGENT_FIELD_ERROR} role="alert">
              {photoError}
            </p>
          ) : null}
        </div>

        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="nin" className={AGENT_LABEL_CLASS}>
            NIN (11 digits)
          </Label>
          <Input
            id="nin"
            value={nin}
            onChange={(e) => {
              setNin(e.target.value.replace(/\D/g, '').slice(0, 11));
              setNinError(null);
            }}
            inputMode="numeric"
            maxLength={11}
            placeholder="Enter your 11-digit NIN"
            className={cn(AGENT_FIELD_CLASS, ninError && 'border-red-400')}
            required
          />
          {ninError ? (
            <p className={AGENT_FIELD_ERROR} role="alert">
              {ninError}
            </p>
          ) : null}
        </div>
      </form>
    </AgentAuthShell>
  );
}
