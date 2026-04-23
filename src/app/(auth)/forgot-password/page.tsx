function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

import { ForgotPasswordForm } from './forgot-password-form';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string | string[]; service?: string | string[] }>;
}) {
  const sp = (await searchParams) ?? {};
  const role = first(sp.role);
  const service = first(sp.service);

  return (
    <ForgotPasswordForm
      agentMode={role === 'agent'}
      service={service === 'real_estate' ? 'real_estate' : service === 'travel' ? 'travel' : undefined}
    />
  );
}
