'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, type SignInState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';

export function LoginForm({
  nextPath,
  errorFromUrl,
  messageFromUrl,
}: {
  nextPath: string | undefined;
  errorFromUrl: string | undefined;
  messageFromUrl: string | undefined;
}) {
  const [state, formAction, isPending] = useActionState<SignInState, FormData>(signIn, null);

  const displayError = state?.error ?? errorFromUrl;

  return (
    <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.03fr]">
      <aside className="relative hidden min-h-[720px] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/20" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-11 w-auto" />
          <div className="space-y-3 text-primary-foreground">
            <h2 className="text-3xl font-medium leading-tight">Welcome back to DotCharis</h2>
            <p className="max-w-md text-sm text-primary-foreground/90">
              Access your dashboard to continue with your property, travel, or construction journey.
            </p>
          </div>
        </div>
      </aside>

      <section className="w-full p-5 sm:p-8 md:p-10">
        <div className="mb-6 lg:hidden">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-10 w-auto" />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Log in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your email and password to open your dashboard.
          </p>
        </div>

        {displayError && (
          <div
            className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {displayError}
          </div>
        )}
        {messageFromUrl && (
          <div className="mb-4 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
            {messageFromUrl}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
            />
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary font-medium underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full rounded-full py-5" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Continue'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="secondary" className="w-full rounded-full">
            <Link href="/register">I don&apos;t have an account</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Back to{' '}
            <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
              home
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
