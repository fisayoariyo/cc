'use client';

import { SegmentError } from '@/components/errors/segment-error';

export default function RootError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError {...props} />;
}
