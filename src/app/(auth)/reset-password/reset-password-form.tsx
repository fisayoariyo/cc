'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';
import { AgentAuthShell, type AuthShellVariant } from '@/components/auth/AgentAuthShell';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SupabaseClient } from '@supabase/supabase-js';

export function ResetPasswordForm({
  agentMode = false,
  service,
}: {
  agentMode?: boolean;
  service?: 'travel' | 'real_estate';
}) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
  const backHref = agentMode
    ? '/login?role=agent'
    : service
      ? `/login?role=client&service=${service}`
      : '/login';

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Configuration missing. Please contact support.');
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
        setError('Reset link is invalid or expired. Please request another one.');
      }
      setReady(true);
    })();
  }, [supabase]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!supabase) {
      setError('Configuration missing. Please contact support.');
      return;
    }
    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(humanizeAuthError(updateError.message));
      return;
    }
    setSuccess(true);
  }

  return (
    <AgentAuthShell
      title="Reset password"
      variant={shellVariant}
      description="Create your password and confirm it."
      visualTitle={agentMode ? 'Set a fresh password and continue' : undefined}
      visualCopy={
        agentMode
          ? 'Protect your Charis Consult account with a new password and return to your dashboard flow.'
          : undefined
      }
      backHref={backHref}
      backLabel="Go back"
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-[18px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Password updated successfully. You can now sign in.
          </div>
        ) : null}

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Create your password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-[18px] border-slate-200 pl-11 pr-12"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                onClick={() => setShowConfirmPassword((value) => !value)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-[#0B7155] text-base hover:bg-[#095743]"
            disabled={!ready || pending}
          >
            {pending ? 'Updating...' : 'Continue'}
          </Button>
        </form>

        <Button
          asChild
          variant="secondary"
          className="h-12 w-full rounded-full border border-slate-200 bg-[#F6F8F7] text-[#0B7155] hover:bg-[#edf3f0]"
        >
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
    </AgentAuthShell>
  );
}
