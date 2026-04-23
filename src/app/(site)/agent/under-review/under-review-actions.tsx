'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AgentUnderReviewActions() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        className="h-12 rounded-full px-6"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            router.refresh();
          });
        }}
      >
        <RefreshCcw className={`mr-2 h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
        {pending ? 'Refreshing status...' : 'Refresh status'}
      </Button>

      <Button asChild variant="secondary" className="h-12 rounded-full border border-slate-200 bg-[#F6F8F7] px-6 text-[#0B7155] hover:bg-[#edf3f0]">
        <Link href="/agent/help">
          Contact support
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
