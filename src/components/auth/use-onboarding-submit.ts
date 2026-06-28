'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingActionState } from '@/app/(site)/agent/onboarding/actions';

/** Reliable pending state for agent onboarding server actions (avoid useTransition + async). */
export function useOnboardingSubmit(defaultNextPath?: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(
    action: () => Promise<OnboardingActionState>,
    options?: { nextPath?: string; onSuccess?: () => void | Promise<void> },
  ) {
    setIsSubmitting(true);
    setNotice(null);
    try {
      const res = await action();
      if (res && 'error' in res) {
        setNotice(res.error);
        return false;
      }
      if (options?.onSuccess) {
        await options.onSuccess();
      } else {
        router.push(options?.nextPath ?? defaultNextPath ?? '/agent/onboarding');
      }
      return true;
    } catch (err) {
      if (isNextRedirectError(err)) return true;
      setNotice(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, notice, setNotice, submit };
}

function isNextRedirectError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
  );
}
