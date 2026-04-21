import { createClient } from '@/lib/supabase/server';
import {
  getAllTravelApplicationsForAdmin,
  getDocumentsForApplications,
  getStageHistoryForApplications,
} from '@/lib/supabase/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TravelStatus } from '@/lib/types/database';
import { TravelStageSelect } from './travel-stage-select';
import { DocumentReviewControls } from './document-review-controls';
import { getStageLabel } from '@/lib/travel-stages';

export default async function AdminTravelPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; service?: string; stage?: string }>;
}) {
  const { q = '', service = 'all', stage = 'all' } = await searchParams;
  const allApps = await getAllTravelApplicationsForAdmin();
  const serviceOptions = [...new Set(allApps.map((a) => a.service_type).filter(Boolean))] as string[];
  const stageOptions = [...new Set(allApps.map((a) => a.current_stage).filter(Boolean))] as string[];
  const query = q.trim().toLowerCase();
  const apps = allApps.filter((a) => {
    const matchesQuery =
      !query ||
      (a.destination ?? '').toLowerCase().includes(query) ||
      (a.service_type ?? '').toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query);
    const matchesService = service === 'all' || a.service_type === service;
    const matchesStage = stage === 'all' || a.current_stage === stage;
    return matchesQuery && matchesService && matchesStage;
  });
  const docMap = await getDocumentsForApplications(apps.map((a) => a.id));
  const historyMap = await getStageHistoryForApplications(apps.map((a) => a.id));
  const supabase = await createClient();
  const clientIds = [...new Set(apps.map((a) => a.client_id).filter(Boolean))] as string[];
  let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
  if (clientIds.length) {
    const { data: profs } = await supabase.from('profiles').select('id, full_name, email').in('id', clientIds);
    profileMap = Object.fromEntries((profs ?? []).map((p) => [p.id, p]));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-foreground">Travel applications</h1>
        <p className="text-muted-foreground text-sm mt-1">Update stages as cases progress (stored in Supabase).</p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl border border-border bg-card p-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by destination, service, ID"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select name="service" defaultValue={service} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All services</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="stage" defaultValue={stage} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">All stages</option>
          {stageOptions.map((s) => (
            <option key={s} value={s}>
              {String(s)}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          Apply filters
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Applicant</TableHead>
              <TableHead className="hidden md:table-cell">Destination</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Submitted</TableHead>
              <TableHead className="hidden md:table-cell">Docs</TableHead>
              <TableHead className="hidden xl:table-cell">Latest client note</TableHead>
              <TableHead className="min-w-[160px]">Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No applications yet.
                </TableCell>
              </TableRow>
            ) : (
              apps.map((t) => {
                const prof = t.client_id ? profileMap[t.client_id] : null;
                const label = prof?.full_name || prof?.email || t.client_id?.slice(0, 8) || '—';
                const submitted = new Date(t.created_at).toLocaleString();
                const docs = docMap[t.id] ?? [];
                const latestHistory = historyMap[t.id]?.[0];
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-foreground max-w-[180px]">{label}</TableCell>
                    <TableCell className="hidden md:table-cell">{t.destination ?? '—'}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{t.service_type ?? '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{submitted}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground align-top min-w-[280px]">
                      {docs.length === 0 ? (
                        <span className="text-xs">0</span>
                      ) : (
                        <div className="space-y-3">
                          {docs.map((d) => (
                            <div key={d.id} className="rounded-md border border-border p-2">
                              <p className="text-xs text-foreground">{d.document_type ?? 'Document'}</p>
                              <p className="text-[11px] text-muted-foreground mb-2">Current: {d.status}</p>
                              <DocumentReviewControls id={d.id} currentStatus={d.status} currentNote={d.admin_note} />
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                      {latestHistory?.note_to_client ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Current: {getStageLabel(t.service_type, t.current_stage)}
                        </p>
                        <TravelStageSelect
                          id={t.id}
                          serviceType={t.service_type}
                          current={t.current_stage as TravelStatus}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
