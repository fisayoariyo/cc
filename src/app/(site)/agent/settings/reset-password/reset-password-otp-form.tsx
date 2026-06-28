'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { resendAgentPasswordResetOtp } from '@/app/(auth)/reset-password/verify/actions';
import { maskEmailForDisplay } from '@/lib/auth/reset-email';
import { AGENT_SETTINGS_PRIMARY_BTN } from '@/lib/agent-settings-theme';
import { AgentSettingsPanel } from '@/components/agent/agent-settings-panel';
import { AgentOtpInput } from '@/components/auth/agent-otp-input';
import { AGENT_OTP_LENGTH } from '@/components/auth/agent-auth-styles';

export function AgentSettingsResetPasswordOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const sentRef = useRef(false);
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    void resendAgentPasswordResetOtp(email).then((result) => {
      if (result && 'error' in result) {
        setFeedback(result.error);
      }
    });
  }, [email]);

  async function handleContinue() {
    if (code.length < AGENT_OTP_LENGTH) {
      setFeedback('Incorrect code, try again');
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setPending(false);

    if (error) {
      setFeedback('Incorrect code, try again');
      return;
    }

    router.push('/agent/settings/reset-password/new');
  }

  async function handleResend() {
    setPending(true);
    const result = await resendAgentPasswordResetOtp(email);
    setPending(false);
    if (result && 'error' in result) {
      setFeedback(result.error);
      return;
    }
    setFeedback(null);
    setResendMessage('Code sent again');
  }

  return (
    <AgentSettingsPanel
      title="Reset password"
      backHref="/agent/settings"
      footer={
        <button
          type="button"
          disabled={pending || code.length < AGENT_OTP_LENGTH}
          onClick={() => void handleContinue()}
          className={AGENT_SETTINGS_PRIMARY_BTN}
        >
          {pending ? 'Verifying...' : 'Continue'}
        </button>
      }
    >
      <div className="space-y-6">
        <p className="font-sans text-sm leading-relaxed text-[#1F2A24]">
          Enter the 6-digit code we sent to your registered email:{' '}
          <span className="font-semibold">{maskEmailForDisplay(email)}</span>.
        </p>

        <AgentOtpInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setFeedback(null);
            setResendMessage(null);
          }}
          className="max-w-md"
        />

        <p className="font-sans text-sm text-[#6b7280]">
          I did not receive a code.{' '}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={pending}
            className="font-semibold text-[#4b2e6f] hover:underline"
          >
            Resend Code
          </button>
        </p>

        {feedback ? (
          <p className="text-sm font-medium text-red-600" role="alert">
            {feedback}
          </p>
        ) : null}
        {resendMessage ? (
          <p className="text-sm font-medium text-[#15803d]" role="status">
            {resendMessage}
          </p>
        ) : null}
      </div>
    </AgentSettingsPanel>
  );
}
