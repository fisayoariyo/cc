import { cn } from '@/components/ui/utils';

/** Shared skeleton for dashboard route transitions (agent + admin). */
export function DashboardRouteLoading({ className }: { className?: string }) {
  return (
    <div className={cn('min-h-[min(70vh,640px)] animate-pulse bg-[#fbfafc]', className)}>
      <div className="space-y-4 p-4 lg:bg-transparent lg:p-0">
        <div className="h-8 w-48 rounded-lg bg-[#e8e4ef]" />
        <div className="h-4 w-72 max-w-full rounded-lg bg-[#ece8f2]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-36 rounded-2xl bg-[#ece8f2]" />
          <div className="h-36 rounded-2xl bg-[#ece8f2]" />
        </div>
        <div className="h-28 rounded-2xl bg-[#ece8f2]" />
      </div>
    </div>
  );
}
