'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';
import {
  AGENT_AUTH_CONTENT_WIDTH,
  AgentAuthShell,
  CLIENT_AUTH_CONTENT_WIDTH,
  type AuthShellVariant,
} from '@/components/auth/AgentAuthShell';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FIELD_ERROR,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
} from '@/components/auth/agent-auth-styles';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export function ResetPasswordForm({
  agentMode = false,
  service,
}: {
  agentMode?: boolean;
  service?: 'travel' | 'real_estate';
}) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ variant: 'error' | 'success'; message: string } | null>(null);
  const [mismatch, setMismatch] = useState(false);

  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
  const backHref = agentMode
    ? '/reset-password/verify?role=agent'
    : service
      ? `/login?role=client&service=${service}`
      : '/login';
  const loginHref = agentMode
    ? '/login?role=agent'
    : service
      ? `/login?role=client&service=${service}`
      : '/login';

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSessionError('Configuration missing. Please contact support.');
      setReady(true);
      return;
    }
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setSessionError('Reset link is invalid or expired. Please request another one.');
      }
      setReady(true);
    })();
  }, [supabase]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMismatch(false);
    setSessionError(null);

    if (password.length < 6) {
      setToast({ variant: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setMismatch(true);
      return;
    }
    if (!supabase) {
      setToast({ variant: 'error', message: 'Configuration missing. Please contact support.' });
      return;
    }

    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setToast({ variant: 'error', message: humanizeAuthError(updateError.message) });
      return;
    }

    setToast({ variant: 'success', message: 'Password reset successfully' });
    window.setTimeout(() => {
      router.push(loginHref);
    }, 1200);
  }

  return (
    <AgentAuthShell
        title="Reset password"
        variant={shellVariant}
        description={agentMode ? 'Choose a new password for your account.' : 'Create your password and confirm it.'}
        visualTitle={agentMode ? 'Set a fresh password and continue' : undefined}
        visualCopy={
          agentMode
            ? 'Protect your Charis Consult account with a new password and return to your dashboard flow.'
            : undefined
        }
        agentAuthMobile={agentMode}
        contentWidthClass={agentMode ? AGENT_AUTH_CONTENT_WIDTH : CLIENT_AUTH_CONTENT_WIDTH}
        footerMode={agentMode ? 'pinned' : undefined}
        actions={
          agentMode ? (
            <>
              {toast ? (
                <AgentFormFeedback variant={toast.variant}>{toast.message}</AgentFormFeedback>
              ) : null}
              {sessionError && !toast ? <AgentFormFeedback>{sessionError}</AgentFormFeedback> : null}
              <Button type="submit" form="reset-form" className={AGENT_PRIMARY_BTN} disabled={!ready || pending}>
                {pending ? 'Updating...' : 'Continue'}
              </Button>
              <AgentBackButton href={backHref} />
            </>
          ) : undefined
        }
      >
        {agentMode ? (
          <form id="reset-form" onSubmit={(e) => void onSubmit(e)} className={AGENT_FORM_STACK}>
            <div className={AGENT_FIELD_BLOCK}>
              <Label htmlFor="password" className={AGENT_LABEL_CLASS}>
                Create your password
              </Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Write your password here"
                  className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className={AGENT_FIELD_BLOCK}>
              <Label htmlFor="confirm-password" className={AGENT_LABEL_CLASS}>
                Confirm password
              </Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setMismatch(false);
                  }}
                  placeholder="Confirm your password"
                  className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10', mismatch && 'border-red-400')}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mismatch ? (
                <p className={AGENT_FIELD_ERROR} role="alert">
                  Password doesn&apos;t match
                </p>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 lg:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Create your password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-[18px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-[18px]"
                />
                {mismatch ? <p className="text-sm text-destructive">Password doesn&apos;t match</p> : null}
              </div>
              <Button type="submit" className={AGENT_PRIMARY_BTN} disabled={!ready || pending}>
                {pending ? 'Updating...' : 'Continue'}
              </Button>
            </form>
          </div>
        )}
      </AgentAuthShell>
  );
}
