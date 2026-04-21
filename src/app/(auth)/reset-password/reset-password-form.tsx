'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';

export function ResetPasswordForm() {
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError('Reset link is invalid or expired. Please request another one.');
      }
      setReady(true);
    })();
  }, [supabase.auth]);

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
    <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.03fr]">
      <aside className="relative hidden min-h-[720px] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/20" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-11 w-auto" />
          <div className="space-y-3 text-primary-foreground">
            <h2 className="text-3xl font-medium leading-tight">Secure your account again</h2>
            <p className="max-w-md text-sm text-primary-foreground/90">
              Create a new strong password to continue using your DotCharis dashboard.
            </p>
          </div>
        </div>
      </aside>

      <section className="w-full p-5 sm:p-8 md:p-10">
        <div className="mb-6 lg:hidden">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-10 w-auto" />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your password and confirm it.</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Password updated successfully. You can now sign in.
          </div>
        ) : null}
        <form onSubmit={(e) => void onSubmit(e)} className="mt-4 space-y-5">
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
            />
          </div>
          <Button type="submit" className="w-full rounded-full py-5" disabled={!ready || pending}>
            {pending ? 'Updating…' : 'Continue'}
          </Button>
        </form>

        <Button asChild variant="secondary" className="mt-3 w-full rounded-full">
          <Link href="/login">Back</Link>
        </Button>
      </section>
    </div>
  );
}
