'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type SegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  /** Where the secondary "back" link points and what it reads. */
  homeHref?: string;
  homeLabel?: string;
  /** Renders compact (for in-shell dashboard/admin areas) vs full-screen. */
  variant?: 'full' | 'inset';
};

export function SegmentError({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We hit an unexpected problem loading this section. Please try again in a moment.',
  homeHref = '/',
  homeLabel = 'Back to home',
  variant = 'full',
}: SegmentErrorProps) {
  useEffect(() => {
    console.error('Segment error:', error);
  }, [error]);

  return (
    <div
      className={
        variant === 'full'
          ? 'flex min-h-screen items-center justify-center bg-[#FEFAF4] px-6 py-16'
          : 'flex min-h-[60vh] items-center justify-center px-6 py-12'
      }
    >
      <div className="w-full max-w-md rounded-3xl border border-[#F0EDE6] bg-[#FFFDF9] p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E88A5F]/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E88A5F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-[#1F2A24]">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3F4A44]">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#E88A5F] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center rounded-full border border-[#F0EDE6] bg-white px-6 py-2.5 text-sm font-semibold text-[#1F2A24] transition-colors hover:bg-[#FEFAF4]"
          >
            {homeLabel}
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-6 text-xs text-[#9aa39d]">Reference code: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
