export default function TravelDashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-28 rounded-2xl border border-border bg-card animate-pulse" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
        <div className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
        <div className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
      </div>
      <div className="h-44 rounded-2xl border border-border bg-card animate-pulse" />
    </div>
  );
}

