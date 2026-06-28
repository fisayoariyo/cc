'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { markSupportTicketResolved } from './actions';

export function ResolveIssueButton({ ticketId, disabled }: { ticketId: string; disabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() => {
        startTransition(async () => {
          const result = await markSupportTicketResolved(ticketId);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success('Issue marked as resolved.');
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-2 rounded-xl bg-[#4b2e6f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3d245c] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CheckCheck className="h-4 w-4" />
      {pending ? 'Updating...' : 'Mark as resolved'}
    </button>
  );
}
