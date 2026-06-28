'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markTravelNotificationsRead } from './actions';

export function MarkUpdatesRead({ hasUnread }: { hasUnread: boolean }) {
  const router = useRouter();
  const didRunRef = useRef(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!hasUnread || didRunRef.current) {
      return;
    }

    didRunRef.current = true;
    startTransition(() => {
      void (async () => {
        await markTravelNotificationsRead();
        router.refresh();
      })();
    });
  }, [hasUnread, router]);

  return null;
}
