import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  BriefcaseBusiness,
  Luggage,
  ArrowRight,
  Home,
  HeartPulse,
  FolderOpen,
  Files,
  Clock3,
} from 'lucide-react';
import { isTravelApplicationFinished, type TravelServiceType } from '@/lib/travel-stages';
import { getUnreadNotificationsCount } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createClient } from '@/lib/supabase/server';
const START_OPTIONS: {
  flowParam: string;
  serviceType: TravelServiceType;
  title: string;
  copy: string;
  icon: typeof BookOpen;
}[] = [
  {
    flowParam: 'education',
    serviceType: 'education',
    title: 'Study',
    copy: 'Apply for admission, scholarship support, and then move into visa processing.',
    icon: BookOpen,
  },
  {
    flowParam: 'immigration',
    serviceType: 'immigration',
    title: 'Work',
    copy: 'Share your CV and profile so the team can start work-abroad processing.',
    icon: BriefcaseBusiness,
  },
  {
    flowParam: 'tourism',
    serviceType: 'tourism',
    title: 'Leisure',
    copy: 'Plan your itinerary first, then prepare the visa documents for your trip.',
    icon: Luggage,
  },
  {
    flowParam: 'relocation',
    serviceType: 'relocation',
    title: 'Permanent Relocation',
    copy: 'End-to-end support for permanent moves, housing logistics, and settlement planning.',
    icon: Home,
  },
  {
    flowParam: 'health',
    serviceType: 'visa',
    title: 'Health',
    copy: 'Medical travel, treatment abroad, and visa documentation aligned with care timelines.',
    icon: HeartPulse,
  },
];

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
  const metrics = [
    {
      label: 'Applications',
      value: applicationsCount,
      icon: FolderOpen,
      accent: 'bg-[#efe8f7] text-[#4b2e6f]',
    },
    {
      label: 'Uploaded docs',
      value: docsCount,
      icon: Files,
      accent: 'bg-[#f7ead8] text-[#9a6420]',
    },
    {
      label: 'Pending stages',
      value: pendingApplications,
      icon: Clock3,
      accent: 'bg-[#e9f3ef] text-[#24604a]',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6 lg:rounded-[32px] lg:border-[#ece4d8] lg:bg-[#fcfaf7] lg:p-7 lg:shadow-none">
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
            Start my application
          </p>
          <div>
            <h2 className="text-[2.35rem] font-semibold leading-none text-foreground sm:text-[3rem]">
              Choose the travel flow that fits your goal
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground sm:text-[17px]">
              Select one path to begin. You&apos;ll upload documents, see admin-approved ticks, and follow the next stage from your dashboard.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-6xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-4">
          {START_OPTIONS.map((option) => (
            (() => {
              const matchingApplications = (applicationsRes.data ?? []).filter(
                (application) => application.service_type === option.serviceType,
              );
              const hasPendingDeletion = matchingApplications.some(
                (application) => application.deletion_request_status === 'pending',
              );
              const hasActiveApplication = activeServiceTypes.has(option.serviceType);
              const href = hasActiveApplication
                ? '/travel/dashboard/applications'
                : `/travel/dashboard/applications?flow=${option.flowParam}`;

              return (
            <Link
              key={option.flowParam}
              href={href}
              className="group flex h-full flex-col rounded-2xl border border-border bg-white p-3 transition-[border-color,background-color,transform,box-shadow] hover:border-[#6b4a95] hover:bg-[#faf7fd] sm:p-3.5 lg:min-h-[220px] lg:rounded-3xl lg:border-[#e9dfd2] lg:p-5 lg:shadow-[0_1px_2px_rgba(17,24,39,0.04)] lg:hover:-translate-y-0.5 lg:hover:shadow-[0_14px_30px_rgba(75,46,111,0.08)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2 lg:gap-3">
                  <div className="min-w-0 space-y-1.5 lg:space-y-2">
                    <p className="text-sm font-semibold text-foreground sm:text-[0.95rem] lg:text-[1.05rem]">{option.title}</p>
                    <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-[13px] sm:leading-6 lg:max-w-[24ch]">
                      {option.copy}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-[#4b2e6f] p-1.5 text-white sm:p-2 lg:rounded-2xl lg:p-2.5">
                    <option.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
                  </div>
                </div>

                <div className="mt-3 space-y-2 lg:mt-auto lg:space-y-3">
                  {hasPendingDeletion ? (
                    <p className="text-xs font-medium text-[#4b2e6f]">Deletion request pending approval</p>
                  ) : hasActiveApplication ? (
                    <p className="text-xs font-medium text-[#4b2e6f]">Active application already started</p>
                  ) : (
                    <div className="hidden lg:block lg:h-[18px]" aria-hidden="true" />
                  )}

                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4b2e6f] sm:text-[13px]">
                    {hasPendingDeletion ? 'View status' : hasActiveApplication ? 'View application' : 'Continue'}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
                  </div>
                </div>
              </div>
            </Link>
              );
            })()
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f] p-4 text-white shadow-sm lg:rounded-3xl lg:border lg:border-[#e9dfd2] lg:bg-none lg:bg-white lg:p-5 lg:text-foreground lg:shadow-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/85 lg:text-[13px] lg:font-medium lg:uppercase lg:tracking-[0.08em] lg:text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold lg:mt-4 lg:text-[2.25rem]">{metric.value}</p>
              </div>
              <div className={`hidden rounded-2xl p-3 lg:flex ${metric.accent}`}>
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
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
