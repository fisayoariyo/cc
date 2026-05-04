import { redirect } from 'next/navigation';
import { RegisterForm } from './register-form';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; service?: string }>;
}) {
  const { role, service } = await searchParams;

  if (service === 'construction') {
    redirect('https://cal.com/charisconsult');
  }

  const defaultRole = role === 'agent' ? 'agent' : 'client';
  const defaultService = service === 'real_estate' ? 'real_estate' : 'travel';

  return <RegisterForm defaultRole={defaultRole} defaultService={defaultService} />;
}
