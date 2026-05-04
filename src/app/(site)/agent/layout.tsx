import { redirect } from 'next/navigation';
import AgentDesktopShell from '@/components/agent/AgentDesktopShell';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerContext();
  if (!viewer) {
    redirect('/login?next=/agent');
  }

  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'client') redirect('/dashboard');

  return <AgentDesktopShell fullName={viewer.fullName ?? viewer.email}>{children}</AgentDesktopShell>;
}

