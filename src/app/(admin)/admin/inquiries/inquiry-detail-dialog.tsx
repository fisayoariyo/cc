'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function InquiryDetailDialog({
  fullName,
  email,
  phone,
  inquiryType,
  message,
  createdAt,
}: {
  fullName: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  message: string;
  createdAt: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full bg-transparent">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Inquiry details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p><span className="font-medium">Name:</span> {fullName}</p>
          <p><span className="font-medium">Email:</span> {email}</p>
          {phone ? <p><span className="font-medium">Phone:</span> {phone}</p> : null}
          <p><span className="font-medium">Type:</span> {inquiryType}</p>
          <p><span className="font-medium">Received:</span> {new Date(createdAt).toLocaleString()}</p>
          <div className="rounded-md border border-border bg-muted/30 p-3 whitespace-pre-wrap">
            {message}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
