import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { createClient } from '@/lib/supabase/server';
import {
  getAllTravelApplicationsForAdmin,
  getDocumentsForApplications,
} from '@/lib/supabase/data';
import { getStageLabel, getTravelServiceLabel } from '@/lib/travel-stages';
import { getCaseMessagesForTravelApplications } from '@/lib/supabase/case-messages';
import { TravelApplicationsList } from './travel-applications-list';

export default async function AdminTravelPage() {
  const allApps = await getAllTravelApplicationsForAdmin();

  const [docMap, messageMap] = await Promise.all([
    getDocumentsForApplications(allApps.map((application) => application.id)),
    getCaseMessagesForTravelApplications(allApps.map((application) => application.id)),
  ]);

  const clientIds = [...new Set(allApps.map((application) => application.client_id).filter(Boolean))] as string[];
  let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
  if (clientIds.length) {
    const supabase = await createClient();
    if (supabase) {
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', clientIds);
      profileMap = Object.fromEntries((profiles ?? []).map((profile) => [profile.id, profile]));
    }
  }

  const serviceOptions = [...new Set(allApps.map((application) => application.service_type).filter(Boolean))]
    .map((value) => ({ value: value as string, label: getTravelServiceLabel(value) }));
  const stageOptions = [...new Set(allApps.map((application) => application.current_stage).filter(Boolean))]
    .map((value) => ({ value: value as string, label: String(value) }));

  const applicationsWithDocs = allApps.filter((application) => (docMap[application.id] ?? []).length > 0).length;
  const documentsNeedingReview = Object.values(docMap)
    .flat()
    .filter((document) => {
      const normalizedStatus = document.status.trim().toLowerCase();
      return normalizedStatus === 'submitted' || normalizedStatus === 'under_review';
    }).length;

  const applications = allApps.map((application) => {
    const profile = application.client_id ? profileMap[application.client_id] : null;

    return {
      id: application.id,
      applicantLabel:
        profile?.full_name || profile?.email || application.client_id?.slice(0, 8) || '-',
      serviceLabel: getTravelServiceLabel(application.service_type),
      currentStageLabel: getStageLabel(application.service_type, application.current_stage),
      serviceType: application.service_type,
      currentStage: application.current_stage,
      destination: application.destination,
      created_at: application.created_at,
      deletion_request_status: application.deletion_request_status,
      docCount: (docMap[application.id] ?? []).length,
      messageCount: (messageMap[application.id] ?? []).length,
    };
  });

  return (
    <AdminPageShell
      title="Travel applications"
      subtitle="Review uploads, message clients, and update case stages."
    >
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Applications', value: allApps.length },
          { label: 'With uploads', value: applicationsWithDocs },
          { label: 'Docs to review', value: documentsNeedingReview },
        ].map((item) => (
          <AdminStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <TravelApplicationsList
        applications={applications}
        serviceOptions={serviceOptions}
        stageOptions={stageOptions}
      />
    </AdminPageShell>
  );
}
