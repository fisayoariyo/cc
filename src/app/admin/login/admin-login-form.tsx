'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { signIn, type SignInState } from '@/app/(auth)/login/actions';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  ADMIN_LOGIN_ACTIONS_GAP,
  ADMIN_LOGIN_FORGOT_LINK,
  ADMIN_LOGIN_PRIMARY_BTN,
  ADMIN_LOGIN_TITLE_MB,
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
} from '@/components/auth/agent-auth-styles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';

export function AdminLoginForm({
  nextPath,
  errorFromUrl,
  messageFromUrl,
}: {
  nextPath: string | undefined;
  errorFromUrl: string | undefined;
  messageFromUrl: string | undefined;
}) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  const displayError = state?.error ?? errorFromUrl;

  return (
    <AgentAuthShell
      title="Log in to your account"
      variant="admin"
      contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile
      headerAlign="center"
      showMobileLogo={false}
      titleClassName={ADMIN_LOGIN_TITLE_MB}
      footerMode="inline"
      actionsClassName={ADMIN_LOGIN_ACTIONS_GAP}
      rightClassName="lg:justify-start lg:pt-14 xl:pt-16"
      actions={
        <>
          {messageFromUrl ? (
            <AgentFormFeedback variant="success">{messageFromUrl}</AgentFormFeedback>
          ) : null}
          {displayError ? <AgentFormFeedback>{displayError}</AgentFormFeedback> : null}
          <Button type="submit" form="admin-login-form" className={ADMIN_LOGIN_PRIMARY_BTN} disabled={isPending}>
            {isPending ? 'Signing in...' : 'Log in'}
          </Button>
        </>
      }
    >
      <form id="admin-login-form" action={formAction} className={AGENT_FORM_STACK}>
        <input type="hidden" name="intent" value="admin" />
        {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="email" className={AGENT_LABEL_CLASS}>
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email here"
              className={cn(AGENT_FIELD_CLASS, 'pl-10')}
            />
          </div>
        </div>

        <div className={AGENT_FIELD_BLOCK}>
          <Label htmlFor="password" className={AGENT_LABEL_CLASS}>
            Password
          </Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="Write your password here"
              className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10')}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#111827]"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className={ADMIN_LOGIN_FORGOT_LINK}>
            Forgot password?
          </Link>
        </div>
      </form>
    </AgentAuthShell>
  );
}
