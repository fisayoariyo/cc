import type { Metadata } from 'next';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import Link from 'next/link';
import { ArrowRight, ChartNoAxesCombined, CircleAlert, Wallet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Construction dashboard preview B',
};

const kpis = [
  { label: 'Progress vs Plan', value: '62% / 59%', tone: 'text-[#166534]' },
  { label: 'Budget Variance', value: '+2.3%', tone: 'text-[#92400e]' },
  { label: 'Schedule Variance', value: '+4 days', tone: 'text-[#500085]' },
  { label: 'Critical Risks', value: '2 open', tone: 'text-[#dc2626]' },
];

export default function ConstructionDashboardDirectionBPreview() {
  return (
    <div className="space-y-5">
      <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#500085]">
          Direction B Preview - Owner Command Center
        </p>
        <DashboardPageTitle className="mt-3">Board-level visibility, site-level detail</DashboardPageTitle>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Data-first dashboard built for cost control, schedule confidence, and executive reporting.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-border/70 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{item.label}</p>
            <p className={`mt-3 text-2xl font-semibold tracking-[-0.03em] ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.03em]">Cost / Schedule Performance</h2>
            <ChartNoAxesCombined className="h-5 w-5 text-[#500085]" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Cost burn</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">₦83.1M spent</p>
              <div className="mt-4 h-2 rounded-full bg-[#e9dff5]">
                <div className="h-full w-[68%] rounded-full bg-[#500085]" />
              </div>
            </div>
            <div className="rounded-xl bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Schedule health</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">SPI 0.94</p>
              <div className="mt-4 h-2 rounded-full bg-[#e9dff5]">
                <div className="h-full w-[58%] rounded-full bg-[#6d28d9]" />
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Action Queue</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-lg bg-[#fbfafc] px-3 py-2">Approve VO-014 (₦2.4M)</li>
            <li className="rounded-lg bg-[#fbfafc] px-3 py-2">Review MEP slippage report</li>
            <li className="rounded-lg bg-[#fbfafc] px-3 py-2">Sign consultant invoice</li>
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-[#f3ebfa] p-3 text-center">
              <Wallet className="mx-auto h-4 w-4 text-[#500085]" />
              <p className="mt-1 text-xs text-[#500085]">Finance</p>
            </div>
            <div className="rounded-lg bg-[#fef3c7] p-3 text-center">
              <CircleAlert className="mx-auto h-4 w-4 text-[#92400e]" />
              <p className="mt-1 text-xs text-[#92400e]">Risk</p>
            </div>
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
