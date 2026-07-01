import { LoginForm } from './login-form';
import { redirect } from 'next/navigation';
import { serviceFromLoginContext } from '@/lib/auth/login-redirect';

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
    message?: string | string[];
    role?: string | string[];
    service?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const next = first(sp.next);
  const err = first(sp.error);
  const message = first(sp.message);
  const role = first(sp.role);
  const service = first(sp.service);
  const nextPath =
    next?.startsWith('/') && !next.startsWith('//') ? next : undefined;
  const agentMode = role === 'agent' || nextPath?.startsWith('/agent');

  if (role === 'admin' || nextPath?.startsWith('/admin')) {
    const params = new URLSearchParams();
    if (err) params.set('error', err);
    if (message) params.set('message', message);
    if (nextPath?.startsWith('/admin')) params.set('next', nextPath);
    const qs = params.toString();
    redirect(qs ? `/admin/login?${qs}` : '/admin/login');
  }

  const resolvedService = serviceFromLoginContext({ role, service, nextPath });

  return (
    <LoginForm
      nextPath={nextPath}
      errorFromUrl={err}
      messageFromUrl={message}
      agentMode={Boolean(agentMode)}
      service={resolvedService}
    />
  );
}
