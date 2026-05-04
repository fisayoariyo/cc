'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircleHelp, LogOut, ShieldCheck } from 'lucide-react';
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
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">More options</h2>
      <div className="mt-3 space-y-2">
        <Link
          href="/travel/dashboard/help"
          className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[15px] text-foreground hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <CircleHelp size={16} />
            FAQs & Support
          </span>
          <span aria-hidden>&rsaquo;</span>
        </Link>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-[15px] text-foreground hover:bg-muted/30"
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
