import type { ReactNode } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { cn } from '@/components/ui/utils';

/** Inline row feedback — sits after fields, before action buttons (not a top banner). */
export function AgentFormFeedback({
  variant = 'error',
  children,
  className,
}: {
  variant?: 'error' | 'success';
  children: ReactNode;
  className?: string;
}) {
  if (variant === 'success') {
    return (
      <div
        role="status"
        className={cn(
          'flex items-center gap-2.5 font-sans text-sm font-medium text-[#2F7A6E]',
          className,
        )}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F7A6E]"
          aria-hidden
        >
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        </span>
        {children}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2.5 font-sans text-sm font-medium text-[#3B0063]',
        className,
      )}
    >
      <AlertCircle className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
      {children}
    </div>
  );
}
