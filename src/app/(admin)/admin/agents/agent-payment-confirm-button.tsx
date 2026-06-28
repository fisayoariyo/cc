'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { confirmAgentOnboardingPayment } from './actions';
import { dashboardButtonRadiusClass } from '@/lib/dashboard-theme';
import { Button } from '@/components/ui/button';

export function AgentPaymentConfirmButton({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="border-t border-border/60 pt-4">
      <p className="mb-3 text-sm text-muted-foreground">
        Confirm when the agent has paid the NGN 5,000 onboarding fee (bank transfer, cash, or other).
      </p>
      <Button
        type="button"
        className={dashboardButtonRadiusClass}
        disabled={pending}
        onClick={() =>
          start(() => {
            void confirmAgentOnboardingPayment(profileId).then((result) => {
              if (result && 'error' in result) {
                setMessage(result.error ?? 'Could not confirm payment.');
                return;
              }
              setMessage('Payment confirmed. The agent can now create listings.');
              router.refresh();
            });
          })
        }
      >
        {pending ? 'Confirming…' : 'Confirm payment received'}
      </Button>
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
