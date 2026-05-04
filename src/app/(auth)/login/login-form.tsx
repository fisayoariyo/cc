'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { signIn, type SignInState } from './actions';
import { AgentAuthShell, type AuthShellVariant } from '@/components/auth/AgentAuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  service?: 'travel' | 'real_estate';
}) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  const displayError = state?.error ?? errorFromUrl;
  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
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

  return (
    <AgentAuthShell
      title="Log in to your account"
      variant={shellVariant}
      description={
        agentMode
          ? 'Sign in to continue your agent onboarding or return to your dashboard.'
          : 'Sign in with your email and password to open the right Charis Consult dashboard.'
      }
      visualTitle={agentMode ? 'Welcome back to Charis Consult agents' : undefined}
      visualCopy={
        agentMode
          ? 'Return to your onboarding status, update your review progress, and continue into your agent workspace once approved.'
          : undefined
      }
    >
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
                className="h-12 rounded-[18px] border-slate-200 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Write your password here"
                className="h-12 rounded-[18px] border-slate-200 pl-11 pr-12"
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
              className="text-sm font-medium text-primary transition hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base"
            disabled={isPending}
          >
            {isPending ? 'Signing in...' : 'Continue'}
          </Button>
        </form>

        <Button
          asChild
          variant="secondary"
          className="h-12 w-full rounded-full border border-border text-primary"
        >
          <Link href={registerHref}>I don&apos;t have an account</Link>
        </Button>
      </div>
    </AgentAuthShell>
  );
}
