import type { Metadata } from 'next';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, FileText, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Construction dashboard preview A',
};

const phases = [
  { name: 'Foundation', status: 'completed', note: 'Concrete test passed and signed.' },
  { name: 'Ground Slab', status: 'completed', note: 'Slab pour completed.' },
  { name: 'Lintel', status: 'active', note: 'Inspection due in 2 days.' },
  { name: 'Roofing', status: 'queued', note: 'Materials expected next week.' },
  { name: 'Finishes', status: 'queued', note: 'Awaiting cabinetry samples.' },
];

export default function ConstructionDashboardDirectionAPreview() {
  return (
    <div className="space-y-5">
      <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#500085]">
          Direction A Preview - Timeline First
        </p>
        <DashboardPageTitle className="mt-3">Build in public command center</DashboardPageTitle>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Clients follow the job exactly as it rises from foundation to handover, with milestone
          evidence and approvals in one flow.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Milestone Spine</h2>
            <Clock3 className="h-5 w-5 text-[#500085]" />
          </div>
          <div className="mt-5 space-y-4">
            {phases.map((phase, index) => (
              <div key={phase.name} className="flex items-start gap-4 rounded-xl bg-[#fbfafc] px-4 py-3">
                <div
                  className={`mt-1 h-4 w-4 rounded-full ${
                    phase.status === 'completed'
                      ? 'bg-[#16a34a]'
                      : phase.status === 'active'
                        ? 'bg-[#500085]'
                        : 'bg-[#d4d4d8]'
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {index + 1}. {phase.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{phase.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.09em] text-muted-foreground">Latest approval</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">Roofing tranche</p>
            <p className="mt-2 text-sm text-muted-foreground">Due in 48 hours to protect schedule.</p>
            <button className="mt-4 inline-flex h-10 items-center rounded-full bg-[#500085] px-4 text-sm font-medium text-white hover:bg-[#3B0063]">
              Approve payment
            </button>
          </div>

          <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.09em] text-muted-foreground">Evidence trail</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                Site photo log (32 uploads)
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#500085]" />
                Engineer notes (11 updates)
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#f59e0b]" />
                2 risks tracked this week
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <Link
          href="/real-estate/construction/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#500085] hover:text-[#3B0063]"
        >
          Back to current dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
