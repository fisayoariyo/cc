import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TravelProfileActions } from './profile-actions';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Travel profile',
};

export default async function TravelProfilePage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, phone_number, passport_number')
    .eq('id', viewer.userId)
    .maybeSingle();

  return (
    <div className="max-w-[980px] space-y-6">
      <section className="max-w-3xl space-y-2">
        <h1 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">Travel profile</h1>
        <p className="text-[15px] leading-7 text-muted-foreground">Profile data used across your travel applications.</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <dl className="grid gap-3 sm:grid-cols-2 text-[15px]">
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="font-medium text-foreground">{profile?.full_name || 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{profile?.email || viewer.email || 'Not set'}</dd>
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

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <h2 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Need profile changes?</h2>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Contact support so we can update sensitive details correctly on your account.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex rounded-full bg-[#c88a2d] px-4 py-2 text-[15px] font-medium text-white hover:bg-[#b67b25]"
        >
          Contact support
        </Link>
      </section>

      <TravelProfileActions />
    </div>
  );
}
