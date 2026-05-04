import { LoginForm } from './login-form';

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

  return (
    <LoginForm
      nextPath={nextPath}
      errorFromUrl={err}
      messageFromUrl={message}
      agentMode={Boolean(agentMode)}
      service={service === 'real_estate' ? 'real_estate' : service === 'travel' ? 'travel' : undefined}
    />
  );
}
