import { RegisterForm } from './register-form';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; service?: string }>;
}) {
  const { role, service } = await searchParams;
  const defaultRole = role === 'agent' ? 'agent' : 'client';
  const defaultService = service === 'real_estate' || service === 'construction' ? service : 'travel';

  return <RegisterForm defaultRole={defaultRole} defaultService={defaultService} />;
}
