'use client';

import { FormEvent, useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { signUp, type SignUpState } from './actions';
import { validateFullNameSingleField } from '@/lib/auth/validation';
import { AgentBackButton } from '@/components/auth/agent-auth-page-body';
import { AgentFormFeedback } from '@/components/auth/agent-form-feedback';
import { REGISTER_EMAIL_KEY } from '@/lib/auth/register-email';
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
import {
  AGENT_FIELD_BLOCK,
  AGENT_FIELD_CLASS,
  AGENT_FORM_STACK,
  AGENT_LABEL_CLASS,
  AGENT_PRIMARY_BTN,
  AGENT_SECONDARY_BTN,
  AGENT_SELECT_CLASS,
} from '@/components/auth/agent-auth-styles';

const CLIENT_COPY = {
  travel: {
    title: 'Create Travel Account',
    description: 'Open your Charis Consult travel account and manage your applications in one place.',
  },
  real_estate: {
    title: 'Create Real Estate Account',
    description: 'Open your Charis Consult real-estate account and continue into your dashboard.',
  },
  construction: {
    title: 'Create Construction Account',
    description: 'Open your Charis Consult construction workspace to start a project and track milestones.',
  },
} as const;

export function RegisterForm({
  defaultRole,
  defaultService,
}: {
  defaultRole: 'client' | 'agent';
  defaultService: 'travel' | 'real_estate' | 'construction';
}) {
  const [state, formAction, isPending] = useActionState<SignUpState, FormData>(signUp, null);
  const router = useRouter();
  const [submitting, startSubmit] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const isAgentMode = defaultRole === 'agent';
  const shellVariant: AuthShellVariant = isAgentMode ? 'agent' : defaultService;
  const loginHref = isAgentMode ? '/login?role=agent' : `/login?role=client&service=${defaultService}`;

  const isSubmitting = isPending || submitting;

  useEffect(() => {
    if (
      state &&
      'success' in state &&
      state.success &&
      state.needsEmailConfirmation &&
      state.role === 'agent'
    ) {
      sessionStorage.setItem(REGISTER_EMAIL_KEY, state.email);
      router.push('/agent/onboarding/verify-email');
    }
  }, [state, router]);

  function handleAgentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMismatch(false);

    const nameCheck = validateFullNameSingleField(fullName);
    if (!nameCheck.ok) {
      setFullNameError(nameCheck.message);
      return;
    }
    setFullNameError(null);

    if (password.length < 6) return;
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    const formData = new FormData(e.currentTarget);
    startSubmit(() => {
      formAction(formData);
    });
  }

  const agentFormFields = (
    <>
      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="full_name" className={AGENT_LABEL_CLASS}>
          Full Name
        </Label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setFullNameError(null);
            }}
            onBlur={() => {
              const check = validateFullNameSingleField(fullName);
              setFullNameError(check.ok ? null : check.message);
            }}
            placeholder="Write your full name here"
            className={cn(AGENT_FIELD_CLASS, 'pl-10', fullNameError && 'border-destructive')}
          />
        </div>
        {fullNameError ? (
          <p className="text-sm text-destructive" role="alert">
            {fullNameError}
          </p>
        ) : null}
      </div>

      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="phone" className={AGENT_LABEL_CLASS}>
          Phone Number
        </Label>
        <div className="flex h-11 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:rounded-[18px]">
          <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 text-[15px] text-slate-500">
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
            className="h-full w-full bg-transparent px-3 text-[15px] outline-none placeholder:text-slate-400 lg:px-4"
          />
        </div>
      </div>

      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="email" className={AGENT_LABEL_CLASS}>
          Email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
        <Label htmlFor="gender" className={AGENT_LABEL_CLASS}>
          Gender
        </Label>
        <div className="relative">
          <select
            id="gender"
            name="gender"
            defaultValue="male"
            required
            className={AGENT_SELECT_CLASS}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="password" className={AGENT_LABEL_CLASS}>
          Create your password
        </Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordMismatch(false);
            }}
            placeholder="Write your password here"
            className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className={AGENT_FIELD_BLOCK}>
        <Label htmlFor="confirm_password" className={AGENT_LABEL_CLASS}>
          Confirm password
        </Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="confirm_password"
            name="confirm_password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordMismatch(false);
            }}
            placeholder="Confirm your password"
            className={cn(AGENT_FIELD_CLASS, 'pl-10 pr-10', passwordMismatch && 'border-destructive')}
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowConfirmPassword((value) => !value)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordMismatch ? (
          <p className="text-sm text-destructive" role="alert">
            Password doesn&apos;t match
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <AgentAuthShell
      variant={shellVariant}
      title={isAgentMode ? 'Create Agent Account' : CLIENT_COPY[defaultService].title}
      description={
        isAgentMode
          ? 'Complete your details to create your Charis Consult agent account.'
          : CLIENT_COPY[defaultService].description
      }
      contentWidthClass={isAgentMode ? AGENT_AUTH_CONTENT_WIDTH : CLIENT_AUTH_CONTENT_WIDTH}
      agentAuthMobile={isAgentMode}
      footerMode={isAgentMode ? 'inline' : undefined}
      actions={
        isAgentMode ? (
          <>
            {state && 'error' in state ? <AgentFormFeedback>{state.error}</AgentFormFeedback> : null}
            <Button type="submit" form="agent-register-form" className={AGENT_PRIMARY_BTN} disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
            <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
              <Link href={loginHref}>I already have an account</Link>
            </Button>
          </>
        ) : undefined
      }
    >
      {isAgentMode ? (
        <form id="agent-register-form" onSubmit={handleAgentSubmit} className={AGENT_FORM_STACK}>
          <input type="hidden" name="role" value={defaultRole} />
          <input type="hidden" name="service_interest" value={defaultService} />
          <input type="hidden" name="agency_name" value="" />
          <input type="hidden" name="registration_number" value="" />
          {agentFormFields}
        </form>
      ) : (
        <div className="space-y-5">
          {state && 'success' in state && state.success && state.needsEmailConfirmation ? (
            <div
              className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary lg:rounded-[18px]"
              role="status"
            >
              Check your email to confirm your account before signing in.
            </div>
          ) : null}

          {state && 'error' in state ? (
            <div
              className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive lg:rounded-[18px]"
              role="alert"
            >
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="space-y-4 lg:space-y-5">
            <input type="hidden" name="role" value={defaultRole} />
            <input type="hidden" name="service_interest" value={defaultService} />
            <input type="hidden" name="agency_name" value="" />

            <div className={AGENT_FIELD_BLOCK}>
              <Label htmlFor="full_name" className={AGENT_LABEL_CLASS}>
                Full Name
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Write your full name here"
                  className={cn(AGENT_FIELD_CLASS, 'pl-11')}
                />
              </div>
            </div>

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
                  className={cn(AGENT_FIELD_CLASS, 'pl-11')}
                />
              </div>
            </div>

            {defaultService === 'travel' || defaultService === 'construction' ? (
              <>
                <div className={AGENT_FIELD_BLOCK}>
                  <Label htmlFor="phone" className={AGENT_LABEL_CLASS}>
                    Phone number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="+234..."
                    className={AGENT_FIELD_CLASS}
                  />
                </div>
                {defaultService === 'construction' ? (
                  <div className={AGENT_FIELD_BLOCK}>
                    <Label htmlFor="preferred_location" className={AGENT_LABEL_CLASS}>
                      Project location
                    </Label>
                    <Input
                      id="preferred_location"
                      name="preferred_location"
                      type="text"
                      placeholder="Ibadan, Oyo State"
                      className={AGENT_FIELD_CLASS}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className={AGENT_FIELD_BLOCK}>
                  <Label htmlFor="preferred_location" className={AGENT_LABEL_CLASS}>
                    Preferred location
                  </Label>
                  <Input
                    id="preferred_location"
                    name="preferred_location"
                    type="text"
                    required
                    placeholder="Ibadan"
                    className={AGENT_FIELD_CLASS}
                  />
                </div>
                <div className={AGENT_FIELD_BLOCK}>
                  <Label htmlFor="budget_range" className={AGENT_LABEL_CLASS}>
                    Budget range
                  </Label>
                  <Input
                    id="budget_range"
                    name="budget_range"
                    type="text"
                    required
                    placeholder="N50M - N90M"
                    className={AGENT_FIELD_CLASS}
                  />
                </div>
              </>
            )}

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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className={cn(AGENT_FIELD_CLASS, 'pl-11 pr-12')}
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

            <Button type="submit" className={AGENT_PRIMARY_BTN} disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="flex flex-col gap-3">
            <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
              <Link href={loginHref}>I already have an account</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 w-full rounded-full text-base text-slate-600">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      )}
    </AgentAuthShell>
  );
}
