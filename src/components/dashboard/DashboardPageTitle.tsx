import { cn } from '@/components/ui/utils';

/** Creato Display 700 · 20px · 100% line-height · 0 letter-spacing */
export const dashboardPageTitleClass =
  'font-sans text-[20px] font-bold leading-none tracking-normal text-foreground';

export function DashboardPageTitle({
  children,
  as: Tag = 'h1',
  className,
}: {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return <Tag className={cn(dashboardPageTitleClass, className)}>{children}</Tag>;
}
