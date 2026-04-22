'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircleHelp, LogOut, Repeat, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function TravelProfileActions() {
  const router = useRouter();

  async function handleLogout() {
    const shouldLogout = window.confirm('Log out of your account?');
    if (!shouldLogout) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">More options</h2>
      <div className="mt-4 space-y-2">
        <Link
          href="/travels/dashboard/help"
          className="flex items-center justify-between rounded-xl border border-border px-3 py-3 text-sm text-foreground hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <CircleHelp size={16} />
            FAQs & Support
          </span>
          <span aria-hidden>›</span>
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-xl border border-border px-3 py-3 text-sm text-foreground hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <Repeat size={16} />
            Switch Service
          </span>
          <span aria-hidden>›</span>
        </Link>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-3 text-sm text-foreground hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <LogOut size={16} />
            Log out
          </span>
          <ShieldCheck size={14} className="text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}

