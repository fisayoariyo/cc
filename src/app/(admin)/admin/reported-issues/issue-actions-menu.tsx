'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatSupportTicketDate, supportTicketStatusLabel } from '@/lib/support-tickets';
import type { AgentSupportTicketWithAgent } from '@/lib/types/database';
import { useState, useTransition } from 'react';
import { markSupportTicketResolved } from './actions';

export function IssueActionsMenu({ ticket }: { ticket: AgentSupportTicketWithAgent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const detailHref = `/admin/reported-issues/${ticket.id}`;

  function resolve() {
    startTransition(async () => {
      const result = await markSupportTicketResolved(ticket.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Issue marked as resolved.');
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Issue actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
          >
            View details
          </DropdownMenuItem>
          {ticket.status !== 'resolved' ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={pending} onSelect={resolve}>
                Mark as resolved
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Issue summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Issue ID:</span>{' '}
              <span className="font-semibold text-foreground">{ticket.ticket_code}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Agent:</span>{' '}
              <span className="font-semibold text-foreground">{ticket.agent?.full_name ?? '—'}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Type:</span>{' '}
              <span className="font-semibold text-foreground">{ticket.issue_type}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Status:</span>{' '}
              <span className="font-semibold text-foreground">{supportTicketStatusLabel(ticket.status)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Date:</span>{' '}
              <span className="font-semibold text-foreground">{formatSupportTicketDate(ticket.created_at)}</span>
            </p>
          </div>
          <Button
            className="mt-2 w-full rounded-xl bg-[#4b2e6f] hover:bg-[#3d245c]"
            onClick={() => {
              setOpen(false);
              router.push(detailHref);
            }}
          >
            View full details
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function IssueStatusBadge({ status }: { status: 'pending' | 'resolved' }) {
  const pending = status === 'pending';
  return (
    <span
      className={
        pending
          ? 'inline-flex rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold text-[#b45309]'
          : 'inline-flex rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#15803d]'
      }
    >
      {supportTicketStatusLabel(status)}
    </span>
  );
}

export function ViewAgentProfileLink({ agentId }: { agentId: string }) {
  return (
    <Link
      href={`/admin/agents/${agentId}`}
      className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-[#4b2e6f] hover:underline"
    >
      View agent profile
      <span aria-hidden>↗</span>
    </Link>
  );
}
