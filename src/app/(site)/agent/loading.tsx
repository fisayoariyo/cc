export default function AgentLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-20 rounded-2xl bg-muted/60" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-28 rounded-2xl bg-muted/60" />
        <div className="h-28 rounded-2xl bg-muted/60" />
      </div>
      <div className="h-40 rounded-2xl bg-muted/60" />
    </div>
  );
}

