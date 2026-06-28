import type { Metadata } from 'next';
import { BarChart3, Building2, Hammer, MessageSquareText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Construction dashboard current preview',
};

export default function CurrentConstructionDashboardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#500085]">
            Current Construction Dashboard Snapshot
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            Existing production layout
          </h1>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Active Projects', value: 3, helper: '4 total projects', icon: Building2 },
            { label: 'BOQ / Agreement', value: 1, helper: 'Awaiting estimate sign-off', icon: Hammer },
            { label: 'Milestone Updates', value: 12, helper: '58% average progress', icon: BarChart3 },
          ].map((item) => (
            <div key={item.label} className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {item.label}
                </p>
                <item.icon className="h-5 w-5 text-[#500085]" />
              </div>
              <p className="mt-5 text-[2.1rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
                {item.value}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{item.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Avg project movement</h2>
              <BarChart3 className="h-5 w-5 text-[#500085]" />
            </div>
            <div className="mt-6 flex h-[190px] items-end gap-4 rounded-2xl bg-[#fbfafc] px-4 py-5">
              {[40, 56, 74, 98, 120, 86].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full max-w-[70px] rounded-2xl border border-border/70 bg-[#500085]" style={{ height }} />
                  <span className="text-xs text-muted-foreground">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Latest Activity</h2>
              <MessageSquareText className="h-5 w-5 text-[#500085]" />
            </div>
            <ul className="mt-4 space-y-2">
              <li className="rounded-xl bg-[#fbfafc] p-3 text-sm">Lintel update shared by site manager</li>
              <li className="rounded-xl bg-[#fbfafc] p-3 text-sm">Roofing materials approved</li>
              <li className="rounded-xl bg-[#fbfafc] p-3 text-sm">Milestone note posted for client review</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
