'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { requestPasswordReset, type ForgotState } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<ForgotState, FormData>(
    requestPasswordReset,
    null,
  );

  return (
    <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.03fr]">
      <aside className="relative hidden min-h-[720px] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/20" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-11 w-auto" />
          <div className="space-y-3 text-primary-foreground">
            <h2 className="text-3xl font-medium leading-tight">Reset your account access</h2>
            <p className="max-w-md text-sm text-primary-foreground/90">
              Enter your email to get a secure reset link and continue your journey.
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
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your account email and we will send a reset link.
          </p>
        </div>

        {state && 'error' in state && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </div>
        )}
        {state && 'success' in state && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Reset email sent. Check your inbox and spam folder.
          </div>
        )}

        <form action={formAction} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </div>
          <Button type="submit" className="w-full rounded-full py-5" disabled={isPending}>
            {isPending ? 'Sending link…' : 'Continue'}
          </Button>
        </form>

        <Button asChild variant="secondary" className="mt-3 w-full rounded-full">
          <Link href="/login">Back</Link>
        </Button>
      </section>
    </div>
  );
}
