import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Travel profile',
};

export default async function TravelProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, phone_number, passport_number')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Travel profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile data used across your travel applications.</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="font-medium text-foreground">{profile?.full_name || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{profile?.email || user.email || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="font-medium text-foreground">{profile?.phone_number || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Passport number</dt>
            <dd className="font-medium text-foreground">{profile?.passport_number || 'Not set'}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Need profile changes?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact support so we can update sensitive details correctly on your account.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Contact support
        </Link>
      </section>
    </div>
  );
}

