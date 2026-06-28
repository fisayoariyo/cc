'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { requestPasswordReset, type ForgotState } from './actions';
import { sendAgentPasswordResetOtp, type OtpSendState } from '@/app/(auth)/reset-password/verify/actions';
import { RESET_EMAIL_KEY } from '@/lib/auth/reset-email';
import {
  AGENT_AUTH_CONTENT_WIDTH,
  AgentAuthShell,
  CLIENT_AUTH_CONTENT_WIDTH,
  type AuthShellVariant,
} from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  AGENT_BODY_TEXT,
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FORM_STACK,
  AGENT_INPUT_INNER_CLASS,
  AGENT_INPUT_WRAPPER_CLASS,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

const CLIENT_FIELD_CLASS =
  'h-12 rounded-2xl border-slate-200 text-base placeholder:text-slate-400 lg:rounded-[18px] lg:text-lg';

export function ForgotPasswordForm({
  agentMode = false,
  service,
}: {
  agentMode?: boolean;
  service?: 'travel' | 'real_estate';
}) {
  const router = useRouter();
  const [emailState, emailAction, emailPending] = useActionState<ForgotState, FormData>(
    requestPasswordReset,
    null,
  );
  const [otpState, otpAction, otpPending] = useActionState<OtpSendState, FormData>(
    sendAgentPasswordResetOtp,
    null,
  );

  const state = agentMode ? otpState : emailState;
  const formAction = agentMode ? otpAction : emailAction;
  const isPending = agentMode ? otpPending : emailPending;

  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
  const backHref = agentMode
    ? '/login?role=agent'
    : service
      ? `/login?role=client&service=${service}`
      : '/login';

  useEffect(() => {
    if (agentMode && otpState && 'success' in otpState && otpState.success) {
      sessionStorage.setItem(RESET_EMAIL_KEY, otpState.email);
      router.push('/reset-password/verify?role=agent');
    }
  }, [agentMode, otpState, router]);

  return (
    <AgentAuthShell
      title="Reset password"
      variant={shellVariant}
      description={
        agentMode
          ? "We'll email a code to your registered address."
          : 'Enter your account email and we will send a reset link.'
      }
      visualTitle={agentMode ? 'Keep agent access secure' : undefined}
      visualCopy={
        agentMode
          ? 'Recover access quickly and continue your onboarding or dashboard work without losing progress.'
          : undefined
      }
      agentAuthMobile={agentMode}
      contentWidthClass={agentMode ? AGENT_AUTH_CONTENT_WIDTH : CLIENT_AUTH_CONTENT_WIDTH}
      footerMode={agentMode ? 'pinned' : undefined}
      actions={
        agentMode ? (
          <>
            <Button type="submit" form="forgot-form" className={AGENT_PRIMARY_BTN} disabled={isPending}>
              {isPending ? 'Sending code...' : 'Continue'}
            </Button>
            <AgentBackButton href={backHref} label="Back to log in" />
          </>
        ) : undefined
      }
    >
      {agentMode ? (
        <form id="forgot-form" action={formAction} className={AGENT_FORM_STACK}>
          <input type="hidden" name="role" value="agent" />
          <p className={AGENT_BODY_TEXT}>
            Enter your registered email address. We&apos;ll send a verification code to continue.
          </p>
          {state && 'error' in state ? <AgentFormFeedback>{state.error}</AgentFormFeedback> : null}
          <div className={AGENT_FIELD_BLOCK}>
            <Label htmlFor="email" className={AGENT_LABEL_CLASS}>
              Email Address
            </Label>
            <div className={AGENT_INPUT_WRAPPER_CLASS}>
              <Mail className="h-[18px] w-[18px] shrink-0 text-[#9ca3af]" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email here"
                className={AGENT_INPUT_INNER_CLASS}
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          {state && 'success' in state ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary lg:rounded-[18px]">
              Reset email sent. Check your inbox and spam folder.
            </div>
          ) : null}

          <form action={formAction} className="space-y-4 lg:space-y-5">
            <input type="hidden" name="role" value="client" />
            {service ? <input type="hidden" name="service" value={service} /> : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email here"
                  className={cn(CLIENT_FIELD_CLASS, 'pl-11')}
                />
              </div>
            </div>

            <Button type="submit" className={AGENT_PRIMARY_BTN} disabled={isPending}>
              {isPending ? 'Sending link...' : 'Continue'}
            </Button>
          </form>
        </div>
      )}
    </AgentAuthShell>
  );
}
