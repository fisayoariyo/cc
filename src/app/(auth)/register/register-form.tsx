'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { signUp, type SignUpState } from './actions';
import { AgentAuthShell, type AuthShellVariant } from '@/components/auth/AgentAuthShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CLIENT_COPY = {
  travel: {
    title: 'Create Travel Account',
    description: 'Open your Charis Consult travel account and manage your applications in one place.',
  },
  real_estate: {
    title: 'Create Real Estate Account',
    description: 'Open your Charis Consult real-estate account and continue into your dashboard.',
  },
} as const;

export function RegisterForm({
  defaultRole,
  defaultService,
}: {
  defaultRole: 'client' | 'agent';
  defaultService: 'travel' | 'real_estate';
}) {
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(signUp, null);
  const [showPassword, setShowPassword] = useState(false);

  const isAgentMode = defaultRole === 'agent';
  const shellVariant: AuthShellVariant = isAgentMode ? 'agent' : defaultService;
  const loginHref = isAgentMode ? '/login?role=agent' : `/login?role=client&service=${defaultService}`;

  return (
    <AgentAuthShell
      variant={shellVariant}
      title={isAgentMode ? 'Create Agent Account' : CLIENT_COPY[defaultService].title}
      description={
        isAgentMode
          ? 'Complete your details to create your Charis Consult agent account.'
          : CLIENT_COPY[defaultService].description
      }
    >
      <div className="space-y-5">
        {state && 'success' in state && state.success && state.needsEmailConfirmation ? (
          <div
            className="rounded-[18px] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
            role="status"
          >
            {state.role === 'agent'
              ? 'Check your email to confirm your account. After confirmation, you will go straight to the account under review page.'
              : 'Check your email to confirm your account before signing in.'}
          </div>
        ) : null}

        {state && 'error' in state ? (
          <div
            className="rounded-[18px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </div>
        ) : null}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="role" value={defaultRole} />
          <input type="hidden" name="service_interest" value={defaultService} />
          <input type="hidden" name="agency_name" value="" />
          {isAgentMode ? <input type="hidden" name="registration_number" value="" /> : null}

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Write your full name here"
                className="h-12 rounded-[18px] border-slate-200 pl-11"
              />
            </div>
          </div>

          {isAgentMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex h-12 overflow-hidden rounded-[18px] border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 border-r border-slate-200 px-4 text-sm text-slate-500">
                    <Phone className="h-4 w-4" />
                    +234
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="Input your phone number here"
                    className="h-full w-full bg-transparent px-4 text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

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
                <Label htmlFor="gender">Gender</Label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    defaultValue=""
                    className="h-12 w-full appearance-none rounded-[18px] border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </>
          ) : (
            <>
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

              {defaultService === 'travel' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="+234..."
                      className="h-12 rounded-[18px] border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passport_number">Passport number</Label>
                    <Input
                      id="passport_number"
                      name="passport_number"
                      type="text"
                      required
                      placeholder="A12345678"
                      className="h-12 rounded-[18px] border-slate-200"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="preferred_location">Preferred location</Label>
                    <Input
                      id="preferred_location"
                      name="preferred_location"
                      type="text"
                      required
                      placeholder="Ibadan"
                      className="h-12 rounded-[18px] border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget_range">Budget range</Label>
                    <Input
                      id="budget_range"
                      name="budget_range"
                      type="text"
                      required
                      placeholder="N50M - N90M"
                      className="h-12 rounded-[18px] border-slate-200"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">{isAgentMode ? 'Create your password' : 'Password'}</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={6}
                placeholder={isAgentMode ? 'Write your password here' : 'At least 6 characters'}
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

          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base"
            disabled={isPending}
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            variant="secondary"
            className="h-12 w-full rounded-full border border-border text-primary"
          >
            <Link href={loginHref}>
              {isAgentMode ? 'I already have an account' : 'I already have an account'}
            </Link>
          </Button>
          {isAgentMode ? null : (
            <Button asChild variant="ghost" className="h-12 w-full rounded-full">
              <Link href="/">Back to home</Link>
            </Button>
          )}
        </div>
      </div>
    </AgentAuthShell>
  );
}
