import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminShell from '@/components/admin/AdminShell';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerContext();
  if (!viewer) {
    redirect('/admin/login');
  }
  if (viewer.role !== 'admin') {
    redirect('/dashboard?error=Admin access required.');
  }

  return (
    <AdminShell
      fullName={viewer.fullName ?? viewer.email ?? 'Admin'}
      photoUrl={viewer.photoUrl ?? null}
    >
      {children}
      <Toaster richColors position="top-center" />
    </AdminShell>
  );
}
