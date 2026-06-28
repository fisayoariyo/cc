'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentOtpInput } from '@/components/auth/agent-otp-input';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  AGENT_BODY_TEXT,
  AGENT_OTP_LENGTH,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { maskEmailForDisplay, REGISTER_EMAIL_KEY } from '@/lib/auth/register-email';
import { resendAgentSignupOtp } from './actions';
import { Button } from '@/components/ui/button';

export function VerifyEmailView({ email }: { email: string | null }) {
  const router = useRouter();
  const [storedEmail, setStoredEmail] = useState(email);
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: 'error' | 'success'; message: string } | null>(
    null,
  );

  useEffect(() => {
    if (email) return;
    const fromStorage = sessionStorage.getItem(REGISTER_EMAIL_KEY);
    if (fromStorage) setStoredEmail(fromStorage);
  }, [email]);

  const displayEmail = storedEmail ? maskEmailForDisplay(storedEmail) : 'your email';

  async function handleContinue() {
    if (!storedEmail || code.length < AGENT_OTP_LENGTH) {
      setFeedback({ variant: 'error', message: 'Incorrect code, try again' });
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: storedEmail,
      token: code,
      type: 'signup',
    });
    setPending(false);
    if (error) {
      setFeedback({ variant: 'error', message: 'Incorrect code, try again' });
      return;
    }
    sessionStorage.removeItem(REGISTER_EMAIL_KEY);
    router.push('/agent/onboarding/identity');
    router.refresh();
  }

  async function handleResend() {
    setPending(true);
    const res = await resendAgentSignupOtp();
    setPending(false);
    if (res && 'error' in res) {
      setFeedback({ variant: 'error', message: res.error });
      return;
    }
    setFeedback({ variant: 'success', message: 'Code sent again' });
  }

  const actions = (
    <>
      {feedback?.variant === 'success' ? (
        <AgentFormFeedback variant="success">{feedback.message}</AgentFormFeedback>
      ) : null}
      <Button
        type="button"
        disabled={pending || code.length < AGENT_OTP_LENGTH}
        onClick={() => void handleContinue()}
        className={AGENT_PRIMARY_BTN}
      >
        {pending ? 'Verifying...' : 'Continue'}
      </Button>
      <AgentBackButton href="/register?role=agent" label="Edit account details" />
    </>
  );

  return (
    <AgentAuthShell
      title="Verify email address"
      description="Enter the 6-digit code we sent to your registered email address"
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      footerMode="pinned"
      actions={actions}
    >
      <div className="space-y-5">
        {feedback?.variant === 'error' ? (
          <AgentFormFeedback>{feedback.message}</AgentFormFeedback>
        ) : null}
        <p className={AGENT_BODY_TEXT}>
          Code sent to <span className="font-medium text-[#111827]">{displayEmail}</span>
        </p>
        <AgentOtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setFeedback(null);
          }}
        />
        <p className={AGENT_BODY_TEXT}>
          I did not receive a code.{' '}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={pending}
            className="font-semibold text-[#3B0063]"
          >
            Resend Code
          </button>
        </p>
      </div>
    </AgentAuthShell>
  );
}
