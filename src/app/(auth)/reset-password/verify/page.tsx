import { VerifyOtpForm } from './verify-otp-form';

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string | string[] }>;
}) {
  const sp = (await searchParams) ?? {};
  const role = first(sp.role);

  return <VerifyOtpForm agentMode={role === 'agent'} />;
}
