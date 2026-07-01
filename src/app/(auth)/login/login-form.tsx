'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { signIn, type SignInState } from './actions';
import {
  AGENT_AUTH_CONTENT_WIDTH,
  AgentAuthShell,
  CLIENT_AUTH_CONTENT_WIDTH,
  type AuthShellVariant,
} from '@/components/auth/AgentAuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
  AGENT_SECONDARY_BTN,
} from '@/components/auth/agent-auth-styles';

const LOGIN_FORM_ID = 'portal-login-form';

const LOGIN_DESCRIPTION = {
  agent: 'Sign in to continue your agent onboarding or return to your dashboard.',
  travel: 'Sign in to manage your travel applications and track updates from your dashboard.',
  real_estate: 'Sign in to access saved properties, searches, and your real-estate dashboard.',
  construction: 'Sign in to follow construction requests, BOQ updates, and project milestones.',
} as const;

export function LoginForm({
  nextPath,
  errorFromUrl,
  messageFromUrl,
  agentMode,
  service,
}: {
  nextPath: string | undefined;
  errorFromUrl: string | undefined;
  messageFromUrl: string | undefined;
  agentMode: boolean;
  service?: 'travel' | 'real_estate' | 'construction';
}) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  const displayError = state?.error ?? errorFromUrl;
  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
  const useBrandedLayout = agentMode || Boolean(service);

  const forgotPasswordHref = agentMode
    ? '/forgot-password?role=agent'
    : service
      ? `/forgot-password?role=client&service=${service}`
      : '/forgot-password';
  const registerHref = agentMode
    ? '/register?role=agent'
    : service
      ? `/register?role=client&service=${service}`
      : '/register';

  const description = agentMode
    ? LOGIN_DESCRIPTION.agent
    : service
      ? LOGIN_DESCRIPTION[service]
      : 'Sign in with your email and password to open the right Charis Consult dashboard.';

  const formFields = (
    <>
      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="email" className={AGENT_LABEL_CLASS}>
          Email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <Link
          href={forgotPasswordHref}
          className="font-sans text-sm font-semibold text-[#3B0063] transition hover:text-[#2E004D]"
        >
          Forgot password?
        </Link>
      </div>
    </>
  );

  const brandedActions = (
    <>
      {messageFromUrl ? <AgentFormFeedback variant="success">{messageFromUrl}</AgentFormFeedback> : null}
      {displayError ? <AgentFormFeedback>{displayError}</AgentFormFeedback> : null}
      <Button type="submit" form={LOGIN_FORM_ID} className={AGENT_PRIMARY_BTN} disabled={isPending}>
        {isPending ? 'Signing in...' : 'Continue'}
      </Button>
      <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
        <Link href={registerHref}>I don&apos;t have an account</Link>
      </Button>
    </>
  );

  return (
    <AgentAuthShell
      title="Log in to your account"
      variant={shellVariant}
      description={description}
      visualTitle={agentMode ? 'Welcome back to Charis Consult agents' : undefined}
      visualCopy={
        agentMode
          ? 'Return to your onboarding status, update your review progress, and continue into your agent workspace once approved.'
          : undefined
      }
      contentWidthClass={useBrandedLayout ? AGENT_AUTH_CONTENT_WIDTH : CLIENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile={useBrandedLayout}
      footerMode={useBrandedLayout ? 'inline' : undefined}
      showMobileLogo={!useBrandedLayout}
      actions={useBrandedLayout ? brandedActions : undefined}
    >
      {useBrandedLayout ? (
        <form id={LOGIN_FORM_ID} action={formAction} className={AGENT_FORM_STACK}>
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          {formFields}
        </form>
      ) : (
        <div className="space-y-5">
          {displayError ? (
            <div
              className="rounded-[18px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {displayError}
            </div>
          ) : null}
          {messageFromUrl ? (
            <div className="rounded-[18px] border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
              {messageFromUrl}
            </div>
          ) : null}

          <form action={formAction} className="space-y-5">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            {formFields}

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-[#3B0063] text-lg font-semibold text-white hover:bg-[#2E004D]"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Continue'}
            </Button>
          </form>

          <Button
            asChild
            variant="secondary"
            className="h-12 w-full rounded-full border border-[#d9c8eb] bg-[#f3ebfa] text-lg font-medium text-[#3B0063] hover:bg-[#ebe0f5]"
          >
            <Link href={registerHref}>I don&apos;t have an account</Link>
          </Button>
        </div>
      )}
    </AgentAuthShell>
  );
}
