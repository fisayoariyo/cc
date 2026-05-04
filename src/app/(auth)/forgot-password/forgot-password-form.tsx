'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { requestPasswordReset, type ForgotState } from './actions';
import { AgentAuthShell, type AuthShellVariant } from '@/components/auth/AgentAuthShell';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm({
  agentMode = false,
  service,
}: {
  agentMode?: boolean;
  service?: 'travel' | 'real_estate';
}) {
  const [state, formAction, isPending] = useActionState<ForgotState, FormData>(
    requestPasswordReset,
    null,
  );
  const shellVariant: AuthShellVariant = agentMode ? 'agent' : service ?? 'generic';
  const backHref = agentMode
    ? '/login?role=agent'
    : service
      ? `/login?role=client&service=${service}`
      : '/login';

  return (
    <AgentAuthShell
      title="Reset password"
      variant={shellVariant}
      description="Enter your account email and we will send a reset link."
      visualTitle={agentMode ? 'Keep agent access secure' : undefined}
      visualCopy={
        agentMode
          ? 'Recover access quickly and continue your onboarding or dashboard work without losing progress.'
          : undefined
      }
      backHref={backHref}
      backLabel="Go back"
    >
      <div className="space-y-5">
        {state && 'error' in state ? (
          <div className="rounded-[18px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        ) : null}
        {state && 'success' in state ? (
          <div className="rounded-[18px] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            Reset email sent. Check your inbox and spam folder.
          </div>
        ) : null}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="role" value={agentMode ? 'agent' : 'client'} />
          {service ? <input type="hidden" name="service" value={service} /> : null}
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
          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base"
            disabled={isPending}
          >
            {isPending ? 'Sending link...' : 'Continue'}
          </Button>
        </form>

        <Button
          asChild
          variant="secondary"
          className="h-12 w-full rounded-full border border-border text-primary"
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
