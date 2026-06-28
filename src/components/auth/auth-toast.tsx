'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export function AuthToast({
  variant,
  message,
  className,
}: {
  variant: 'error' | 'success';
  message: string;
  className?: string;
}) {
  const isError = variant === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'fixed left-1/2 top-6 z-[100] flex w-[min(92vw,360px)] -translate-x-1/2 items-center gap-3 rounded-full border border-[#F0EDE6] bg-white px-4 py-3 shadow-[0_12px_40px_rgba(31,42,36,0.12)]',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isError ? 'bg-[#3B0063] text-white' : 'bg-[#2F7A6E] text-white',
        )}
      >
        {isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
      </span>
      <p className={cn('text-sm font-medium', isError ? 'text-[#3B0063]' : 'text-[#2F7A6E]')}>
        {message}
      </p>
    </div>
  );
}
