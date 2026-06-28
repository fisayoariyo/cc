import Link from 'next/link';
import { AGENT_PRIMARY_BTN, AGENT_SECONDARY_BTN } from '@/components/auth/agent-auth-styles';
import { Button } from '@/components/ui/button';

export function AgentVerifiedActions() {
  return (
    <Button asChild className={AGENT_PRIMARY_BTN}>
      <Link href="/agent">Go to dashboard</Link>
    </Button>
  );
}

export function AgentRejectedActions() {
  return (
    <>
      <Button asChild className={AGENT_PRIMARY_BTN}>
        <Link href="/contact">Contact support</Link>
      </Button>
      <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
        <Link href="/agent/onboarding">Review onboarding</Link>
      </Button>
    </>
  );
}
