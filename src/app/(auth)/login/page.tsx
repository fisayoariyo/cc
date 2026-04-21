import { LoginForm } from './login-form';

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[]; message?: string | string[] }>;
}) {
  const sp = await searchParams;
  const next = first(sp.next);
  const err = first(sp.error);
  const message = first(sp.message);
  const nextPath =
    next?.startsWith('/') && !next.startsWith('//') ? next : undefined;

  return <LoginForm nextPath={nextPath} errorFromUrl={err} messageFromUrl={message} />;
}
