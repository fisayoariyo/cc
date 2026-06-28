export default function AdminTravelApplicationDetailLoading() {
  return (
    <div className="animate-pulse space-y-4 lg:space-y-6">
      <div className="h-4 w-40 rounded-lg bg-[#ece8f2]" />
      <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="h-7 w-56 rounded-lg bg-[#ece8f2]" />
            <div className="h-4 w-40 rounded-lg bg-[#f1eef6]" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-44 rounded-lg bg-[#f1eef6]" />
            <div className="h-4 w-36 rounded-lg bg-[#f1eef6]" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="h-40 rounded-2xl border border-[#ece8f2] bg-white shadow-sm" />
          <div className="h-48 rounded-2xl border border-[#ece8f2] bg-white shadow-sm" />
          <div className="h-56 rounded-2xl border border-[#ece8f2] bg-white shadow-sm" />
        </div>
        <div className="h-64 rounded-2xl border border-[#ece8f2] bg-white shadow-sm" />
      </div>
    </div>
  );
}
