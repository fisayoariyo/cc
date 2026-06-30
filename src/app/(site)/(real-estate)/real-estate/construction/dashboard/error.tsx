'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function ConstructionDashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      variant="inset"
      title="This page failed to load"
      description="Something went wrong loading your construction dashboard. Please try again."
      homeHref="/real-estate/construction/dashboard"
      homeLabel="Construction dashboard"
    />
  );
}
