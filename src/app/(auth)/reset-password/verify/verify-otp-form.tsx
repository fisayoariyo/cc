'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { resendAgentPasswordResetOtp } from './actions';
import { maskEmailForDisplay, RESET_EMAIL_KEY } from '@/lib/auth/reset-email';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentOtpInput } from '@/components/auth/agent-otp-input';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  AGENT_BODY_TEXT,
  AGENT_OTP_LENGTH,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { Button } from '@/components/ui/button';

export function VerifyOtpForm({ agentMode = false }: { agentMode?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: 'error' | 'success'; message: string } | null>(
    null,
  );

  const backHref = agentMode ? '/forgot-password?role=agent' : '/forgot-password';

  useEffect(() => {
    const stored = sessionStorage.getItem(RESET_EMAIL_KEY);
    if (stored) setEmail(stored);
  }, []);

  async function handleContinue() {
    if (!email || code.length < AGENT_OTP_LENGTH) {
      setFeedback({ variant: 'error', message: 'Incorrect code, try again' });
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setPending(false);
    if (error) {
      setFeedback({ variant: 'error', message: 'Incorrect code, try again' });
      return;
    }
    router.push(agentMode ? '/reset-password?role=agent' : '/reset-password');
  }

  async function handleResend() {
    if (!email) return;
    setPending(true);
    const res = await resendAgentPasswordResetOtp(email);
    setPending(false);
    if (res && 'error' in res) {
      setFeedback({ variant: 'error', message: res.error });
      return;
    }
    setFeedback({ variant: 'success', message: 'Code sent again' });
  }

  const displayEmail = email ? maskEmailForDisplay(email) : 'your email';

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
      <AgentBackButton href={backHref} />
    </>
  );

  return (
    <AgentAuthShell
      title="Reset password"
      description="Enter the 6-digit code we sent to your email"
      variant={agentMode ? 'agent' : 'generic'}
      agentAuthMobile={agentMode}
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      footerMode="pinned"
      actions={agentMode ? actions : undefined}
    >
      <div className="space-y-5">
        {feedback?.variant === 'error' ? (
          <AgentFormFeedback>{feedback.message}</AgentFormFeedback>
        ) : null}
        <p className={AGENT_BODY_TEXT}>
          Code sent to <span className="font-medium text-[#111827]">{displayEmail}</span>
        </p>
        <AgentOtpInput value={code} onChange={(v) => { setCode(v); setFeedback(null); }} />
        <p className={AGENT_BODY_TEXT}>
          I did not receive a code.{' '}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={pending || !email}
            className="font-semibold text-[#3B0063]"
          >
            Resend Code
          </button>
        </p>
        {!agentMode ? (
          <div className="space-y-3 pt-4">
            <Button
              type="button"
              disabled={pending || code.length < AGENT_OTP_LENGTH}
              onClick={() => void handleContinue()}
              className={AGENT_PRIMARY_BTN}
            >
              {pending ? 'Verifying...' : 'Continue'}
            </Button>
            <AgentBackButton href={backHref} />
          </div>
        ) : null}
      </div>
    </AgentAuthShell>
  );
}
