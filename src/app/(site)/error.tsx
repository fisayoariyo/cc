'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function SiteError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError {...props} />;
}
