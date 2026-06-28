import { AdminPageShell } from '@/components/admin/admin-page-shell';
import {
  adminFilterBarClass,
  adminPrimaryButtonClass,
  adminTablePanelClass,
  ADMIN_FORM_FIELD_CLASS,
} from '@/lib/admin-dashboard-theme';
import { getConstructionHistoryByProjectIds, getConstructionProjectsForAdmin } from '@/lib/supabase/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConstructionStageSelect } from './construction-stage-select';
import { createConstructionProject } from './actions';
import { constructionStageLabel } from '@/lib/construction-stages';

export default async function AdminConstructionProjectsPage() {
  const rows = await getConstructionProjectsForAdmin();
  const history = await getConstructionHistoryByProjectIds(rows.map((r) => r.id));

  return (
    <AdminPageShell title="Construction projects" subtitle="Create and update client construction projects.">
      <form
        action={async (formData) => {
          'use server';
          await createConstructionProject(formData);
        }}
        className={`${adminFilterBarClass} md:grid-cols-2 xl:grid-cols-3`}
      >
        <input name="client_id" placeholder="Client profile UUID" className={ADMIN_FORM_FIELD_CLASS} required />
        <input name="title" placeholder="Project title" className={ADMIN_FORM_FIELD_CLASS} required />
        <input name="project_type" placeholder="Residential / Commercial" className={ADMIN_FORM_FIELD_CLASS} required />
        <input name="location" placeholder="Location" className={ADMIN_FORM_FIELD_CLASS} required />
        <input name="budget_range" placeholder="Budget range" className={ADMIN_FORM_FIELD_CLASS} />
        <input name="timeline" placeholder="Timeline" className={ADMIN_FORM_FIELD_CLASS} />
        <textarea name="description" placeholder="Description" rows={2} className={`${ADMIN_FORM_FIELD_CLASS} md:col-span-2 xl:col-span-3 min-h-[80px]`} />
        <button type="submit" className={`${adminPrimaryButtonClass} w-fit px-4 py-2`}>
          Create project
        </button>
      </form>

      <div className={adminTablePanelClass}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead className="hidden xl:table-cell">Latest note</TableHead>
              <TableHead>Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No construction projects yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.project_type}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{p.location}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                    {history[p.id]?.[0]?.note_to_client ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Current: {constructionStageLabel(p.current_stage)}</p>
                      <ConstructionStageSelect projectId={p.id} current={p.current_stage} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminPageShell>
  );
}
