import { createClient } from '@/lib/supabase/server';
import {
  getAllTravelApplicationsForAdmin,
  getDocumentsForApplications,
  getStageHistoryForApplications,
} from '@/lib/supabase/data';
import type { TravelStageKey } from '@/lib/types/database';
import { getStageLabel, getTravelServiceLabel } from '@/lib/travel-stages';
import { getCaseMessagesForTravelApplications } from '@/lib/supabase/case-messages';
import { TravelApplicationsWorkspace } from './travel-applications-workspace';

export default async function AdminTravelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; service?: string; stage?: string }>;
}) {
  const { q = '', service = 'all', stage = 'all' } = await searchParams;
  const allApps = await getAllTravelApplicationsForAdmin();
  const serviceOptions = [...new Set(allApps.map((application) => application.service_type).filter(Boolean))] as string[];
  const stageOptions = [...new Set(allApps.map((application) => application.current_stage).filter(Boolean))] as string[];
  const query = q.trim().toLowerCase();
  const apps = allApps.filter((application) => {
    const matchesQuery =
      !query ||
      (application.destination ?? '').toLowerCase().includes(query) ||
      (application.service_type ?? '').toLowerCase().includes(query) ||
      application.id.toLowerCase().includes(query);
    const matchesService = service === 'all' || application.service_type === service;
    const matchesStage = stage === 'all' || application.current_stage === stage;
    return matchesQuery && matchesService && matchesStage;
  });

  const docMap = await getDocumentsForApplications(apps.map((application) => application.id));
  const historyMap = await getStageHistoryForApplications(apps.map((application) => application.id));
  const messageMap = await getCaseMessagesForTravelApplications(apps.map((application) => application.id));
  const supabase = await createClient();
  const clientIds = [...new Set(apps.map((application) => application.client_id).filter(Boolean))] as string[];

  let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
  if (clientIds.length) {
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', clientIds);
    profileMap = Object.fromEntries((profiles ?? []).map((profile) => [profile.id, profile]));
  }

  const applicationsWithDocs = apps.filter((application) => (docMap[application.id] ?? []).length > 0).length;
  const documentsNeedingReview = Object.values(docMap)
    .flat()
    .filter((document) => {
      const normalizedStatus = document.status.trim().toLowerCase();
      return normalizedStatus === 'submitted' || normalizedStatus === 'under_review';
    }).length;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Travel applications
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Review uploads, respond to clients, and move each case to the next stage without leaving the queue.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Applications', value: apps.length },
          { label: 'With uploads', value: applicationsWithDocs },
          { label: 'Docs to review', value: documentsNeedingReview },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 text-white shadow-sm ${
              index === 0
                ? 'bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f]'
                : index === 1
                  ? 'bg-gradient-to-br from-[#3a2358] to-[#593881]'
                  : 'bg-gradient-to-br from-[#442963] to-[#6a4698]'
            }`}
          >
            <p className="text-sm text-white/80">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      <form className="grid gap-3 rounded-2xl border border-border/70 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by destination, service, or ID"
          className="h-11 rounded-xl border border-input bg-[#fbfafc] px-3 text-[15px]"
        />
        <select
          name="service"
          defaultValue={service}
          className="h-11 rounded-xl border border-input bg-[#fbfafc] px-3 text-[15px]"
        >
          <option value="all">All services</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {getTravelServiceLabel(option)}
            </option>
          ))}
        </select>
        <select
          name="stage"
          defaultValue={stage}
          className="h-11 rounded-xl border border-input bg-[#fbfafc] px-3 text-[15px]"
        >
          <option value="all">All stages</option>
          {stageOptions.map((option) => (
            <option key={option} value={option}>
              {String(option)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
        >
          Apply filters
        </button>
      </form>

      <TravelApplicationsWorkspace
        applications={apps.map((application) => {
          const profile = application.client_id ? profileMap[application.client_id] : null;

          return {
            ...application,
            applicantLabel:
              profile?.full_name || profile?.email || application.client_id?.slice(0, 8) || '-',
            serviceLabel: getTravelServiceLabel(application.service_type),
            currentStageLabel: getStageLabel(application.service_type, application.current_stage),
          };
        })}
        docsByApplication={docMap}
        historyByApplication={historyMap}
        messagesByApplication={messageMap}
      />
    </div>
  );
}
