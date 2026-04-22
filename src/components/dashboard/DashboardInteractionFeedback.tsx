'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function DashboardInteractionFeedback({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPending(false);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function beginPending() {
    setPending(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setPending(false), 8000);
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const link = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (!link) return;

    if (typeof window === 'undefined') return;

    try {
      const href = new URL(link.href, window.location.origin);
      const current = `${window.location.pathname}${window.location.search}`;
      const next = `${href.pathname}${href.search}`;
      if (href.origin === window.location.origin && current !== next) {
        beginPending();
      }
    } catch {
      // Ignore malformed urls.
    }
  }

  function handleSubmitCapture() {
    beginPending();
  }

  return (
    <div onClickCapture={handleClickCapture} onSubmitCapture={handleSubmitCapture}>
      {pending ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-[#03624D]/15">
          <div className="h-full w-full animate-pulse bg-[#03624D]" />
        </div>
      ) : null}
      {children}
    </div>
  );
}

