import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './admin-login-form';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Admin log in',
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
    message?: string | string[];
  }>;
}) {
  const viewer = await getViewerContext();
  if (viewer?.role === 'admin') {
    redirect('/admin');
  }

  const sp = await searchParams;
  const next = first(sp.next);
  const err = first(sp.error);
  const message = first(sp.message);
  const nextPath =
    next?.startsWith('/admin') && !next.startsWith('//') ? next : undefined;

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <AdminLoginForm nextPath={nextPath} errorFromUrl={err} messageFromUrl={message} />
    </main>
  );
}
