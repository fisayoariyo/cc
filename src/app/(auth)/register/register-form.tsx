'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signUp, type SignUpState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';

const SERVICE_LABELS = {
  travel: 'Travel',
  real_estate: 'Real Estate',
  construction: 'Construction',
} as const;

const SERVICE_VISUAL = {
  travel:
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80',
  real_estate:
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1600&q=80',
  construction:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
} as const;

export function RegisterForm({
  defaultRole,
  defaultService,
}: {
  defaultRole: 'client' | 'agent';
  defaultService: 'travel' | 'real_estate' | 'construction';
}) {
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(signUp, null);
  const [role, setRole] = useState<'client' | 'agent'>(defaultRole);
  const [service, setService] = useState<'travel' | 'real_estate' | 'construction'>(defaultService);

  useEffect(() => {
    if (role === 'agent') {
      setService('real_estate');
    }
  }, [role]);

  const visualService = role === 'agent' ? 'real_estate' : service;
  const panelTitle = role === 'agent' ? 'Become a Verified Agent' : `Open Your ${SERVICE_LABELS[service]} Account`;
  const panelCopy =
    role === 'agent'
      ? 'List properties, manage leads, and publish after admin verification and onboarding payment.'
      : service === 'travel'
        ? 'Register to track visas, relocation steps, document reviews, and travel milestones.'
        : service === 'real_estate'
          ? 'Register to manage favorites, compare listings, and follow your property journey.'
          : 'Register to track your construction project stages and updates in one dashboard.';

  const serviceFields = useMemo(() => {
    if (service === 'travel') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+234..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passport_number">Passport number</Label>
            <Input id="passport_number" name="passport_number" type="text" required placeholder="A12345678" />
          </div>
        </>
      );
    }

    if (service === 'real_estate') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="preferred_location">Preferred location</Label>
            <Input id="preferred_location" name="preferred_location" type="text" required placeholder="Ibadan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget_range">Budget range</Label>
            <Input id="budget_range" name="budget_range" type="text" required placeholder="₦50M - ₦90M" />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="project_type">Project type</Label>
          <Input id="project_type" name="project_type" type="text" required placeholder="Residential duplex" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project_location">Project location</Label>
          <Input id="project_location" name="project_location" type="text" required placeholder="Lagos" />
        </div>
      </>
    );
  }, [service]);

  return (
    <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-[1fr_1.03fr]">
      <aside className="relative hidden min-h-[720px] lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SERVICE_VISUAL[visualService]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/25" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-11 w-auto" />
          <div className="space-y-3 text-primary-foreground">
            <h2 className="text-3xl font-medium leading-tight">{panelTitle}</h2>
            <p className="max-w-md text-sm text-primary-foreground/90">{panelCopy}</p>
          </div>
        </div>
      </aside>

      <section className="w-full p-5 sm:p-8 md:p-10">
        <div className="mb-6 lg:hidden">
          <Image src={logoLockupColor} alt="DotCharis Consult" className="h-10 w-auto" />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {role === 'agent'
              ? 'Submit your details. After email confirmation and login, your profile remains under review until admin verifies it.'
              : 'Choose your service and complete the required details to access your dashboard.'}
          </p>
        </div>

        {state && 'success' in state && state.success && state.needsEmailConfirmation && (
          <div
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
          >
            {state.role === 'agent'
              ? 'Check your email to confirm your account. After sign-in, your agent profile remains under review until admin verification.'
              : 'Check your email to confirm your account before signing in.'}
          </div>
        )}

        {state && 'error' in state && (
          <div
            className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              role === 'client' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole('agent')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              role === 'agent' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Agent
          </button>
        </div>

        {role === 'client' ? (
          <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(['travel', 'real_estate', 'construction'] as const).map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => setService(svc)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                  service === svc
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                }`}
              >
                {SERVICE_LABELS[svc]}
              </button>
            ))}
          </div>
        ) : null}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="service_interest" value={service} />
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Doe"
            />
          </div>

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

          {role === 'agent' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+234..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_name">Agency Name (optional)</Label>
                <Input id="agency_name" name="agency_name" type="text" placeholder="Your agency" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration_number">NIN or Business Registration Number</Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  type="text"
                  required
                  placeholder="Required for verification"
                />
              </div>
            </>
          ) : (
            serviceFields
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <Button type="submit" className="w-full rounded-full py-5" disabled={isPending}>
            {isPending ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full rounded-full bg-transparent">
            <Link href="/login">Already have an account?</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full rounded-full">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
