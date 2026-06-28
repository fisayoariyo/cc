'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/utils';

type RouteTransitionFeedbackProps = {
  children: React.ReactNode;
  themeScope?: 'app' | 'web';
};

export function RouteTransitionFeedback({
  children,
  themeScope = 'web',
}: RouteTransitionFeedbackProps) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setPending(false);
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  function beginPending() {
    setPending(true);
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setPending(false), 4000);
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const link = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (!link || typeof window === 'undefined') return;

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

  return (
    <div
      className={cn(themeScope === 'app' ? 'charis-app-theme' : 'charis-web-app')}
      onClickCapture={handleClickCapture}
    >
      {pending ? (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-0 top-0 h-0.5 overflow-hidden bg-primary/15',
            themeScope === 'app' ? 'z-[70]' : 'z-[80]',
          )}
        >
          <div className="h-full w-1/3 animate-[charis-route-progress_0.9s_ease-in-out_infinite] bg-primary" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
