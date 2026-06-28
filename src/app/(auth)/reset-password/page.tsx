function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

import { ResetPasswordForm } from './reset-password-form';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string | string[]; service?: string | string[] }>;
}) {
  const sp = (await searchParams) ?? {};
  const role = first(sp.role);
  const service = first(sp.service);

  return (
    <ResetPasswordForm
      agentMode={role === 'agent'}
      service={service === 'real_estate' ? 'real_estate' : service === 'travel' ? 'travel' : undefined}
    />
  );
}
