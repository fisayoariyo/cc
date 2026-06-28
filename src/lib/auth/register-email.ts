export const REGISTER_EMAIL_KEY = 'charis_agent_register_email';

export function maskEmailForDisplay(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.length <= 2 ? local : `${local.slice(0, 2)}***`;
  return `${visible}@${domain}`;
}
