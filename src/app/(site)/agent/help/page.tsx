import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Mail, Phone } from 'lucide-react';
import { AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Agent support',
};

export default async function AgentHelpPage() {
  const viewer = await getViewerContext();

  if (!viewer) {
    redirect('/login?next=/agent/help');
  }

  if (viewer.role !== 'agent') {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-white">
      <AgentAuthShell
        title="Need Help?"
        description="We're here to support you. Reach out to us if you're having any issues with registration, verification, or syncing data."
        visualTitle="Digitally onboard property agents"
        visualCopy="Create verified agent profiles, complete onboarding, and activate listing access across Charis Consult."
        backHref="/agent/under-review"
        backLabel="Go back"
      >
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-[#101828]">Customer Support</h2>
            <p className="text-sm text-slate-500">Get help from our support team</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#101828]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0B7155] text-white">
                <Phone className="h-4 w-4" />
              </span>
              <span className="text-[18px] font-medium">+234 XXX XXX XXXX</span>
            </div>
            <div className="flex items-center gap-3 text-[#101828]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0B7155] text-white">
                <Mail className="h-4 w-4" />
              </span>
              <span className="text-[18px] font-medium">support@charisconsult.com</span>
            </div>
          </div>
        </div>
      </AgentAuthShell>
    </main>
  );
}
