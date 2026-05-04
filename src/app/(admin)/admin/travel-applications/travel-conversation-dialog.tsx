'use client';

import { postTravelAdminMessage } from '@/app/actions/case-messages';
import { AdminCaseMessageForm } from '@/components/communications/AdminCaseMessageForm';
import { CaseMessagesFeed } from '@/components/communications/CaseMessagesFeed';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { CaseMessageRow } from '@/lib/types/database';

export function TravelConversationDialog({
  applicationId,
  label,
  messages,
}: {
  applicationId: string;
  label: string;
  messages: CaseMessageRow[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full bg-transparent">
          Messages
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <CaseMessagesFeed
            messages={messages}
            emptyLabel="No conversation yet."
            showVisibility
          />
          <AdminCaseMessageForm
            action={postTravelAdminMessage}
            hiddenFields={[{ name: 'application_id', value: applicationId }]}
            defaultVisibility="client"
            submitLabel="Send update"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
