import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, FileSearch, Headset } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agent help',
};

export default function AgentHelpPage() {
  return (
    <div className="space-y-5">
      <Link href="/agent" className="inline-flex items-center gap-1.5 text-sm text-foreground/90 hover:text-foreground lg:hidden">
        <ArrowLeft size={16} />
        Go back
      </Link>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Help & Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick support tools for listing issues, account questions, and onboarding guidance.
        </p>
      </section>

      <section className="space-y-3">
        <Link
          href="/contact"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-sm text-foreground shadow-sm hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <Headset size={16} />
            Contact support
          </span>
          <span aria-hidden>›</span>
        </Link>

        <Link
          href="/agent/listings/new"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-sm text-foreground shadow-sm hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <FileSearch size={16} />
            Submit listing again
          </span>
          <span aria-hidden>›</span>
        </Link>

        <Link
          href="/agent"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-sm text-foreground shadow-sm hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-2">
            <CircleHelp size={16} />
            Dashboard FAQs
          </span>
          <span aria-hidden>›</span>
        </Link>
      </section>
    </div>
  );
}

