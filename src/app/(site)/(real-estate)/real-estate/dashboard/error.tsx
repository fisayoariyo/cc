'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function RealEstateDashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      {...props}
      variant="inset"
      title="This page failed to load"
      description="Something went wrong loading your real estate dashboard. Please try again."
      homeHref="/real-estate/dashboard"
      homeLabel="Real estate dashboard"
    />
  );
}
