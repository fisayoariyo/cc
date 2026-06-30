'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function TravelDashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      variant="inset"
      title="This page failed to load"
      description="Something went wrong loading your travel dashboard. Please try again."
      homeHref="/travel/dashboard"
      homeLabel="Travel dashboard"
    />
  );
}
