'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      variant="inset"
      title="This admin section failed to load"
      description="Something went wrong loading this page. Try again, or return to the dashboard overview."
      homeHref="/admin"
      homeLabel="Admin overview"
    />
  );
}
