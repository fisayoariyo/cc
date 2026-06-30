'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function AgentError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      variant="inset"
      title="This page failed to load"
      description="Something went wrong loading your agent workspace. Please try again."
      homeHref="/agent"
      homeLabel="Agent dashboard"
    />
  );
}
