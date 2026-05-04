import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, BriefcaseBusiness, Luggage, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { isTravelApplicationFinished } from '@/lib/travel-stages';
import { getUnreadNotificationsCount } from '@/lib/supabase/data';

const START_OPTIONS = [
  {
    value: 'education',
    title: 'Study',
    copy: 'Apply for admission, scholarship support, and then move into visa processing.',
    icon: BookOpen,
  },
  {
    value: 'immigration',
    title: 'Work',
    copy: 'Share your CV and profile so the team can start work-abroad processing.',
    icon: BriefcaseBusiness,
  },
  {
    value: 'tourism',
    title: 'Leisure',
    copy: 'Plan your itinerary first, then prepare the visa documents for your trip.',
    icon: Luggage,
  },
] as const;

export const metadata: Metadata = {
  title: 'Travel dashboard',
};

export default async function TravelClientDashboardPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const supabase = await createClient();

  const [appsCountRes, docsCountRes, completedCountRes, unreadNoticesCount, applicationsRes] = await Promise.all([
    supabase.from('travel_applications').select('id', { count: 'exact', head: true }).eq('client_id', viewer.userId),
    supabase.from('application_documents').select('id', { count: 'exact', head: true }).eq('client_id', viewer.userId),
    supabase
      .from('travel_applications')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', viewer.userId)
      .in('current_stage', ['completed', 'approved']),
    getUnreadNotificationsCount(viewer.userId),
    supabase
      .from('travel_applications')
      .select('id, service_type, current_stage, deletion_request_status')
      .eq('client_id', viewer.userId),
  ]);
  const applicationsCount = appsCountRes.count ?? 0;
  const docsCount = docsCountRes.count ?? 0;
  const completedCount = completedCountRes.count ?? 0;
  const pendingApplications = Math.max(0, applicationsCount - completedCount);
  const activeServiceTypes = new Set(
    (applicationsRes.data ?? [])
      .filter((application) => !isTravelApplicationFinished(application.service_type, application.current_stage))
      .map((application) => application.service_type)
      .filter(Boolean),
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
            Start my application
          </p>
          <div>
            <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
              Choose the travel flow that fits your goal
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground sm:text-[17px]">
              Select one path to begin. You&apos;ll upload documents, see admin-approved ticks, and follow the next stage from your dashboard.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {START_OPTIONS.map((option) => (
            (() => {
              const matchingApplications = (applicationsRes.data ?? []).filter(
                (application) => application.service_type === option.value,
              );
              const hasPendingDeletion = matchingApplications.some(
                (application) => application.deletion_request_status === 'pending',
              );
              const hasActiveApplication = activeServiceTypes.has(option.value);
              const href = hasActiveApplication
                ? '/travel/dashboard/applications'
                : `/travel/dashboard/applications?flow=${option.value}`;

              return (
            <Link
              key={option.value}
              href={href}
              className="group rounded-[24px] border border-border bg-white p-4 transition-colors hover:border-[#6b4a95] hover:bg-[#faf7fd]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[1.1rem] font-semibold tracking-[-0.02em] text-foreground">{option.title}</p>
                  <p className="text-[15px] leading-7 text-muted-foreground">{option.copy}</p>
                  {hasPendingDeletion ? (
                    <p className="text-sm font-medium text-[#4b2e6f]">Deletion request pending approval</p>
                  ) : hasActiveApplication ? (
                    <p className="text-sm font-medium text-[#4b2e6f]">Active application already started</p>
                  ) : null}
                </div>
                <div className="rounded-2xl bg-[#4b2e6f] p-2 text-white">
                  <option.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-[#4b2e6f]">
                {hasPendingDeletion ? 'View status' : hasActiveApplication ? 'View application' : 'Continue'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
              );
            })()
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f] p-4 text-white shadow-sm">
          <p className="text-sm text-white/85">Applications</p>
          <p className="mt-2 text-3xl font-semibold">{applicationsCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#3a2358] to-[#593881] p-4 text-white shadow-sm">
          <p className="text-sm text-white/85">Uploaded docs</p>
          <p className="mt-2 text-3xl font-semibold">{docsCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#442963] to-[#6a4698] p-4 text-white shadow-sm">
          <p className="text-sm text-white/85">Pending stages</p>
          <p className="mt-2 text-3xl font-semibold">{pendingApplications}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-foreground">Quick links</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Jump straight to the parts of your dashboard you use most.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
          href="/travel/dashboard/applications"
            className="rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
          >
            Manage applications
          </Link>
          <Link
          href="/travel/dashboard/updates"
            className="rounded-full border border-[#d8d1df] bg-white px-4 py-2.5 text-[15px] text-foreground hover:bg-[#f6f1ea]"
          >
            View updates {unreadNoticesCount > 0 ? `(${unreadNoticesCount})` : ''}
          </Link>
          <Link
          href="/travel/dashboard/profile"
            className="rounded-full border border-[#d8d1df] bg-white px-4 py-2.5 text-[15px] text-foreground hover:bg-[#f6f1ea]"
          >
            Open profile
          </Link>
        </div>
      </section>
    </div>
  );
}
