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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-foreground">Construction projects</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and update construction client projects.</p>
      </div>

      <form
        action={async (formData) => {
          'use server';
          await createConstructionProject(formData);
        }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4"
      >
        <input name="client_id" placeholder="Client profile UUID" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required />
        <input name="title" placeholder="Project title" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required />
        <input name="project_type" placeholder="Residential / Commercial" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required />
        <input name="location" placeholder="Location" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required />
        <input name="budget_range" placeholder="Budget range" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
        <input name="timeline" placeholder="Timeline" className="h-9 rounded-md border border-input bg-background px-3 text-sm" />
        <textarea name="description" placeholder="Description" rows={2} className="md:col-span-2 xl:col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <button type="submit" className="w-fit rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          Create project
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-sm">
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
    </div>
  );
}
