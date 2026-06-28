'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { CaseMessageRow, InquiryRow, InquiryStatus } from '@/lib/types/database';
import { setInquiryStatus } from './actions';
import { InquiryDetailDialog } from './inquiry-detail-dialog';

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: 'New',
  actioned: 'Actioned',
  archived: 'Archived',
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const styles: Record<InquiryStatus, string> = {
    new: 'bg-[#ede9f5] text-[#4b2e6f]',
    actioned: 'bg-[#dcfce7] text-[#15803d]',
    archived: 'bg-[#f3f4f6] text-[#6b7280]',
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function InquiryActionsMenu({
  inquiry,
  messages,
}: {
  inquiry: InquiryRow;
  messages: CaseMessageRow[];
}) {
  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function updateStatus(next: InquiryStatus) {
    startTransition(async () => {
      const res = await setInquiryStatus(inquiry.id, next);
      if (res && 'error' in res) {
        toast.error(res.error ?? 'Failed to update status.');
        return;
      }
      toast.success(`Marked as ${STATUS_LABEL[next].toLowerCase()}.`);
      router.refresh();
    });
  }

  const replyHref = `mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.inquiry_type)}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Inquiry actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setDetailOpen(true);
            }}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={replyHref}>Reply by email</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {inquiry.status !== 'actioned' ? (
            <DropdownMenuItem disabled={pending} onSelect={() => updateStatus('actioned')}>
              Mark as actioned
            </DropdownMenuItem>
          ) : null}
          {inquiry.status !== 'new' ? (
            <DropdownMenuItem disabled={pending} onSelect={() => updateStatus('new')}>
              Mark as new
            </DropdownMenuItem>
          ) : null}
          {inquiry.status !== 'archived' ? (
            <DropdownMenuItem disabled={pending} onSelect={() => updateStatus('archived')}>
              Archive
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <InquiryDetailDialog
        hideTrigger
        open={detailOpen}
        onOpenChange={setDetailOpen}
        inquiryId={inquiry.id}
        fullName={inquiry.full_name}
        email={inquiry.email}
        phone={inquiry.phone}
        inquiryType={inquiry.inquiry_type}
        createdAt={inquiry.created_at}
        messages={messages}
      />
    </>
  );
}
