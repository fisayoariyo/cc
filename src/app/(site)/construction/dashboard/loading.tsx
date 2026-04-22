export default function ConstructionDashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 rounded-2xl bg-muted/60" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-24 rounded-2xl bg-muted/60" />
        <div className="h-24 rounded-2xl bg-muted/60" />
        <div className="h-24 rounded-2xl bg-muted/60" />
      </div>
      <div className="h-44 rounded-2xl bg-muted/60" />
    </div>
  );
}

