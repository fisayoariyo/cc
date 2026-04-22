import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { TravelApplicationForm } from '@/app/(site)/dashboard/travel-form';
import { DocumentUploadForm } from '@/app/(site)/dashboard/document-upload-form';
import { Badge } from '@/components/ui/badge';
import { getDocumentsForClient, getStageHistoryForApplications, getTravelApplicationsForClient } from '@/lib/supabase/data';
import { getStageLabel } from '@/lib/travel-stages';

export const metadata: Metadata = {
  title: 'Travel applications',
};

export default async function TravelApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [applications, docs] = await Promise.all([
    getTravelApplicationsForClient(user.id),
    getDocumentsForClient(user.id),
  ]);

  const historyMap = await getStageHistoryForApplications(applications.map((a) => a.id));
  const docsByApplication = docs.reduce<Record<string, typeof docs>>((acc, d) => {
    if (!acc[d.application_id]) acc[d.application_id] = [];
    acc[d.application_id].push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start a new travel application and track all submissions.</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <TravelApplicationForm />
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">My travel applications</h2>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-8 text-center">
            No applications yet. Start one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {applications.map((a) => (
              <li key={a.id} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{a.service_type ?? 'Application'}</p>
                    <p className="text-sm text-muted-foreground">{a.destination}</p>
                    {a.notes ? <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.notes}</p> : null}
                  </div>
                  <Badge variant="secondary" className="capitalize w-fit shrink-0">
                    {getStageLabel(a.service_type, a.current_stage)}
                  </Badge>
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-2 min-w-0">
                    <p className="text-xs text-muted-foreground">Uploaded docs: {docsByApplication[a.id]?.length ?? 0}</p>
                    {historyMap[a.id]?.length ? (
                      <div className="rounded-md border border-border bg-background p-2">
                        <p className="text-xs text-foreground">Latest update: {historyMap[a.id][0].stage_label}</p>
                        {historyMap[a.id][0].note_to_client ? (
                          <p className="text-xs text-muted-foreground mt-1">{historyMap[a.id][0].note_to_client}</p>
                        ) : null}
                      </div>
                    ) : null}
                    {(docsByApplication[a.id] ?? []).length ? (
                      <div className="space-y-1">
                        {(docsByApplication[a.id] ?? []).map((d) => (
                          <div key={d.id} className="text-xs text-muted-foreground">
                            {(d.document_type ?? 'Document') + ': '}
                            <span className="text-foreground">{d.status}</span>
                            {d.admin_note ? <span className="text-muted-foreground"> - {d.admin_note}</span> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <DocumentUploadForm applicationId={a.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

