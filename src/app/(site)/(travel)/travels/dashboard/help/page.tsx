import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel help',
};

export default function TravelHelpPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/travels/dashboard/profile"
        className="inline-flex items-center gap-1.5 text-sm text-foreground/90 hover:text-foreground sm:hidden"
      >
        <ArrowLeft size={16} />
        Go back
      </Link>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Help & support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get support for applications, document issues, and stage updates.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">General support</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions about your travel workflow, timelines, and account.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Contact us
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Upload issue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If document upload fails, include application id and file type in your message.
          </p>
          <Link
            href="/travels/dashboard/applications"
            className="mt-3 inline-flex rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            Go to applications
          </Link>
        </div>
      </section>
    </div>
  );
}

