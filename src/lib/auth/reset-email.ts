/** Agent password-reset email session key + display helpers. */

export const RESET_EMAIL_KEY = 'charis_reset_email';

export function maskEmailForDisplay(email: string) {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}
