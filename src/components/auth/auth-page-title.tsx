import { cn } from '@/components/ui/utils';

/** Shared auth form page title — matches dashboard title scale. */
export const authPageTitleClassName =
  'font-sans text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[#101828] sm:text-[25px]';

export function AuthPageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h1 className={cn(authPageTitleClassName, className)}>{children}</h1>;
}
