import { Toaster } from 'sonner';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster richColors position="top-center" />
    </AdminShell>
  );
}
