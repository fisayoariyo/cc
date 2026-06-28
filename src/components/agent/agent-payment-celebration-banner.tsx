'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { PartyPopper, X } from 'lucide-react';
import { dismissAgentNotification } from '@/app/(site)/agent/notifications/actions';
import type { NotificationRow } from '@/lib/types/database';

export function AgentPaymentCelebrationBanner({ notice }: { notice: NotificationRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#d9c6a2] bg-gradient-to-r from-[#fff7ea] to-[#fffdf9] px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-start gap-3 pr-8">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFBB3C]/25 text-[#9a6b00]">
          <PartyPopper className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <p className="font-sans text-base font-bold text-[#1F2A24]">{notice.title}</p>
          <p className="font-sans text-sm text-[#6b7280]">{notice.body}</p>
          <Link
            href="/agent/listings/new"
            className="mt-2 inline-flex text-sm font-semibold text-[#4b2e6f] hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(() => {
            void dismissAgentNotification(notice.id).then(() => router.refresh());
          })
        }
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-black/5 hover:text-[#1F2A24]"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
