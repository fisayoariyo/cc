'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function AuthError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      title="Authentication problem"
      description="We couldn't complete that request. Please try again."
      homeHref="/login"
      homeLabel="Back to login"
    />
  );
}
