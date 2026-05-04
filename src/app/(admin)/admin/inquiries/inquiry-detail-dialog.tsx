'use client';

import { postInquiryStaffMessage } from '@/app/actions/case-messages';
import { AdminCaseMessageForm } from '@/components/communications/AdminCaseMessageForm';
import { CaseMessagesFeed } from '@/components/communications/CaseMessagesFeed';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CaseMessageRow } from '@/lib/types/database';

export function InquiryDetailDialog({
  inquiryId,
  fullName,
  email,
  phone,
  inquiryType,
  createdAt,
  messages,
}: {
  inquiryId: string;
  fullName: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  createdAt: string;
  messages: CaseMessageRow[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full bg-transparent">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Inquiry details</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 text-sm">
          <p><span className="font-medium">Name:</span> {fullName}</p>
          <p><span className="font-medium">Email:</span> {email}</p>
          {phone ? <p><span className="font-medium">Phone:</span> {phone}</p> : null}
          <p><span className="font-medium">Type:</span> {inquiryType}</p>
          <p><span className="font-medium">Received:</span> {new Date(createdAt).toLocaleString()}</p>
          <div className="space-y-3">
            <p className="text-base font-semibold text-foreground">Handling thread</p>
            <CaseMessagesFeed
              messages={messages}
              emptyLabel="No handling notes yet."
              showVisibility
            />
            <AdminCaseMessageForm
              action={postInquiryStaffMessage}
              hiddenFields={[{ name: 'inquiry_id', value: inquiryId }]}
              submitLabel="Add note"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
