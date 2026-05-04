import { getAllAgentsForAdmin } from '@/lib/supabase/data';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AgentVerifyButtons } from './agent-actions';

export default async function AdminAgentsPage() {
  const agents = await getAllAgentsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-foreground">Agent verification</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Approve or reject agents (updates <code className="text-xs bg-muted px-1 rounded">profiles.status</code>).
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right min-w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No agent accounts yet.
                </TableCell>
              </TableRow>
            ) : (
              agents.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-foreground max-w-[160px]">{a.full_name ?? '—'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{a.email ?? '—'}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        a.status === 'verified' ? 'default' : a.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {(a.status ?? 'pending').replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status === 'pending' || !a.status ? <AgentVerifyButtons profileId={a.id} /> : null}
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
